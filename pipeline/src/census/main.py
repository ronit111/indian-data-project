"""
Census & Demographics Data Pipeline — main entry point.

Stages:
  1. FETCH   — World Bank API + curated Census 2011 / NFHS-6 / SRS data
  2. TRANSFORM — Build output schemas from raw data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/census/

Data sources:
  - World Bank Development Indicators (population, demographics, health, literacy)
  - Census of India 2011 (state-level population, literacy, sex ratio)
  - NFHS-6 2023-24 (state-level health and nutrition indicators)
  - SRS 2024 (state-level infant mortality rates)
"""

import logging
import sys
from datetime import date
from pathlib import Path

# Set up path so we can import our modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.census.sources.world_bank import fetch_multiple
from src.census.sources.curated import (
    CENSUS_2011_STATES,
    NPC_2026_PROJECTIONS,
    NFHS6_STATE_HEALTH,
    SRS_STATE_IMR,
)
from src.census.transform.population import build_population
from src.census.transform.demographics import build_demographics
from src.census.transform.literacy import build_literacy
from src.census.transform.health import build_health
from src.census.validate.schemas import (
    CensusSummary,
    PopulationData,
    LiteracyData,
    DemographicsData,
    HealthData,
    CensusIndicatorsData,
    GlossaryData,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("census-pipeline")

SURVEY_YEAR = "2025-26"


def run_census_pipeline():
    logger.info("=" * 60)
    logger.info(f"Census & Demographics Data Pipeline \u2014 {SURVEY_YEAR}")
    logger.info("=" * 60)

    # \u2500\u2500 Stage 1: FETCH \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    logger.info("Stage 1: FETCH")
    logger.info("  Fetching 19 indicators from World Bank API...")

    wb_data = fetch_multiple()

    logger.info(f"  World Bank: {sum(len(v) for v in wb_data.values())} total data points")
    logger.info(f"  Curated: {len(CENSUS_2011_STATES)} Census 2011 states")
    logger.info(f"  Curated: {len(NPC_2026_PROJECTIONS)} NPC 2026 projected states")
    logger.info(f"  Curated: {len(NFHS6_STATE_HEALTH)} NFHS-6 states")
    logger.info(f"  Curated: {len(SRS_STATE_IMR)} SRS IMR states")

    # \u2500\u2500 Stage 2: TRANSFORM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    logger.info("Stage 2: TRANSFORM")

    population_data = build_population(wb_data, CENSUS_2011_STATES, NPC_2026_PROJECTIONS, SURVEY_YEAR)
    demographics_data = build_demographics(wb_data, CENSUS_2011_STATES, SURVEY_YEAR)
    literacy_data = build_literacy(wb_data, CENSUS_2011_STATES, SURVEY_YEAR)
    health_data = build_health(wb_data, SRS_STATE_IMR, NFHS6_STATE_HEALTH, SURVEY_YEAR)
    summary_data = _build_summary(wb_data, NPC_2026_PROJECTIONS)
    indicators_data = _build_indicators(CENSUS_2011_STATES, NPC_2026_PROJECTIONS, NFHS6_STATE_HEALTH, SRS_STATE_IMR)
    glossary_data = _build_glossary()

    # \u2500\u2500 Stage 3: VALIDATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", CensusSummary, summary_data),
        ("population.json", PopulationData, population_data),
        ("demographics.json", DemographicsData, demographics_data),
        ("literacy.json", LiteracyData, literacy_data),
        ("health.json", HealthData, health_data),
        ("indicators.json", CensusIndicatorsData, indicators_data),
        ("glossary.json", GlossaryData, glossary_data),
    ]

    for name, model, data in validations:
        try:
            model(**data)
            logger.info(f"  {name} \u2713")
        except Exception as e:
            errors.append(f"{name}: {e}")
            logger.error(f"  {name} FAILED: {e}")

    if errors:
        logger.error(f"Validation failed with {len(errors)} error(s):")
        for err in errors:
            logger.error(f"  - {err}")
        sys.exit(1)

    # \u2500\u2500 Stage 4: PUBLISH \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    logger.info("Stage 4: PUBLISH")
    outputs = {
        f"census/{SURVEY_YEAR}/summary.json": summary_data,
        f"census/{SURVEY_YEAR}/population.json": population_data,
        f"census/{SURVEY_YEAR}/demographics.json": demographics_data,
        f"census/{SURVEY_YEAR}/literacy.json": literacy_data,
        f"census/{SURVEY_YEAR}/health.json": health_data,
        f"census/{SURVEY_YEAR}/indicators.json": indicators_data,
        f"census/{SURVEY_YEAR}/glossary.json": glossary_data,
    }

    paths = publish_all(outputs)
    # Provenance sidecar: recomputes integrity checks against the
    # JSONs just published; a failing check aborts the run (fail-closed).
    from src.publish.provenance import publish_provenance
    publish_provenance("census", SURVEY_YEAR)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Census & Demographics pipeline complete!")
    logger.info("=" * 60)


def _build_summary(wb_data: dict, npc_states: list[dict]) -> dict:
    """Build summary.json for the hub page card."""
    # Get latest population from World Bank time series
    pop_ts = wb_data.get("population", [])
    latest_pop = pop_ts[-1]["value"] if pop_ts else 1_428_627_663  # fallback: WB 2023

    pop_growth_ts = wb_data.get("pop_growth", [])
    latest_growth = pop_growth_ts[-1]["value"] if pop_growth_ts else 0.81

    urban_ts = wb_data.get("urban_pct", [])
    latest_urban = urban_ts[-1]["value"] if urban_ts else 35.87

    # Literacy: Census 2011 national figure (age 7+).
    # A weighted average of state entries gives 72.82% — lower than the official
    # 74.04% because weighting by total population (not age 7+ population)
    # under-counts literate adults in high-fertility states. Use the authoritative
    # Census 2011 national figure directly.
    weighted_literacy = 74.04

    # Sex ratio: national weighted average from Census 2011
    census_pop = sum(s["population"] for s in CENSUS_2011_STATES)
    weighted_sex_ratio = round(sum(s["sexRatio"] * s["population"] for s in CENSUS_2011_STATES) / census_pop) if census_pop else 943

    # Top 5 most populous states (NPC 2026 projections)
    sorted_states = sorted(npc_states, key=lambda s: s["population"], reverse=True)
    top5 = [{"name": s["name"], "population": s["population"]} for s in sorted_states[:5]]

    return {
        "year": SURVEY_YEAR,
        "totalPopulation": latest_pop,
        "populationGrowthRate": round(latest_growth, 2),
        "literacyRate": round(weighted_literacy, 2),
        "urbanizationRate": round(latest_urban, 2),
        "sexRatio": weighted_sex_ratio,
        "topPopulousStates": top5,
        "lastUpdated": date.today().isoformat(),
        "source": "World Bank + NPC Projections 2026 + Census of India 2011",
    }


def _build_indicators(
    census_states: list[dict],
    npc_states: list[dict],
    nfhs_states: list[dict],
    srs_states: list[dict],
) -> dict:
    """Build indicators.json for the explorer page."""
    indicators = []

    # Population category — use NPC 2026 projected population
    indicators.append({
        "id": "population",
        "name": "Population (Projected 2026)",
        "category": "population",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["population"]} for s in npc_states],
        "source": "NPC Population Projections 2026",
    })
    indicators.append({
        "id": "density",
        "name": "Population Density",
        "category": "population",
        "unit": "per sq km",
        "states": [{"id": s["id"], "name": s["name"], "value": s["density"]} for s in census_states],
        "source": "Census of India 2011",
    })
    indicators.append({
        "id": "decadal_growth",
        "name": "Decadal Growth Rate",
        "category": "population",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["decadalGrowth"]} for s in census_states],
        "source": "Census of India 2011",
    })
    indicators.append({
        "id": "sex_ratio",
        "name": "Sex Ratio",
        "category": "population",
        "unit": "females per 1000 males",
        "states": [{"id": s["id"], "name": s["name"], "value": s["sexRatio"]} for s in census_states],
        "source": "Census of India 2011",
    })

    # Demographics category
    indicators.append({
        "id": "urbanization",
        "name": "Urbanization Rate",
        "category": "demographics",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["urbanPercent"]} for s in census_states],
        "source": "Census of India 2011",
    })

    # Literacy category
    indicators.append({
        "id": "literacy_total",
        "name": "Literacy Rate (Total)",
        "category": "literacy",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["literacyTotal"]} for s in census_states],
        "source": "Census of India 2011",
    })
    indicators.append({
        "id": "literacy_male",
        "name": "Literacy Rate (Male)",
        "category": "literacy",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["literacyMale"]} for s in census_states],
        "source": "Census of India 2011",
    })
    indicators.append({
        "id": "literacy_female",
        "name": "Literacy Rate (Female)",
        "category": "literacy",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["literacyFemale"]} for s in census_states],
        "source": "Census of India 2011",
    })
    indicators.append({
        "id": "gender_gap",
        "name": "Literacy Gender Gap",
        "category": "literacy",
        "unit": "percentage points",
        "states": [{"id": s["id"], "name": s["name"], "value": round(s["literacyMale"] - s["literacyFemale"], 2)} for s in census_states],
        "source": "Census of India 2011",
    })

    # Health category
    indicators.append({
        "id": "imr_srs",
        "name": "Infant Mortality Rate (SRS 2024)",
        "category": "health",
        "unit": "per 1000 live births",
        "states": [{"id": s["id"], "name": s["name"], "value": s["value"]} for s in srs_states],
        "source": "Sample Registration System 2024",
    })
    indicators.append({
        "id": "tfr_nfhs",
        "name": "Total Fertility Rate (NFHS-6)",
        "category": "health",
        "unit": "",
        "states": [{"id": s["id"], "name": s["name"], "value": s["tfr"]} for s in nfhs_states],
        "source": "NFHS-6 (2023-24)",
    })
    indicators.append({
        "id": "stunting",
        "name": "Child Stunting",
        "category": "health",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["stunting"]} for s in nfhs_states],
        "source": "NFHS-6 (2023-24)",
    })
    indicators.append({
        "id": "full_immunization",
        "name": "Full Immunization",
        "category": "health",
        "unit": "%",
        "states": [{"id": s["id"], "name": s["name"], "value": s["fullImmunization"]} for s in nfhs_states],
        "source": "NFHS-6 (2023-24)",
    })

    return {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }


def _build_glossary() -> dict:
    """Build glossary.json with curated demographic terms."""
    return {
        "domain": "census",
        "year": SURVEY_YEAR,
        "terms": [
            {
                "id": "census",
                "term": "Census",
                "simple": "A complete count of every person living in India, conducted once every 10 years.",
                "detail": "The Census of India is the largest peacetime administrative exercise in the world. It records not just headcount but age, gender, literacy, occupation, housing, religion, language, and migration status for every individual. The last completed census was in 2011. Census 2021 was postponed due to COVID-19; Census 2027 is now planned (houselisting from April 2026, enumeration from February 2027).",
                "inContext": "Census 2011 counted 1.21 billion people across 640,000+ villages and 8,000+ towns",
                "relatedTerms": ["population-density", "decadal-growth", "sex-ratio"],
            },
            {
                "id": "population-density",
                "term": "Population Density",
                "simple": "How many people live in each square kilometer of land.",
                "detail": "Population density = total population / land area in sq km. India's national average is 382 per sq km (Census 2011), but this masks enormous variation: Bihar has 1,106 people/sq km while Arunachal Pradesh has just 17. Delhi, at 11,320/sq km, is one of the most densely populated places on Earth.",
                "inContext": "India's average density: 382 per sq km (Census 2011). Bihar highest at 1,106, Arunachal Pradesh lowest at 17.",
                "relatedTerms": ["census", "urbanization"],
            },
            {
                "id": "sex-ratio",
                "term": "Sex Ratio",
                "simple": "The number of females for every 1,000 males in the population.",
                "detail": "India uses the convention of females per 1,000 males (unlike the global standard of males per 100 females). A ratio below 1,000 means fewer women than men. India's national sex ratio was 943 in Census 2011, up from 933 in 2001. Kerala leads with 1,084; Haryana is lowest at 879. The skewed ratio reflects son preference, sex-selective practices, and differential mortality.",
                "inContext": "National: 943 females per 1000 males (Census 2011). Kerala: 1,084. Haryana: 879.",
                "relatedTerms": ["census", "total-fertility-rate"],
            },
            {
                "id": "decadal-growth",
                "term": "Decadal Growth Rate",
                "simple": "How much the population grew over a 10-year period, as a percentage.",
                "detail": "Decadal growth is calculated between two census rounds (e.g., 2001 to 2011). India's growth rate has been declining: from 21.5% (1991-2001) to 17.7% (2001-2011). This slowdown reflects falling fertility rates, rising education levels, and urbanization. Nagaland is the only state with negative decadal growth (-0.58% in 2001-2011).",
                "inContext": "India grew 17.7% from 2001 to 2011, down from 21.5% in the previous decade",
                "relatedTerms": ["census", "total-fertility-rate", "demographic-dividend"],
            },
            {
                "id": "total-fertility-rate",
                "term": "Total Fertility Rate (TFR)",
                "simple": "The average number of children a woman would have in her lifetime at current birth rates.",
                "detail": "TFR of 2.1 is called 'replacement level' \u2014 the rate at which a population exactly replaces itself. India's TFR held below replacement at 2.0 nationally (NFHS-6, 2023-24). Bihar remains highest at 2.7 (down from 3.0 in NFHS-5); West Bengal, Punjab, Assam and Goa are among the lowest at 1.6. Below-replacement fertility means India's population will eventually stabilize and then decline, though population momentum means growth continues for decades after TFR drops below 2.1.",
                "inContext": "India's TFR: 2.0 (NFHS-6). Below replacement level (2.1).",
                "relatedTerms": ["infant-mortality-rate", "demographic-dividend", "sex-ratio"],
            },
            {
                "id": "infant-mortality-rate",
                "term": "Infant Mortality Rate (IMR)",
                "simple": "The number of babies (under age 1) who die per 1,000 live births in a year.",
                "detail": "IMR is one of the most sensitive indicators of a country's healthcare quality and social development. India's IMR has dropped dramatically: from 66 per 1,000 in 2000 to 24 in 2024 (SRS). But the interstate gap tells the real story: Kerala's IMR is 8 while Chhattisgarh's is 36 \u2014 a baby born in Chhattisgarh is about four to five times more likely to die before age 1 than one born in Kerala.",
                "inContext": "National IMR: 24 per 1000 (SRS 2024). Kerala: 8. Chhattisgarh: 36.",
                "relatedTerms": ["under-5-mortality", "maternal-mortality-ratio", "total-fertility-rate"],
            },
            {
                "id": "under-5-mortality",
                "term": "Under-5 Mortality Rate",
                "simple": "The number of children who die before age 5 per 1,000 live births.",
                "detail": "Under-5 mortality captures deaths from infancy through early childhood, including those from malnutrition, diarrhea, pneumonia, and vaccine-preventable diseases. India's rate has halved since 2000 but remains higher than the global average. NFHS-5 shows Kerala at 5 and Uttar Pradesh at 59 \u2014 a 12-fold difference within the same country.",
                "inContext": "India U5MR: ~30 per 1000 (World Bank 2022). NFHS-5 range: Kerala 5 to UP 59.",
                "relatedTerms": ["infant-mortality-rate", "stunting"],
            },
            {
                "id": "maternal-mortality-ratio",
                "term": "Maternal Mortality Ratio (MMR)",
                "simple": "The number of women who die from pregnancy-related causes per 100,000 live births.",
                "detail": "MMR measures maternal deaths during pregnancy, childbirth, or within 42 days after delivery. India's MMR has declined from 370 (2000) to about 103 (SRS 2019-21). The government target is below 70 by 2030 (SDG target). Kerala has among the lowest MMRs in the developing world; Assam and UP among the highest.",
                "inContext": "India MMR: ~103 per 100,000 live births (SRS 2019-21), down from 370 in 2000",
                "relatedTerms": ["infant-mortality-rate", "total-fertility-rate"],
            },
            {
                "id": "demographic-dividend",
                "term": "Demographic Dividend",
                "simple": "The economic boost a country gets when its working-age population (15-64) is much larger than its dependent population (children + elderly).",
                "detail": "India is in the middle of its demographic dividend window. About 67% of Indians are working-age (2024), with the dependency ratio at a historic low. This window opened around 2005-2010 and closes around 2035-2040. Countries like South Korea, China, and Thailand converted their dividend into rapid economic growth through education and job creation. India's challenge: creating enough quality jobs before the window closes and the elderly population grows.",
                "inContext": "India's working-age share: ~67%. Window closes ~2040.",
                "relatedTerms": ["dependency-ratio", "total-fertility-rate", "urbanization"],
            },
            {
                "id": "dependency-ratio",
                "term": "Dependency Ratio",
                "simple": "The number of people too young (under 15) or too old (65+) to work, relative to the working-age population.",
                "detail": "Expressed as dependents per 100 working-age people. A lower ratio means more potential earners supporting fewer dependents. India's ratio has been falling (from 65 in 2000 to about 48 in 2024) as birth rates drop and the working-age bulge grows. Japan's ratio is over 70 due to aging. India's is at a sweet spot \u2014 but only if jobs exist.",
                "inContext": "India's dependency ratio: ~48 (2024), down from 65 in 2000",
                "relatedTerms": ["demographic-dividend", "total-fertility-rate"],
            },
            {
                "id": "urbanization",
                "term": "Urbanization Rate",
                "simple": "The percentage of the population living in cities and towns.",
                "detail": "India is about 35% urban (2024), far below China (65%) or Brazil (87%). But urban India is growing fast: cities added 91 million people between 2001 and 2011. By 2047 (India at 100), projections suggest 50%+ will be urban. Urbanization drives economic growth but also strains infrastructure \u2014 India's cities already face water, housing, and transport challenges.",
                "inContext": "India: ~35% urban (2024). Goa: 62%. Himachal Pradesh: 10%.",
                "relatedTerms": ["population-density", "demographic-dividend"],
            },
            {
                "id": "literacy-rate",
                "term": "Literacy Rate",
                "simple": "The percentage of people aged 7 and above who can read and write in any language.",
                "detail": "India's definition counts anyone aged 7+ who can read and write with understanding. The national rate was 74% in Census 2011, up from 65% in 2001. The gender gap (male 82% vs female 65%) has narrowed but remains significant. Kerala leads at 94%; Bihar trails at 62%. Literacy is a census measure \u2014 it doesn't capture quality of education, only basic reading/writing ability.",
                "inContext": "National: 74% (Census 2011). Male: 82%. Female: 65%. Kerala: 94%. Bihar: 62%.",
                "relatedTerms": ["census", "sex-ratio"],
            },
            {
                "id": "stunting",
                "term": "Stunting",
                "simple": "When a child under 5 is too short for their age due to chronic malnutrition.",
                "detail": "Stunting (low height-for-age) is a marker of chronic undernutrition, repeated infections, and poor living conditions in early life. It affects brain development and lifelong earning potential. India's stunting rate fell to 29.3% nationally in NFHS-6 (2023-24), down from 35.5% in NFHS-5 (2019-21). That's still tens of millions of stunted children \u2014 among the most of any country.",
                "inContext": "29.3% of Indian children under 5 are stunted (NFHS-6). Down from 35.5% in NFHS-5.",
                "relatedTerms": ["under-5-mortality", "infant-mortality-rate"],
            },
            {
                "id": "srs",
                "term": "Sample Registration System (SRS)",
                "simple": "A continuous survey that tracks births and deaths across India between census years.",
                "detail": "Since India conducts a census only every 10 years, the SRS fills the gap by continuously recording vital events (births, deaths) in a representative sample of villages and urban blocks. It provides annual estimates of birth rate, death rate, IMR, and fertility rate at state and national levels. The SRS is run by the Registrar General of India and is the primary source for inter-censal vital statistics.",
                "inContext": "SRS 2024 reported a national IMR of 24 per 1000 live births",
                "relatedTerms": ["census", "infant-mortality-rate", "total-fertility-rate"],
            },
        ],
    }


if __name__ == "__main__":
    run_census_pipeline()
