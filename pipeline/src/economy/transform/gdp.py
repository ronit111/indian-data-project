"""
Transform World Bank GDP data into the GDPGrowthData schema.
"""

import logging

logger = logging.getLogger(__name__)

# India uses April-March fiscal years. World Bank reports calendar years.
# Map calendar year to fiscal year: 2024 → "2024-25"
def calendar_to_fiscal(cal_year: str) -> str:
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_gdp_growth(wb_data: list[dict], survey_year: str, source: str = "World Bank") -> dict:
    """
    Build gdp-growth.json from GDP growth data.

    Accepts data from either MOSPI NAS (primary) or World Bank (fallback).
    Both provide {year, value} format. NAS data already has fiscal year labels;
    World Bank data uses calendar years and gets converted.

    NSO First Advance Estimate: 7.4% real GDP growth for FY2025-26 (Jan 2026).
    World Bank data lags by ~1 year, so we supplement the latest year from the Survey.
    """
    series = []
    for point in wb_data:
        year = point["year"]
        # NAS data already uses fiscal year format ("2024-25"); WB uses calendar ("2024")
        fiscal_year = year if "-" in str(year) else calendar_to_fiscal(str(year))
        series.append({
            "year": fiscal_year,
            "value": round(point["value"], 1),
        })

    # The latest World Bank data point may not cover FY2025-26.
    # Add the advance estimate from the Economic Survey if missing.
    fiscal_years_present = {s["year"] for s in series}
    if "2025-26" not in fiscal_years_present:
        # NSO First Advance Estimate for FY2025-26: 7.4% real GDP growth
        # Published January 2026, corroborated by RBI Feb 2026 MPC statement
        # Source: NSO / Economic Survey 2025-26 Ch.1
        series.append({
            "year": "2025-26",
            "value": 7.4,
            "label": "Advance estimate",
        })
        logger.info("  Added FY2025-26 advance estimate (7.4%) from NSO/Economic Survey")

    # Sort by fiscal year
    series.sort(key=lambda x: x["year"])

    source_url = (
        "MOSPI NAS API (api.mospi.gov.in/api/nas/getNASData) + Economic Survey 2025-26"
        if source == "MOSPI NAS"
        else "https://api.worldbank.org/v2/country/ind/indicator/NY.GDP.MKTP.KD.ZG + Economic Survey 2025-26"
    )

    return {
        "year": survey_year,
        "indicator": "Real GDP Growth Rate",
        "unit": "percent",
        "series": series,
        "source": source_url,
    }
