"""
RBI Handbook of Statistics on Indian States — data extraction.

Downloads and parses XLSX tables to provide:
  - Table 19: Per Capita NSDP (current prices)
  - Table 21: GSDP at current prices
  - Table 22: GSDP at constant prices (2011-12 base)
  - Table 164: Gross Fiscal Deficit

Replaces manually curated STATE_GSDP_DATA, STATE_GSDP_HISTORY, and
STATE_FISCAL_DATA in curated.py.

Source: RBI Handbook of Statistics on Indian States
https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States
"""

import logging
from typing import Any

from src.common.rbi_handbook import fetch_states_tables, parse_state_table

logger = logging.getLogger(__name__)

# State name → RTO code mapping (matches curated.py)
_STATE_TO_RTO: dict[str, str] = {
    "Andhra Pradesh": "AP",
    "Arunachal Pradesh": "AR",
    "Assam": "AS",
    "Bihar": "BR",
    "Chhattisgarh": "CG",
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
    "Delhi": "DL",
    "Jammu & Kashmir": "JK",
    "Jammu and Kashmir": "JK",
    "Jammu & Kashmir*": "JK",
    "Puducherry": "PY",
}

# Small UTs without comparable GSDP data — set to zero
_ZERO_UTS = {"AN", "CH", "DN", "LA", "LD"}


def fetch_handbook_gsdp() -> tuple[list[dict[str, Any]], list[dict[str, Any]], str] | None:
    """
    Fetch GSDP data from Tables 19, 21, 22.

    Returns (gsdp_data, gsdp_history, data_year) matching the curated.py schema,
    or None if the Handbook is unreachable.

    gsdp_data: [{id, name, gsdp, gsdpConstant, growthRate, perCapitaGsdp, population}]
    gsdp_history: [{id, name, gsdp: [{year, value}]}] for top 10 states, last 3 years
    data_year: fiscal year string (e.g., "2022-23")
    """
    tables = fetch_states_tables([19, 21, 22])
    if not tables or 21 not in tables:
        logger.warning("Handbook GSDP tables unavailable — will use curated fallback")
        return None

    # Parse each table
    gsdp_current = parse_state_table(tables[21]) if 21 in tables else []
    gsdp_constant = parse_state_table(tables[22]) if 22 in tables else []
    per_capita = parse_state_table(tables[19]) if 19 in tables else []

    if not gsdp_current:
        return None

    # Build lookup dicts by state name
    constant_by_state = {d["state"]: d["years"] for d in gsdp_constant}
    percapita_by_state = {d["state"]: d["years"] for d in per_capita}

    # Determine the latest year with the most data coverage
    all_years: set[str] = set()
    for d in gsdp_current:
        all_years.update(d["years"].keys())

    if not all_years:
        return None

    # Find latest year available (sort fiscal years)
    sorted_years = sorted(all_years)
    latest_year = sorted_years[-1]
    prev_year = sorted_years[-2] if len(sorted_years) >= 2 else None

    logger.info(f"  Handbook GSDP: latest year = {latest_year}, {len(gsdp_current)} states")

    # Build gsdp_data list
    gsdp_data: list[dict[str, Any]] = []
    for entry in gsdp_current:
        state_name = entry["state"]
        rto = _STATE_TO_RTO.get(state_name)
        if not rto:
            continue  # Skip unrecognized states/UTs

        # GSDP at current prices (Rs lakh → Rs crore = divide by 100)
        gsdp_lakh = entry["years"].get(latest_year, 0)
        gsdp_crore = round(gsdp_lakh / 100, 2)

        # GSDP at constant prices
        const_years = constant_by_state.get(state_name, {})
        gsdp_const_lakh = const_years.get(latest_year, 0)
        gsdp_const_crore = round(gsdp_const_lakh / 100, 2)

        # Growth rate (YoY in current prices)
        growth_rate = 0.0
        if prev_year:
            prev_gsdp = entry["years"].get(prev_year, 0)
            if prev_gsdp > 0 and gsdp_lakh > 0:
                growth_rate = round((gsdp_lakh - prev_gsdp) / prev_gsdp * 100, 2)

        # Per capita NSDP
        pc_years = percapita_by_state.get(state_name, {})
        per_capita_val = round(pc_years.get(latest_year, 0))

        # Implied population (GSDP crore * 100 / per_capita)
        population = round(gsdp_crore * 100 / per_capita_val, 2) if per_capita_val > 0 else 0

        gsdp_data.append({
            "id": rto,
            "name": state_name,
            "gsdp": gsdp_crore,
            "gsdpConstant": gsdp_const_crore,
            "growthRate": growth_rate,
            "perCapitaGsdp": per_capita_val,
            "population": population,
        })

    # Add zero-value entries for small UTs
    existing_ids = {d["id"] for d in gsdp_data}
    ut_names = {
        "AN": "Andaman and Nicobar Islands",
        "CH": "Chandigarh",
        "DN": "Dadra and Nagar Haveli and Daman and Diu",
        "LA": "Ladakh",
        "LD": "Lakshadweep",
    }
    for ut_id in _ZERO_UTS:
        if ut_id not in existing_ids:
            gsdp_data.append({
                "id": ut_id,
                "name": ut_names.get(ut_id, ut_id),
                "gsdp": 0, "gsdpConstant": 0, "growthRate": 0,
                "perCapitaGsdp": 0, "population": 0,
            })

    # Build gsdp_history (top 10 by GSDP, last 3 years)
    valid_states = [s for s in gsdp_data if s["gsdp"] > 0]
    top_10 = sorted(valid_states, key=lambda s: s["gsdp"], reverse=True)[:10]

    # Get last 3 years
    history_years = sorted_years[-3:] if len(sorted_years) >= 3 else sorted_years

    current_by_state = {d["state"]: d["years"] for d in gsdp_current}
    gsdp_history: list[dict[str, Any]] = []
    for state in top_10:
        name = state["name"]
        years_data = current_by_state.get(name, {})
        history_series = []
        for y in history_years:
            val = years_data.get(y, 0)
            if val > 0:
                history_series.append({"year": y, "value": round(val / 100, 2)})

        if history_series:
            gsdp_history.append({
                "id": state["id"],
                "name": name,
                "gsdp": history_series,
            })

    gsdp_data.sort(key=lambda s: s["id"])
    logger.info(f"  Handbook GSDP: {len(gsdp_data)} states for {latest_year}")
    return gsdp_data, gsdp_history, latest_year


def fetch_handbook_fiscal() -> list[dict[str, Any]] | None:
    """
    Fetch fiscal deficit data from Table 164.

    Returns [{id, name, fiscalDeficitPctGsdp, debtToGsdp}] or None if unavailable.

    Note: Table 164 provides absolute fiscal deficit (Rs crore), not % of GSDP.
    We compute the percentage using GSDP data from Table 21.
    debtToGsdp is not available from this table and will be kept from curated data.
    """
    tables = fetch_states_tables([164, 21])
    if 164 not in tables:
        logger.warning("Handbook fiscal table unavailable — will use curated fallback")
        return None

    fiscal_data = parse_state_table(tables[164])
    if not fiscal_data:
        return None

    # Get GSDP for computing percentage
    gsdp_data = parse_state_table(tables[21]) if 21 in tables else []
    gsdp_by_state: dict[str, dict[str, float]] = {
        d["state"]: d["years"] for d in gsdp_data
    }

    # Find the latest fiscal year. Fiscal years have suffixes like "(A)", "(RE)", "(BE)".
    # Strip suffixes for matching with GSDP years.
    fiscal_years: set[str] = set()
    for d in fiscal_data:
        fiscal_years.update(d["years"].keys())

    if not fiscal_years:
        return None

    # Sort by the base year (strip suffix), prefer latest
    def _base_year(y: str) -> str:
        """'2024-25 (BE)' → '2024-25'"""
        return y.split(" ")[0].strip()

    sorted_fiscal_years = sorted(fiscal_years, key=lambda y: _base_year(y))
    latest_fiscal_year = sorted_fiscal_years[-1]
    latest_base_year = _base_year(latest_fiscal_year)

    # Find matching GSDP year
    gsdp_match_year = latest_base_year  # GSDP uses clean year strings

    logger.info(f"  Handbook fiscal: using {latest_fiscal_year} for deficit, {gsdp_match_year} for GSDP")

    result: list[dict[str, Any]] = []
    for entry in fiscal_data:
        state_name = entry["state"]
        rto = _STATE_TO_RTO.get(state_name)
        if not rto:
            continue

        fiscal_deficit_crore = entry["years"].get(latest_fiscal_year, 0)

        # Compute fiscal deficit as % of GSDP
        gsdp_years = gsdp_by_state.get(state_name, {})
        gsdp_lakh = gsdp_years.get(gsdp_match_year, 0)
        gsdp_crore = gsdp_lakh / 100 if gsdp_lakh > 0 else 0

        deficit_pct = 0.0
        if gsdp_crore > 0:
            deficit_pct = round(fiscal_deficit_crore / gsdp_crore * 100, 1)

        result.append({
            "id": rto,
            "name": state_name,
            "fiscalDeficitPctGsdp": deficit_pct,
            "debtToGsdp": 0,  # Not available from Table 164; kept from curated
        })

    # Add zero-value entries for small UTs
    existing_ids = {d["id"] for d in result}
    ut_names = {
        "AN": "Andaman and Nicobar Islands",
        "CH": "Chandigarh",
        "DN": "Dadra and Nagar Haveli and Daman and Diu",
        "LA": "Ladakh",
        "LD": "Lakshadweep",
    }
    for ut_id in _ZERO_UTS:
        if ut_id not in existing_ids:
            result.append({
                "id": ut_id,
                "name": ut_names.get(ut_id, ut_id),
                "fiscalDeficitPctGsdp": 0,
                "debtToGsdp": 0,
            })

    result.sort(key=lambda s: s["id"])
    logger.info(f"  Handbook fiscal: {len(result)} states for {latest_fiscal_year}")
    return result
