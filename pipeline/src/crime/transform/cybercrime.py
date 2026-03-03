"""
Transform cybercrime data.

Outputs:
  - cybercrime.json: NCRB FIR trends, category breakdown, I4C context
"""


def build_cybercrime(
    trend: list[dict],
    crime_types: list[dict],
    i4c_context: dict,
    survey_year: str,
) -> dict:
    """Build the cybercrime JSON output."""

    national_trend = [
        {
            "year": t["year"],
            "cases": t["cases"],
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

    return {
        "year": survey_year,
        "ncrbTrend": national_trend,
        "crimeTypes": types,
        "i4cComplaints": i4c_context["complaints2022"],
        "i4cFinancialLossCrore": i4c_context["financialLossCrore"],
        "i4cNote": i4c_context["note"],
        "source": "NCRB Crime in India 2022 + I4C / cybercrime.gov.in",
    }
