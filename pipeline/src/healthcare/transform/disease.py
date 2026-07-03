"""
Transform World Bank disease/immunization data + NFHS-6 state data into disease.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_disease(wb_data: dict, imm_states: list[dict], year: str) -> dict:
    state_imm = [
        {
            "id": s["id"],
            "name": s["name"],
            "fullImmunization": s["fullImmunization"],
            "bcg": s["bcg"],
            "measles": s["measles"],
            "dpt3": s["dpt3"],
        }
        for s in imm_states
    ]

    logger.info(f"  Disease: {len(wb_data.get('tb_incidence', []))} TB points, {len(state_imm)} imm states")

    return {
        "year": year,
        "dptTimeSeries": wb_data.get("imm_dpt", []),
        "measlesTimeSeries": wb_data.get("imm_measles", []),
        "tbIncidenceTimeSeries": wb_data.get("tb_incidence", []),
        "hivTimeSeries": wb_data.get("hiv_prev", []),
        "birthsAttendedTimeSeries": wb_data.get("births_attended", []),
        "stateImmunization": state_imm,
        "source": "World Bank + NFHS-6 (2023-24)",
    }
