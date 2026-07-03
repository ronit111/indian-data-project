"""
Transform World Bank LFPR data + PLFS state data into participation.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_participation(wb_data: dict, plfs_states: list[dict], year: str) -> dict:
    """
    Build participation.json matching the ParticipationData TypeScript interface.
    """
    state_lfpr = [
        {"id": s["id"], "name": s["name"], "value": s["lfpr"]}
        for s in plfs_states
    ]

    logger.info(f"  Participation: {len(wb_data.get('lfpr_total', []))} LFPR points, {len(state_lfpr)} states")

    return {
        "year": year,
        "lfprTotalTimeSeries": wb_data.get("lfpr_total", []),
        "lfprMaleTimeSeries": wb_data.get("lfpr_male", []),
        "lfprFemaleTimeSeries": wb_data.get("lfpr_female", []),
        "empPopRatioTimeSeries": wb_data.get("emp_pop_ratio", []),
        "stateLfpr": state_lfpr,
        "source": "World Bank (ILO modelled) + PLFS Annual Report 2025",
    }
