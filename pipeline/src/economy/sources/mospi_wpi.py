"""
MOSPI WPI (Wholesale Price Index) API wrapper.

Fetches wholesale price inflation data from api.mospi.gov.in/api/wpi/getWpiRecords.
WPI complements CPI by measuring producer-side price changes.

Response fields: year, month, majorgroup, group, subgroup, sub_subgroup, item, index_value.
Base year: 2011-12 = 100.

Source: MOSPI eSankhyiki WPI API
"""

import logging
from typing import Any

from src.common.mospi_client import fetch

logger = logging.getLogger(__name__)


def fetch_wpi_annual(start_year: int = 2014) -> list[dict[str, Any]] | None:
    """
    Fetch annual WPI headline index and compute YoY inflation.

    Fetches monthly WPI for the "Wholesale Price Index" major group (headline),
    computes fiscal year averages, then derives YoY inflation rates.

    Returns list of {year: str, wpiIndex: float, wpiInflation: float} or None.
    Fiscal year format: "2023-24".
    """
    # Fetch all monthly headline WPI (majorgroup = "Wholesale Price Index" is the top level)
    records = fetch("wpi", {
        "major_group_code": "1",  # Top-level "All Commodities" / WPI headline
    }, max_pages=50)

    if not records:
        return None

    # Filter to headline level (majorgroup only, no group/subgroup breakdown)
    headline_records = [
        r for r in records
        if r.get("majorgroup") == "Wholesale Price Index"
        and not r.get("group")
    ]

    if not headline_records:
        # Fallback: just use whatever the first major group is
        headline_records = [
            r for r in records
            if not r.get("group") and not r.get("subgroup")
        ]

    if not headline_records:
        logger.warning("  WPI: no headline-level records found")
        return None

    # Organize by fiscal year and compute averages
    fy_indices: dict[str, list[float]] = {}
    for r in headline_records:
        year = r.get("year")
        month_name = r.get("month", "")
        idx = r.get("index_value")
        if not year or not idx:
            continue

        try:
            idx_val = float(idx)
        except (ValueError, TypeError):
            continue

        # Determine fiscal year from calendar year + month
        cal_year = int(year) if isinstance(year, (int, float)) else int(str(year)[:4])
        month_num = _month_name_to_num(month_name)
        if month_num is None:
            continue

        if month_num >= 4:
            fy = f"{cal_year}-{str(cal_year + 1)[-2:]}"
        else:
            fy = f"{cal_year - 1}-{str(cal_year)[-2:]}"

        fy_start = int(fy[:4])
        if fy_start < start_year:
            continue

        fy_indices.setdefault(fy, []).append(idx_val)

    # Compute fiscal year average index
    fy_avg: dict[str, float] = {}
    for fy, values in sorted(fy_indices.items()):
        if len(values) >= 6:  # Need at least 6 months
            fy_avg[fy] = round(sum(values) / len(values), 1)

    # Compute YoY inflation from index averages
    sorted_fys = sorted(fy_avg.keys())
    result: list[dict[str, Any]] = []
    for i, fy in enumerate(sorted_fys):
        entry: dict[str, Any] = {"year": fy, "wpiIndex": fy_avg[fy]}
        if i > 0:
            prev_idx = fy_avg[sorted_fys[i - 1]]
            if prev_idx > 0:
                entry["wpiInflation"] = round(
                    (fy_avg[fy] - prev_idx) / prev_idx * 100, 1
                )
        result.append(entry)

    logger.info(f"  WPI: {len(result)} fiscal years ({result[0]['year']}–{result[-1]['year']})" if result else "  WPI: no data")
    return result if result else None


_MONTH_MAP = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}


def _month_name_to_num(name: str) -> int | None:
    """Convert month name string to number."""
    return _MONTH_MAP.get(name.lower().strip()) if name else None
