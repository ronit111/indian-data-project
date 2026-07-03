"""
Transform World Bank unemployment data + PLFS state data into unemployment.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_unemployment(wb_data: dict, plfs_states: list[dict], year: str) -> dict:
    """
    Build unemployment.json matching the UnemploymentData TypeScript interface.
    """
    state_ur = [
        {"id": s["id"], "name": s["name"], "value": s["unemploymentRate"]}
        for s in plfs_states
    ]

    logger.info(f"  Unemployment: {len(wb_data.get('unemp_total', []))} total points, {len(state_ur)} states")

    return {
        "year": year,
        "totalTimeSeries": wb_data.get("unemp_total", []),
        "youthTimeSeries": wb_data.get("unemp_youth", []),
        "femaleTimeSeries": wb_data.get("unemp_female", []),
        "maleTimeSeries": wb_data.get("unemp_male", []),
        "stateUnemployment": state_ur,
        "source": "World Bank (ILO modelled) + PLFS Annual Report 2025",
    }
