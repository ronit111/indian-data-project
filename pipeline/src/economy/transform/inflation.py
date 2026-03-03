"""
Transform inflation data into the InflationData schema.

For the initial build, we use annual CPI data from World Bank
plus key data points from the Economic Survey 2025-26.

CPI-by-category (COICOP division) data is sourced from:
- MOSPI eSankhyiki API (api.mospi.gov.in/api/cpi/getCPIIndex) — primary,
  fetches monthly group-wise CPI and computes fiscal year averages.
  Covers FY 2019-20 onwards. No authentication required.
- IMF CPI dataset via DBnomics (FY 2014-15 through 2018-19) — historical
  baseline before MOSPI monthly series begins.
- Curated fallback (hardcoded) if MOSPI API is unreachable.

Source: Economic Survey 2025-26 Chapter 5
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_inflation(
    wb_cpi_data: list[dict],
    survey_year: str,
    mospi_cpi_by_category: list[dict] | None = None,
    wpi_data: list[dict] | None = None,
) -> dict:
    """
    Build inflation.json from World Bank annual CPI data + Survey data points.

    CPI data from World Bank is annual (calendar year).
    We supplement with fiscal-year averages from the Survey where available.

    Args:
        wb_cpi_data: World Bank annual CPI inflation data points.
        survey_year: Fiscal year label (e.g., "2025-26").
        mospi_cpi_by_category: Optional list of COICOP division entries from
            the MOSPI eSankhyiki API. If None, falls back to curated data.
        wpi_data: Optional WPI fiscal year data from MOSPI WPI API.
    """
    series = []
    for point in wb_cpi_data:
        fiscal_year = calendar_to_fiscal(point["year"])
        series.append({
            "period": fiscal_year,
            "cpiHeadline": round(point["value"], 1),
            "cpiFood": None,
            "cpiCore": None,
        })

    # Add Economic Survey data points that World Bank may not have yet
    fiscal_years_present = {s["period"] for s in series}

    # FY2024-25 estimate from Economic Survey: ~4.9% headline
    # Source: Economic Survey 2025-26, Chapter 5
    if "2024-25" not in fiscal_years_present:
        series.append({
            "period": "2024-25",
            "cpiHeadline": 4.9,
            "cpiFood": 7.5,
            "cpiCore": 3.5,
        })
        logger.info("  Added FY2024-25 inflation estimate from Economic Survey")

    # FY2025-26 from Economic Survey 2025-26 revised projection
    if "2025-26" not in fiscal_years_present:
        series.append({
            "period": "2025-26",
            "cpiHeadline": 4.0,
            "cpiFood": 5.8,
            "cpiCore": 3.2,
        })
        logger.info("  Added FY2025-26 inflation data from Economic Survey")

    series.sort(key=lambda x: x["period"])

    # Apply food/core CPI from Economic Survey where WB headline is present
    # but food/core breakdown isn't.
    survey_food_core = {
        "2024-25": {"cpiFood": 7.5, "cpiCore": 3.5},
        "2025-26": {"cpiFood": 5.8, "cpiCore": 3.2},
    }
    for s in series:
        if s["period"] in survey_food_core:
            data = survey_food_core[s["period"]]
            if s["cpiFood"] is None:
                s["cpiFood"] = data["cpiFood"]
            if s["cpiCore"] is None:
                s["cpiCore"] = data["cpiCore"]

    # Build CPI-by-COICOP-division data for the cost-of-living calculator.
    # Strategy: IMF data for 2014-2018, MOSPI API for 2019+, curated fallback.
    cpi_by_category = _build_cpi_by_category(mospi_cpi_by_category)
    logger.info(f"  CPI by category: {len(cpi_by_category)} divisions")

    source_parts = [
        "World Bank CPI (api.worldbank.org)",
        "Economic Survey 2025-26 Ch.5",
        "IMF CPI (db.nomics.world)",
    ]
    if mospi_cpi_by_category:
        source_parts.append("MOSPI eSankhyiki CPI API (api.mospi.gov.in)")
    if wpi_data:
        source_parts.append("MOSPI eSankhyiki WPI API (api.mospi.gov.in)")
    source = " + ".join(source_parts)

    result = {
        "year": survey_year,
        "targetBand": {"lower": 2, "upper": 6},
        "series": series,
        "cpiByCategory": cpi_by_category,
        "source": source,
    }

    # Add WPI series if available (new indicator from MOSPI WPI API)
    if wpi_data:
        result["wpiSeries"] = wpi_data
        logger.info(f"  WPI series: {len(wpi_data)} fiscal years added")

    return result


# ── IMF historical baseline (2014-15 to 2018-19) ──────────────────────
# Source: IMF CPI dataset via DBnomics (db.nomics.world/IMF/CPI).
# Calendar year → fiscal year approximation (9 of 12 months overlap).
_IMF_BASELINE: dict[str, list[dict]] = {
    "01": [
        {"period": "2014-15", "value": 6.9},
        {"period": "2015-16", "value": 5.0},
        {"period": "2016-17", "value": 5.3},
        {"period": "2017-18", "value": 1.3},
        {"period": "2018-19", "value": 1.3},
    ],
    "04": [
        {"period": "2014-15", "value": 7.0},
        {"period": "2015-16", "value": 5.0},
        {"period": "2016-17", "value": 4.5},
        {"period": "2017-18", "value": 5.7},
        {"period": "2018-19", "value": 7.3},
    ],
    "06": [
        {"period": "2014-15", "value": 5.5},
        {"period": "2015-16", "value": 5.3},
        {"period": "2016-17", "value": 4.9},
        {"period": "2017-18", "value": 4.2},
        {"period": "2018-19", "value": 6.2},
    ],
    "07": [
        {"period": "2014-15", "value": 4.5},
        {"period": "2015-16", "value": -1.3},
        {"period": "2016-17", "value": 1.9},
        {"period": "2017-18", "value": 4.5},
        {"period": "2018-19", "value": 6.6},
    ],
    "10": [
        {"period": "2014-15", "value": 7.5},
        {"period": "2015-16", "value": 7.0},
        {"period": "2016-17", "value": 5.7},
        {"period": "2017-18", "value": 5.1},
        {"period": "2018-19", "value": 6.1},
    ],
}

# Division names (shared between IMF baseline and MOSPI data)
_DIVISION_NAMES: dict[str, str] = {
    "01": "Food & Non-Alcoholic Beverages",
    "04": "Housing, Water, Electricity, Gas",
    "06": "Health",
    "07": "Transport & Communication",
    "10": "Education",
}

# ── Curated fallback for FY 2019-20+ when MOSPI API is unreachable ────
# Source: MOSPI eSankhyiki API (fetched 2026-03-01), verified against press
# release CPI_PR_12Mar25.pdf group-wise inflation rates.
_CURATED_MOSPI_FALLBACK: dict[str, list[dict]] = {
    "01": [
        {"period": "2019-20", "value": 6.0},
        {"period": "2020-21", "value": 7.0},
        {"period": "2021-22", "value": 4.3},
        {"period": "2022-23", "value": 6.7},
        {"period": "2023-24", "value": 7.0},
        {"period": "2024-25", "value": 7.1},
    ],
    "04": [
        {"period": "2019-20", "value": 4.2},
        {"period": "2020-21", "value": 3.2},
        {"period": "2021-22", "value": 3.7},
        {"period": "2022-23", "value": 4.3},
        {"period": "2023-24", "value": 3.9},
        {"period": "2024-25", "value": 2.7},
    ],
    "06": [
        {"period": "2019-20", "value": 6.3},
        {"period": "2020-21", "value": 5.4},
        {"period": "2021-22", "value": 7.5},
        {"period": "2022-23", "value": 6.0},
        {"period": "2023-24", "value": 5.6},
        {"period": "2024-25", "value": 4.1},
    ],
    "07": [
        {"period": "2019-20", "value": 2.4},
        {"period": "2020-21", "value": 10.6},
        {"period": "2021-22", "value": 10.1},
        {"period": "2022-23", "value": 5.9},
        {"period": "2023-24", "value": 1.9},
        {"period": "2024-25", "value": 2.3},
    ],
    "10": [
        {"period": "2019-20", "value": 5.5},
        {"period": "2020-21", "value": 2.3},
        {"period": "2021-22", "value": 2.9},
        {"period": "2022-23", "value": 5.3},
        {"period": "2023-24", "value": 5.2},
        {"period": "2024-25", "value": 3.9},
    ],
}


def _build_cpi_by_category(mospi_data: list[dict] | None = None) -> list[dict]:
    """
    Build CPI-by-COICOP-division array.

    Merges three data sources in order:
    1. IMF baseline (2014-15 to 2018-19) — always present
    2. MOSPI eSankhyiki API (2019-20+) — if pipeline fetched successfully
    3. Curated fallback (2019-20+) — if MOSPI API was unreachable

    The resulting series for each division is continuous from 2014-15 to present.
    """
    # Index MOSPI API data by division code for fast lookup
    mospi_by_code: dict[str, list[dict]] = {}
    if mospi_data:
        for entry in mospi_data:
            mospi_by_code[entry["division"]] = entry["series"]

    use_api = bool(mospi_by_code)
    recent_source = (
        "MOSPI eSankhyiki API (api.mospi.gov.in)"
        if use_api
        else "MOSPI eSankhyiki API (curated fallback, fetched 2026-03-01)"
    )

    result: list[dict] = []
    for code in ["01", "04", "06", "07", "10"]:
        # Start with IMF baseline
        series = list(_IMF_BASELINE.get(code, []))
        baseline_periods = {p["period"] for p in series}

        # Append recent data (API or curated fallback)
        recent = mospi_by_code.get(code) if use_api else _CURATED_MOSPI_FALLBACK.get(code)
        if recent:
            for point in recent:
                if point["period"] not in baseline_periods:
                    series.append(point)

        series.sort(key=lambda x: x["period"])

        source = f"IMF CPI (db.nomics.world) FY 2014-19 + {recent_source} FY 2019+"
        result.append({
            "division": code,
            "name": _DIVISION_NAMES[code],
            "source": source,
            "series": series,
        })

    return result
