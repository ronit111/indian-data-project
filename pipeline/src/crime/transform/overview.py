"""
Transform crime overview data.

Outputs:
  - overview.json: National crime trends, IPC composition, state-wise crime rates,
    World Bank homicide rate (long-run context)
"""


def build_overview(
    national_trend: list[dict],
    ipc_composition: list[dict],
    state_rates: list[dict],
    homicide_wb: list[dict],
    survey_year: str,
) -> dict:
    """Build the overview JSON output."""

    trend = [
        {
            "year": t["year"],
            "total": t["total"],
            "ipc": t["ipc"],
            "sll": t["sll"],
            "rate": t["rate"],
        }
        for t in national_trend
    ]

    composition = [
        {
            "id": c["id"],
            "name": c["name"],
            "cases": c["cases"],
            "pct": c["pct"],
        }
        for c in ipc_composition
    ]

    states = sorted(
        [
            {"id": s["id"], "name": s["name"], "rate": s["rate"], "total": s["total"]}
            for s in state_rates
        ],
        key=lambda x: x["rate"],
        reverse=True,
    )

    homicide_trend = [
        {"year": h["year"], "value": h["value"]}
        for h in homicide_wb
    ]

    return {
        "year": survey_year,
        "nationalTrend": trend,
        "ipcComposition": composition,
        "stateRates": states,
        "homicideRate": homicide_trend,
        "source": "NCRB Crime in India 2022 + World Bank",
    }
