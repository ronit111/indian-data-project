"""
Transform road accident data.

Outputs:
  - road-accidents.json: National trends (accidents/killed/injured),
    cause breakdown, state-wise fatality rates
"""


def build_road_accidents(
    trend: list[dict],
    causes: list[dict],
    state_fatalities: list[dict],
    survey_year: str,
) -> dict:
    """Build the road accidents JSON output."""

    national_trend = [
        {
            "year": t["year"],
            "accidents": t["accidents"],
            "killed": t["killed"],
            "injured": t["injured"],
        }
        for t in trend
    ]

    cause_breakdown = [
        {
            "id": c["id"],
            "name": c["name"],
            "pct": c["pct"],
        }
        for c in causes
    ]

    states = sorted(
        [
            {
                "id": s["id"],
                "name": s["name"],
                "rate": s["rate"],
                "killed": s.get("killed", s.get("total", 0)),
            }
            for s in state_fatalities
        ],
        key=lambda x: x["rate"],
        reverse=True,
    )

    return {
        "year": survey_year,
        "nationalTrend": national_trend,
        "causes": cause_breakdown,
        "stateFatalities": states,
        "source": "MoRTH Road Accidents in India 2022",
    }
