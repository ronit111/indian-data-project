"""
MOSPI PLFS (Periodic Labour Force Survey) API wrapper.

Fetches employment indicators from api.mospi.gov.in/api/plfs/getData.

PLFS indicator codes:
  1 = LFPR (Labour Force Participation Rate)
  2 = WPR (Worker Population Ratio)
  3 = UR (Unemployment Rate)
  4 = Percentage distribution of workers (by sector/status)
  5 = Regular wage employees with employment conditions
  6 = Average wage/salary earnings
  7 = Average casual labour wage
  8 = Average self-employment earnings

Key filter codes:
  frequency_code: 1=Annually, 2=Quarterly
  gender_code: 1=male, 2=female, 3=person (total)
  sector_code: 1=rural, 2=urban, 3=rural+urban
  age_code: 1=all, 2=15+, 3=15-29, 4=15-59
  weekly_status_code: 1=PS+SS (Usual Status), 2=CWS

Source: MOSPI eSankhyiki PLFS API
"""

import logging
from typing import Any

from src.common.mospi_client import fetch

logger = logging.getLogger(__name__)

# State name → RTO code mapping for consistency with our pipeline
_STATE_TO_RTO: dict[str, str] = {
    "Andhra Pradesh": "AP",
    "Arunachal Pradesh": "AR",
    "Assam": "AS",
    "Bihar": "BR",
    "Chhattisgarh": "CG",
    "Delhi": "DL",
    "Goa": "GA",
    "Gujarat": "GJ",
    "Haryana": "HR",
    "Himachal Pradesh": "HP",
    "Jharkhand": "JH",
    "Karnataka": "KA",
    "Kerala": "KL",
    "Madhya Pradesh": "MP",
    "Maharashtra": "MH",
    "Manipur": "MN",
    "Meghalaya": "ML",
    "Mizoram": "MZ",
    "Nagaland": "NL",
    "Odisha": "OD",
    "Punjab": "PB",
    "Rajasthan": "RJ",
    "Sikkim": "SK",
    "Tamil Nadu": "TN",
    "Telangana": "TS",
    "Tripura": "TR",
    "Uttar Pradesh": "UP",
    "Uttarakhand": "UK",
    "West Bengal": "WB",
    "Jammu & Kashmir": "JK",
}


def fetch_state_employment(year: str = "2023-24") -> list[dict[str, Any]] | None:
    """
    Fetch state-level employment indicators: LFPR, WPR, UR (total, male, female).

    Returns list of state dicts matching our existing PLFS_STATE_DATA schema:
    {id, name, lfpr, lfprMale, lfprFemale, unemploymentRate, wpr, selfEmployed}

    Only includes the 30 major states/UTs (matching our RTO code map).
    Filters: age 15+, Usual Status (PS+SS), rural+urban combined, all religion/social/education.
    """
    # Fetch LFPR (indicator 1), WPR (indicator 2), UR (indicator 3)
    # For each: total, male, female
    indicators = {
        "lfpr": ("1", "3", None),     # LFPR, total gender, no specific gender filter
        "lfpr_male": ("1", "1", None), # LFPR, male
        "lfpr_female": ("1", "2", None), # LFPR, female
        "wpr": ("2", "3", None),       # WPR, total
        "ur": ("3", "3", None),        # UR, total
    }

    raw_data: dict[str, dict[str, float]] = {}  # state_name -> {lfpr: val, ...}
    api_reachable = False

    for metric, (indicator_code, gender_code, _) in indicators.items():
        params = {
            "indicator_code": indicator_code,
            "frequency_code": "1",  # Annual
            "gender_code": gender_code,
            "sector_code": "3",  # rural + urban
            "weekly_status_code": "1",  # PS+SS (Usual Status)
            "year": year,
        }
        records = fetch("plfs", params, max_pages=10)
        if not records:
            continue
        api_reachable = True

        for r in records:
            state = r.get("state", "")
            if state == "All India" or state not in _STATE_TO_RTO:
                continue

            # Filter to clean aggregates
            if (r.get("religion") != "all" or
                r.get("socialGroup") != "all" or
                r.get("General_Education") != "all"):
                continue

            age = r.get("AgeGroup", "")
            if age != "15 years and above":
                continue

            value = r.get("value")
            if value is None:
                continue

            try:
                val = float(value)
            except (ValueError, TypeError):
                continue

            raw_data.setdefault(state, {})[metric] = val

    if not api_reachable:
        logger.warning("PLFS API unreachable — will use curated fallback")
        return None

    # Now fetch self-employment share (indicator 4, broad_status_employment_code=1)
    self_emp_params = {
        "indicator_code": "4",
        "frequency_code": "1",
        "gender_code": "3",  # person
        "sector_code": "3",  # total
        "weekly_status_code": "1",
        "year": year,
        "broad_status_employment_code": "1",  # self-employed
    }
    self_emp_records = fetch("plfs", self_emp_params, max_pages=10)
    for r in (self_emp_records or []):
        state = r.get("state", "")
        if state not in _STATE_TO_RTO:
            continue
        if (r.get("religion") != "all" or r.get("socialGroup") != "all" or
            r.get("General_Education") != "all" or r.get("AgeGroup") != "15 years and above"):
            continue
        value = r.get("value")
        if value is not None:
            try:
                raw_data.setdefault(state, {})["self_employed"] = float(value)
            except (ValueError, TypeError):
                pass

    # Build output matching PLFS_STATE_DATA schema
    result: list[dict[str, Any]] = []
    for state_name, metrics in raw_data.items():
        rto_code = _STATE_TO_RTO.get(state_name)
        if not rto_code:
            continue
        if "lfpr" not in metrics:
            continue  # Skip if we don't even have LFPR

        result.append({
            "id": rto_code,
            "name": state_name,
            "lfpr": metrics.get("lfpr", 0),
            "lfprMale": metrics.get("lfpr_male", 0),
            "lfprFemale": metrics.get("lfpr_female", 0),
            "unemploymentRate": metrics.get("ur", 0),
            "wpr": metrics.get("wpr", 0),
            "selfEmployed": metrics.get("self_employed", 0),
        })

    result.sort(key=lambda s: s["id"])
    logger.info(f"  PLFS state data: {len(result)} states for {year}")
    return result if result else None


def fetch_national_totals(year: str = "2023-24") -> dict[str, Any] | None:
    """
    Fetch national headline employment numbers.

    Returns dict matching our NATIONAL_TOTALS schema:
    {unemploymentRate, lfpr, youthUnemployment, femaleLfpr, workforceTotal, selfEmployedPct}
    """
    totals: dict[str, float] = {}
    api_reachable = False

    # Fetch specific national aggregates
    queries = [
        ("lfpr", "1", "3", "2"),         # LFPR, person, 15+
        ("femaleLfpr", "1", "2", "2"),   # LFPR, female, 15+
        ("unemploymentRate", "3", "3", "2"),  # UR, person, 15+
        ("youthUnemployment", "3", "3", "3"),  # UR, person, 15-29
    ]

    for key, indicator, gender, age in queries:
        params = {
            "indicator_code": indicator,
            "frequency_code": "1",
            "gender_code": gender,
            "sector_code": "3",
            "weekly_status_code": "1",
            "year": year,
            "age_code": age,
        }
        records = fetch("plfs", params, max_pages=3)
        if not records:
            continue
        api_reachable = True

        for r in records:
            if (r.get("state") == "All India" and
                r.get("religion") == "all" and
                r.get("socialGroup") == "all" and
                r.get("General_Education") == "all"):
                try:
                    totals[key] = float(r["value"])
                except (ValueError, TypeError, KeyError):
                    pass
                break

    if not api_reachable:
        return None

    # Self-employed percentage
    self_emp_params = {
        "indicator_code": "4",
        "frequency_code": "1",
        "gender_code": "3",
        "sector_code": "3",
        "weekly_status_code": "1",
        "year": year,
        "broad_status_employment_code": "1",
        "age_code": "2",
    }
    se_records = fetch("plfs", self_emp_params, max_pages=3)
    for r in (se_records or []):
        if (r.get("state") == "All India" and r.get("religion") == "all" and
            r.get("socialGroup") == "all" and r.get("General_Education") == "all"):
            try:
                totals["selfEmployedPct"] = float(r["value"])
            except (ValueError, TypeError, KeyError):
                pass
            break

    logger.info(f"  PLFS national totals: {len(totals)} metrics for {year}")

    return {
        "unemploymentRate": totals.get("unemploymentRate", 0),
        "lfpr": totals.get("lfpr", 0),
        "youthUnemployment": totals.get("youthUnemployment", 0),
        "femaleLfpr": totals.get("femaleLfpr", 0),
        "workforceTotal": 57.0,  # crores — API doesn't provide this directly, kept from curated
        "selfEmployedPct": totals.get("selfEmployedPct", 0),
    } if totals else None
