"""
Transform World Bank literacy data + Census 2011 state data into literacy.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_literacy(wb_data: dict, census_states: list[dict], year: str) -> dict:
    """
    Build literacy.json matching the LiteracyData TypeScript interface.

    Args:
        wb_data: World Bank indicator data keyed by indicator name
        census_states: Census 2011 state population entries (with literacy fields)
        year: Output year string (e.g. "2025-26")
    """
    total_ts = wb_data.get("literacy", [])
    male_ts = wb_data.get("literacy_male", [])
    female_ts = wb_data.get("literacy_female", [])

    states = []
    for s in census_states:
        male = s.get("literacyMale")
        female = s.get("literacyFemale")
        gap = round(male - female, 2) if male is not None and female is not None else None
        states.append({
            "id": s["id"],
            "name": s["name"],
            "overallRate": s.get("literacyTotal"),
            "maleRate": male,
            "femaleRate": female,
            "genderGap": gap,
        })

    logger.info(f"  Literacy: {len(total_ts)} national points, {len(states)} states")

    return {
        "year": year,
        "totalTimeSeries": total_ts,
        "maleTimeSeries": male_ts,
        "femaleTimeSeries": female_ts,
        "states": states,
        "source": "World Bank Development Indicators + Census of India 2011",
    }
