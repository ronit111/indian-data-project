"""
MOSPI eSankhyiki CPI API client — fetches group/subgroup-level CPI data.

Uses the shared MOSPI client to fetch from api.mospi.gov.in/api/cpi/getCPIIndex.
Returns group-wise monthly CPI indices and YoY inflation rates for Base 2012=100.

We fetch monthly data and compute fiscal year annual averages for each COICOP
group, producing the cpiByCategory array used by the cost-of-living calculator.

Source: https://api.mospi.gov.in (eSankhyiki CPI API)
"""

import logging
import time
from datetime import datetime
from typing import Any

from src.common.mospi_client import fetch_single_page, RATE_LIMIT_DELAY

logger = logging.getLogger(__name__)

# Mapping from MOSPI API group/subgroup names to our COICOP division codes.
# The Base 2012 CPI uses 6 groups, with divisions under "Miscellaneous".
TARGET_GROUPS: dict[tuple[str, str], tuple[str, str]] = {
    ("Food and Beverages", "Food and Beverages-Overall"): ("01", "Food & Non-Alcoholic Beverages"),
    ("Housing", "Housing-Overall"): ("04", "Housing, Water, Electricity, Gas"),
    ("Miscellaneous", "Health"): ("06", "Health"),
    ("Miscellaneous", "Transport and Communication"): ("07", "Transport & Communication"),
    ("Miscellaneous", "Education"): ("10", "Education"),
}

# CPI-specific pagination: 3 pages × default limit is enough for all groups
PAGES_PER_QUERY = 3


def _fetch_month(year: int, month: int) -> dict[tuple[str, str], dict[str, Any]]:
    """Fetch target group-level CPI data for a given month. Returns only All India Combined."""
    results: dict[tuple[str, str], dict[str, Any]] = {}
    for page in range(1, PAGES_PER_QUERY + 1):
        params = {
            "base_year": "2012",
            "series": "Current",
            "year": str(year),
            "month_code": str(month),
            "sector_code": "3",  # Combined
        }
        records, _meta = fetch_single_page("cpi", params, page=page, limit=10)
        if not records:
            break
        for r in records:
            key = (r.get("group", ""), r.get("subgroup", ""))
            if key in TARGET_GROUPS and r.get("state") == "All India":
                idx = r.get("index")
                inf = r.get("inflation")
                if idx is not None and idx != "None":
                    results[key] = {
                        "index": float(idx),
                        "inflation": float(inf) if inf and inf != "None" else None,
                    }
        time.sleep(0.3)
    return results


def _compute_fy_averages(
    monthly_data: dict[str, dict[tuple[str, str], dict[str, Any]]],
) -> dict[tuple[str, str], float]:
    """Compute fiscal year average inflation from monthly YoY inflation rates."""
    averages: dict[tuple[str, str], float] = {}
    for key in TARGET_GROUPS:
        values = []
        for _month_key, data in monthly_data.items():
            if key in data and data[key].get("inflation") is not None:
                values.append(data[key]["inflation"])
        if len(values) >= 6:  # Need at least 6 months for a reliable average
            averages[key] = round(sum(values) / len(values), 1)
    return averages


def _fiscal_year_months(fy: str) -> list[tuple[int, int]]:
    """Return (year, month) tuples for a fiscal year string like '2023-24'."""
    start_year = int(fy[:4])
    months = [(start_year, m) for m in range(4, 13)]
    months += [(start_year + 1, m) for m in range(1, 4)]
    return months


def fetch_cpi_by_category(start_fy: str = "2019-20") -> list[dict] | None:
    """
    Fetch group-wise CPI inflation from the eSankhyiki API and compute
    fiscal year annual averages.

    Returns list of COICOP division entries with annual inflation series,
    or None if the API is unreachable.

    Args:
        start_fy: First fiscal year to fetch (default: 2019-20, where our
                  IMF/DBnomics data ends).
    """
    now = datetime.now()
    current_fy_start = now.year if now.month >= 4 else now.year - 1
    start_year = int(start_fy[:4])

    # Build fiscal year list
    fiscal_years: list[str] = []
    for y in range(start_year, current_fy_start + 1):
        fiscal_years.append(f"{y}-{str(y + 1)[-2:]}")

    logger.info(f"MOSPI eSankhyiki: fetching CPI by group for FY {fiscal_years[0]} to {fiscal_years[-1]}")

    # Collect all fiscal year averages
    all_fy_averages: dict[str, dict[tuple[str, str], float]] = {}
    api_reachable = False

    for fy in fiscal_years:
        months = _fiscal_year_months(fy)

        # For the current (incomplete) FY, only fetch months that have passed
        if fy == fiscal_years[-1]:
            months = [(y, m) for y, m in months if (y, m) <= (now.year, now.month - 1)]

        logger.info(f"  FY {fy}: fetching {len(months)} months...")
        monthly_data: dict[str, dict[tuple[str, str], dict[str, Any]]] = {}

        for year, month in months:
            month_key = f"{year}-{month:02d}"
            data = _fetch_month(year, month)
            if data:
                api_reachable = True
            monthly_data[month_key] = data
            time.sleep(1)  # Conservative rate limiting

        fy_avg = _compute_fy_averages(monthly_data)
        if fy_avg:
            all_fy_averages[fy] = fy_avg
            logger.info(f"  FY {fy}: {len(fy_avg)} divisions averaged")

    if not api_reachable:
        logger.warning("MOSPI eSankhyiki API unreachable — will use curated fallback")
        return None

    # Build the cpiByCategory list
    source = "MOSPI eSankhyiki API (api.mospi.gov.in/api/cpi/getCPIIndex, Base 2012=100)"
    divisions: list[dict] = []
    for key, (code, name) in TARGET_GROUPS.items():
        series = []
        for fy in fiscal_years:
            if fy in all_fy_averages and key in all_fy_averages[fy]:
                series.append({"period": fy, "value": all_fy_averages[fy][key]})
        if series:
            divisions.append({
                "division": code,
                "name": name,
                "source": source,
                "series": series,
            })

    logger.info(f"MOSPI eSankhyiki: {len(divisions)} divisions with data")
    return divisions if divisions else None
