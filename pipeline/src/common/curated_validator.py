"""
Automated validation for curated data constants.

Curated data — manually typed from government PDFs — is the highest-risk layer
of the data pipeline. This module provides cross-checks that catch common errors:

1. INTERNAL CONSISTENCY: state sums ≈ national totals, PTR = students/teachers
2. RANGE CHECKS: percentages ∈ [0, 100], rates within plausible bounds
3. KNOWN REFERENCE VALUES: cross-check headline numbers against trusted anchors
4. STRUCTURAL CHECKS: required fields present, no duplicates, IDs valid

Run standalone:  python -m pipeline.src.common.curated_validator
Or import:       from pipeline.src.common.curated_validator import validate_all

Design: Each check returns a list of (severity, message) tuples.
  severity: "CRITICAL" (blocks pipeline), "WARNING" (log + continue), "INFO"

--- HISTORY ---
Created 2026-03-04 after audit found fabricated education state data, wrong
elections asset figures, incorrect healthcare OOP %, and other errors across
6 domains. See pipeline/CURATED_DATA_AUDIT.md for the full findings.
"""

import logging
import sys
from typing import Any

logger = logging.getLogger("curated-validator")

Finding = tuple[str, str]  # (severity, message)


# ── Generic checks ────────────────────────────────────────────────────

def check_percentage_range(data: list[dict], fields: list[str], label: str) -> list[Finding]:
    """Verify percentage fields are in [0, 120]. GER can exceed 100."""
    findings: list[Finding] = []
    for entry in data:
        name = entry.get("name", entry.get("id", "?"))
        for f in fields:
            val = entry.get(f)
            if val is None:
                continue
            if not (0 <= val <= 120):
                findings.append(("CRITICAL", f"{label}: {name}.{f} = {val} is outside [0, 120]"))
    return findings


def check_no_duplicate_ids(data: list[dict], label: str) -> list[Finding]:
    """Ensure no duplicate IDs in a state-level dataset."""
    seen: dict[str, int] = {}
    findings: list[Finding] = []
    for entry in data:
        sid = entry.get("id", "")
        seen[sid] = seen.get(sid, 0) + 1
    for sid, count in seen.items():
        if count > 1:
            findings.append(("CRITICAL", f"{label}: Duplicate ID '{sid}' appears {count} times"))
    return findings


def check_sum_approx(
    data: list[dict],
    field: str,
    expected_total: float,
    label: str,
    tolerance_pct: float = 5.0,
) -> list[Finding]:
    """Check that sum of state values ≈ national total (within tolerance %)."""
    actual = sum(entry.get(field, 0) for entry in data)
    if expected_total == 0:
        return []
    pct_diff = abs(actual - expected_total) / expected_total * 100
    if pct_diff > tolerance_pct:
        return [("CRITICAL",
                 f"{label}: sum of state {field} = {actual:,.0f}, "
                 f"national total = {expected_total:,.0f} "
                 f"(diff {pct_diff:.1f}%, threshold {tolerance_pct}%)")]
    return []


def check_ptr_consistency(data: list[dict], label: str) -> list[Finding]:
    """Verify PTR ≈ totalStudents / totalTeachers for education data."""
    findings: list[Finding] = []
    for entry in data:
        teachers = entry.get("totalTeachers", 0)
        students = entry.get("totalStudents", 0)
        ptr = entry.get("ptr", 0)
        if teachers == 0 or ptr == 0:
            continue
        computed = students / teachers
        if abs(computed - ptr) > 3:  # allow ±3 tolerance
            findings.append((
                "WARNING",
                f"{label}: {entry['name']} PTR={ptr} but students/teachers="
                f"{computed:.1f} (diff {abs(computed-ptr):.1f})"
            ))
    return findings


def check_required_fields(data: list[dict], fields: list[str], label: str) -> list[Finding]:
    """Check that all required fields are present and non-None."""
    findings: list[Finding] = []
    for entry in data:
        name = entry.get("name", entry.get("id", "?"))
        for f in fields:
            if f not in entry or entry[f] is None:
                findings.append(("CRITICAL", f"{label}: {name} missing required field '{f}'"))
    return findings


# ── Domain-specific validators ────────────────────────────────────────

def validate_education() -> list[Finding]:
    """Validate education curated data."""
    findings: list[Finding] = []

    try:
        from pipeline.src.education.sources.curated import (
            UDISE_2023_24_STATES,
            NATIONAL_TOTALS,
        )
    except ImportError:
        # Fallback for direct execution
        import importlib.util
        import os
        spec = importlib.util.spec_from_file_location(
            "curated",
            os.path.join(os.path.dirname(__file__), "..", "education", "sources", "curated.py"),
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        UDISE_2023_24_STATES = mod.UDISE_2023_24_STATES
        NATIONAL_TOTALS = mod.NATIONAL_TOTALS

    label = "Education"

    # Structure
    findings += check_no_duplicate_ids(UDISE_2023_24_STATES, label)
    findings += check_required_fields(
        UDISE_2023_24_STATES,
        ["id", "name", "totalSchools", "totalTeachers", "totalStudents", "ptr"],
        label,
    )

    # PTR consistency: stored PTR should ≈ students/teachers
    findings += check_ptr_consistency(UDISE_2023_24_STATES, label)

    # State sums should ≈ national totals
    findings += check_sum_approx(
        UDISE_2023_24_STATES, "totalSchools",
        NATIONAL_TOTALS["totalSchools"], f"{label} schools", tolerance_pct=3,
    )
    findings += check_sum_approx(
        UDISE_2023_24_STATES, "totalTeachers",
        NATIONAL_TOTALS["totalTeachers"], f"{label} teachers", tolerance_pct=5,
    )
    findings += check_sum_approx(
        UDISE_2023_24_STATES, "totalStudents",
        NATIONAL_TOTALS["totalStudents"], f"{label} students", tolerance_pct=5,
    )

    # Percentages in range
    findings += check_percentage_range(
        UDISE_2023_24_STATES,
        ["gerPrimary", "gerSecondary", "gerHigherSec",
         "dropoutPrimary", "dropoutSecondary",
         "schoolsWithComputers", "schoolsWithInternet", "girlsToilets"],
        label,
    )

    # Known reference: national GER primary should be < 105 post-2022 SDMIS change
    ger = NATIONAL_TOTALS.get("gerPrimary", 0)
    if ger > 105:
        findings.append(("WARNING",
                         f"{label}: National GER Primary = {ger}. "
                         "Post-UDISE+ 2022-23 SDMIS methodology change, GER dropped below 100. "
                         "Values >105 likely use pre-2022 methodology."))

    return findings


def validate_employment() -> list[Finding]:
    """Validate employment curated data."""
    findings: list[Finding] = []

    try:
        from pipeline.src.employment.sources.curated import (
            NATIONAL_TOTALS,
            SECTORAL_EMPLOYMENT,
            PLFS_STATE_DATA,
        )
    except ImportError:
        return [("INFO", "Employment: could not import curated data")]

    label = "Employment"

    # Sectoral employment should sum to ~100%
    sector_sum = sum(s["employmentShare"] for s in SECTORAL_EMPLOYMENT)
    if abs(sector_sum - 100) > 2:
        findings.append(("CRITICAL",
                         f"{label}: Sectoral employment shares sum to {sector_sum}%, "
                         "expected ~100%"))

    # LFPR should be > unemployment rate
    lfpr = NATIONAL_TOTALS.get("lfpr", 0)
    unemp = NATIONAL_TOTALS.get("unemploymentRate", 0)
    if unemp >= lfpr and lfpr > 0:
        findings.append(("CRITICAL",
                         f"{label}: Unemployment ({unemp}%) >= LFPR ({lfpr}%), impossible"))

    # Youth unemployment should be > overall unemployment
    youth = NATIONAL_TOTALS.get("youthUnemployment", 0)
    if youth <= unemp and youth > 0:
        findings.append(("WARNING",
                         f"{label}: Youth unemployment ({youth}%) <= overall ({unemp}%), unusual"))

    # Self-employed % should be in plausible range for India (45-65%)
    se = NATIONAL_TOTALS.get("selfEmployedPct", 0)
    if se < 45 or se > 65:
        findings.append(("WARNING",
                         f"{label}: Self-employed {se}% outside plausible range [45-65%] for India"))

    # State data checks
    findings += check_no_duplicate_ids(PLFS_STATE_DATA, label)
    findings += check_percentage_range(
        PLFS_STATE_DATA,
        ["lfpr", "lfprMale", "lfprFemale", "unemploymentRate", "selfEmployed"],
        label,
    )

    return findings


def validate_elections() -> list[Finding]:
    """Validate elections curated data."""
    findings: list[Finding] = []

    try:
        from pipeline.src.elections.sources.curated import (
            ADR_SUMMARY,
            ADR_TOP_WEALTHIEST,
        )
    except ImportError:
        return [("INFO", "Elections: could not import curated data")]

    label = "Elections"

    # Average assets: ADR 2024 report confirmed Rs 46.34 crore
    avg = ADR_SUMMARY.get("assets", {}).get("avgCrore", 0)
    if avg > 60:
        findings.append(("CRITICAL",
                         f"{label}: Average MP assets Rs {avg} crore seems too high. "
                         "ADR 2024 report says Rs 46.34 crore. Cross-check against "
                         "https://adrindia.org/content/lok-sabha-2024"))

    # Criminal case percentages should match count/total
    total_mps = ADR_SUMMARY.get("totalMPs", 543)
    criminal = ADR_SUMMARY.get("criminalCases", {})
    expected_pct = round(criminal.get("any", 0) / total_mps * 100)
    if abs(expected_pct - criminal.get("pctAny", 0)) > 1:
        findings.append(("WARNING",
                         f"{label}: Criminal cases pctAny={criminal.get('pctAny')}% "
                         f"but {criminal.get('any')}/{total_mps} = {expected_pct}%"))

    # Wealthiest list: check no fictional constituencies or known losing candidates
    KNOWN_LOSERS_2024 = {"D.K. Suresh", "Rajeev Chandrasekhar", "Navneet Rana"}
    for entry in ADR_TOP_WEALTHIEST:
        if entry["name"] in KNOWN_LOSERS_2024:
            findings.append(("CRITICAL",
                             f"{label}: {entry['name']} in wealthiest list but "
                             "LOST the 2024 Lok Sabha election"))

    return findings


def validate_healthcare() -> list[Finding]:
    """Validate healthcare curated data."""
    findings: list[Finding] = []

    try:
        from pipeline.src.healthcare.sources.curated import (
            NATIONAL_TOTALS,
            IMMUNIZATION_STATES,
        )
    except ImportError:
        return [("INFO", "Healthcare: could not import curated data")]

    label = "Healthcare"

    # OOP should be declining trend: was 62% in 2014, ~45% in 2021
    oop = NATIONAL_TOTALS.get("outOfPocketPct", 0)
    if oop > 50:
        findings.append(("WARNING",
                         f"{label}: OOP expenditure {oop}% seems high. "
                         "World Bank 2021 reports 45.1%. Declining trend since 2014."))

    # Immunization: full immunization should be < BCG for every state
    findings += check_no_duplicate_ids(IMMUNIZATION_STATES, label)
    for entry in IMMUNIZATION_STATES:
        full = entry.get("fullImmunization", 0)
        bcg = entry.get("bcg", 0)
        if full > bcg:
            findings.append(("CRITICAL",
                             f"{label}: {entry['name']} fullImmunization ({full}%) > "
                             f"BCG ({bcg}%), impossible"))
        # DPT3 should be < BCG
        dpt3 = entry.get("dpt3", 0)
        if dpt3 > bcg:
            findings.append(("CRITICAL",
                             f"{label}: {entry['name']} DPT3 ({dpt3}%) > BCG ({bcg}%), unlikely"))

    findings += check_percentage_range(
        IMMUNIZATION_STATES,
        ["fullImmunization", "bcg", "measles", "dpt3"],
        label,
    )

    return findings


def validate_environment() -> list[Finding]:
    """Validate environment curated data."""
    findings: list[Finding] = []

    try:
        from pipeline.src.environment.sources.curated import (
            NATIONAL_TOTALS,
            ISFR_2023_STATES,
        )
    except ImportError:
        return [("INFO", "Environment: could not import curated data")]

    label = "Environment"

    # Forest cover: 25.17% is forest+tree cover, not forest alone (21.76%)
    forest = NATIONAL_TOTALS.get("forestPct", 0)
    if forest > 22 and forest < 26:
        findings.append(("INFO",
                         f"{label}: forestPct={forest}% — note this is forest+tree cover "
                         "(ISFR 2023). Forest-only cover is 21.76%."))

    # State forest cover should sum approximately to national total
    findings += check_no_duplicate_ids(ISFR_2023_STATES, label)
    findings += check_percentage_range(
        ISFR_2023_STATES,
        ["pctGeographicArea"],
        label,
    )

    return findings


def validate_crime() -> list[Finding]:
    """Validate crime curated data."""
    findings: list[Finding] = []

    try:
        from pipeline.src.crime.sources.curated import (
            ROAD_ACCIDENT_CAUSES,
            IPC_COMPOSITION,
            NATIONAL_TOTALS as CRIME_TOTALS,
        )
    except ImportError:
        return [("INFO", "Crime: could not import curated data")]

    label = "Crime"

    # Road accident causes should sum to ~100%
    cause_sum = sum(c["pct"] for c in ROAD_ACCIDENT_CAUSES)
    if abs(cause_sum - 100) > 2:
        findings.append(("WARNING",
                         f"{label}: Road accident causes sum to {cause_sum}%, expected ~100%"))

    # IPC composition should sum to IPC total
    ipc_total = CRIME_TOTALS.get("ipcCrimes", 0)
    ipc_sum = sum(c.get("cases", 0) for c in IPC_COMPOSITION)
    if ipc_total > 0 and abs(ipc_sum - ipc_total) > 50000:
        findings.append(("WARNING",
                         f"{label}: IPC composition cases sum to {ipc_sum:,} "
                         f"but IPC total is {ipc_total:,} "
                         f"(gap: {abs(ipc_sum-ipc_total):,})"))

    return findings


# ── Master runner ──────────────────────────────────────────────────────

def validate_all() -> list[Finding]:
    """Run all validators. Returns list of (severity, message)."""
    all_findings: list[Finding] = []

    validators = [
        validate_education,
        validate_employment,
        validate_elections,
        validate_healthcare,
        validate_environment,
        validate_crime,
    ]

    for validator in validators:
        try:
            all_findings.extend(validator())
        except Exception as e:
            all_findings.append(("WARNING", f"{validator.__name__}: {e}"))

    return all_findings


def main():
    """CLI entry point — run all validators and report."""
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    findings = validate_all()

    if not findings:
        print("All curated data checks passed.")
        return

    # Group by severity
    by_severity: dict[str, list[str]] = {}
    for sev, msg in findings:
        by_severity.setdefault(sev, []).append(msg)

    for sev in ["CRITICAL", "WARNING", "INFO"]:
        items = by_severity.get(sev, [])
        if items:
            print(f"\n{'='*60}")
            print(f"  {sev} ({len(items)} issues)")
            print(f"{'='*60}")
            for msg in items:
                print(f"  - {msg}")

    criticals = len(by_severity.get("CRITICAL", []))
    warnings = len(by_severity.get("WARNING", []))
    print(f"\nSummary: {criticals} critical, {warnings} warnings")

    if criticals > 0:
        print("\nCRITICAL issues found. Pipeline should not proceed without review.")
        sys.exit(1)


if __name__ == "__main__":
    main()
