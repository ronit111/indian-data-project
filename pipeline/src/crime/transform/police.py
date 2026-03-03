"""
Transform police infrastructure data.

Outputs:
  - police.json: National strength/vacancy, state-wise ratios, women in police
"""


def build_police(
    national: dict,
    state_ratios: list[dict],
    survey_year: str,
) -> dict:
    """Build the police infrastructure JSON output."""

    states = sorted(
        [
            {
                "id": s["id"],
                "name": s["name"],
                "sanctioned": s["sanctioned"],
                "actual": s["actual"],
            }
            for s in state_ratios
        ],
        key=lambda x: x["actual"],
        reverse=True,
    )

    return {
        "year": survey_year,
        "sanctionedStrength": national["sanctionedStrength"],
        "actualStrength": national["actualStrength"],
        "vacancyPct": national["vacancyPct"],
        "sanctionedRatePerLakh": national["sanctionedRatePerLakh"],
        "actualRatePerLakh": national["actualRatePerLakh"],
        "unRecommended": national["unRecommended"],
        "womenPolicePct": national["womenPolicePct"],
        "womenPoliceTotal": national["womenPoliceTotal"],
        "stateRatios": states,
        "source": national["source"],
    }
