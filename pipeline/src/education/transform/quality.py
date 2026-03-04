"""
Transform World Bank PTR data + UDISE+ infrastructure + ASER learning outcomes into quality.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_quality(
    wb_data: dict,
    udise_states: list[dict],
    aser_states: list[dict],
    year: str,
) -> dict:
    """
    Build quality.json matching the QualityData TypeScript interface.
    """
    state_infra = [
        {
            "id": s["id"],
            "name": s["name"],
            "ptr": s["ptr"],
            "schoolsWithComputers": s["schoolsWithComputers"],
            "schoolsWithInternet": s["schoolsWithInternet"],
            "girlsToilets": s["girlsToilets"],
        }
        for s in udise_states
    ]

    learning = [
        {
            "id": s["id"],
            "name": s["name"],
            "canReadStd2": s["canReadStd2"],
            "canDoSubtraction": s["canDoSubtraction"],
        }
        for s in aser_states
    ]

    logger.info(f"  Quality: {len(wb_data.get('ptr_primary', []))} PTR points, {len(state_infra)} infra states, {len(learning)} ASER states")

    return {
        "year": year,
        "ptrPrimaryTimeSeries": wb_data.get("ptr_primary", []),
        "ptrSecondaryTimeSeries": wb_data.get("ptr_secondary", []),
        "stateInfrastructure": state_infra,
        "learningOutcomes": learning,
        "source": "World Bank + UDISE+ 2023-24 + ASER 2024",
    }
