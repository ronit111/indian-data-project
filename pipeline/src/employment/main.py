"""
Employment Data Pipeline — main entry point.

Stages:
  1. FETCH   — MOSPI PLFS API (primary) + World Bank API + curated PLFS/KLEMS data (fallback)
  2. TRANSFORM — Build output schemas from raw data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/employment/

Data source priority:
  - State-level employment: MOSPI PLFS API (primary) → curated PLFS data (fallback)
  - National totals: MOSPI PLFS API (primary) → curated (fallback)
  - Time series: World Bank ILO-modelled estimates (primary for historical trends)
  - Sectoral: RBI KLEMS (curated, no API)
"""

import logging
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.employment.sources.world_bank import fetch_multiple
from src.employment.sources.mospi_plfs import fetch_state_employment, fetch_national_totals
from src.employment.sources.curated import (
    PLFS_STATE_DATA,
    SECTORAL_EMPLOYMENT,
    NATIONAL_TOTALS,
)
from src.employment.transform.unemployment import build_unemployment
from src.employment.transform.participation import build_participation
from src.employment.transform.sectoral import build_sectoral
from src.employment.validate.schemas import (
    EmploymentSummary,
    UnemploymentData,
    ParticipationData,
    SectoralData,
    EmploymentIndicatorsData,
    GlossaryData,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("employment-pipeline")

SURVEY_YEAR = "2025-26"


def run_employment_pipeline():
    logger.info("=" * 60)
    logger.info(f"Employment Data Pipeline — {SURVEY_YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────────
    logger.info("Stage 1: FETCH")

    # 1a. MOSPI PLFS API — state-level + national totals (primary)
    logger.info("  Fetching MOSPI PLFS API (state-level employment)...")
    plfs_api_states = fetch_state_employment(year="2023-24")
    plfs_api_nationals = fetch_national_totals(year="2023-24")

    if plfs_api_states:
        plfs_state_data = plfs_api_states
        logger.info(f"  PLFS API: {len(plfs_state_data)} states (MOSPI primary)")
    else:
        plfs_state_data = PLFS_STATE_DATA
        logger.info(f"  PLFS API unavailable, using curated fallback: {len(plfs_state_data)} states")

    if plfs_api_nationals:
        national_totals = plfs_api_nationals
        logger.info(f"  PLFS API national totals: {len(national_totals)} metrics (MOSPI primary)")
    else:
        national_totals = NATIONAL_TOTALS
        logger.info(f"  PLFS API nationals unavailable, using curated fallback")

    # 1b. World Bank — historical time series
    logger.info("  Fetching 17 indicators from World Bank API...")
    wb_data = fetch_multiple()
    logger.info(f"  World Bank: {sum(len(v) for v in wb_data.values())} total data points")
    logger.info(f"  Curated: {len(SECTORAL_EMPLOYMENT)} KLEMS sectors")

    # ── Stage 2: TRANSFORM ──────────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    unemployment_data = build_unemployment(wb_data, plfs_state_data, SURVEY_YEAR)
    participation_data = build_participation(wb_data, plfs_state_data, SURVEY_YEAR)
    sectoral_data = build_sectoral(wb_data, SECTORAL_EMPLOYMENT, SURVEY_YEAR)
    summary_data = _build_summary(national_totals)
    indicators_data = _build_indicators(plfs_state_data)
    glossary_data = _build_glossary()

    # ── Stage 3: VALIDATE ───────────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", EmploymentSummary, summary_data),
        ("unemployment.json", UnemploymentData, unemployment_data),
        ("participation.json", ParticipationData, participation_data),
        ("sectoral.json", SectoralData, sectoral_data),
        ("indicators.json", EmploymentIndicatorsData, indicators_data),
        ("glossary.json", GlossaryData, glossary_data),
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

    # ── Stage 4: PUBLISH ────────────────────────────────────────────
    logger.info("Stage 4: PUBLISH")
    outputs = {
        f"employment/{SURVEY_YEAR}/summary.json": summary_data,
        f"employment/{SURVEY_YEAR}/unemployment.json": unemployment_data,
        f"employment/{SURVEY_YEAR}/participation.json": participation_data,
        f"employment/{SURVEY_YEAR}/sectoral.json": sectoral_data,
        f"employment/{SURVEY_YEAR}/indicators.json": indicators_data,
        f"employment/{SURVEY_YEAR}/glossary.json": glossary_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Employment pipeline complete!")
    logger.info("=" * 60)


def _build_summary(national_totals: dict) -> dict:
    return {
        "year": SURVEY_YEAR,
        "unemploymentRate": national_totals["unemploymentRate"],
        "lfpr": national_totals["lfpr"],
        "youthUnemployment": national_totals["youthUnemployment"],
        "femaleLfpr": national_totals["femaleLfpr"],
        "workforceTotal": national_totals["workforceTotal"],
        "selfEmployedPct": national_totals["selfEmployedPct"],
        "lastUpdated": date.today().isoformat(),
        "source": "MOSPI PLFS API (api.mospi.gov.in) + PLFS Annual Report 2023-24",
    }


def _build_indicators(plfs_states: list[dict]) -> dict:
    indicators = []

    # Unemployment
    indicators.append({
        "id": "unemployment_rate",
        "name": "Unemployment Rate",
        "category": "unemployment",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["unemploymentRate"]} for s in plfs_states],
        "source": "PLFS 2023-24",
    })

    # Participation
    indicators.append({
        "id": "lfpr",
        "name": "Labour Force Participation Rate",
        "category": "participation",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["lfpr"]} for s in plfs_states],
        "source": "PLFS 2023-24",
    })
    indicators.append({
        "id": "lfpr_male",
        "name": "Male LFPR",
        "category": "participation",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["lfprMale"]} for s in plfs_states],
        "source": "PLFS 2023-24",
    })
    indicators.append({
        "id": "lfpr_female",
        "name": "Female LFPR",
        "category": "participation",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["lfprFemale"]} for s in plfs_states],
        "source": "PLFS 2023-24",
    })
    indicators.append({
        "id": "wpr",
        "name": "Worker Population Ratio",
        "category": "participation",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["wpr"]} for s in plfs_states],
        "source": "PLFS 2023-24",
    })

    # Informality
    indicators.append({
        "id": "self_employed",
        "name": "Self-Employed (% of workers)",
        "category": "informality",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["selfEmployed"]} for s in plfs_states],
        "source": "PLFS 2023-24",
    })

    return {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }


def _build_glossary() -> dict:
    return {
        "domain": "employment",
        "year": SURVEY_YEAR,
        "terms": [
            {
                "id": "lfpr",
                "term": "Labour Force Participation Rate (LFPR)",
                "simple": "The percentage of people aged 15+ who are either working or actively looking for work.",
                "detail": "LFPR measures economic engagement. India's LFPR (~55.8%) is lower than the global average (~60%) primarily because of low female participation. Male LFPR (~76%) is comparable to global norms, but female LFPR (~35%) is among the lowest in the world. PLFS uses 'Usual Status' (principal + subsidiary activity in the past year) for annual estimates and 'Current Weekly Status' (CWS) for quarterly urban estimates.",
                "inContext": "India LFPR: 55.8% (PLFS Oct-Dec 2025). Male: 75.8%, Female: 35.2%.",
                "relatedTerms": ["unemployment-rate", "wpr", "plfs"],
            },
            {
                "id": "unemployment-rate",
                "term": "Unemployment Rate",
                "simple": "The percentage of people in the labour force who are looking for work but can't find it.",
                "detail": "Unemployment rate = unemployed / labour force × 100. India's headline unemployment (~4.2%) looks low by global standards, but it masks underemployment (people working fewer hours than they want) and disguised unemployment (people in agriculture with near-zero productivity). Youth unemployment is 3-4x the overall rate. Measurement matters: PLFS quarterly CWS shows higher unemployment than annual usual status because it captures short-term joblessness.",
                "inContext": "India UR: 4.2% (PLFS Q3 2025). Youth (15-29): 12.8%. Rural: 3.8%, Urban: 5.2%.",
                "relatedTerms": ["lfpr", "youth-unemployment", "plfs"],
            },
            {
                "id": "youth-unemployment",
                "term": "Youth Unemployment",
                "simple": "The unemployment rate among people aged 15-29, typically 3-4 times higher than the overall rate.",
                "detail": "India has ~60 crore people under 25 — the world's largest youth population. Youth unemployment at ~12.8% means roughly 2 crore young people are actively seeking work but can't find it. The paradox: educated youth face higher unemployment than uneducated youth (graduates: ~15% vs illiterates: ~2%), because educated youth have higher job expectations and can afford to wait. This is the 'educated unemployment' problem.",
                "inContext": "Youth UR (15-29): 12.8%. Graduates: ~15%. School dropouts: ~3%.",
                "relatedTerms": ["unemployment-rate", "demographic-dividend", "neet"],
            },
            {
                "id": "wpr",
                "term": "Worker Population Ratio (WPR)",
                "simple": "The percentage of people aged 15+ who are actually employed.",
                "detail": "WPR = employed / population 15+ × 100. It's LFPR minus unemployment. India's WPR (~53.5%) tells you that roughly half the adult population is working. The other half includes students, homemakers, retirees, and discouraged workers. WPR is considered a more direct measure of economic engagement than LFPR because it excludes the unemployed.",
                "inContext": "India WPR: ~53.5% (PLFS 2023-24). Male: ~72%, Female: ~33%.",
                "relatedTerms": ["lfpr", "unemployment-rate"],
            },
            {
                "id": "plfs",
                "term": "PLFS (Periodic Labour Force Survey)",
                "simple": "India's primary employment survey, conducted continuously by MoSPI since 2017-18.",
                "detail": "PLFS replaced the five-yearly Employment-Unemployment Survey (EUS). It runs on a rotational panel: each household is visited 4 times over a year. Annual reports cover all India (rural + urban) using Usual Status. Quarterly bulletins cover only urban areas using Current Weekly Status. PLFS is to employment data what UDISE+ is to education: the foundational administrative dataset. Sample size: ~1 lakh households/quarter.",
                "inContext": "PLFS samples ~1 lakh households/quarter. Annual report: rural + urban. Quarterly: urban only.",
                "relatedTerms": ["lfpr", "unemployment-rate", "usual-status"],
            },
            {
                "id": "usual-status",
                "term": "Usual Status (ps+ss)",
                "simple": "Employment measured by what a person mainly did over the past year (principal status + subsidiary status).",
                "detail": "PLFS uses two measurement approaches. Usual Status asks: 'What was your main activity in the last 365 days?' This captures long-term employment patterns. Current Weekly Status (CWS) asks about the reference week. Usual Status shows lower unemployment (because seasonal workers count as employed if they worked any time in the year). CWS shows higher unemployment (catches short-term joblessness). Both are valid — they measure different things.",
                "inContext": "Usual Status UR: ~3.2%. CWS UR: ~4.2% (higher because it captures short-term joblessness).",
                "relatedTerms": ["plfs", "unemployment-rate"],
            },
            {
                "id": "informal-sector",
                "term": "Informal Sector",
                "simple": "Jobs in unregistered enterprises with no written contracts, social security, or labor law protections.",
                "detail": "About 89% of India's workers are in the informal sector (ILO estimates). This includes street vendors, farm laborers, construction workers, domestic workers, auto-rickshaw drivers. Informal workers have no provident fund, health insurance, or job security. The formal-informal divide is India's deepest labor market challenge. E-Shram portal (2021) registered 29+ crore informal workers to extend social security coverage.",
                "inContext": "~89% of workers are informal. ~52% are self-employed. E-Shram: 29+ crore registered.",
                "relatedTerms": ["self-employment", "vulnerable-employment"],
            },
            {
                "id": "self-employment",
                "term": "Self-Employment",
                "simple": "People who work for themselves rather than for a wage — including small shop owners, farmers, and unpaid family workers.",
                "detail": "Over 52% of India's workforce is self-employed (PLFS 2023-24). Self-employment is highest in agriculture (nearly all farmers are self-employed) and retail trade. The category includes own-account workers (running their own micro-enterprise) and unpaid family helpers (often women working on family farms or shops). High self-employment is a marker of informal, subsistence economies — it falls as countries industrialize.",
                "inContext": "52.4% self-employed (PLFS 2023-24). Bihar: 68%, Delhi: 28%.",
                "relatedTerms": ["informal-sector", "vulnerable-employment"],
            },
            {
                "id": "vulnerable-employment",
                "term": "Vulnerable Employment",
                "simple": "Workers most at risk of poverty — own-account workers and contributing family workers combined.",
                "detail": "The ILO defines vulnerable employment as self-employed (excluding employers) + unpaid family workers. These workers typically lack formal contracts, social protection, and predictable income. India's vulnerable employment rate is ~77% (World Bank). It's falling slowly as regular wage employment grows, but the pace is glacial. For comparison: China's rate is ~45%, Brazil ~32%.",
                "inContext": "India vulnerable employment: ~77%. China: ~45%. Brazil: ~32%.",
                "relatedTerms": ["self-employment", "informal-sector"],
            },
            {
                "id": "structural-transformation",
                "term": "Structural Transformation",
                "simple": "The long-term shift of workers from agriculture to manufacturing and services as an economy develops.",
                "detail": "In 1991, agriculture employed 65% of Indians. Today it's ~46% — but it still produces only ~18% of GDP. This means agricultural productivity is far below manufacturing or services. The 'transformation' is workers moving to higher-productivity sectors. India's unique pattern: workers are moving directly from agriculture to services (skipping manufacturing). This 'premature de-industrialization' worries economists because manufacturing historically creates more stable, higher-paying jobs.",
                "inContext": "Agriculture: 46% of workers but 18% of GDP. Services: 31% of workers, 54% of GDP.",
                "relatedTerms": ["informal-sector", "disguised-unemployment"],
            },
            {
                "id": "disguised-unemployment",
                "term": "Disguised Unemployment",
                "simple": "When more people work on a farm or business than needed — removing some wouldn't reduce output.",
                "detail": "Classic example: a family farm needs 3 workers but employs 6 family members. The extra 3 are 'disguisedly unemployed' — they appear employed in statistics but contribute zero marginal productivity. This is widespread in Indian agriculture. Some economists estimate that 20-30% of agricultural workers are disguisedly unemployed. It's why India's headline unemployment rate looks low: these workers are counted as employed.",
                "inContext": "Estimated 20-30% of agricultural workers are disguisedly unemployed",
                "relatedTerms": ["structural-transformation", "self-employment"],
            },
            {
                "id": "female-lfpr",
                "term": "Female Labour Force Participation",
                "simple": "The percentage of women aged 15+ who are working or looking for work.",
                "detail": "India's female LFPR (~35%) is among the lowest in the world — below Bangladesh (38%), Sri Lanka (35%), and far below China (62%). The U-shaped hypothesis says female LFPR falls as families get richer (women leave farm work) and rises again at higher incomes (women enter professional jobs). India appears stuck in the dip. Contributing factors: safety concerns, social norms, care responsibilities, and lack of suitable local jobs.",
                "inContext": "India female LFPR: 35.2%. China: 62%. Bangladesh: 38%. Global: 47%.",
                "relatedTerms": ["lfpr", "unemployment-rate"],
            },
            {
                "id": "gig-economy",
                "term": "Gig Economy",
                "simple": "Short-term, task-based work arranged through digital platforms — delivery, ride-hailing, freelancing.",
                "detail": "India's gig workforce is estimated at 77 lakh workers (NITI Aayog 2022), projected to reach 2.35 crore by 2029-30. Platforms like Zomato, Swiggy, Uber, and Urban Company dominate. Gig workers are classified as 'partners' or 'independent contractors,' not employees — so they get no minimum wage, PF, or health insurance. The Social Security Code 2020 mandated gig worker welfare, but implementation lags.",
                "inContext": "~77 lakh gig workers (2022). Projected: 2.35 crore by 2029-30.",
                "relatedTerms": ["informal-sector", "self-employment"],
            },
            {
                "id": "neet",
                "term": "NEET (Not in Education, Employment, or Training)",
                "simple": "Young people who are neither studying, working, nor receiving any job training.",
                "detail": "India's NEET rate for youth (15-29) is about 30% — one of the highest globally. The gender breakdown is stark: male NEET ~10%, female NEET ~50%. Most female NEETs are engaged in unpaid domestic work. High NEET rates represent a demographic dividend being wasted. Skill India Mission and National Apprenticeship Promotion Scheme aim to reduce NEET by providing vocational training and work experience.",
                "inContext": "Youth NEET: ~30%. Male: ~10%. Female: ~50% (mostly domestic work).",
                "relatedTerms": ["youth-unemployment", "female-lfpr"],
            },
        ],
    }


if __name__ == "__main__":
    run_employment_pipeline()
