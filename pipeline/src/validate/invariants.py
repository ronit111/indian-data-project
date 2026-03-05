"""
Cross-file data integrity invariants.

These checks catch inconsistencies between related JSON files that individual
Pydantic schema validation cannot detect (schema validation only checks one
file at a time).

Run after all JSON files are generated, before publishing.
"""

import logging

logger = logging.getLogger(__name__)


def check_treemap_expenditure(treemap: dict, expenditure: dict) -> list[str]:
    """Treemap children must sum to expenditure total."""
    errors = []

    def sum_tree(node: dict) -> float:
        if "children" in node and node["children"]:
            return sum(sum_tree(c) for c in node["children"])
        return node.get("value", 0)

    tree_sum = sum_tree(treemap["root"])
    exp_total = expenditure["total"]
    diff = abs(tree_sum - exp_total)

    if diff > 1:  # Allow Rs 1 Cr rounding tolerance
        errors.append(
            f"Treemap sum ({tree_sum:,.0f}) != expenditure total ({exp_total:,.0f}), "
            f"diff = {diff:,.0f} Cr"
        )
    else:
        logger.info(f"  treemap sum == expenditure total ({exp_total:,.0f} Cr) ✓")

    return errors


def check_scheme_consistency(schemes: dict, expenditure: dict) -> list[str]:
    """Scheme allocations must match amounts in expenditure ministry breakdowns."""
    errors = []

    # Build lookup: scheme_id -> amount from expenditure.json
    exp_amounts: dict[str, float] = {}
    for ministry in expenditure["ministries"]:
        for scheme in ministry.get("schemes", []):
            exp_amounts[scheme["id"]] = scheme["amount"]

    for scheme in schemes["schemes"]:
        sid = scheme["id"]
        if sid in exp_amounts:
            exp_val = exp_amounts[sid]
            sch_val = scheme["allocation"]
            if abs(exp_val - sch_val) > 1:
                errors.append(
                    f"Scheme '{sid}': schemes.json has {sch_val:,.0f} but "
                    f"expenditure.json has {exp_val:,.0f}"
                )

    if not errors:
        logger.info(f"  scheme allocations match expenditure ({len(exp_amounts)} checked) ✓")

    return errors


def check_receipts_percentages(receipts: dict) -> list[str]:
    """Receipt category percentages should sum to ~100%."""
    errors = []

    pct_sum = sum(c["percentOfTotal"] for c in receipts["categories"])
    if abs(pct_sum - 100.0) > 1.5:
        errors.append(
            f"Receipt percentOfTotal sum is {pct_sum:.1f}% (expected ~100%)"
        )
    else:
        logger.info(f"  receipt percentages sum to {pct_sum:.1f}% ✓")

    # Also check amounts sum to total
    amt_sum = sum(c["amount"] for c in receipts["categories"])
    total = receipts["total"]
    diff = abs(amt_sum - total)
    if diff > 1:
        errors.append(
            f"Receipt amounts sum ({amt_sum:,.0f}) != total ({total:,.0f})"
        )
    else:
        logger.info(f"  receipt amounts sum to total ({total:,.0f} Cr) ✓")

    return errors


def check_statewise_transfers(statewise: dict) -> list[str]:
    """State transfer amounts should sum close to totalTransfers."""
    errors = []

    state_sum = sum(s["transfer"] for s in statewise["states"])
    total = statewise["totalTransfers"]
    pct_diff = abs(state_sum - total) / total * 100 if total else 0

    if pct_diff > 0.5:  # 0.5% tolerance for rounding
        errors.append(
            f"State transfers sum ({state_sum:,.0f}) differs from "
            f"totalTransfers ({total:,.0f}) by {pct_diff:.2f}%"
        )
    else:
        logger.info(
            f"  state transfers sum within tolerance "
            f"(diff {pct_diff:.4f}%) ✓"
        )

    return errors


def check_receipts_equals_expenditure(receipts: dict, expenditure: dict) -> list[str]:
    """Receipts total (incl. borrowings) must equal total expenditure."""
    errors = []
    r_total = receipts["total"]
    e_total = expenditure["total"]
    diff = abs(r_total - e_total)
    if diff > 1:
        errors.append(
            f"Receipts total ({r_total:,.0f}) != expenditure total ({e_total:,.0f}), "
            f"diff = {diff:,.0f} Cr. Receipts incl. borrowings must fund all expenditure."
        )
    else:
        logger.info(f"  receipts total == expenditure total ({e_total:,.0f} Cr) ✓")
    return errors


def run_all_invariants(
    treemap: dict,
    expenditure: dict,
    schemes: dict,
    receipts: dict,
    statewise: dict,
) -> list[str]:
    """Run all cross-file invariants. Returns list of error messages (empty = pass)."""
    logger.info("Running cross-file invariants...")
    errors = []
    errors.extend(check_treemap_expenditure(treemap, expenditure))
    errors.extend(check_scheme_consistency(schemes, expenditure))
    errors.extend(check_receipts_percentages(receipts))
    errors.extend(check_receipts_equals_expenditure(receipts, expenditure))
    errors.extend(check_statewise_transfers(statewise))
    return errors
