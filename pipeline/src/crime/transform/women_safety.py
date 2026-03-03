"""
Transform crimes against women data.

Outputs:
  - women-safety.json: National trends, crime type breakdown, state-wise rates
"""


def build_women_safety(
    trend: list[dict],
    crime_types: list[dict],
    state_rates: list[dict],
    survey_year: str,
) -> dict:
    """Build the women safety JSON output."""

    national_trend = [
        {
            "year": t["year"],
            "total": t["total"],
            "rate": t["rate"],
        }
        for t in trend
    ]

    types = [
        {
            "id": ct["id"],
            "name": ct["name"],
            "cases": ct["cases"],
            "pct": ct["pct"],
        }
        for ct in crime_types
    ]

    states = sorted(
        [
            {"id": s["id"], "name": s["name"], "rate": s["rate"], "total": s["total"]}
            for s in state_rates
        ],
        key=lambda x: x["rate"],
        reverse=True,
    )

    return {
        "year": survey_year,
        "nationalTrend": national_trend,
        "crimeTypes": types,
        "stateRates": states,
        "source": "NCRB Crime in India 2022, Chapter 5",
    }
