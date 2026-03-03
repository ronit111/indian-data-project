"""
MOSPI Energy Statistics API wrapper.

Fetches energy balance data from api.mospi.gov.in/api/energy/getEnergyRecords.
Provides production and consumption by commodity (coal, gas, nuclear, hydro,
solar, wind, etc.) in KToE (Kilo Tonnes of Oil Equivalent).

Used to supplement/validate curated CEA energy mix data.

Source: MOSPI eSankhyiki Energy API
"""

import logging
from typing import Any

from src.common.mospi_client import fetch

logger = logging.getLogger(__name__)

# Energy commodity codes of interest
_COMMODITIES = {
    "Coal": "coal",
    "Lignite": "lignite",
    "Natural Gas": "gas",
    "Crude Petroleum": "oil",
    "Nuclear Electricity": "nuclear",
    "Hydro Electricity": "hydro",
    "Wind Electricity": "wind",
    "Solar Electricity": "solar",
}


def fetch_energy_supply() -> list[dict[str, Any]] | None:
    """
    Fetch energy supply balance by commodity for the latest available year.

    Returns list of {commodity, commodityCode, year, production, imports,
    totalSupply, unit} or None if API is unreachable.

    Unit: KToE (Kilo Tonnes of Oil Equivalent).
    """
    records = fetch("energy", {
        "indicator_code": "Energy Balance ( in KToE )",
        "use_of_energy_balance_code": "Supply",
    }, max_pages=20)

    if not records:
        return None

    # Group by year and commodity
    years: set[str] = set()
    by_year_commodity: dict[str, dict[str, dict[str, float]]] = {}

    for r in records:
        year = str(r.get("year", ""))
        commodity = r.get("energy_commodities", "")
        sector = r.get("end_use_sector", "")
        value = r.get("value")

        if not year or not commodity or value is None:
            continue

        years.add(year)
        key = f"{year}|{commodity}"
        entry = by_year_commodity.setdefault(key, {"year": year, "commodity": commodity})

        try:
            val = float(value)
        except (ValueError, TypeError):
            continue

        if "Production" in sector:
            entry["production"] = val
        elif "Imports" in sector:
            entry["imports"] = val
        elif "Total primary energy supply" in sector:
            entry["totalSupply"] = val

    # Get the latest year
    if not years:
        return None
    latest_year = max(years)

    # Build output for latest year
    result: list[dict[str, Any]] = []
    for commodity_name, code in _COMMODITIES.items():
        key = f"{latest_year}|{commodity_name}"
        entry = by_year_commodity.get(key)
        if not entry:
            continue

        result.append({
            "commodity": commodity_name,
            "commodityCode": code,
            "year": latest_year,
            "production": round(entry.get("production", 0), 1),
            "imports": round(entry.get("imports", 0), 1),
            "totalSupply": round(entry.get("totalSupply", 0), 1),
            "unit": "KToE",
        })

    result.sort(key=lambda x: x.get("totalSupply", 0), reverse=True)
    logger.info(f"  Energy supply: {len(result)} commodities for {latest_year}")
    return result if result else None


def fetch_energy_time_series() -> dict[str, list[dict[str, Any]]] | None:
    """
    Fetch multi-year energy production totals by commodity.

    Returns dict of {commodityCode: [{year, value}]} for time series charting.
    """
    records = fetch("energy", {
        "indicator_code": "Energy Balance ( in KToE )",
        "use_of_energy_balance_code": "Supply",
    }, max_pages=30)

    if not records:
        return None

    # Extract production by commodity and year
    series: dict[str, dict[str, float]] = {}
    for r in records:
        year = str(r.get("year", ""))
        commodity = r.get("energy_commodities", "")
        sector = r.get("end_use_sector", "")
        value = r.get("value")

        if "Total primary energy supply" not in sector:
            continue
        if commodity not in _COMMODITIES or not year or value is None:
            continue

        code = _COMMODITIES[commodity]
        try:
            series.setdefault(code, {})[year] = round(float(value), 1)
        except (ValueError, TypeError):
            pass

    if not series:
        return None

    # Convert to list format
    result: dict[str, list[dict[str, Any]]] = {}
    for code, year_vals in series.items():
        result[code] = [
            {"year": y, "value": v}
            for y, v in sorted(year_vals.items())
        ]

    logger.info(f"  Energy time series: {len(result)} commodities")
    return result
