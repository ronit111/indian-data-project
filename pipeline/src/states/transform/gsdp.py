"""
Transform curated state GSDP data into gsdp.json schema.

Source: RBI Handbook of Statistics on Indian States
"""

import logging

logger = logging.getLogger(__name__)


def build_gsdp(
    curated_data: list[dict],
    data_year: str,
    base_year: str,
    history_data: list[dict] | None = None,
) -> dict:
    """
    Build gsdp.json from curated STATE_GSDP_DATA.

    Args:
        curated_data: List of state GSDP dicts from sources/curated.py
        data_year: Fiscal year string (e.g. "2025-26")
        base_year: Constant price base year (e.g. "2011-12")
        history_data: Optional 3-year GSDP history for top states
    """
    if not curated_data:
        logger.warning("  gsdp.json: no state data available")
        return {"year": data_year, "baseYear": base_year, "states": [], "source": "RBI Handbook of Statistics on Indian States"}
    states = sorted(curated_data, key=lambda s: s["gsdp"], reverse=True)
    logger.info(f"  gsdp.json: {len(states)} states, top = {states[0]['name']}")

    result = {
        "year": data_year,
        "baseYear": base_year,
        "states": states,
        "source": "RBI Handbook of Statistics on Indian States",
    }

    if history_data:
        result["gsdpHistory"] = history_data
        logger.info(f"  gsdp.json: includes {len(history_data)} states with 3-year history")

    return result
