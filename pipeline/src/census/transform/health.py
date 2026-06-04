"""
Transform World Bank health data + NFHS-5 + SRS state data into health.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_health(
    wb_data: dict,
    srs_state_imr: list[dict],
    nfhs_state_health: list[dict],
    year: str,
) -> dict:
    """
    Build health.json matching the HealthData TypeScript interface.

    Args:
        wb_data: World Bank indicator data keyed by indicator name
        srs_state_imr: SRS 2022 state-level IMR entries
        nfhs_state_health: NFHS-5 state-level health entries
        year: Output year string (e.g. "2025-26")
    """
    imr_national = wb_data.get("imr", [])
    mmr = wb_data.get("mmr", [])
    under5 = wb_data.get("under5_mr", [])
    life_exp = wb_data.get("life_exp", [])
    fertility = wb_data.get("fertility", [])

    state_imr = [
        {"id": s["id"], "name": s["name"], "value": s["value"]}
        for s in srs_state_imr
    ]

    state_health = [
        {
            "id": s["id"],
            "name": s["name"],
            "tfr": s["tfr"],
            "imr": s["imr"],
            "under5mr": s["under5mr"],
            "stunting": s["stunting"],
            "wasting": s["wasting"],
            "fullImmunization": s["fullImmunization"],
        }
        for s in nfhs_state_health
    ]

    logger.info(f"  Health: {len(imr_national)} IMR points, {len(state_imr)} SRS states, {len(state_health)} NFHS states")

    return {
        "year": year,
        "imrNational": imr_national,
        "mmr": mmr,
        "under5": under5,
        "lifeExpectancy": life_exp,
        "fertilityRate": fertility,
        "stateImr": state_imr,
        "stateHealth": state_health,
        "source": "World Bank Development Indicators + SRS 2022 + NFHS-6 (2023-24)",
    }
