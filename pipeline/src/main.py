"""
India Budget Data Pipeline — main entry point.

Stages:
  1. FETCH   — Try CKAN API at openbudgetsindia.org, fall back to curated data
  2. EXTRACT — Parse into DataFrames
  3. TRANSFORM — Normalize, derive metrics, build viz structures
  4. VALIDATE — Pydantic model checks
  5. PUBLISH — Write JSON to public/data/
"""

import json
import logging
import sys
from datetime import date

# Set up path so we can import our modules
sys.path.insert(0, str(__file__).rsplit("/src/", 1)[0])

from src.sources.open_budgets import fetch_budget_data
from src.extract.csv_parser import (
    get_curated_expenditure_data,
    get_curated_receipts_data,
    get_curated_schemes_data,
    get_curated_statewise_data,
    get_curated_summary,
)
from src.transform.derive import (
    POPULATION,
    human_context,
    per_capita,
    per_capita_daily,
    percent_of_total,
    yoy_change,
)
from src.transform.sankey import build_sankey
from src.transform.treemap import build_treemap
from src.transform.budget_trends import build_budget_trends
from src.transform.budget_vs_actual import build_budget_vs_actual
from src.validate.schemas import (
    BudgetSummary,
    BudgetTrendsData,
    BudgetVsActualData,
    ExpenditureData,
    ExpenditureShare,
    ExpenditureSharesData,
    GovernmentScheme,
    MinistryExpenditure,
    ReceiptsData,
    RevenueCategory,
    SankeyData,
    SchemesData,
    StateTransfer,
    StatewiseData,
    TaxSlab,
    TaxSlabsData,
    TreemapData,
    YearIndex,
)
from src.validate.invariants import run_all_invariants
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("pipeline")

YEAR = "2025-26"
SOURCE_URL = "https://openbudgetsindia.org/"


def run_pipeline():
    logger.info("=" * 60)
    logger.info(f"India Budget Pipeline — {YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────
    logger.info("Stage 1: FETCH")
    api_result = fetch_budget_data()
    if api_result:
        logger.info(f"Got data from API: {api_result['dataset']}")
    else:
        logger.info("Using curated budget data (API unavailable or limited)")

    # ── Stage 2: EXTRACT ────────────────────────────────────────
    logger.info("Stage 2: EXTRACT")
    summary_raw = get_curated_summary()
    expenditure_df = get_curated_expenditure_data()
    receipts_df = get_curated_receipts_data()
    statewise_df = get_curated_statewise_data()
    schemes_df = get_curated_schemes_data()

    total_expenditure = summary_raw["totalExpenditure"]
    total_receipts = receipts_df["amount"].sum()

    logger.info(f"  Expenditure entries: {len(expenditure_df)}")
    logger.info(f"  Receipt categories: {len(receipts_df)}")
    logger.info(f"  States: {len(statewise_df)}")
    logger.info(f"  Schemes: {len(schemes_df)}")

    # ── Stage 3: TRANSFORM ──────────────────────────────────────
    logger.info("Stage 3: TRANSFORM")

    # 3a. Summary
    summary_data = {
        **summary_raw,
        "population": POPULATION,
        "perCapitaExpenditure": per_capita(total_expenditure),
        "perCapitaDailyExpenditure": per_capita_daily(total_expenditure),
        "lastUpdated": date.today().isoformat(),
        "source": SOURCE_URL,
    }

    # 3b. Receipts
    receipts_categories = []
    for _, row in receipts_df.iterrows():
        receipts_categories.append({
            "id": row["id"],
            "name": row["name"],
            "amount": row["amount"],
            "percentOfTotal": percent_of_total(row["amount"], total_receipts),
            "previousYear": row["previous_year"],
            "yoyChange": yoy_change(row["amount"], row["previous_year"]),
        })
    receipts_data = {
        "year": YEAR,
        "total": round(total_receipts),
        "categories": receipts_categories,
    }

    # 3c. Expenditure (ministry-wise)
    ministries = []
    for _, row in expenditure_df.iterrows():
        schemes = json.loads(row["schemes_json"])
        ministry = {
            "id": row["id"],
            "name": row["name"],
            "budgetEstimate": row["budget_estimate"],
            "revisedEstimate": None,
            "actualExpenditure": None,
            "percentOfTotal": percent_of_total(row["budget_estimate"], total_expenditure),
            "yoyChange": yoy_change(row["budget_estimate"], row["previous_year"]),
            "perCapita": per_capita(row["budget_estimate"]),
            "humanContext": human_context(row["id"], row["budget_estimate"]),
            "schemes": schemes,
        }
        ministries.append(ministry)

    expenditure_data = {
        "year": YEAR,
        "total": total_expenditure,
        "ministries": ministries,
    }

    # 3d. Sankey
    sankey_data = build_sankey(
        receipts=receipts_categories,
        expenditures=ministries,
        total_expenditure=total_expenditure,
        year=YEAR,
    )

    # 3e. Treemap
    treemap_data = build_treemap(
        expenditures=ministries,
        total=total_expenditure,
        year=YEAR,
    )

    # 3f. State-wise transfers
    total_transfers = statewise_df["transfer"].sum()
    states = []
    for _, row in statewise_df.iterrows():
        states.append({
            "id": row["id"],
            "name": row["name"],
            "transfer": row["transfer"],
            "perCapita": round(row["transfer"] * 1e7 / row["population"]),
            "percentOfTotal": percent_of_total(row["transfer"], total_transfers),
            "population": row["population"],
        })
    statewise_data = {
        "year": YEAR,
        "totalTransfers": round(total_transfers),
        "states": states,
    }

    # 3g. Schemes
    schemes_list = []
    for _, row in schemes_df.iterrows():
        schemes_list.append({
            "id": row["id"],
            "name": row["name"],
            "ministry": row["ministry"],
            "ministryName": row["ministryName"],
            "allocation": row["allocation"],
            "previousYear": row["previous_year"],
            "yoyChange": yoy_change(row["allocation"], row["previous_year"]),
            "humanContext": row["humanContext"],
        })
    schemes_data = {"year": YEAR, "schemes": schemes_list}

    # 3h. Tax slabs
    tax_slabs_data = {
        "assessmentYear": "2026-27",
        "financialYear": "2025-26",
        "regimes": {
            "new": {
                "slabs": [
                    {"from": 0, "to": 400000, "rate": 0},
                    {"from": 400001, "to": 800000, "rate": 5},
                    {"from": 800001, "to": 1200000, "rate": 10},
                    {"from": 1200001, "to": 1600000, "rate": 15},
                    {"from": 1600001, "to": 2000000, "rate": 20},
                    {"from": 2000001, "to": 2400000, "rate": 25},
                    {"from": 2400001, "to": None, "rate": 30},
                ],
                "standardDeduction": 75000,
                "rebateLimit": 1200000,
            },
            "old": {
                "slabs": [
                    {"from": 0, "to": 250000, "rate": 0},
                    {"from": 250001, "to": 500000, "rate": 5},
                    {"from": 500001, "to": 1000000, "rate": 20},
                    {"from": 1000001, "to": None, "rate": 30},
                ],
                "standardDeduction": 50000,
                "rebateLimit": 500000,
            },
        },
        "cess": 4,
        "surchargeSlabs": [
            {"from": 5000001, "to": 10000000, "rate": 10},
            {"from": 10000001, "to": 20000000, "rate": 15},
            {"from": 20000001, "to": 50000000, "rate": 25},
            {"from": 50000001, "to": None, "rate": 37},
        ],
    }

    # 3i. Expenditure shares (for tax calculator)
    expenditure_shares_data = {
        "year": YEAR,
        "shares": [
            {"id": "transfers-to-states", "name": "State Transfers", "percentOfExpenditure": 23.9, "humanContext": "Funding your state's roads, schools, and hospitals", "humanContextMultiplier": 0},
            {"id": "interest-payments", "name": "Interest Payments", "percentOfExpenditure": 21.5, "humanContext": "Servicing past government debt", "humanContextMultiplier": 0},
            {"id": "defence", "name": "Defence", "percentOfExpenditure": 13.6, "humanContext": "school mid-day meals", "humanContextMultiplier": 167},
            {"id": "subsidies", "name": "Subsidies", "percentOfExpenditure": 7.9, "humanContext": "months of subsidized ration for one family", "humanContextMultiplier": 4},
            {"id": "road-transport", "name": "Roads & Highways", "percentOfExpenditure": 5.5, "humanContext": "metres of national highway", "humanContextMultiplier": 0.02},
            {"id": "railways", "name": "Railways", "percentOfExpenditure": 5.3, "humanContext": "train journeys (sleeper class)", "humanContextMultiplier": 12},
            {"id": "home-affairs", "name": "Home Affairs", "percentOfExpenditure": 4.4, "humanContext": "police and border security", "humanContextMultiplier": 0},
            {"id": "rural-development", "name": "Rural Development", "percentOfExpenditure": 3.6, "humanContext": "days of MGNREGA wages", "humanContextMultiplier": 8},
            {"id": "agriculture", "name": "Agriculture", "percentOfExpenditure": 2.7, "humanContext": "farmer PM-KISAN installments", "humanContextMultiplier": 3},
            {"id": "education", "name": "Education", "percentOfExpenditure": 2.5, "humanContext": "school textbooks", "humanContextMultiplier": 25},
            {"id": "health", "name": "Health", "percentOfExpenditure": 1.8, "humanContext": "basic health checkups", "humanContextMultiplier": 5},
            {"id": "other", "name": "Everything Else", "percentOfExpenditure": 7.3, "humanContext": "science, environment, culture, and more", "humanContextMultiplier": 0},
        ],
    }

    # 3j. Budget Trends (20-year historical)
    trends_data = build_budget_trends(YEAR)
    logger.info(f"  trends.json: {len(trends_data['series'])} years")

    # 3k. Budget vs Actual (ministry-level)
    bva_data = build_budget_vs_actual(YEAR)
    logger.info(f"  budget-vs-actual.json: {len(bva_data['ministries'])} ministries")

    # Years index
    years_data = {"years": ["2025-26"], "latest": "2025-26"}

    # ── Stage 4: VALIDATE ──────────────────────────────────────
    logger.info("Stage 4: VALIDATE")
    errors = []

    try:
        BudgetSummary(**summary_data)
        logger.info("  summary.json ✓")
    except Exception as e:
        errors.append(f"summary: {e}")
        logger.error(f"  summary.json FAILED: {e}")

    try:
        ReceiptsData(**receipts_data)
        logger.info("  receipts.json ✓")
    except Exception as e:
        errors.append(f"receipts: {e}")
        logger.error(f"  receipts.json FAILED: {e}")

    try:
        ExpenditureData(**expenditure_data)
        logger.info("  expenditure.json ✓")
    except Exception as e:
        errors.append(f"expenditure: {e}")
        logger.error(f"  expenditure.json FAILED: {e}")

    try:
        SankeyData(**sankey_data)
        logger.info("  sankey.json ✓")
    except Exception as e:
        errors.append(f"sankey: {e}")
        logger.error(f"  sankey.json FAILED: {e}")

    try:
        TreemapData(**treemap_data)
        logger.info("  treemap.json ✓")
    except Exception as e:
        errors.append(f"treemap: {e}")
        logger.error(f"  treemap.json FAILED: {e}")

    try:
        StatewiseData(**statewise_data)
        logger.info("  statewise.json ✓")
    except Exception as e:
        errors.append(f"statewise: {e}")
        logger.error(f"  statewise.json FAILED: {e}")

    try:
        SchemesData(**schemes_data)
        logger.info("  schemes.json ✓")
    except Exception as e:
        errors.append(f"schemes: {e}")
        logger.error(f"  schemes.json FAILED: {e}")

    try:
        YearIndex(**years_data)
        logger.info("  years.json ✓")
    except Exception as e:
        errors.append(f"years: {e}")
        logger.error(f"  years.json FAILED: {e}")

    try:
        BudgetTrendsData(**trends_data)
        logger.info("  trends.json ✓")
    except Exception as e:
        errors.append(f"trends: {e}")
        logger.error(f"  trends.json FAILED: {e}")

    try:
        BudgetVsActualData(**bva_data)
        logger.info("  budget-vs-actual.json ✓")
    except Exception as e:
        errors.append(f"budget-vs-actual: {e}")
        logger.error(f"  budget-vs-actual.json FAILED: {e}")

    try:
        TaxSlabsData(**tax_slabs_data)
        logger.info("  tax-slabs.json ✓")
    except Exception as e:
        errors.append(f"tax-slabs: {e}")
        logger.error(f"  tax-slabs.json FAILED: {e}")

    try:
        ExpenditureSharesData(**expenditure_shares_data)
        logger.info("  expenditure-shares.json ✓")
    except Exception as e:
        errors.append(f"expenditure-shares: {e}")
        logger.error(f"  expenditure-shares.json FAILED: {e}")

    # Integrity checks
    ministry_sum = sum(m["budgetEstimate"] for m in ministries)
    pct_covered = ministry_sum / total_expenditure * 100
    logger.info(f"  Ministry sum covers {pct_covered:.1f}% of total expenditure")

    pct_sum = sum(m["percentOfTotal"] for m in ministries)
    logger.info(f"  percentOfTotal sum: {pct_sum:.1f}%")

    receipt_pct_sum = sum(c["percentOfTotal"] for c in receipts_categories)
    logger.info(f"  Receipt percentOfTotal sum: {receipt_pct_sum:.1f}%")

    if errors:
        logger.error(f"Validation failed with {len(errors)} error(s):")
        for err in errors:
            logger.error(f"  - {err}")
        sys.exit(1)

    # Cross-file invariants
    invariant_errors = run_all_invariants(
        treemap=treemap_data,
        expenditure=expenditure_data,
        schemes=schemes_data,
        receipts=receipts_data,
        statewise=statewise_data,
    )
    if invariant_errors:
        logger.error(f"Cross-file invariants failed with {len(invariant_errors)} error(s):")
        for err in invariant_errors:
            logger.error(f"  - {err}")
        sys.exit(1)
    logger.info("  All cross-file invariants passed ✓")

    # ── Stage 5: PUBLISH ────────────────────────────────────────
    logger.info("Stage 5: PUBLISH")
    outputs = {
        f"budget/{YEAR}/summary.json": summary_data,
        f"budget/{YEAR}/receipts.json": receipts_data,
        f"budget/{YEAR}/expenditure.json": expenditure_data,
        f"budget/{YEAR}/sankey.json": sankey_data,
        f"budget/{YEAR}/treemap.json": treemap_data,
        f"budget/{YEAR}/statewise.json": statewise_data,
        f"budget/{YEAR}/schemes.json": schemes_data,
        f"budget/{YEAR}/trends.json": trends_data,
        f"budget/{YEAR}/budget-vs-actual.json": bva_data,
        "tax-calculator/slabs.json": tax_slabs_data,
        "tax-calculator/expenditure-shares.json": expenditure_shares_data,
        "years.json": years_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Pipeline complete!")
    logger.info("=" * 60)


if __name__ == "__main__":
    run_pipeline()
