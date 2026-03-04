"""
Transform election results data.

Outputs:
  - results.json: Seat evolution (17 elections, 8 party categories)
                  + 2024 detailed party results
"""


# Party category metadata for stacked area chart
PARTY_CATEGORIES = [
    {"id": "INC", "name": "Congress (INC)", "color": "#00BFFF"},
    {"id": "BJP", "name": "BJP", "color": "#FF6B35"},
    {"id": "Left", "name": "Left Parties", "color": "#DC2626"},
    {"id": "JD", "name": "Janata Family", "color": "#A855F7"},
    {"id": "BSP", "name": "BSP", "color": "#3B82F6"},
    {"id": "SP", "name": "SP", "color": "#22C55E"},
    {"id": "Regional", "name": "Regional Parties", "color": "#14B8A6"},
    {"id": "Others", "name": "Others / Independents", "color": "#9CA3AF"},
]


def build_results(seat_evolution: list[dict], results_2024: list[dict],
                  survey_year: str) -> dict:
    """Build the results JSON output."""

    # Transform seat evolution into series format for stacked area chart
    # Each category becomes a series with data points across elections
    series = []
    for cat in PARTY_CATEGORIES:
        cat_id = cat["id"]
        data_points = []
        for election in seat_evolution:
            seats = election.get(cat_id, 0)
            total = election.get("totalSeats", 0)
            data_points.append({
                "year": election["year"],
                "seats": seats,
                "totalSeats": total,
                "pct": round(seats / total * 100, 1) if total > 0 else 0.0,
            })
        series.append({
            "id": cat_id,
            "name": cat["name"],
            "color": cat["color"],
            "data": data_points,
        })

    # 2024 detailed results — already well-structured, pass through with sorting
    parties_2024 = sorted(
        [
            {
                "party": p["party"],
                "fullName": p["fullName"],
                "seats": p["seats"],
                "voteShare": p["voteShare"],
                "color": p["color"],
                "alliance": p["alliance"],
            }
            for p in results_2024
        ],
        key=lambda x: x["seats"],
        reverse=True,
    )

    # Alliance totals for 2024
    nda_seats = sum(p["seats"] for p in results_2024 if p["alliance"] == "NDA")
    india_seats = sum(p["seats"] for p in results_2024 if p["alliance"] == "INDIA")
    other_seats = sum(p["seats"] for p in results_2024 if p["alliance"] == "—")

    return {
        "year": survey_year,
        "seatEvolution": series,
        "parties2024": parties_2024,
        "allianceTotals2024": {
            "NDA": nda_seats,
            "INDIA": india_seats,
            "Others": other_seats,
            "majorityMark": 272,
        },
        "source": "ECI Official Results + TCPD Lok Dhaba",
    }
