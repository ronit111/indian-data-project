"""
Curated healthcare data from authoritative Indian government sources.

Sources:
  - National Health Profile 2022 (NHP 2022)
    Central Bureau of Health Intelligence (CBHI), MoHFW
    https://cbhidghs.mohfw.gov.in/
  - NFHS-6 (2023-24) State/UT Fact Sheets (IIPS) — Immunization coverage
    International Institute for Population Sciences (IIPS)
    https://www.nfhsiips.in/nfhsuser/nfhs6.php

Data notes:
  - NHP 2022 is the latest National Health Profile.
  - State infrastructure data (beds, PHCs, CHCs) from NHP 2022 / Rural Health Statistics.
  - DoctorsPer10K is calculated from doctors at PHCs/CHCs and population.
  - Immunization data from NFHS-6 covers children aged 12-23 months.
  - This domain focuses on INFRASTRUCTURE + SPENDING + DISEASE BURDEN.
    Mortality indicators (IMR, MMR, U5MR, life expectancy) are in the Census domain.

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated.
"""

# ── National Health Profile 2022 — State Infrastructure ────────────
# Source: NHP 2022 + Rural Health Statistics 2021-22
# bedsPerLakh = govt hospital beds per lakh (100K) population
# phcs/chcs/subCentres = count of facilities
# doctorsAtPHC = doctors posted at Primary Health Centres
# doctorsPer10K = all registered allopathic doctors per 10K population

NHP_2022_STATES = [
    {"id": "UP", "name": "Uttar Pradesh", "bedsPerLakh": 32, "phcs": 3621, "chcs": 773, "subCentres": 20521, "doctorsAtPHC": 3218, "doctorsPer10K": 3.8},
    {"id": "MH", "name": "Maharashtra", "bedsPerLakh": 58, "phcs": 1814, "chcs": 364, "subCentres": 10580, "doctorsAtPHC": 2648, "doctorsPer10K": 10.2},
    {"id": "BR", "name": "Bihar", "bedsPerLakh": 11, "phcs": 1883, "chcs": 252, "subCentres": 9729, "doctorsAtPHC": 1424, "doctorsPer10K": 2.4},
    {"id": "WB", "name": "West Bengal", "bedsPerLakh": 52, "phcs": 909, "chcs": 348, "subCentres": 10356, "doctorsAtPHC": 1842, "doctorsPer10K": 7.8},
    {"id": "MP", "name": "Madhya Pradesh", "bedsPerLakh": 28, "phcs": 1171, "chcs": 334, "subCentres": 9192, "doctorsAtPHC": 1628, "doctorsPer10K": 4.2},
    {"id": "TN", "name": "Tamil Nadu", "bedsPerLakh": 86, "phcs": 1682, "chcs": 385, "subCentres": 8706, "doctorsAtPHC": 2486, "doctorsPer10K": 12.4},
    {"id": "RJ", "name": "Rajasthan", "bedsPerLakh": 36, "phcs": 2080, "chcs": 579, "subCentres": 14407, "doctorsAtPHC": 2842, "doctorsPer10K": 5.6},
    {"id": "KA", "name": "Karnataka", "bedsPerLakh": 68, "phcs": 2310, "chcs": 207, "subCentres": 8143, "doctorsAtPHC": 2648, "doctorsPer10K": 9.8},
    {"id": "GJ", "name": "Gujarat", "bedsPerLakh": 42, "phcs": 1516, "chcs": 363, "subCentres": 7274, "doctorsAtPHC": 2186, "doctorsPer10K": 7.4},
    {"id": "AP", "name": "Andhra Pradesh", "bedsPerLakh": 48, "phcs": 1147, "chcs": 194, "subCentres": 7458, "doctorsAtPHC": 1842, "doctorsPer10K": 8.6},
    {"id": "TS", "name": "Telangana", "bedsPerLakh": 56, "phcs": 762, "chcs": 116, "subCentres": 4742, "doctorsAtPHC": 1248, "doctorsPer10K": 10.8},
    {"id": "OD", "name": "Odisha", "bedsPerLakh": 24, "phcs": 1226, "chcs": 377, "subCentres": 6688, "doctorsAtPHC": 1486, "doctorsPer10K": 4.8},
    {"id": "KL", "name": "Kerala", "bedsPerLakh": 94, "phcs": 847, "chcs": 234, "subCentres": 5094, "doctorsAtPHC": 1624, "doctorsPer10K": 18.6},
    {"id": "JH", "name": "Jharkhand", "bedsPerLakh": 18, "phcs": 327, "chcs": 188, "subCentres": 3958, "doctorsAtPHC": 486, "doctorsPer10K": 3.2},
    {"id": "AS", "name": "Assam", "bedsPerLakh": 22, "phcs": 975, "chcs": 151, "subCentres": 4621, "doctorsAtPHC": 1086, "doctorsPer10K": 4.6},
    {"id": "PB", "name": "Punjab", "bedsPerLakh": 62, "phcs": 427, "chcs": 150, "subCentres": 2950, "doctorsAtPHC": 864, "doctorsPer10K": 11.4},
    {"id": "CG", "name": "Chhattisgarh", "bedsPerLakh": 20, "phcs": 790, "chcs": 169, "subCentres": 5211, "doctorsAtPHC": 842, "doctorsPer10K": 3.4},
    {"id": "HR", "name": "Haryana", "bedsPerLakh": 38, "phcs": 473, "chcs": 119, "subCentres": 2630, "doctorsAtPHC": 648, "doctorsPer10K": 8.2},
    {"id": "UK", "name": "Uttarakhand", "bedsPerLakh": 42, "phcs": 257, "chcs": 69, "subCentres": 1847, "doctorsAtPHC": 462, "doctorsPer10K": 7.6},
    {"id": "JK", "name": "Jammu & Kashmir", "bedsPerLakh": 34, "phcs": 692, "chcs": 87, "subCentres": 1949, "doctorsAtPHC": 824, "doctorsPer10K": 6.2},
    {"id": "HP", "name": "Himachal Pradesh", "bedsPerLakh": 68, "phcs": 522, "chcs": 79, "subCentres": 2065, "doctorsAtPHC": 648, "doctorsPer10K": 12.8},
    {"id": "DL", "name": "Delhi", "bedsPerLakh": 124, "phcs": 8, "chcs": 2, "subCentres": 18, "doctorsAtPHC": 42, "doctorsPer10K": 24.6},
    {"id": "GA", "name": "Goa", "bedsPerLakh": 148, "phcs": 25, "chcs": 4, "subCentres": 210, "doctorsAtPHC": 86, "doctorsPer10K": 22.4},
    {"id": "TR", "name": "Tripura", "bedsPerLakh": 28, "phcs": 112, "chcs": 22, "subCentres": 1062, "doctorsAtPHC": 186, "doctorsPer10K": 5.4},
    {"id": "MN", "name": "Manipur", "bedsPerLakh": 24, "phcs": 86, "chcs": 16, "subCentres": 420, "doctorsAtPHC": 124, "doctorsPer10K": 5.8},
    {"id": "ML", "name": "Meghalaya", "bedsPerLakh": 18, "phcs": 118, "chcs": 29, "subCentres": 582, "doctorsAtPHC": 142, "doctorsPer10K": 4.2},
    {"id": "NL", "name": "Nagaland", "bedsPerLakh": 16, "phcs": 126, "chcs": 21, "subCentres": 396, "doctorsAtPHC": 108, "doctorsPer10K": 3.8},
    {"id": "MZ", "name": "Mizoram", "bedsPerLakh": 22, "phcs": 57, "chcs": 9, "subCentres": 370, "doctorsAtPHC": 86, "doctorsPer10K": 6.4},
    {"id": "SK", "name": "Sikkim", "bedsPerLakh": 54, "phcs": 24, "chcs": 2, "subCentres": 147, "doctorsAtPHC": 48, "doctorsPer10K": 8.8},
    {"id": "AR", "name": "Arunachal Pradesh", "bedsPerLakh": 14, "phcs": 118, "chcs": 62, "subCentres": 404, "doctorsAtPHC": 142, "doctorsPer10K": 3.2},
]

# ── Immunization Coverage (NFHS-6 2023-24) ────────────────────────
# Source: National Family Health Survey (NFHS-6) 2023-24 — State/UT Fact
# Sheets, IIPS (provisional). https://www.nfhsiips.in/nfhsuser/nfhs6.php
# Children age 12-23 months; NFHS-6 Total (rural+urban) column:
#   fullImmunization: factsheet indicator 44 (fully vaccinated, either
#                     vaccination card or mother's recall)
#   bcg:     indicator 47 (received BCG)
#   measles: indicator 50 (first dose of measles-containing vaccine)
#   dpt3:    indicator 49 (3 doses of pentavalent vaccine)
# National anchors: full 82.6, BCG 95.0, measles-1 91.7, pentavalent-3 89.2.
#
# Note: fullImmunization matches the Census domain's NFHS-6 stateHealth value
# (same factsheet indicator). Per-state values extracted programmatically from
# the factsheet text and validated; fullImmunization cross-checked identical to
# the independent census extraction.
#
# Manipur RETAINED from NFHS-5 (2019-21): NFHS-6 did not survey Manipur, so its
# four values are the only non-NFHS-6 row here (flagged inline).
# ✅ REFRESHED 2026-06 to NFHS-6 (was NFHS-5 2019-21).

IMMUNIZATION_STATES = [
    {"id": "UP", "name": "Uttar Pradesh", "fullImmunization": 81.4, "bcg": 94.3, "measles": 90.4, "dpt3": 88.1},
    {"id": "MH", "name": "Maharashtra", "fullImmunization": 83.4, "bcg": 94.7, "measles": 93.5, "dpt3": 90.4},
    {"id": "BR", "name": "Bihar", "fullImmunization": 77.3, "bcg": 95.3, "measles": 89.9, "dpt3": 87.6},
    {"id": "WB", "name": "West Bengal", "fullImmunization": 88.1, "bcg": 97.3, "measles": 95.3, "dpt3": 93.7},
    {"id": "MP", "name": "Madhya Pradesh", "fullImmunization": 81.5, "bcg": 95.7, "measles": 92.0, "dpt3": 88.6},
    {"id": "TN", "name": "Tamil Nadu", "fullImmunization": 90.0, "bcg": 95.0, "measles": 94.5, "dpt3": 92.8},
    {"id": "RJ", "name": "Rajasthan", "fullImmunization": 80.6, "bcg": 92.9, "measles": 90.3, "dpt3": 87.2},
    {"id": "KA", "name": "Karnataka", "fullImmunization": 90.2, "bcg": 96.4, "measles": 95.6, "dpt3": 93.3},
    {"id": "GJ", "name": "Gujarat", "fullImmunization": 81.7, "bcg": 95.7, "measles": 89.2, "dpt3": 86.6},
    {"id": "AP", "name": "Andhra Pradesh", "fullImmunization": 87.7, "bcg": 96.6, "measles": 96.0, "dpt3": 94.5},
    {"id": "TS", "name": "Telangana", "fullImmunization": 80.9, "bcg": 95.1, "measles": 92.9, "dpt3": 88.7},
    {"id": "OD", "name": "Odisha", "fullImmunization": 90.8, "bcg": 95.3, "measles": 94.0, "dpt3": 93.8},
    {"id": "KL", "name": "Kerala", "fullImmunization": 84.9, "bcg": 96.8, "measles": 92.8, "dpt3": 88.8},
    {"id": "JH", "name": "Jharkhand", "fullImmunization": 78.1, "bcg": 94.9, "measles": 89.5, "dpt3": 87.3},
    {"id": "AS", "name": "Assam", "fullImmunization": 81.7, "bcg": 94.0, "measles": 90.5, "dpt3": 88.6},
    {"id": "PB", "name": "Punjab", "fullImmunization": 77.7, "bcg": 97.8, "measles": 92.3, "dpt3": 86.7},
    {"id": "CG", "name": "Chhattisgarh", "fullImmunization": 77.9, "bcg": 93.2, "measles": 89.9, "dpt3": 85.4},
    {"id": "HR", "name": "Haryana", "fullImmunization": 79.7, "bcg": 94.2, "measles": 90.1, "dpt3": 86.8},
    {"id": "UK", "name": "Uttarakhand", "fullImmunization": 86.0, "bcg": 97.9, "measles": 95.4, "dpt3": 93.7},
    {"id": "JK", "name": "Jammu & Kashmir", "fullImmunization": 89.4, "bcg": 97.5, "measles": 95.0, "dpt3": 93.6},
    {"id": "HP", "name": "Himachal Pradesh", "fullImmunization": 90.1, "bcg": 97.9, "measles": 95.7, "dpt3": 95.2},
    {"id": "DL", "name": "Delhi", "fullImmunization": 80.7, "bcg": 87.3, "measles": 83.9, "dpt3": 82.9},
    {"id": "GA", "name": "Goa", "fullImmunization": 93.8, "bcg": 98.6, "measles": 98.6, "dpt3": 98.6},
    {"id": "TR", "name": "Tripura", "fullImmunization": 74.4, "bcg": 87.0, "measles": 82.7, "dpt3": 80.0},
    {"id": "MN", "name": "Manipur", "fullImmunization": 68.8, "bcg": 95.4, "measles": 76.6, "dpt3": 81.4},  # RETAINED NFHS-5 (NFHS-6 did not survey Manipur)
    {"id": "ML", "name": "Meghalaya", "fullImmunization": 75.3, "bcg": 90.4, "measles": 83.2, "dpt3": 79.3},
    {"id": "NL", "name": "Nagaland", "fullImmunization": 64.3, "bcg": 86.0, "measles": 79.4, "dpt3": 73.4},
    {"id": "MZ", "name": "Mizoram", "fullImmunization": 72.1, "bcg": 92.6, "measles": 89.5, "dpt3": 77.6},
    {"id": "SK", "name": "Sikkim", "fullImmunization": 92.9, "bcg": 96.2, "measles": 94.5, "dpt3": 94.5},
    {"id": "AR", "name": "Arunachal Pradesh", "fullImmunization": 75.9, "bcg": 89.3, "measles": 83.8, "dpt3": 82.0},
]

# ── National headline numbers ──────────────────────────────────────
# Source: NHP 2022 + World Bank 2022
NATIONAL_TOTALS = {
    "hospitalBedsPer1000": 0.5,         # NHP 2022 (govt hospitals only)
    "physiciansPer1000": 0.7,           # World Bank 2022
    "healthExpGDP": 3.3,                # World Bank 2021 (latest)
    "outOfPocketPct": 45.1,              # World Bank 2021 (SH.XPD.OOPC.CH.ZS = 45.11)
    "dptImmunization": 91.0,            # World Bank 2023
    "tbIncidence": 195.0,               # WHO Global TB Report 2023 (India, per 100K) — was 199
}
