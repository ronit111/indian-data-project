"""
Education Data Pipeline — main entry point.

Stages:
  1. FETCH   — World Bank API + curated UDISE+/ASER data
  2. TRANSFORM — Build output schemas from raw data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/education/

Data sources:
  - World Bank Development Indicators (enrollment, literacy, spending, PTR)
  - UDISE+ Flash Statistics 2023-24 (state-level schools, teachers, infrastructure)
  - ASER 2024 (state-level learning outcomes)
"""

import logging
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.education.sources.world_bank import fetch_multiple
from src.education.sources.curated import (
    UDISE_2023_24_STATES,
    ASER_2024_STATES,
    NATIONAL_TOTALS,
)
from src.education.transform.enrollment import build_enrollment
from src.education.transform.quality import build_quality
from src.education.transform.spending import build_spending
from src.education.validate.schemas import (
    EducationSummary,
    EnrollmentData,
    QualityData,
    SpendingData,
    EducationIndicatorsData,
    GlossaryData,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("education-pipeline")

SURVEY_YEAR = "2025-26"


def run_education_pipeline():
    logger.info("=" * 60)
    logger.info(f"Education Data Pipeline — {SURVEY_YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ──────────────────────────────────────────────
    logger.info("Stage 1: FETCH")
    logger.info("  Fetching 14 indicators from World Bank API...")

    wb_data = fetch_multiple()

    logger.info(f"  World Bank: {sum(len(v) for v in wb_data.values())} total data points")
    logger.info(f"  Curated: {len(UDISE_2023_24_STATES)} UDISE+ states")
    logger.info(f"  Curated: {len(ASER_2024_STATES)} ASER states")

    # ── Stage 2: TRANSFORM ──────────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    enrollment_data = build_enrollment(wb_data, UDISE_2023_24_STATES, SURVEY_YEAR)
    quality_data = build_quality(wb_data, UDISE_2023_24_STATES, ASER_2024_STATES, SURVEY_YEAR)
    spending_data = build_spending(wb_data, SURVEY_YEAR)
    summary_data = _build_summary(wb_data)
    indicators_data = _build_indicators(UDISE_2023_24_STATES, ASER_2024_STATES)
    glossary_data = _build_glossary()

    # ── Stage 3: VALIDATE ───────────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", EducationSummary, summary_data),
        ("enrollment.json", EnrollmentData, enrollment_data),
        ("quality.json", QualityData, quality_data),
        ("spending.json", SpendingData, spending_data),
        ("indicators.json", EducationIndicatorsData, indicators_data),
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
        f"education/{SURVEY_YEAR}/summary.json": summary_data,
        f"education/{SURVEY_YEAR}/enrollment.json": enrollment_data,
        f"education/{SURVEY_YEAR}/quality.json": quality_data,
        f"education/{SURVEY_YEAR}/spending.json": spending_data,
        f"education/{SURVEY_YEAR}/indicators.json": indicators_data,
        f"education/{SURVEY_YEAR}/glossary.json": glossary_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Education pipeline complete!")
    logger.info("=" * 60)


def _build_summary(wb_data: dict) -> dict:
    """Build summary.json for the hub page card."""
    edu_spend_ts = wb_data.get("edu_spend_gdp", [])
    latest_spend = edu_spend_ts[-1]["value"] if edu_spend_ts else 3.5

    sorted_states = sorted(UDISE_2023_24_STATES, key=lambda s: s["totalStudents"], reverse=True)
    top5 = [{"name": s["name"], "students": s["totalStudents"]} for s in sorted_states[:5]]

    return {
        "year": SURVEY_YEAR,
        "totalStudents": NATIONAL_TOTALS["totalStudents"],
        "totalSchools": NATIONAL_TOTALS["totalSchools"],
        "totalTeachers": NATIONAL_TOTALS["totalTeachers"],
        "gerPrimary": NATIONAL_TOTALS["gerPrimary"],
        "gerSecondary": NATIONAL_TOTALS["gerSecondary"],
        "ptrNational": NATIONAL_TOTALS["ptrNational"],
        "educationSpendGDP": round(latest_spend, 1),
        "topEnrolledStates": top5,
        "lastUpdated": date.today().isoformat(),
        "source": "UDISE+ 2023-24 + World Bank + ASER 2024",
    }


def _build_indicators(udise_states: list[dict], aser_states: list[dict]) -> dict:
    """Build indicators.json for the explorer page."""
    indicators = []

    # Enrollment category
    indicators.append({
        "id": "ger_primary",
        "name": "Gross Enrollment Ratio (Primary)",
        "category": "enrollment",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["gerPrimary"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "ger_secondary",
        "name": "Gross Enrollment Ratio (Secondary)",
        "category": "enrollment",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["gerSecondary"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "ger_higher_sec",
        "name": "Gross Enrollment Ratio (Higher Secondary)",
        "category": "enrollment",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["gerHigherSec"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "dropout_primary",
        "name": "Dropout Rate (Primary)",
        "category": "enrollment",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["dropoutPrimary"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "dropout_secondary",
        "name": "Dropout Rate (Secondary)",
        "category": "enrollment",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["dropoutSecondary"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })

    # Quality category
    indicators.append({
        "id": "can_read_std2",
        "name": "Can Read Std II Text (Std III children)",
        "category": "quality",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["canReadStd2"]} for s in aser_states],
        "source": "ASER 2024",
    })
    indicators.append({
        "id": "can_do_subtraction",
        "name": "Can Do Subtraction (Std III children)",
        "category": "quality",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["canDoSubtraction"]} for s in aser_states],
        "source": "ASER 2024",
    })
    # Infrastructure category
    indicators.append({
        "id": "ptr",
        "name": "Pupil-Teacher Ratio",
        "category": "infrastructure",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["ptr"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "schools_computers",
        "name": "Schools with Computers",
        "category": "infrastructure",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["schoolsWithComputers"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "schools_internet",
        "name": "Schools with Internet",
        "category": "infrastructure",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["schoolsWithInternet"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "girls_toilets",
        "name": "Schools with Girls' Toilets",
        "category": "infrastructure",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["girlsToilets"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })

    # Spending category
    indicators.append({
        "id": "total_students",
        "name": "Total Students Enrolled",
        "category": "spending",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["totalStudents"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })
    indicators.append({
        "id": "total_teachers",
        "name": "Total Teachers",
        "category": "spending",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["totalTeachers"]} for s in udise_states],
        "source": "UDISE+ 2023-24",
    })

    return {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }


def _build_glossary() -> dict:
    """Build glossary.json with curated education terms."""
    return {
        "domain": "education",
        "year": SURVEY_YEAR,
        "terms": [
            {
                "id": "ger",
                "term": "Gross Enrollment Ratio (GER)",
                "simple": "The total number of students enrolled at a level, as a percentage of the age-appropriate population.",
                "detail": "GER can exceed 100% because it includes over-age and under-age students (repeaters, late starters). India's primary GER is ~105%, meaning nearly universal enrollment plus some over-age students. Secondary GER at ~80% reveals the drop-off. GER doesn't measure whether enrolled students actually attend or learn — that's where ASER and attendance data matter.",
                "inContext": "India's primary GER: ~105%. Secondary: ~80%. Higher secondary: ~57%.",
                "relatedTerms": ["ner", "dropout-rate", "udise"],
            },
            {
                "id": "ner",
                "term": "Net Enrollment Ratio (NER)",
                "simple": "The percentage of age-appropriate children enrolled at the correct school level.",
                "detail": "Unlike GER, NER only counts children of the official age group. It can never exceed 100%. NER gives a truer picture of access: if GER is 105% but NER is 92%, it means 8% of age-appropriate children are out of school while some older children are still in primary. India reports both, but UDISE+ primarily uses GER.",
                "inContext": "India's primary NER is ~92%, compared to GER of ~105%",
                "relatedTerms": ["ger", "out-of-school"],
            },
            {
                "id": "dropout-rate",
                "term": "Dropout Rate",
                "simple": "The percentage of students who leave school before completing a level.",
                "detail": "Calculated from UDISE+ transition rates: the percentage of students enrolled in one year who don't appear in the next year's records. India's primary dropout is low (~1.9%) but secondary jumps to ~14%. The cliff steepens at higher secondary (~20%). Dropouts are driven by economic pressure (child labor), distance to school, quality perception, and for girls, early marriage.",
                "inContext": "India: Primary dropout 1.9% → Secondary 14.1% → Higher secondary ~20%",
                "relatedTerms": ["ger", "out-of-school", "rte"],
            },
            {
                "id": "ptr",
                "term": "Pupil-Teacher Ratio (PTR)",
                "simple": "The average number of students per teacher.",
                "detail": "RTE Act mandates PTR of 30:1 for primary and 35:1 for upper primary. National average is ~26:1, but this masks huge gaps: Bihar has 65:1 while Himachal Pradesh has 14:1. A high PTR means less individual attention, more rote learning, and lower learning outcomes. PTR also doesn't capture teacher absenteeism, which ASER surveys estimate at 15-25% on any given day.",
                "inContext": "National PTR: 26:1. Bihar: 65:1. HP: 14:1. RTE target: 30:1.",
                "relatedTerms": ["rte", "udise", "aser"],
            },
            {
                "id": "aser",
                "term": "ASER (Annual Status of Education Report)",
                "simple": "The largest citizen-led survey of children's learning levels in rural India.",
                "detail": "Conducted by Pratham since 2005, ASER tests children (ages 3-16) at their homes, not schools, giving an unbiased snapshot of actual learning. It tests basic reading (Can a Std III child read a Std II text?) and arithmetic (Can they do subtraction?). The consistent finding: enrollment has risen dramatically, but learning levels have stagnated or declined. ASER 2024 shows slow recovery from COVID-era learning loss.",
                "inContext": "ASER 2024: Only ~23% of Std III children in rural India can read at Std II level",
                "relatedTerms": ["learning-outcomes", "ptr", "nep"],
            },
            {
                "id": "learning-outcomes",
                "term": "Learning Outcomes",
                "simple": "What children actually know and can do, as opposed to just being enrolled in school.",
                "detail": "India's education story has two chapters: access (largely solved — 97%+ enrollment) and quality (the crisis). ASER data shows that roughly half of Class V students can't read a Class II text. NAS (National Achievement Survey) by NCERT and ASER by Pratham are the two main assessment systems. NEP 2020 shifts focus from input metrics (schools built, teachers hired) to outcome metrics (foundational literacy and numeracy by Class 3).",
                "inContext": "India has near-universal enrollment but a severe learning crisis",
                "relatedTerms": ["aser", "nep", "foundational-literacy"],
            },
            {
                "id": "rte",
                "term": "Right to Education (RTE) Act",
                "simple": "A 2009 law guaranteeing free and compulsory education for all children aged 6-14.",
                "detail": "The RTE Act made India one of 135 countries to make education a fundamental right. Key provisions: no child can be held back or expelled until Class VIII, PTR caps (30:1 primary), infrastructure norms (drinking water, toilets, boundary walls), 25% reservation for disadvantaged children in private schools. Impact: enrollment surged, but the no-detention policy (repealed 2019) may have weakened learning incentives.",
                "inContext": "RTE covers ages 6-14 (Classes I-VIII). Enacted 2009, fully operational 2010.",
                "relatedTerms": ["dropout-rate", "ptr", "nep"],
            },
            {
                "id": "nep",
                "term": "National Education Policy (NEP) 2020",
                "simple": "India's new education policy replacing the 34-year-old policy, restructuring schooling into a 5+3+3+4 model.",
                "detail": "NEP 2020 replaces the 10+2 structure with 5+3+3+4 (Foundational: ages 3-8, Preparatory: 8-11, Middle: 11-14, Secondary: 14-18). Key goals: foundational literacy/numeracy by Class 3, mother tongue instruction until Class 5, coding from Class 6, flexible board exams, 6% of GDP target for education spending (currently ~3.5%). Implementation is phased and varies by state.",
                "inContext": "NEP 2020 targets: 100% GER by 2030, 6% GDP education spending, mother tongue instruction",
                "relatedTerms": ["rte", "foundational-literacy", "education-spending"],
            },
            {
                "id": "udise",
                "term": "UDISE+ (Unified District Information System for Education Plus)",
                "simple": "India's comprehensive school census, covering every school from pre-primary to higher secondary.",
                "detail": "UDISE+ collects data from 14.89 lakh schools annually — enrollment, teachers, infrastructure, examination results. It's the primary data source for education planning. The '+' signifies real-time data entry (since 2018-19) vs. the older paper-based system. UDISE+ is to education what the Census is to demographics: the foundational administrative dataset.",
                "inContext": "UDISE+ 2023-24: 14.89 lakh schools, 97.4 lakh teachers, 24.82 crore students",
                "relatedTerms": ["ger", "ptr", "rte"],
            },
            {
                "id": "foundational-literacy",
                "term": "Foundational Literacy and Numeracy (FLN)",
                "simple": "The ability to read with understanding and perform basic math by the end of Class 3.",
                "detail": "NEP 2020 identifies FLN as the most urgent education priority. The NIPUN Bharat mission (2021) targets universal FLN by 2026-27. Without foundational skills, later schooling is ineffective — a child who can't read in Class 3 is unlikely to catch up. ASER data consistently shows that 50%+ of Class V students lack Class II-level reading ability.",
                "inContext": "NIPUN Bharat target: Every child achieves FLN by end of Class 3 by 2026-27",
                "relatedTerms": ["aser", "learning-outcomes", "nep"],
            },
            {
                "id": "out-of-school",
                "term": "Out-of-School Children",
                "simple": "Children of school age who are not enrolled in any educational institution.",
                "detail": "India had ~3.2 crore out-of-school children (ages 6-17) in 2020. The number has declined dramatically since RTE (from ~13.5 crore in 2000), but the remaining children are the hardest to reach: children with disabilities, child laborers, girls in conservative areas, migrant families, tribal communities. COVID pushed millions temporarily out of school; full recovery is ongoing.",
                "inContext": "India: ~3.2 crore out-of-school (2020), down from ~13.5 crore in 2000",
                "relatedTerms": ["rte", "dropout-rate", "ger"],
            },
            {
                "id": "education-spending",
                "term": "Education Spending (% of GDP)",
                "simple": "How much of the country's total economic output is spent on education by the government.",
                "detail": "India spends about 3.5% of GDP on education — below the NEP 2020 target of 6% and below the global average of ~4.3%. The Kothari Commission (1966) first recommended 6%. For context: the US spends ~5%, UK ~5.5%, Brazil ~6%. Low spending per student means overcrowded classrooms, undertrained teachers, and poor infrastructure in government schools.",
                "inContext": "India: ~3.5% GDP. NEP target: 6%. Global average: ~4.3%.",
                "relatedTerms": ["nep", "ptr", "udise"],
            },
            {
                "id": "mid-day-meal",
                "term": "Mid-Day Meal Scheme (PM POSHAN)",
                "simple": "Government programme providing free hot meals to students in government schools to boost attendance and nutrition.",
                "detail": "Launched in 1995, now the world's largest school feeding program, covering ~12 crore children daily. Renamed PM POSHAN Shakti Nirman in 2021. Impact: enrollment increased 15%, attendance improved, reduced classroom hunger, narrowed gender gap (girls' enrollment rose faster in covered schools). Quality varies widely by state. Budget: ~₹12,000 crore/year.",
                "inContext": "PM POSHAN serves ~12 crore children daily in 11.8 lakh schools",
                "relatedTerms": ["rte", "dropout-rate"],
            },
            {
                "id": "private-schools",
                "term": "Private School Enrollment",
                "simple": "The share of students attending privately-managed schools rather than government schools.",
                "detail": "About 50% of Indian school students now attend private schools (up from ~28% in 2005). Private school growth is driven by perceived quality advantages, English medium instruction, and middle-class aspirations. ASER data shows private school students score 10-15 percentage points higher than government school students in reading and math, though this partly reflects socioeconomic selection rather than school quality alone.",
                "inContext": "~50% of students attend private schools. ASER shows 10-15 point learning gap vs. government schools.",
                "relatedTerms": ["rte", "learning-outcomes", "aser"],
            },
        ],
    }


if __name__ == "__main__":
    run_education_pipeline()
