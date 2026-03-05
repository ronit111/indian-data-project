"""
Healthcare Data Pipeline — main entry point.

Stages:
  1. FETCH   — World Bank API + curated NHP/NFHS data
  2. TRANSFORM — Build output schemas from raw data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/healthcare/

Data sources:
  - World Bank Development Indicators (hospital beds, physicians, health spending, immunization, TB/HIV)
  - National Health Profile 2022 — CBHI (state-level infrastructure)
  - NFHS-5 2019-21 (state-level immunization coverage)

Note: This domain focuses on infrastructure + spending + disease burden.
Mortality (IMR, MMR, U5MR) and life expectancy are in the Census domain.
"""

import logging
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.healthcare.sources.world_bank import fetch_multiple
from src.healthcare.sources.curated import (
    NHP_2022_STATES,
    IMMUNIZATION_STATES,
    NATIONAL_TOTALS,
)
from src.healthcare.transform.infrastructure import build_infrastructure
from src.healthcare.transform.spending import build_health_spending
from src.healthcare.transform.disease import build_disease
from src.healthcare.validate.schemas import (
    HealthcareSummary,
    InfrastructureData,
    HealthSpendingData,
    DiseaseData,
    HealthcareIndicatorsData,
    GlossaryData,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("healthcare-pipeline")

SURVEY_YEAR = "2025-26"


def run_healthcare_pipeline():
    logger.info("=" * 60)
    logger.info(f"Healthcare Data Pipeline — {SURVEY_YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────────
    logger.info("Stage 1: FETCH")
    logger.info("  Fetching 12 indicators from World Bank API...")

    wb_data = fetch_multiple()

    logger.info(f"  World Bank: {sum(len(v) for v in wb_data.values())} total data points")
    logger.info(f"  Curated: {len(NHP_2022_STATES)} NHP states")
    logger.info(f"  Curated: {len(IMMUNIZATION_STATES)} immunization states")

    # ── Stage 2: TRANSFORM ──────────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    infrastructure_data = build_infrastructure(wb_data, NHP_2022_STATES, SURVEY_YEAR)
    spending_data = build_health_spending(wb_data, SURVEY_YEAR)
    disease_data = build_disease(wb_data, IMMUNIZATION_STATES, SURVEY_YEAR)
    summary_data = _build_summary()
    indicators_data = _build_indicators(NHP_2022_STATES, IMMUNIZATION_STATES)
    glossary_data = _build_glossary()

    # ── Stage 3: VALIDATE ───────────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", HealthcareSummary, summary_data),
        ("infrastructure.json", InfrastructureData, infrastructure_data),
        ("spending.json", HealthSpendingData, spending_data),
        ("disease.json", DiseaseData, disease_data),
        ("indicators.json", HealthcareIndicatorsData, indicators_data),
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
        f"healthcare/{SURVEY_YEAR}/summary.json": summary_data,
        f"healthcare/{SURVEY_YEAR}/infrastructure.json": infrastructure_data,
        f"healthcare/{SURVEY_YEAR}/spending.json": spending_data,
        f"healthcare/{SURVEY_YEAR}/disease.json": disease_data,
        f"healthcare/{SURVEY_YEAR}/indicators.json": indicators_data,
        f"healthcare/{SURVEY_YEAR}/glossary.json": glossary_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Healthcare pipeline complete!")
    logger.info("=" * 60)


def _build_summary() -> dict:
    return {
        "year": SURVEY_YEAR,
        "hospitalBedsPer1000": NATIONAL_TOTALS["hospitalBedsPer1000"],
        "physiciansPer1000": NATIONAL_TOTALS["physiciansPer1000"],
        "healthExpGDP": NATIONAL_TOTALS["healthExpGDP"],
        "outOfPocketPct": NATIONAL_TOTALS["outOfPocketPct"],
        "dptImmunization": NATIONAL_TOTALS["dptImmunization"],
        "tbIncidence": NATIONAL_TOTALS["tbIncidence"],
        "lastUpdated": date.today().isoformat(),
        "source": "World Bank + National Health Profile 2022 + NFHS-5",
    }


def _build_indicators(nhp_states: list[dict], imm_states: list[dict]) -> dict:
    indicators = []

    # Infrastructure
    indicators.append({
        "id": "beds_per_lakh",
        "name": "Hospital Beds per Lakh Population",
        "category": "infrastructure",
        "unit": "per lakh",
        "states": [{"id": s["id"], "name": s["name"], "value": s["bedsPerLakh"]} for s in nhp_states],
        "source": "NHP 2022",
    })
    indicators.append({
        "id": "doctors_per_10k",
        "name": "Doctors per 10,000 Population",
        "category": "infrastructure",
        "unit": "per 10K",
        "states": [{"id": s["id"], "name": s["name"], "value": s["doctorsPer10K"]} for s in nhp_states],
        "source": "NHP 2022",
    })
    indicators.append({
        "id": "phcs",
        "name": "Primary Health Centres",
        "category": "infrastructure",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["phcs"]} for s in nhp_states],
        "source": "NHP 2022",
    })
    indicators.append({
        "id": "chcs",
        "name": "Community Health Centres",
        "category": "infrastructure",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["chcs"]} for s in nhp_states],
        "source": "NHP 2022",
    })
    indicators.append({
        "id": "sub_centres",
        "name": "Sub-Centres",
        "category": "infrastructure",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["subCentres"]} for s in nhp_states],
        "source": "NHP 2022",
    })

    # Immunization
    indicators.append({
        "id": "full_immunization",
        "name": "Full Immunization Coverage",
        "category": "immunization",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["fullImmunization"]} for s in imm_states],
        "source": "NFHS-5",
    })
    indicators.append({
        "id": "bcg_coverage",
        "name": "BCG Coverage",
        "category": "immunization",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["bcg"]} for s in imm_states],
        "source": "NFHS-5",
    })
    indicators.append({
        "id": "measles_coverage",
        "name": "Measles/MR Coverage",
        "category": "immunization",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["measles"]} for s in imm_states],
        "source": "NFHS-5",
    })
    indicators.append({
        "id": "dpt3_coverage",
        "name": "DPT/Pentavalent 3rd Dose Coverage",
        "category": "immunization",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["dpt3"]} for s in imm_states],
        "source": "NFHS-5",
    })

    return {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }


def _build_glossary() -> dict:
    return {
        "domain": "healthcare",
        "year": SURVEY_YEAR,
        "terms": [
            {
                "id": "phc",
                "term": "Primary Health Centre (PHC)",
                "simple": "A government clinic serving 20,000-30,000 people in rural areas, staffed by one or more doctors.",
                "detail": "PHCs are the first contact point between the village community and the medical officer. India has ~30,000 PHCs. Each should have 6 beds, a laboratory, and a pharmacy. In practice, many PHCs lack doctors (10% have zero doctors), essential drugs, or even electricity. IPHS (Indian Public Health Standards) set norms: 1 PHC per 30,000 rural population, with 24x7 services.",
                "inContext": "India has ~30,000 PHCs. ~10% function without a single doctor.",
                "relatedTerms": ["chc", "sub-centre", "ayushman-bharat"],
            },
            {
                "id": "chc",
                "term": "Community Health Centre (CHC)",
                "simple": "A 30-bed hospital serving about 1,20,000 people, with specialist doctors for surgery, obstetrics, medicine, and pediatrics.",
                "detail": "CHCs are the referral tier above PHCs. IPHS norms require 4 specialists, 21 paramedical staff, and equipment for surgeries and deliveries. India has ~6,000 CHCs. Specialist shortfall is severe: only 18% of CHCs have all 4 specialist doctors. This forces patients to travel to district hospitals or private facilities for basic surgeries.",
                "inContext": "India has ~6,000 CHCs. Only 18% have all 4 required specialist doctors.",
                "relatedTerms": ["phc", "district-hospital"],
            },
            {
                "id": "sub-centre",
                "term": "Sub-Centre (SC)",
                "simple": "The most basic health facility, serving about 5,000 people, staffed by a female health worker (ANM).",
                "detail": "India has ~1.6 lakh sub-centres — the frontline of rural healthcare. Each is staffed by an Auxiliary Nurse Midwife (ANM) who provides immunization, antenatal care, family planning, and basic drug distribution. Many sub-centres operate from rented rooms without water or electricity. Under Ayushman Bharat, ~1.5 lakh sub-centres are being upgraded to Health and Wellness Centres (HWCs) for comprehensive primary care.",
                "inContext": "India has ~1.6 lakh sub-centres. ~1.5 lakh being upgraded to HWCs.",
                "relatedTerms": ["phc", "ayushman-bharat"],
            },
            {
                "id": "oop-expenditure",
                "term": "Out-of-Pocket Expenditure (OOP)",
                "simple": "Healthcare costs paid directly by patients from their own pockets, without insurance or government coverage.",
                "detail": "India's OOP health spending is ~45% of total health expenditure (World Bank 2021) — among the highest globally (global average: ~18%). This means for every ₹100 spent on healthcare, ₹45 comes from patient pockets. High OOP pushes ~5.5 crore Indians into poverty annually due to medical expenses. It's the primary driver of catastrophic health expenditure. The solution: expanding public health insurance (Ayushman Bharat) and reducing dependence on private providers.",
                "inContext": "India OOP: ~45% (World Bank 2021, global avg: 18%). Pushes ~5.5 crore into poverty annually.",
                "relatedTerms": ["health-expenditure", "ayushman-bharat"],
            },
            {
                "id": "health-expenditure",
                "term": "Health Expenditure (% of GDP)",
                "simple": "How much of the country's total economic output is spent on healthcare from all sources.",
                "detail": "India's total health expenditure is ~3.3% of GDP (World Bank 2021). Government health spending is ~1.3% of GDP — one of the lowest globally. The National Health Policy 2017 targets 2.5% of GDP for government health spending by 2025. For comparison: US spends 18% of GDP (mostly private), UK 12% (mostly public), China 7%. India's challenge isn't just spending level but allocation: most goes to curative hospital care rather than preventive primary care.",
                "inContext": "Total health exp: ~3.3% GDP. Govt: ~1.3%. NHP target: 2.5%. US: 18%, UK: 12%.",
                "relatedTerms": ["oop-expenditure", "ayushman-bharat"],
            },
            {
                "id": "ayushman-bharat",
                "term": "Ayushman Bharat (PM-JAY)",
                "simple": "World's largest government health insurance scheme, covering ₹5 lakh per family per year for hospitalization.",
                "detail": "Launched 2018. Covers ~12 crore families (50 crore individuals) — the bottom 40% by income. Provides cashless hospitalization at empanelled hospitals (both public and private). Over 7 crore hospitalizations authorized since launch. Two components: (1) PM-JAY insurance for secondary/tertiary care, (2) Health & Wellness Centres (HWCs) for comprehensive primary care at 1.5 lakh upgraded sub-centres.",
                "inContext": "PM-JAY covers ~50 crore people. ₹5 lakh/family/year. 7+ crore hospitalizations.",
                "relatedTerms": ["oop-expenditure", "phc"],
            },
            {
                "id": "tb-incidence",
                "term": "TB Incidence",
                "simple": "The number of new tuberculosis cases per 100,000 people per year.",
                "detail": "India accounts for 27% of global TB cases — the highest burden of any country. Incidence: ~199 per 100,000 (2023). The National TB Elimination Programme targets elimination by 2025 (5 years ahead of the global SDG target of 2030). Despite this ambitious target, India still reports ~28 lakh new cases annually. Multi-drug resistant TB (MDR-TB) is an additional challenge at ~1.2 lakh cases/year.",
                "inContext": "India: ~199 TB cases per 100K. 27% of global burden. Target: elimination by 2025.",
                "relatedTerms": ["disease-burden"],
            },
            {
                "id": "hospital-beds",
                "term": "Hospital Beds per 1,000 Population",
                "simple": "The number of hospital beds available for every 1,000 people in the country.",
                "detail": "India has about 0.5 beds per 1,000 (government hospitals only) — far below the WHO recommendation of 3.5 per 1,000. Including private hospitals, the total is ~1.9 per 1,000. The variation is extreme: Delhi has 12+ per 1,000 while Bihar has less than 0.5. COVID-19 exposed this deficit acutely. Most beds are concentrated in urban areas, leaving rural India with minimal hospital infrastructure.",
                "inContext": "India: 0.5 govt beds/1000. Total (incl. private): ~1.9. WHO recommends: 3.5.",
                "relatedTerms": ["phc", "chc", "health-expenditure"],
            },
            {
                "id": "physicians-per-1000",
                "term": "Physicians per 1,000 Population",
                "simple": "The number of registered medical doctors for every 1,000 people.",
                "detail": "India has about 0.7 physicians per 1,000 (WHO recommends 1.0). But the distribution is severely skewed: urban areas have 4x the doctor density of rural areas. Kerala has 18.6 doctors per 10,000; Bihar has 2.4. India produces ~1 lakh MBBS graduates annually but brain drain (to US, UK, Gulf) and urban concentration hollow out rural healthcare. AYUSH practitioners (Ayurveda, Yoga, Naturopathy, Homeopathy) add ~0.5 per 1,000 but their role in primary care is debated.",
                "inContext": "India: 0.7 doctors/1000. WHO: 1.0. Kerala: 18.6 per 10K. Bihar: 2.4.",
                "relatedTerms": ["hospital-beds", "phc"],
            },
            {
                "id": "immunization",
                "term": "Universal Immunization Programme (UIP)",
                "simple": "India's national programme providing free vaccines to all children and pregnant women.",
                "detail": "UIP covers 12 vaccines for children (BCG, OPV, DPT, hepatitis B, measles, JE, pneumococcal, rotavirus, etc.) and 2 for pregnant women (tetanus). India is the world's largest vaccine producer and consumer. Full immunization coverage (all scheduled doses) has risen from 44% (NFHS-4, 2015-16) to 76% (NFHS-5, 2019-21). Mission Indradhanush (2014) intensified coverage in low-performing districts.",
                "inContext": "Full immunization: 76% nationally (NFHS-5). Range: 58% (Nagaland) to 91% (Odisha).",
                "relatedTerms": ["phc", "disease-burden"],
            },
            {
                "id": "disease-burden",
                "term": "Disease Burden",
                "simple": "The overall impact of diseases on a population, measured in deaths, disability, and economic cost.",
                "detail": "India is undergoing an 'epidemiological transition' — communicable diseases (TB, malaria, diarrhea) are declining while non-communicable diseases (NCDs: heart disease, diabetes, cancer, respiratory) are rising. NCDs now cause 65%+ of deaths. But India still carries massive infectious disease burdens: 27% of global TB, high malaria, and significant maternal/child mortality. This 'double burden' strains a healthcare system designed for neither.",
                "inContext": "NCDs: 65%+ of deaths. TB: 27% of global burden. Dual burden of communicable + non-communicable.",
                "relatedTerms": ["tb-incidence", "immunization"],
            },
            {
                "id": "nhp",
                "term": "National Health Profile (NHP)",
                "simple": "An annual publication by CBHI documenting India's health infrastructure, workforce, and disease statistics.",
                "detail": "Published by the Central Bureau of Health Intelligence (CBHI) under MoHFW. NHP compiles data from multiple sources: state health departments, census, SRS, NFHS, and WHO. It covers demographics, health status, healthcare infrastructure, health workforce, health financing, and disease-specific data. The latest edition (NHP 2022) provides the most comprehensive snapshot of India's public health system.",
                "inContext": "NHP 2022 is the latest. Source: CBHI under Ministry of Health & Family Welfare.",
                "relatedTerms": ["phc", "hospital-beds", "physicians-per-1000"],
            },
            {
                "id": "nfhs",
                "term": "NFHS (National Family Health Survey)",
                "simple": "India's largest household health survey, covering reproductive health, nutrition, and immunization across all states.",
                "detail": "NFHS is conducted by IIPS (Mumbai) with support from ICF International. NFHS-5 (2019-21) surveyed 6.4 lakh households across all states/UTs. It's the gold standard for district-level health data in India — used for planning, monitoring, and international comparisons (part of the global DHS programme). Data covers fertility, family planning, infant/child mortality, nutrition, immunization, HIV, and domestic violence.",
                "inContext": "NFHS-5: 6.4 lakh households. Provides district-level health data for all India.",
                "relatedTerms": ["immunization", "disease-burden"],
            },
        ],
    }


if __name__ == "__main__":
    run_healthcare_pipeline()
