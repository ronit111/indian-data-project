"""
State Finances Data Pipeline — main entry point.

Stages:
  1. FETCH   — Load curated state data (no external API; data from RBI Handbook)
  2. TRANSFORM — Build output schemas from curated data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/states/

Data sources:
  - RBI Handbook of Statistics on Indian States (curated extraction)
  - Finance Commission reports (central transfers, devolution)
"""

import logging
import sys
from datetime import date
from pathlib import Path

# Set up path so we can import our modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.states.sources.curated import (
    STATE_GSDP_DATA,
    STATE_GSDP_HISTORY,
    STATE_REVENUE_DATA,
    STATE_FISCAL_DATA,
    DATA_YEAR,
    BASE_YEAR,
)
from src.states.sources.rbi_handbook_states import (
    fetch_handbook_gsdp,
    fetch_handbook_fiscal,
)
from src.states.transform.gsdp import build_gsdp
from src.states.transform.revenue import build_revenue
from src.states.transform.fiscal_health import build_fiscal_health
from src.states.validate.schemas import (
    GSDPData,
    RevenueData,
    FiscalHealthData,
    StatesSummary,
    StatesIndicatorsData,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("states-pipeline")

SURVEY_YEAR = "2025-26"


def run_states_pipeline():
    logger.info("=" * 60)
    logger.info(f"State Finances Data Pipeline — {SURVEY_YEAR}")
    logger.info(f"Data vintage: {DATA_YEAR} (base year: {BASE_YEAR})")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────
    # 1a. Try RBI Handbook (automated)
    logger.info("Stage 1: FETCH")
    logger.info("  1a. RBI Handbook of Statistics on Indian States")

    handbook_gsdp = fetch_handbook_gsdp()
    handbook_fiscal = fetch_handbook_fiscal()

    # 1b. Use Handbook data if available, curated as fallback
    if handbook_gsdp:
        gsdp_source, gsdp_history_source, data_year = handbook_gsdp
        base_year = "2011-12"  # Handbook uses 2011-12 base
        logger.info(f"  Using Handbook GSDP data: {len(gsdp_source)} states ({data_year})")
    else:
        gsdp_source = STATE_GSDP_DATA
        gsdp_history_source = STATE_GSDP_HISTORY
        data_year = DATA_YEAR
        base_year = BASE_YEAR
        logger.info(f"  Using curated GSDP fallback: {len(gsdp_source)} entries")

    if handbook_fiscal:
        # Merge: Handbook provides fiscal deficit %, curated provides debt/GSDP
        fiscal_source = _merge_fiscal(handbook_fiscal, STATE_FISCAL_DATA)
        logger.info(f"  Using Handbook fiscal data + curated debt/GSDP")
    else:
        fiscal_source = STATE_FISCAL_DATA
        logger.info(f"  Using curated fiscal fallback: {len(fiscal_source)} entries")

    # Revenue data remains curated (Handbook doesn't have Tables 24-28 in a clean format)
    revenue_source = STATE_REVENUE_DATA
    logger.info(f"  Revenue: curated ({len(revenue_source)} entries)")

    # ── Stage 2: TRANSFORM ──────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    gsdp_data = build_gsdp(gsdp_source, SURVEY_YEAR, base_year,
                            gsdp_history_source if handbook_gsdp else STATE_GSDP_HISTORY)
    revenue_data = build_revenue(revenue_source, SURVEY_YEAR)
    fiscal_data = build_fiscal_health(fiscal_source, SURVEY_YEAR)
    summary_data = _build_summary(gsdp_source)
    indicators_data = _build_indicators(gsdp_source, revenue_source, fiscal_source)

    # ── Stage 3: VALIDATE ──────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", StatesSummary, summary_data),
        ("gsdp.json", GSDPData, gsdp_data),
        ("revenue.json", RevenueData, revenue_data),
        ("fiscal-health.json", FiscalHealthData, fiscal_data),
        ("indicators.json", StatesIndicatorsData, indicators_data),
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
        f"states/{SURVEY_YEAR}/summary.json": summary_data,
        f"states/{SURVEY_YEAR}/gsdp.json": gsdp_data,
        f"states/{SURVEY_YEAR}/revenue.json": revenue_data,
        f"states/{SURVEY_YEAR}/fiscal-health.json": fiscal_data,
        f"states/{SURVEY_YEAR}/indicators.json": indicators_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("State Finances pipeline complete!")
    logger.info("=" * 60)


def _merge_fiscal(
    handbook_fiscal: list[dict],
    curated_fiscal: list[dict],
) -> list[dict]:
    """
    Merge Handbook fiscal deficit % with curated debt/GSDP ratios.

    Handbook Table 164 provides fiscal deficit but not debt/GSDP.
    Curated data has both. Use Handbook deficit % where available,
    fall back to curated for debt/GSDP.
    """
    curated_by_id = {d["id"]: d for d in curated_fiscal}

    result = []
    for h in handbook_fiscal:
        curated = curated_by_id.get(h["id"], {})
        result.append({
            "id": h["id"],
            "name": h["name"],
            "fiscalDeficitPctGsdp": h["fiscalDeficitPctGsdp"],
            "debtToGsdp": curated.get("debtToGsdp", 0),
        })

    return result


def _build_summary(gsdp_data: list[dict]) -> dict:
    """Build summary.json for the hub page card."""
    sorted_states = sorted(gsdp_data, key=lambda s: s["gsdp"], reverse=True)
    top = sorted_states[0]

    # Filter out zero-GSDP entries (small UTs with no data)
    valid_states = [s for s in gsdp_data if s["gsdp"] > 0]
    growth_rates = [s["growthRate"] for s in valid_states if s["growthRate"] > 0]
    total_gsdp = sum(s["gsdp"] for s in valid_states)
    total_population = sum(s["population"] for s in valid_states)
    avg_per_capita = round(total_gsdp * 100 / total_population) if total_population > 0 else 0

    return {
        "year": SURVEY_YEAR,
        "topGsdpState": top["name"],
        "topGsdpValue": round(top["gsdp"] / 100000, 2),  # Rs crore → Rs lakh crore
        "nationalGsdpTotal": round(total_gsdp / 100000, 2),
        "growthRange": f"{min(growth_rates):.1f}% – {max(growth_rates):.1f}%" if growth_rates else "N/A",
        "averagePerCapita": avg_per_capita,
        "totalStatesAndUTs": 36,
        "statesWithData": len(valid_states),
        "stateCount": len(valid_states),  # kept for backward compat
        "lastUpdated": date.today().isoformat(),
        "source": "RBI Handbook of Statistics on Indian States",
        "note": "India has 28 states and 8 union territories (36 total). Data covers "
                f"{len(valid_states)}; remaining UTs have incomplete state accounts in the RBI Handbook.",
    }


def _build_indicators(
    gsdp_data: list[dict],
    revenue_data: list[dict],
    fiscal_data: list[dict],
) -> dict:
    """Build indicators.json for the explorer page."""
    indicators = []

    # GSDP category
    indicators.append({
        "id": "gsdp_current",
        "name": "GSDP (Current Prices)",
        "category": "gsdp",
        "unit": "Rs crore",
        "states": [{"id": s["id"], "name": s["name"], "value": s["gsdp"]} for s in gsdp_data if s["gsdp"] > 0],
        "source": "RBI Handbook of Statistics on Indian States",
    })

    indicators.append({
        "id": "gsdp_growth",
        "name": "GSDP Growth Rate",
        "category": "gsdp",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["growthRate"]} for s in gsdp_data if s["growthRate"] > 0],
        "source": "RBI Handbook of Statistics on Indian States",
    })

    indicators.append({
        "id": "per_capita_nsdp",
        "name": "Per Capita NSDP",
        "category": "percapita",
        "unit": "Rs",
        "states": [{"id": s["id"], "name": s["name"], "value": s["perCapitaNsdp"]} for s in gsdp_data if s["perCapitaNsdp"] > 0],
        "source": "RBI Handbook of Statistics on Indian States",
    })

    # Revenue category
    indicators.append({
        "id": "own_tax_revenue",
        "name": "Own Tax Revenue",
        "category": "revenue",
        "unit": "Rs crore",
        "states": [{"id": s["id"], "name": s["name"], "value": s["ownTaxRevenue"]} for s in revenue_data if s["ownTaxRevenue"] > 0],
        "source": "RBI Handbook, Finance Commission",
    })

    indicators.append({
        "id": "self_sufficiency",
        "name": "Revenue Self-Sufficiency Ratio",
        "category": "revenue",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["selfSufficiencyRatio"]} for s in revenue_data if s["selfSufficiencyRatio"] > 0],
        "source": "RBI Handbook, Finance Commission",
    })

    indicators.append({
        "id": "central_transfers",
        "name": "Central Transfers",
        "category": "revenue",
        "unit": "Rs crore",
        "states": [{"id": s["id"], "name": s["name"], "value": s["centralTransfers"]} for s in revenue_data if s["centralTransfers"] > 0],
        "source": "RBI Handbook, Finance Commission",
    })

    # Fiscal category
    indicators.append({
        "id": "fiscal_deficit_pct",
        "name": "Fiscal Deficit (% of GSDP)",
        "category": "fiscal",
        "unit": "% of GSDP",
        "states": [{"id": s["id"], "name": s["name"], "value": s["fiscalDeficitPctGsdp"]} for s in fiscal_data if s["fiscalDeficitPctGsdp"] != 0],
        "source": "RBI Handbook of Statistics on Indian States",
    })

    indicators.append({
        "id": "debt_to_gsdp",
        "name": "Outstanding Debt (% of GSDP)",
        "category": "fiscal",
        "unit": "% of GSDP",
        "states": [{"id": s["id"], "name": s["name"], "value": s["debtToGsdp"]} for s in fiscal_data if s["debtToGsdp"] > 0],
        "source": "RBI Handbook of Statistics on Indian States",
    })

    return {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }


if __name__ == "__main__":
    run_states_pipeline()
