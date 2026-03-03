"""
Crime & Safety Data Pipeline — main entry point.

Stages:
  1. FETCH   — Curated NCRB/MoRTH/BPRD data + World Bank homicide rate
  2. TRANSFORM — Build output schemas from curated constants + WB data
  3. VALIDATE — Pydantic model checks
  4. PUBLISH — Write JSON to public/data/crime/

Data sources:
  - NCRB "Crime in India 2022": IPC/SLL crimes, crimes against women,
    cybercrime, justice system disposal
  - MoRTH "Road Accidents in India 2022": Road fatalities, causes
  - BPRD "Data on Police Organisations 2022": Police strength, vacancies
  - I4C / cybercrime.gov.in: Complaint portal context
  - World Bank: Intentional homicide rate (VC.IHR.PSRC.P5)

Coverage: 2014–2022 (curated), 1990–2022 (World Bank homicide rate)
"""

import logging
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.crime.sources.curated import (
    NATIONAL_CRIME_TREND,
    IPC_CRIME_COMPOSITION,
    STATE_CRIME_RATES,
    WOMEN_CRIME_TREND,
    WOMEN_CRIME_TYPES,
    STATE_WOMEN_CRIME_RATES,
    ROAD_ACCIDENT_TREND,
    ROAD_ACCIDENT_CAUSES,
    STATE_ROAD_FATALITIES,
    CYBERCRIME_TREND,
    CYBERCRIME_TYPES,
    I4C_CONTEXT,
    POLICE_NATIONAL,
    STATE_POLICE_RATIO,
    JUSTICE_PIPELINE,
    TRIAL_DURATION,
    NATIONAL_TOTALS,
)
from src.crime.sources.world_bank import fetch_world_bank_data
from src.crime.transform.overview import build_overview
from src.crime.transform.women_safety import build_women_safety
from src.crime.transform.road_accidents import build_road_accidents
from src.crime.transform.cybercrime import build_cybercrime
from src.crime.transform.police import build_police
from src.crime.transform.justice import build_justice
from src.crime.validate.schemas import (
    CrimeSummary,
    CrimeOverviewData,
    WomenSafetyData,
    RoadAccidentData,
    CybercrimeData,
    PoliceData,
    JusticeData,
    CrimeIndicatorsData,
    GlossaryData,
)
from src.publish.writer import publish_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("crime-pipeline")

SURVEY_YEAR = "2025-26"


def run_crime_pipeline():
    logger.info("=" * 60)
    logger.info(f"Crime & Safety Data Pipeline — {SURVEY_YEAR}")
    logger.info("=" * 60)

    # ── Stage 1: FETCH ─────────────────────────────────────────────
    logger.info("Stage 1: FETCH")
    logger.info("  Curated: NCRB Crime in India 2022")
    logger.info(f"    National trend: {len(NATIONAL_CRIME_TREND)} years")
    logger.info(f"    State crime rates: {len(STATE_CRIME_RATES)} states")
    logger.info(f"    Women crime trend: {len(WOMEN_CRIME_TREND)} years")
    logger.info(f"    Road accident trend: {len(ROAD_ACCIDENT_TREND)} years")
    logger.info(f"    Cybercrime trend: {len(CYBERCRIME_TREND)} years")
    logger.info(f"    Police state ratios: {len(STATE_POLICE_RATIO)} states")

    # World Bank: intentional homicide rate (long-run context)
    logger.info("  Fetching World Bank homicide rate...")
    wb_data = fetch_world_bank_data(start_year=1990, end_year=2025)
    homicide_data = wb_data.get("homicideRate", [])
    logger.info(f"    Homicide rate: {len(homicide_data)} data points")

    # ── Stage 2: TRANSFORM ─────────────────────────────────────────
    logger.info("Stage 2: TRANSFORM")

    overview_data = build_overview(
        NATIONAL_CRIME_TREND, IPC_CRIME_COMPOSITION,
        STATE_CRIME_RATES, homicide_data, SURVEY_YEAR,
    )
    women_data = build_women_safety(
        WOMEN_CRIME_TREND, WOMEN_CRIME_TYPES,
        STATE_WOMEN_CRIME_RATES, SURVEY_YEAR,
    )
    road_data = build_road_accidents(
        ROAD_ACCIDENT_TREND, ROAD_ACCIDENT_CAUSES,
        STATE_ROAD_FATALITIES, SURVEY_YEAR,
    )
    cyber_data = build_cybercrime(
        CYBERCRIME_TREND, CYBERCRIME_TYPES,
        I4C_CONTEXT, SURVEY_YEAR,
    )
    police_data = build_police(
        POLICE_NATIONAL, STATE_POLICE_RATIO, SURVEY_YEAR,
    )
    justice_data = build_justice(
        JUSTICE_PIPELINE, TRIAL_DURATION, SURVEY_YEAR,
    )
    summary_data = _build_summary()
    indicators_data = _build_indicators()
    glossary_data = _build_glossary()

    # ── Stage 3: VALIDATE ──────────────────────────────────────────
    logger.info("Stage 3: VALIDATE")
    errors = []

    validations = [
        ("summary.json", CrimeSummary, summary_data),
        ("overview.json", CrimeOverviewData, overview_data),
        ("women-safety.json", WomenSafetyData, women_data),
        ("road-accidents.json", RoadAccidentData, road_data),
        ("cybercrime.json", CybercrimeData, cyber_data),
        ("police.json", PoliceData, police_data),
        ("justice.json", JusticeData, justice_data),
        ("indicators.json", CrimeIndicatorsData, indicators_data),
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

    # ── Stage 4: PUBLISH ───────────────────────────────────────────
    logger.info("Stage 4: PUBLISH")
    outputs = {
        f"crime/{SURVEY_YEAR}/summary.json": summary_data,
        f"crime/{SURVEY_YEAR}/overview.json": overview_data,
        f"crime/{SURVEY_YEAR}/women-safety.json": women_data,
        f"crime/{SURVEY_YEAR}/road-accidents.json": road_data,
        f"crime/{SURVEY_YEAR}/cybercrime.json": cyber_data,
        f"crime/{SURVEY_YEAR}/police.json": police_data,
        f"crime/{SURVEY_YEAR}/justice.json": justice_data,
        f"crime/{SURVEY_YEAR}/indicators.json": indicators_data,
        f"crime/{SURVEY_YEAR}/glossary.json": glossary_data,
    }

    paths = publish_all(outputs)
    logger.info(f"Published {len(paths)} files")

    logger.info("=" * 60)
    logger.info("Crime & Safety pipeline complete!")
    logger.info("=" * 60)


def _build_summary() -> dict:
    return {
        "year": SURVEY_YEAR,
        "totalCrimes": NATIONAL_TOTALS["totalCrimes2022"],
        "crimeRate": NATIONAL_TOTALS["crimeRate2022"],
        "roadDeaths": NATIONAL_TOTALS["roadDeaths2022"],
        "convictionRatePct": NATIONAL_TOTALS["convictionRatePct"],
        "womenCrimes": NATIONAL_TOTALS["womenCrimes2022"],
        "cybercrimes": NATIONAL_TOTALS["cybercrimes2022"],
        "policeRatioActual": NATIONAL_TOTALS["policeRatioActual"],
        "dataYear": NATIONAL_TOTALS["dataYear"],
        "lastUpdated": date.today().isoformat(),
        "source": "NCRB Crime in India 2022 + MoRTH 2022 + BPRD 2022",
    }


def _build_indicators() -> dict:
    """Build state-level indicators for the Explorer page."""
    indicators = []

    # Crime rate per lakh population
    indicators.append({
        "id": "crime_rate",
        "name": "Crime Rate (per lakh population)",
        "category": "overall",
        "unit": "per lakh",
        "states": [
            {"id": s["id"], "name": s["name"], "value": s["rate"]}
            for s in STATE_CRIME_RATES
        ],
        "source": "NCRB Crime in India 2022",
    })

    # Crimes against women rate per lakh women
    indicators.append({
        "id": "women_crime_rate",
        "name": "Crimes Against Women (per lakh women)",
        "category": "women-safety",
        "unit": "per lakh",
        "states": [
            {"id": s["id"], "name": s["name"], "value": s["rate"]}
            for s in STATE_WOMEN_CRIME_RATES
        ],
        "source": "NCRB Crime in India 2022",
    })

    # Road accident fatality rate per lakh population
    indicators.append({
        "id": "road_fatality_rate",
        "name": "Road Accident Fatality Rate (per lakh)",
        "category": "road-safety",
        "unit": "per lakh",
        "states": [
            {"id": s["id"], "name": s["name"], "value": s["rate"]}
            for s in STATE_ROAD_FATALITIES
        ],
        "source": "MoRTH Road Accidents in India 2022",
    })

    # Police-population ratio (actual per lakh)
    indicators.append({
        "id": "police_ratio",
        "name": "Police-Population Ratio (per lakh)",
        "category": "infrastructure",
        "unit": "per lakh",
        "states": [
            {"id": s["id"], "name": s["name"], "value": s["actual"]}
            for s in STATE_POLICE_RATIO
        ],
        "source": "BPRD Data on Police Organisations 2022",
    })

    # Police vacancy rate
    indicators.append({
        "id": "police_vacancy",
        "name": "Police Vacancy Rate",
        "category": "infrastructure",
        "unit": "%",
        "states": [
            {
                "id": s["id"],
                "name": s["name"],
                "value": round(
                    (1 - s["actual"] / s["sanctioned"]) * 100, 1
                ) if s["sanctioned"] > 0 else 0,
            }
            for s in STATE_POLICE_RATIO
        ],
        "source": "BPRD Data on Police Organisations 2022",
    })

    return {
        "year": SURVEY_YEAR,
        "indicators": indicators,
    }


def _build_glossary() -> dict:
    return {
        "domain": "crime",
        "year": SURVEY_YEAR,
        "terms": [
            {
                "id": "ipc",
                "term": "Indian Penal Code (IPC)",
                "simple": "India's main criminal law, covering offences like murder, theft, assault, and fraud. Replaced by the Bharatiya Nyaya Sanhita (BNS) in 2024.",
                "detail": "The IPC was enacted in 1860 during British rule and remained India's primary criminal code for 164 years. It defines offences, punishments, and exceptions. NCRB categorizes all crimes as either IPC crimes or Special & Local Laws (SLL) crimes. In 2022, IPC crimes accounted for 61% of all registered crimes. The IPC was replaced by the Bharatiya Nyaya Sanhita (BNS, 2023) effective July 1, 2024, though NCRB data through 2022 uses IPC categories.",
                "inContext": "3.56 lakh IPC crimes in 2022 (61% of total). Replaced by BNS from July 2024.",
                "relatedTerms": ["sll", "fir", "cognizable"],
            },
            {
                "id": "sll",
                "term": "Special & Local Laws (SLL)",
                "simple": "Crimes under specific laws like NDPS (drugs), Arms Act, SC/ST Act, POCSO, and state-level regulations — separate from the main IPC.",
                "detail": "SLL crimes are offences under laws other than the IPC. Major SLL categories include: NDPS Act (narcotics), Arms Act, SC/ST (Prevention of Atrocities) Act, POCSO (child sexual offences), IT Act (cybercrime), Excise Act, Gambling Act, and various state-specific laws. SLL crimes made up 39% of total cognizable crimes in 2022 (22.6 lakh cases). Some laws like POCSO carry stricter penalties than equivalent IPC sections.",
                "inContext": "22.6 lakh SLL crimes in 2022 (39% of total). Includes NDPS, Arms Act, POCSO, IT Act.",
                "relatedTerms": ["ipc", "pocso"],
            },
            {
                "id": "fir",
                "term": "First Information Report (FIR)",
                "simple": "The official document filed at a police station when a cognizable crime is reported. It starts the legal process.",
                "detail": "An FIR is filed under Section 154 of CrPC (now Section 173 of BNSS) when information about a cognizable offence reaches the police. Filing an FIR is mandatory — refusal is punishable. The FIR captures the complainant's statement, the nature of the crime, and known details. It triggers investigation and is the basis for NCRB crime statistics. Zero FIRs (filed at any station regardless of jurisdiction) were introduced to reduce victims being turned away. E-FIR filing is available in some states.",
                "inContext": "58.2 lakh FIRs registered in 2022. Zero FIR ensures no jurisdictional refusal.",
                "relatedTerms": ["cognizable", "chargesheet"],
            },
            {
                "id": "cognizable",
                "term": "Cognizable Offence",
                "simple": "A serious crime where police can arrest without a warrant and must register an FIR. Murder, theft, and assault are cognizable.",
                "detail": "Cognizable offences are listed in the First Schedule of CrPC. Police have the authority (and obligation) to investigate without a magistrate's order. Non-cognizable offences (like minor fights or defamation) require a magistrate's permission for investigation and cannot lead to arrest without a warrant. NCRB statistics primarily cover cognizable crimes because these generate FIRs. The cognizable/non-cognizable distinction affects police responsiveness — victims of non-cognizable offences often face reluctance from police to act.",
                "inContext": "All NCRB crime data is FIR-based, covering cognizable offences only.",
                "relatedTerms": ["fir", "ipc"],
            },
            {
                "id": "chargesheet",
                "term": "Chargesheet (Charge Sheet)",
                "simple": "A police report filed in court after investigation, formally accusing someone of a crime with evidence. Also called a 'final report.'",
                "detail": "After investigation, police file a chargesheet (Section 173 CrPC / Section 193 BNSS) if they find sufficient evidence, or a closure report if not. The chargesheet includes charges, evidence, witness statements, and forensic reports. In 2022, the chargesheet rate for IPC crimes was 74.6% — meaning ~25% of investigated cases were closed without charges. A high chargesheet rate indicates investigative completion, not necessarily justice — chargesheeted cases still face trial delays. The chargesheet must be filed within 60-90 days (depending on offence severity) or the accused gets default bail.",
                "inContext": "74.6% chargesheet rate in 2022. Filed within 60-90 days or accused gets default bail.",
                "relatedTerms": ["fir", "conviction-rate"],
            },
            {
                "id": "conviction-rate",
                "term": "Conviction Rate",
                "simple": "The percentage of completed trials that result in the accused being found guilty. India's rate is about 39%.",
                "detail": "Conviction rate = (persons convicted / total persons whose trials were completed) × 100. India's 39.1% conviction rate for IPC crimes (2022) is often cited as low, but context matters: it counts only completed trials, not pending cases. The US federal conviction rate is ~93% (but most cases are plea bargains — rare in India). Low conviction reflects investigation quality, evidence standards, witness protection gaps, and overloaded courts. Some crime categories have higher rates: NDPS (~71%), murder (~43%). The rate varies wildly by state.",
                "inContext": "39.1% for IPC crimes in 2022. US federal rate (~93%) includes plea bargains.",
                "relatedTerms": ["chargesheet", "pendency"],
            },
            {
                "id": "pendency",
                "term": "Case Pendency",
                "simple": "Cases stuck in the court system waiting for trial. Over 31 lakh criminal cases were pending at the end of 2022.",
                "detail": "Pendency is the backlog of cases awaiting disposal. In 2022, 63.2% of all cases at courts were pending at year-end (31 lakh cases). Causes: judge vacancies (India has ~21 judges per million vs global average of ~50), slow investigation, adjournments, witness unavailability, and procedural delays. 28.6% of pending cases are older than 5 years, 10.2% older than 10 years. The National Judicial Data Grid (NJDG) tracks pendency in real time. Fast-track courts and e-courts have been set up to address the backlog.",
                "inContext": "31 lakh cases pending (63.2%). 28.6% older than 5 years. 21 judges per million population.",
                "relatedTerms": ["conviction-rate", "chargesheet"],
            },
            {
                "id": "pocso",
                "term": "POCSO Act",
                "simple": "The Protection of Children from Sexual Offences Act (2012) — a special law for crimes against children under 18.",
                "detail": "POCSO was enacted in 2012 to address child sexual abuse with gender-neutral provisions. It covers penetrative assault, sexual assault, sexual harassment, and pornography involving children. Key features: child-friendly procedures (no repeated questioning, in-camera trials, identity protection), mandatory reporting, and presumption of guilt (accused must prove innocence). Special POCSO courts must complete trials within 1 year. In practice, conviction rates under POCSO are around 35-40% and trials often exceed the 1-year mandate.",
                "inContext": "Gender-neutral. Mandatory reporting. Special courts must complete trials in 1 year.",
                "relatedTerms": ["sll", "conviction-rate"],
            },
            {
                "id": "ncrb",
                "term": "National Crime Records Bureau (NCRB)",
                "simple": "The government agency that collects, analyzes, and publishes crime data for all of India.",
                "detail": "NCRB was established in 1986 under the Ministry of Home Affairs. It publishes the annual 'Crime in India' report — the most comprehensive source of crime statistics in the country. NCRB collects data from all state police forces, compiles it, and produces state-wise, crime-wise, and demographic breakdowns. Limitations: data is FIR-based (underreporting is significant), there's typically a 1-2 year publication lag, and definitions/classifications occasionally change between years. NCRB also maintains the Crime and Criminal Tracking Network & Systems (CCTNS).",
                "inContext": "Publishes 'Crime in India' annually. FIR-based data since 1953. 1-2 year lag.",
                "relatedTerms": ["fir", "ipc", "sll"],
            },
            {
                "id": "crime-rate",
                "term": "Crime Rate",
                "simple": "The number of crimes per 1 lakh (100,000) population. Makes crime numbers comparable across states of different sizes.",
                "detail": "Crime rate = (total cognizable crimes / mid-year population) × 100,000. It normalizes for population, making states comparable. India's overall crime rate was 422.2 in 2022. Kerala's rate (1,287) is highest but largely reflects better reporting and policing — not worse safety. Bihar's rate (295) is low partly due to underreporting. Crime rate is limited: it doesn't capture severity (one murder counts the same as one theft), underreporting, or demographic factors. Always interpret alongside reporting culture, police coverage, and urbanization.",
                "inContext": "India: 422.2 per lakh (2022). Kerala: 1,287 (high reporting). Bihar: 295 (underreporting).",
                "relatedTerms": ["ncrb", "cognizable"],
            },
            {
                "id": "dowry-death",
                "term": "Dowry Death (Section 304B IPC)",
                "simple": "Death of a woman within 7 years of marriage due to dowry harassment — treated as murder under Indian law.",
                "detail": "Section 304B IPC (now Section 80 BNS) defines dowry death: if a woman dies within 7 years of marriage under unnatural circumstances, and it's shown she was subjected to cruelty or harassment for dowry, the husband/in-laws are presumed guilty. Punishment: 7 years to life imprisonment. In 2022, 6,450 dowry deaths were registered — about 18 per day. This is widely considered an undercount. The Dowry Prohibition Act (1961) criminalizes giving and taking dowry, but enforcement is weak. States with highest dowry deaths: UP, Bihar, MP.",
                "inContext": "6,450 cases in 2022 (~18 per day). UP, Bihar, MP have highest numbers.",
                "relatedTerms": ["ipc", "fir"],
            },
            {
                "id": "morth",
                "term": "MoRTH (Ministry of Road Transport & Highways)",
                "simple": "The central ministry responsible for road safety policy. Publishes the annual 'Road Accidents in India' report.",
                "detail": "MoRTH road accident data is more comprehensive than NCRB motor vehicle accident FIRs because MoRTH includes accidents not registered as FIRs and uses state transport department records in addition to police records. In 2022: 4.61 lakh accidents, 1.68 lakh deaths, 4.43 lakh injuries. India has about 1% of the world's vehicles but accounts for ~11% of global road fatality deaths. Over-speeding causes ~69% of fatal accidents. The Motor Vehicles (Amendment) Act 2019 significantly increased penalties for traffic violations.",
                "inContext": "1.68 lakh road deaths in 2022. India: 1% of vehicles, 11% of global road deaths.",
                "relatedTerms": ["ncrb"],
            },
            {
                "id": "i4c",
                "term": "I4C (Indian Cyber Crime Coordination Centre)",
                "simple": "A government portal (cybercrime.gov.in) where citizens can report cybercrimes online — separate from filing an FIR.",
                "detail": "I4C was set up by MHA in 2020 to coordinate cybercrime response across states. The portal (cybercrime.gov.in) allows online complaint filing for financial fraud, women/child-related cybercrimes, and other cybercrimes. In 2022, 22.68 lakh complaints were filed on the portal vs only 65,893 cybercrime FIRs registered by NCRB — the 34x gap reflects how few complaints convert to formal police cases. I4C also operates a toll-free helpline (1930) for financial fraud, which has recovered hundreds of crores through quick intervention.",
                "inContext": "22.68 lakh complaints vs 65,893 FIRs (34x gap). Helpline: 1930.",
                "relatedTerms": ["ncrb", "fir"],
            },
            {
                "id": "bprd",
                "term": "BPRD (Bureau of Police Research & Development)",
                "simple": "A government research body that publishes data on police strength, infrastructure, and modernization across all states.",
                "detail": "BPRD was established in 1970 under MHA. It publishes the annual 'Data on Police Organisations' report — the definitive source for police workforce statistics. Key metrics: sanctioned vs actual strength (17.8% vacancy in 2022), police-population ratios by state, women in police (11.7%), training infrastructure, and technology adoption. BPRD also runs training programs and conducts research on policing challenges. The UN recommends 222 police per lakh population — India's actual ratio is 151, with Bihar as low as 77 per lakh.",
                "inContext": "17.8% police vacancy. UN recommends 222 per lakh; India has 151. Bihar: 77.",
                "relatedTerms": ["ncrb", "i4c"],
            },
            {
                "id": "kerala-paradox",
                "term": "Kerala Paradox (Reporting Effect)",
                "simple": "Kerala has India's highest crime rate but also the best policing — high numbers often mean better reporting, not worse safety.",
                "detail": "Kerala's crime rate (1,287 per lakh in 2022) is ~3x the national average, yet Kerala consistently ranks among India's safest states in citizen surveys. The paradox is explained by: higher police-population ratio (188 per lakh vs 151 national), better-educated population more likely to report crimes, stronger women's rights awareness (more domestic violence and harassment FIRs), and inclusive policing practices. Conversely, states like Bihar (295) have low rates partly due to underreporting, social barriers to filing FIRs, and fewer police stations per capita. Crime rate alone is a poor safety indicator.",
                "inContext": "Kerala: 1,287 rate but highest literacy, best police ratio. Bihar: 295 rate but high underreporting.",
                "relatedTerms": ["crime-rate", "ncrb"],
            },
        ],
    }


if __name__ == "__main__":
    run_crime_pipeline()
