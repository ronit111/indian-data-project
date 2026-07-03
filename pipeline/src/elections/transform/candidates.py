"""
Transform ADR candidate analysis data.

Outputs:
  - candidates.json: Criminal records, wealth, education of 2024 MPs
"""


def build_candidates(adr_summary: dict, top_wealthiest: list[dict],
                     top_criminal: list[dict], survey_year: str) -> dict:
    """Build the candidates JSON output."""

    # Criminal cases breakdown
    criminal = {
        "totalMPs": adr_summary["totalMPs"],
        "withAnyCases": adr_summary["criminalCases"]["any"],
        "withSeriousCases": adr_summary["criminalCases"]["serious"],
        "pctAny": adr_summary["criminalCases"]["pctAny"],
        "pctSerious": adr_summary["criminalCases"]["pctSerious"],
    }

    # Assets distribution (ADR publishes only the average, not a median)
    assets = {
        "avgCrore": adr_summary["assets"]["avgCrore"],
    }

    # Education breakdown (percentages)
    education = {
        "postGradAndAbove": adr_summary["education"]["postGradAndAbove"],
        "graduate": adr_summary["education"]["graduate"],
        "belowGraduate": adr_summary["education"]["belowGraduate"],
    }

    # Top wealthiest MPs
    wealthiest = [
        {
            "rank": mp["rank"],
            "name": mp["name"],
            "constituency": mp["constituency"],
            "party": mp["party"],
            "assetsCrore": mp["assetsCrore"],
        }
        for mp in top_wealthiest
    ]

    # Top MPs by criminal cases
    most_criminal = [
        {
            "rank": mp["rank"],
            "name": mp["name"],
            "constituency": mp["constituency"],
            "party": mp["party"],
            "cases": mp["cases"],
        }
        for mp in top_criminal
    ]

    return {
        "year": survey_year,
        "criminal": criminal,
        "assets": assets,
        "education": education,
        "topWealthiest": wealthiest,
        "topCriminal": most_criminal,
        "source": "ADR / MyNeta.info — Analysis of self-sworn affidavits, 18th Lok Sabha",
    }
