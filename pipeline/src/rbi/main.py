"""
RBI Data Pipeline — main entry point.

Stages:
  1. FETCH   — World Bank API + curated RBI policy data
  2. TRANSFORM — Build output schemas from raw data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/rbi/

Data sources:
  - World Bank Development Indicators (monetary, credit, external)
  - Curated RBI MPC decisions (repo rate history, CRR, SLR)
"""

import logging
import sys
from datetime import date
from pathlib import Path

# Set up path so we can import our modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.rbi.sources.world_bank import fetch_multiple
from src.rbi.sources.rbi_handbook_economy import (
    fetch_interest_rates,
    fetch_forex_reserves,
)
from src.rbi.transform.monetary_policy import (
    build_monetary_policy,
    CURRENT_RATES,
    REPO_RATE_DECISIONS,
)
from src.rbi.transform.liquidity import build_liquidity
from src.rbi.transform.credit import build_credit
from src.rbi.transform.forex import build_forex
from src.rbi.validate.schemas import (
    CreditData,
    ForexData,
    LiquidityData,
    MonetaryPolicyData,
    RBIIndicator,
    RBIIndicatorsData,
    RBISummary,
    TimeSeriesPoint,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("rbi-pipeline")

SURVEY_YEAR = "2025-26"


def calendar_to_fiscal(cal_year: str) -> str:
    """Convert calendar year to Indian fiscal year string: '2020' -> '2020-21'."""
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def run_rbi_pipeline():
    logger.info("=" * 60)
    logger.info(f"RBI Data Pipeline — {SURVEY_YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────
    # 1a. RBI Handbook (automated — fills WB gaps)
    logger.info("Stage 1: FETCH")
    logger.info("  1a. RBI Handbook of Statistics on Indian Economy")
    handbook_rates = fetch_interest_rates()
    handbook_forex = fetch_forex_reserves()

    # 1b. World Bank API
    logger.info("  1b. World Bank API")
    wb_data = fetch_multiple(
        [
            "broad_money_growth",
            "broad_money_pct_gdp",
            "domestic_credit_pct_gdp",
            "private_credit_pct_gdp",
            "reserves_usd",
            "exchange_rate",
            "inflation_cpi",
            "lending_rate",
            "deposit_rate",
            "bank_branches",
        ],
        start_year=2000,
        end_year=2025,
    )

    for key, data in wb_data.items():
        logger.info(f"  {key}: {len(data)} data points")

    # ── Stage 2: TRANSFORM ──────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    # 2a. Monetary Policy (curated RBI data, no WB dependency)
    monetary_data = build_monetary_policy(SURVEY_YEAR)
    logger.info(f"  monetary-policy.json: {len(monetary_data['decisions'])} decisions")

    # 2b. Liquidity (World Bank broad money indicators)
    liquidity_data = build_liquidity(
        wb_data.get("broad_money_growth", []),
        wb_data.get("broad_money_pct_gdp", []),
        SURVEY_YEAR,
    )

    # 2c. Credit (World Bank + Handbook Table 62 for lending/deposit rates)
    credit_data = build_credit(
        wb_data.get("domestic_credit_pct_gdp", []),
        wb_data.get("private_credit_pct_gdp", []),
        wb_data.get("lending_rate", []),
        wb_data.get("deposit_rate", []),
        SURVEY_YEAR,
        handbook_rates=handbook_rates,
    )

    # 2d. Forex (World Bank + Handbook Table 147 for extended history)
    forex_data = build_forex(
        wb_data.get("reserves_usd", []),
        wb_data.get("exchange_rate", []),
        SURVEY_YEAR,
        handbook_forex=handbook_forex,
    )

    # 2e. Summary (hub page card — latest values from all sources)
    summary_data = _build_summary(wb_data, monetary_data, liquidity_data, forex_data)
    logger.info("  summary.json: built from RBI + World Bank data")

    # 2f. Indicators (comprehensive collection for explorer page)
    indicators = _build_indicators(wb_data, monetary_data)
    indicators_data = {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }
    logger.info(f"  indicators.json: {len(indicators)} indicators")

    # ── Stage 3: VALIDATE ──────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", RBISummary, summary_data),
        ("monetary-policy.json", MonetaryPolicyData, monetary_data),
        ("liquidity.json", LiquidityData, liquidity_data),
        ("credit.json", CreditData, credit_data),
        ("forex.json", ForexData, forex_data),
        ("indicators.json", RBIIndicatorsData, indicators_data),
    ]

    for name, model, data in validations:
        try:
            model(**data)
            logger.info(f"  {name} ✓")
        except Exception as e:
            errors.append(f"{name}: {e}")
            logger.error(f"  {name} FAILED: {e}")

    if errors:
        logger.error(f"Validation failed with {len(errors)} error(s):")
        for err in errors:
            logger.error(f"  - {err}")
        sys.exit(1)

    # ── Stage 4: PUBLISH ──────────────────────────────────────
    logger.info("Stage 4: PUBLISH")
    outputs = {
        f"rbi/{SURVEY_YEAR}/summary.json": summary_data,
        f"rbi/{SURVEY_YEAR}/monetary-policy.json": monetary_data,
        f"rbi/{SURVEY_YEAR}/liquidity.json": liquidity_data,
        f"rbi/{SURVEY_YEAR}/credit.json": credit_data,
        f"rbi/{SURVEY_YEAR}/forex.json": forex_data,
        f"rbi/{SURVEY_YEAR}/indicators.json": indicators_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("RBI pipeline complete!")
    logger.info("=" * 60)


def _build_summary(
    wb_data: dict,
    monetary_data: dict,
    liquidity_data: dict,
    forex_data: dict,
) -> dict:
    """
    Build summary.json — a compact snapshot for the hub page card.

    Pulls the latest value from each data source. Falls back to None
    if World Bank data is unavailable for a given indicator.
    """
    # Latest CPI from World Bank
    cpi_data = wb_data.get("inflation_cpi", [])
    cpi_latest = round(cpi_data[-1]["value"], 2) if cpi_data else None

    # Latest forex reserves from World Bank (convert to USD billion)
    reserves_data = wb_data.get("reserves_usd", [])
    reserves_latest = round(reserves_data[-1]["value"] / 1e9, 2) if reserves_data else None

    # Latest broad money growth from World Bank
    bm_data = wb_data.get("broad_money_growth", [])
    bm_latest = round(bm_data[-1]["value"], 2) if bm_data else None

    return {
        "year": SURVEY_YEAR,
        "repoRate": monetary_data["currentRate"],
        "repoRateDate": monetary_data["decisions"][0]["date"],  # newest first
        "stance": monetary_data["currentStance"],
        "crr": CURRENT_RATES["crr"],
        "slr": CURRENT_RATES["slr"],
        "cpiLatest": cpi_latest,
        "forexReservesUSD": reserves_latest,
        "broadMoneyGrowth": bm_latest,
        "lastUpdated": date.today().isoformat(),
        "source": "Reserve Bank of India, World Bank",
    }


def _build_indicators(
    wb_data: dict,
    monetary_data: dict,
) -> list[dict]:
    """
    Build the comprehensive indicators collection for the Explorer page.

    Each indicator gets a category tag: monetary, liquidity, credit, external.
    """
    indicators = []

    # ── Monetary category: repo rate series from curated decisions ──
    # Build a series from decisions: one point per change
    repo_series = [
        {"year": d["date"][:4], "value": d["rate"]}
        for d in sorted(REPO_RATE_DECISIONS, key=lambda x: x["date"])
    ]
    # Deduplicate: keep last decision per calendar year
    seen_years = {}
    for point in repo_series:
        seen_years[point["year"]] = point["value"]
    repo_yearly = [
        {"year": calendar_to_fiscal(y), "value": v}
        for y, v in sorted(seen_years.items())
    ]

    indicators.append({
        "id": "repo_rate",
        "name": "Repo Rate",
        "category": "monetary",
        "unit": "%",
        "series": repo_yearly,
        "source": "RBI Monetary Policy Statements",
    })

    # ── CPI Inflation (monetary relevance) ──
    cpi_raw = wb_data.get("inflation_cpi", [])
    if cpi_raw:
        indicators.append({
            "id": "inflation_cpi",
            "name": "CPI Inflation (Annual)",
            "category": "monetary",
            "unit": "%",
            "series": [
                {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
                for p in cpi_raw
            ],
            "source": "World Bank FP.CPI.TOTL.ZG",
        })

    # ── Liquidity category ──
    wb_indicator_configs_liquidity = [
        ("broad_money_growth", "Broad Money Growth", "liquidity", "%", "FM.LBL.BMNY.ZG"),
        ("broad_money_pct_gdp", "Broad Money (% of GDP)", "liquidity", "% of GDP", "FM.LBL.BMNY.GD.ZS"),
    ]
    for wb_key, name, category, unit, wb_code in wb_indicator_configs_liquidity:
        raw = wb_data.get(wb_key, [])
        if not raw:
            continue
        indicators.append({
            "id": wb_key,
            "name": name,
            "category": category,
            "unit": unit,
            "series": [
                {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
                for p in raw
            ],
            "source": f"World Bank {wb_code}",
        })

    # ── Credit category ──
    wb_indicator_configs_credit = [
        ("domestic_credit_pct_gdp", "Domestic Credit (% of GDP)", "credit", "% of GDP", "FS.AST.DOMS.GD.ZS"),
        ("private_credit_pct_gdp", "Private Credit (% of GDP)", "credit", "% of GDP", "FD.AST.PRVT.GD.ZS"),
        ("lending_rate", "Lending Interest Rate", "credit", "%", "FR.INR.LEND"),
        ("deposit_rate", "Deposit Interest Rate", "credit", "%", "FR.INR.DPST"),
        ("bank_branches", "Bank Branches per 100K Adults", "credit", "per 100K", "FB.CBK.BRCH.P5"),
    ]
    for wb_key, name, category, unit, wb_code in wb_indicator_configs_credit:
        raw = wb_data.get(wb_key, [])
        if not raw:
            continue
        indicators.append({
            "id": wb_key,
            "name": name,
            "category": category,
            "unit": unit,
            "series": [
                {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
                for p in raw
            ],
            "source": f"World Bank {wb_code}",
        })

    # ── External category ──
    wb_indicator_configs_external = [
        ("reserves_usd", "Forex Reserves", "external", "US$ billion", "FI.RES.TOTL.CD"),
        ("exchange_rate", "Exchange Rate (INR/USD)", "external", "INR per USD", "PA.NUS.FCRF"),
    ]
    for wb_key, name, category, unit, wb_code in wb_indicator_configs_external:
        raw = wb_data.get(wb_key, [])
        if not raw:
            continue

        # Special handling: reserves need conversion to billions
        if wb_key == "reserves_usd":
            series = [
                {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"] / 1e9, 2)}
                for p in raw
            ]
        else:
            series = [
                {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
                for p in raw
            ]

        indicators.append({
            "id": wb_key,
            "name": name,
            "category": category,
            "unit": unit,
            "series": series,
            "source": f"World Bank {wb_code}",
        })

    return indicators


if __name__ == "__main__":
    run_rbi_pipeline()
