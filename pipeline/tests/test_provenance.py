"""Tests for the provenance sidecar generator."""

import json

import pytest

from src.publish import provenance as prov


GOOD_SUMMARY = {
    "totalExpenditure": 5065345,
    "totalReceipts": 3496409,
    "revenueReceipts": 3420409,
    "capitalReceipts": 76000,
    "fiscalDeficit": 1568936,
    "fiscalDeficitPercentGDP": 4.4,
    "gdp": 35698000,
    "population": 1450000000,
    "perCapitaExpenditure": 34933.0,
    "perCapitaDailyExpenditure": 95.71,
    "lastUpdated": "2026-06-02",
    "source": "https://openbudgetsindia.org/",
}

GOOD_SANKEY = {
    "nodes": [{"id": "income-tax"}, {"id": "central-govt"}, {"id": "defence"}],
    "links": [
        {"source": "income-tax", "target": "central-govt", "value": 5065345},
        {"source": "central-govt", "target": "defence", "value": 5065345},
    ],
}


def _files():
    return {
        "summary.json": json.loads(json.dumps(GOOD_SUMMARY)),
        "sankey.json": json.loads(json.dumps(GOOD_SANKEY)),
    }


def test_budget_figures_all_checks_pass():
    figures = prov._budget_figures(_files())
    assert set(figures) == {
        "summary.totalExpenditure",
        "summary.totalReceipts",
        "summary.fiscalDeficitPercentGDP",
        "summary.perCapitaDailyExpenditure",
    }
    for entry in figures.values():
        kinds = [step["kind"] for step in entry["chain"]]
        assert kinds[0] == "document"
        assert kinds[1] == "curation"
        assert all(k == "check" for k in kinds[2:])
        assert all(
            step["status"] == "pass"
            for step in entry["chain"] if step["kind"] == "check"
        )


def test_values_come_from_published_data_not_registry():
    files = _files()
    figures = prov._budget_figures(files)
    assert figures["summary.totalExpenditure"]["value"] == files["summary.json"]["totalExpenditure"]
    assert figures["summary.totalReceipts"]["value"] == files["summary.json"]["totalReceipts"]


def test_published_date_propagates_from_last_updated():
    figures = prov._budget_figures(_files())
    curation_step = figures["summary.totalExpenditure"]["chain"][1]
    assert curation_step["published"] == GOOD_SUMMARY["lastUpdated"]


def test_chain_never_claims_api_provenance():
    # The budget pipeline publishes curated values; the OBI CKAN fetch is
    # informational only. A chain claiming 'api' would be fabricated.
    figures = prov._budget_figures(_files())
    for entry in figures.values():
        assert all(step["kind"] != "api" for step in entry["chain"])


def test_afs_url_is_year_scoped():
    # The unscoped /doc/AFS/ URL is overwritten every Budget Day.
    assert "budget2025-26" in prov.BUDGET_DOCUMENTS["afs"]["url"]


def test_failing_invariant_aborts_generation():
    files = _files()
    files["summary.json"]["totalExpenditure"] = 9999999  # breaks both checks
    with pytest.raises(ValueError, match="Provenance check FAILED"):
        prov._budget_figures(files)


def test_receipts_identity_check_fails_closed():
    files = _files()
    files["summary.json"]["capitalReceipts"] += 1
    with pytest.raises(ValueError, match="Provenance check FAILED"):
        prov._budget_figures(files)


def test_sankey_central_total_reads_inflow():
    assert prov._sankey_central_total(GOOD_SANKEY) == 5065345


def test_real_published_data_generates_clean_sidecar():
    """End-to-end against the actual committed public/data JSONs."""
    sidecar = prov.build_provenance("budget", "2025-26")
    assert sidecar["spec"] == 1
    assert len(sidecar["figures"]) == 4
    total = sidecar["figures"]["summary.totalExpenditure"]
    assert isinstance(total["value"], (int, float))
    assert total["unit"] == "₹ crore"
