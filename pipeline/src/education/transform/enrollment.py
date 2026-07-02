"""
Transform World Bank enrollment data + UDISE+ state data into enrollment.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_enrollment(wb_data: dict, udise_states: list[dict], year: str) -> dict:
    """
    Build enrollment.json matching the EnrollmentData TypeScript interface.
    """
    states = [
        {
            "id": s["id"],
            "name": s["name"],
            "gerPrimary": s["gerPrimary"],
            "gerSecondary": s["gerSecondary"],
            "gerHigherSec": s["gerHigherSec"],
            "dropoutPrimary": s["dropoutPrimary"],
            "dropoutSecondary": s["dropoutSecondary"],
        }
        for s in udise_states
    ]

    logger.info(f"  Enrollment: {len(wb_data.get('prim_enroll', []))} primary points, {len(states)} states")

    return {
        "year": year,
        "primaryTimeSeries": wb_data.get("prim_enroll", []),
        "secondaryTimeSeries": wb_data.get("sec_enroll", []),
        "tertiaryTimeSeries": wb_data.get("tert_enroll", []),
        "femaleSecondary": wb_data.get("sec_enroll_f", []),
        "maleSecondary": wb_data.get("sec_enroll_m", []),
        "primaryCompletion": wb_data.get("prim_compl", []),
        "states": states,
        "source": "World Bank + UDISE+ 2024-25",
    }
