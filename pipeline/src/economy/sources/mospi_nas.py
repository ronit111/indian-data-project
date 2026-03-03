"""
MOSPI NAS (National Accounts Statistics) API wrapper.

Fetches GDP and GVA data from api.mospi.gov.in/api/nas/getNASData.
Uses base_year=2011-12 for historical series (2012-13 onwards) and
2022-23 for the latest revision framework.

NAS indicator codes:
  1 = Gross Value Added (by industry)
  2 = Net Taxes on Products
  3 = Taxes on Products
  4 = Subsidies on Products
  5 = Gross Domestic Product (aggregate)

Source: MOSPI eSankhyiki NAS API
"""

import logging
from typing import Any

from src.common.mospi_client import fetch

logger = logging.getLogger(__name__)

# Revision priority: prefer the most final estimate for each year.
# NAS returns multiple revisions per year; we keep the best one.
_REVISION_PRIORITY = {
    "Final Estimates": 0,
    "Third Revised Estimates": 1,
    "Second Revised Estimates": 2,
    "First Revised Estimates": 3,
    "Provisional Estimates": 4,
    "Second Advance Estimates": 5,
    "First Advance Estimates": 6,
}


def _best_revision(records: list[dict], year: str) -> dict | None:
    """Pick the most final revision for a given year."""
    year_records = [r for r in records if r.get("year") == year]
    if not year_records:
        return None
    year_records.sort(
        key=lambda r: _REVISION_PRIORITY.get(r.get("revision", ""), 99)
    )
    return year_records[0]


def fetch_gdp_growth(start_year: str = "2012-13") -> list[dict[str, Any]] | None:
    """
    Fetch real GDP growth rate (% change in constant-price GDP year-on-year).

    Uses base_year=2011-12 for historical depth. Computes growth from
    constant-price GDP levels since the API provides levels, not rates.

    Returns list of {year: str, value: float} sorted ascending, or None if
    API is unreachable.
    """
    records = fetch("nas", {
        "base_year": "2011-12",
        "series": "Current",
        "frequency_code": "Annually",
        "indicator_code": "5",  # GDP
    })

    if not records:
        return None

    # Deduplicate: keep best revision per year
    years = sorted(set(r.get("year", "") for r in records))
    gdp_levels: dict[str, float] = {}
    for year in years:
        best = _best_revision(records, year)
        if best and best.get("constant_price"):
            gdp_levels[year] = float(best["constant_price"])

    # Compute year-on-year growth
    sorted_years = sorted(gdp_levels.keys())
    growth_series: list[dict[str, Any]] = []
    for i in range(1, len(sorted_years)):
        prev_year = sorted_years[i - 1]
        curr_year = sorted_years[i]
        prev_gdp = gdp_levels[prev_year]
        curr_gdp = gdp_levels[curr_year]
        if prev_gdp > 0:
            growth = round((curr_gdp - prev_gdp) / prev_gdp * 100, 1)
            growth_series.append({"year": curr_year, "value": growth})

    # Filter to requested start year
    start = start_year[:4] if "-" in start_year else start_year
    growth_series = [p for p in growth_series if p["year"][:4] >= start]

    logger.info(f"  NAS GDP growth: {len(growth_series)} years ({growth_series[0]['year']}–{growth_series[-1]['year']})" if growth_series else "  NAS GDP growth: no data")
    return growth_series if growth_series else None


def fetch_gdp_levels() -> dict[str, dict[str, float]] | None:
    """
    Fetch GDP at current and constant prices (base 2022-23).

    Returns dict of {year: {current_price, constant_price}} or None.
    Used for summary fields (nominal GDP, per capita GDP).
    """
    records = fetch("nas", {
        "base_year": "2022-23",
        "series": "Current",
        "frequency_code": "Annually",
        "indicator_code": "5",  # GDP
    })

    if not records:
        return None

    years = sorted(set(r.get("year", "") for r in records))
    levels: dict[str, dict[str, float]] = {}
    for year in years:
        best = _best_revision(records, year)
        if best:
            cp = best.get("current_price")
            const_p = best.get("constant_price")
            if cp and const_p:
                levels[year] = {
                    "current_price": float(cp),
                    "constant_price": float(const_p),
                }

    logger.info(f"  NAS GDP levels: {len(levels)} years")
    return levels if levels else None


def fetch_sectoral_gva() -> list[dict[str, Any]] | None:
    """
    Fetch GVA by industry (base 2022-23) for the latest year.

    Returns list of {industry, current_price, constant_price, share_pct}
    for each industry sector. Used for sectoral composition charts.
    """
    records = fetch("nas", {
        "base_year": "2022-23",
        "series": "Current",
        "frequency_code": "Annually",
        "indicator_code": "1",  # GVA by industry
    })

    if not records:
        return None

    # Get the latest year
    years = sorted(set(r.get("year", "") for r in records), reverse=True)
    if not years:
        return None

    latest_year = years[0]
    latest_records = [r for r in records if r.get("year") == latest_year]

    # Pick best revision for each industry
    industries: dict[str, dict] = {}
    for r in latest_records:
        industry = r.get("industry", "")
        if not industry:
            continue
        rev = r.get("revision", "")
        existing = industries.get(industry)
        if not existing or _REVISION_PRIORITY.get(rev, 99) < _REVISION_PRIORITY.get(existing.get("revision", ""), 99):
            industries[industry] = r

    # Compute shares
    total_gva = sum(
        float(r.get("current_price", 0))
        for r in industries.values()
        if r.get("current_price")
    )

    sectors: list[dict[str, Any]] = []
    for industry, r in industries.items():
        cp = float(r.get("current_price", 0)) if r.get("current_price") else 0
        const_p = float(r.get("constant_price", 0)) if r.get("constant_price") else 0
        share = round(cp / total_gva * 100, 1) if total_gva > 0 else 0
        sectors.append({
            "industry": industry,
            "currentPrice": cp,
            "constantPrice": const_p,
            "sharePct": share,
            "year": latest_year,
        })

    sectors.sort(key=lambda s: s["currentPrice"], reverse=True)
    logger.info(f"  NAS GVA: {len(sectors)} sectors for {latest_year}")
    return sectors if sectors else None
