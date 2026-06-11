"""
Tests for the last-known-good series preservation in the publish writer.

Guards against the April/June 2026 incident where a failed World Bank fetch
(fetch_indicator returning []) erased ageStructure.elderly and
empPopRatioTimeSeries from the published JSON.
"""

import json
from pathlib import Path

# Add pipeline src to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.publish.writer import _preserve_nonempty_series


def test_empty_list_replaced_by_previous_series():
    new = {"ageStructure": {"elderly": [], "young": [{"year": "2024", "value": 24.6}]}}
    old = {"ageStructure": {"elderly": [{"year": "2024", "value": 7.15}], "young": []}}
    result = _preserve_nonempty_series(new, old)
    assert result["ageStructure"]["elderly"] == [{"year": "2024", "value": 7.15}]


def test_fresh_data_wins_when_nonempty():
    new = {"series": [{"year": "2025", "value": 53.31}]}
    old = {"series": [{"year": "2024", "value": 52.99}]}
    result = _preserve_nonempty_series(new, old)
    assert result["series"] == [{"year": "2025", "value": 53.31}]


def test_both_empty_stays_empty():
    new = {"series": []}
    old = {"series": []}
    assert _preserve_nonempty_series(new, old)["series"] == []


def test_new_keys_untouched_and_type_mismatch_safe():
    new = {"added": [], "changed": {"a": 1}, "scalar": 5}
    old = {"changed": [1, 2], "scalar": [9]}
    result = _preserve_nonempty_series(new, old)
    # "added" has no previous counterpart -> stays empty
    assert result["added"] == []
    # dict vs list mismatch -> new value kept as-is
    assert result["changed"] == {"a": 1}
    # scalar vs list mismatch -> new value kept
    assert result["scalar"] == 5


def test_nested_preservation_logs_path(caplog):
    new = {"a": {"b": {"c": []}}}
    old = {"a": {"b": {"c": [{"year": "2020", "value": 1.0}]}}}
    result = _preserve_nonempty_series(new, old)
    assert result["a"]["b"]["c"] == [{"year": "2020", "value": 1.0}]
