"""
Generate Sankey diagram nodes and links.
Revenue sources → Central Government → Expenditure ministries.
"""


def build_sankey(
    receipts: list[dict],
    expenditures: list[dict],
    total_expenditure: float,
    year: str,
) -> dict:
    """
    Build Sankey data structure.

    Args:
        receipts: list of {"id", "name", "amount"} dicts
        expenditures: list of {"id", "name", "budgetEstimate"} dicts
        total_expenditure: total expenditure in Rs crore
        year: budget year string

    Note: Receipt amounts are GROSS tax collections. The centre devolves
    ~41% of the divisible pool to states under the Finance Commission.
    We add a "States' Share of Taxes" outflow so the Sankey balances:
    gross inflows = central expenditure + states' share.
    """
    nodes = []
    links = []

    # Revenue nodes (left side)
    total_inflows = 0
    for r in receipts:
        total_inflows += r["amount"]
        nodes.append({
            "id": r["id"],
            "name": r["name"],
            "group": "revenue",
            "value": r["amount"],
        })
        links.append({
            "source": r["id"],
            "target": "central-govt",
            "value": r["amount"],
            "verified": True,
        })

    # Central government node (middle) — value = total inflows for balanced Sankey
    nodes.append({
        "id": "central-govt",
        "name": "Central Government",
        "group": "center",
        "value": round(total_inflows),
    })

    # States' share of taxes (constitutional devolution under Finance Commission)
    states_share = round(total_inflows - total_expenditure)
    if states_share > 0:
        nodes.append({
            "id": "states-tax-share",
            "name": "States' Share of Taxes",
            "group": "expenditure",
            "value": states_share,
        })
        links.append({
            "source": "central-govt",
            "target": "states-tax-share",
            "value": states_share,
            "verified": True,
        })

    # Expenditure nodes (right side)
    named_total = 0
    for e in expenditures:
        amount = e["budgetEstimate"]
        named_total += amount
        nodes.append({
            "id": e["id"],
            "name": e["name"].replace("Ministry of ", "").replace("Subsidies (Food, Fertilizer, Fuel)", "Subsidies"),
            "group": "expenditure",
            "value": amount,
        })
        links.append({
            "source": "central-govt",
            "target": e["id"],
            "value": amount,
            "verified": True,
        })

    # "Other" bucket for remaining expenditure
    other = total_expenditure - named_total
    if other > 0:
        nodes.append({
            "id": "other-expenditure",
            "name": "Other",
            "group": "expenditure",
            "value": round(other),
        })
        links.append({
            "source": "central-govt",
            "target": "other-expenditure",
            "value": round(other),
            "verified": True,
        })

    return {"year": year, "nodes": nodes, "links": links}
