"""
Generate machine-readable provenance sidecars for published figures.

Every entry in the registry maps a figure the site displays to its chain of
custody: the official document it comes from, the API/pipeline that fetched
it, and integrity checks that are RECOMPUTED against the published JSON at
generation time — never asserted. A failing check aborts generation
(fail-closed), so a provenance sidecar can never describe data it doesn't
match.

Output: public/data/<domain>/<year>/provenance.json

Honesty rules (non-negotiable, same as the rest of this pipeline):
  - Values are read from the published JSONs, never hardcoded here.
  - Only chains we actually know are declared. No decorative metadata.
  - Checks must be pure functions of published data.
"""

import json
import logging
from datetime import date
from pathlib import Path
from typing import Any, Callable

from src.publish.writer import PROJECT_ROOT, write_json

logger = logging.getLogger(__name__)

DATA_DIR = PROJECT_ROOT / "public" / "data"


def _resolve(data: dict, dotted_path: str) -> Any:
    """Resolve 'a.b.c' against a nested dict. Raises KeyError if absent."""
    node: Any = data
    for part in dotted_path.split("."):
        node = node[part]
    return node


class Check:
    """A named integrity check recomputed against published data."""

    def __init__(self, name: str, fn: Callable[[dict[str, dict]], bool]):
        self.name = name
        self.fn = fn

    def run(self, files: dict[str, dict]) -> dict:
        passed = bool(self.fn(files))
        if not passed:
            raise ValueError(f"Provenance check FAILED: {self.name}")
        return {"kind": "check", "name": self.name, "status": "pass"}


# ── Budget registry ───────────────────────────────────────────────────
# Chains reference documents by stable ids so the UI can dedupe/link them.

BUDGET_DOCUMENTS = {
    "afs": {
        "kind": "document",
        "name": "Union Budget 2025-26 — Annual Financial Statement",
        "publisher": "Ministry of Finance, Government of India",
        "url": "https://www.indiabudget.gov.in/doc/AFS/allafs.pdf",
    },
    "obi": {
        "kind": "api",
        "name": "Open Budgets India (CKAN API)",
        "publisher": "CivicDataLab",
        "url": "https://openbudgetsindia.org/",
    },
}


def _budget_figures(files: dict[str, dict]) -> dict[str, dict]:
    """Declarative figure registry for the budget domain."""
    summary = files["summary.json"]
    retrieved = summary.get("lastUpdated")

    def api_step() -> dict:
        step = dict(BUDGET_DOCUMENTS["obi"])
        if retrieved:
            step["retrieved"] = retrieved
        return step

    figures: dict[str, dict] = {}

    def figure(key: str, label: str, unit: str, value: Any,
               checks: list[Check], basis: str | None = None) -> None:
        chain: list[dict] = [dict(BUDGET_DOCUMENTS["afs"]), api_step()]
        chain += [c.run(files) for c in checks]
        entry: dict[str, Any] = {
            "value": value, "unit": unit, "label": label, "chain": chain,
        }
        if basis:
            entry["basis"] = basis
        figures[key] = entry

    figure(
        "summary.totalExpenditure",
        "Total central expenditure (net)",
        "₹ crore",
        summary["totalExpenditure"],
        checks=[
            Check(
                "Invariant: perCapitaExpenditure × population ≈ totalExpenditure",
                lambda f: abs(
                    f["summary.json"]["perCapitaExpenditure"]
                    * f["summary.json"]["population"] / 1e7
                    - f["summary.json"]["totalExpenditure"]
                ) / f["summary.json"]["totalExpenditure"] < 0.01,
            ),
            Check(
                "Sankey central node equals summary total",
                lambda f: _sankey_central_total(f["sankey.json"])
                == f["summary.json"]["totalExpenditure"],
            ),
        ],
        basis=(
            "Net of tax devolution to states — matches the official Total "
            "Expenditure headline. Gross framing would double-count devolution."
        ),
    )

    figure(
        "summary.totalReceipts",
        "Total receipts (net)",
        "₹ crore",
        summary["totalReceipts"],
        checks=[
            Check(
                "revenueReceipts + capitalReceipts = totalReceipts",
                lambda f: f["summary.json"]["revenueReceipts"]
                + f["summary.json"]["capitalReceipts"]
                == f["summary.json"]["totalReceipts"],
            ),
        ],
    )

    figure(
        "summary.fiscalDeficitPercentGDP",
        "Fiscal deficit as % of GDP",
        "%",
        summary["fiscalDeficitPercentGDP"],
        checks=[
            Check(
                "fiscalDeficit ÷ GDP ≈ published percentage (±0.1pp)",
                lambda f: abs(
                    f["summary.json"]["fiscalDeficit"]
                    / f["summary.json"]["gdp"] * 100
                    - f["summary.json"]["fiscalDeficitPercentGDP"]
                ) < 0.1,
            ),
        ],
    )

    figure(
        "summary.perCapitaDailyExpenditure",
        "Government spend per person per day",
        "₹",
        summary["perCapitaDailyExpenditure"],
        checks=[
            Check(
                "perCapitaExpenditure ÷ 365 ≈ daily figure (±₹1)",
                lambda f: abs(
                    f["summary.json"]["perCapitaExpenditure"] / 365
                    - f["summary.json"]["perCapitaDailyExpenditure"]
                ) < 1,
            ),
        ],
        basis="Derived at pipeline time from totalExpenditure and population; never hardcoded.",
    )

    return figures


def _sankey_central_total(sankey: dict) -> float:
    """Total flow into the central 'budget' node (net expenditure pool)."""
    links = sankey.get("links", [])
    inflow = sum(
        link["value"] for link in links
        if link.get("target") in ("budget", "central-govt", "government")
    )
    if inflow:
        return inflow
    # Fallback: node with declared total
    for node in sankey.get("nodes", []):
        if node.get("id") in ("budget", "central-govt", "government"):
            if "total" in node:
                return node["total"]
    # Last resort: outflow from the central node
    return sum(
        link["value"] for link in links
        if link.get("source") in ("budget", "central-govt", "government")
    )


DOMAIN_REGISTRIES: dict[str, tuple[list[str], Callable]] = {
    # domain: (files the registry reads, registry builder)
    "budget": (["summary.json", "sankey.json"], _budget_figures),
}


def build_provenance(domain: str, year: str) -> dict:
    """Build the provenance sidecar dict for one domain-year."""
    file_names, builder = DOMAIN_REGISTRIES[domain]
    base = DATA_DIR / domain / year
    files = {name: json.loads((base / name).read_text()) for name in file_names}
    return {
        "domain": domain,
        "year": year,
        "generated": date.today().isoformat(),
        "spec": 1,
        "figures": builder(files),
    }


def publish_provenance(domain: str, year: str) -> Path:
    """Generate and write the provenance sidecar. Fail-closed on bad checks."""
    sidecar = build_provenance(domain, year)
    rel_path = f"{domain}/{year}/provenance.json"
    path = write_json(sidecar, rel_path)
    logger.info(
        f"Provenance sidecar written: {rel_path} "
        f"({len(sidecar['figures'])} figures, all checks passed)"
    )
    return path


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    domain = sys.argv[1] if len(sys.argv) > 1 else "budget"
    year = sys.argv[2] if len(sys.argv) > 2 else "2025-26"
    publish_provenance(domain, year)
