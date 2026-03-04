"""
Curated healthcare data from authoritative Indian government sources.

Sources:
  - National Health Profile 2022 (NHP 2022)
    Central Bureau of Health Intelligence (CBHI), MoHFW
    https://cbhidghs.mohfw.gov.in/
  - NFHS-5 (2019-21) State Factsheets — Immunization coverage
    International Institute for Population Sciences (IIPS)
    https://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf

Data notes:
  - NHP 2022 is the latest National Health Profile.
  - State infrastructure data (beds, PHCs, CHCs) from NHP 2022 / Rural Health Statistics.
  - DoctorsPer10K is calculated from doctors at PHCs/CHCs and population.
  - Immunization data from NFHS-5 covers children aged 12-23 months.
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

# ── Immunization Coverage (NFHS-5 2019-21) ────────────────────────
# Source: NFHS-5 State Factsheets — Children 12-23 months
# fullImmunization: BCG + 3 DPT + 3 OPV + measles/MR
# bcg: BCG vaccine coverage (%)
# measles: Measles/MR first dose (%)
# dpt3: Third dose of DPT/Pentavalent (%)
#
# Note: These overlap with Census domain's NFHS-5 stateHealth data,
# but here we focus specifically on immunization metrics for the
# healthcare infrastructure story.
#
# ✅ VERIFIED 2026-03-04: All values from pratapvardhan/NFHS-5 CSV dataset
# (DOI: 10.7910/DVN/42WNZF), cross-checked against rchiips.org state factsheets.
# National average fullImmunization = 76.4%.

IMMUNIZATION_STATES = [
    {"id": "UP", "name": "Uttar Pradesh", "fullImmunization": 69.6, "bcg": 93.2, "measles": 83.3, "dpt3": 80.8},
    {"id": "MH", "name": "Maharashtra", "fullImmunization": 73.5, "bcg": 93.8, "measles": 84.7, "dpt3": 83.4},
    {"id": "BR", "name": "Bihar", "fullImmunization": 71.0, "bcg": 95.5, "measles": 85.7, "dpt3": 85.0},
    {"id": "WB", "name": "West Bengal", "fullImmunization": 87.8, "bcg": 98.6, "measles": 94.4, "dpt3": 95.0},
    {"id": "MP", "name": "Madhya Pradesh", "fullImmunization": 77.1, "bcg": 95.4, "measles": 88.0, "dpt3": 87.4},
    {"id": "TN", "name": "Tamil Nadu", "fullImmunization": 89.2, "bcg": 97.6, "measles": 95.8, "dpt3": 94.8},
    {"id": "RJ", "name": "Rajasthan", "fullImmunization": 80.4, "bcg": 95.6, "measles": 91.2, "dpt3": 89.3},
    {"id": "KA", "name": "Karnataka", "fullImmunization": 84.1, "bcg": 97.2, "measles": 91.2, "dpt3": 92.1},
    {"id": "GJ", "name": "Gujarat", "fullImmunization": 76.3, "bcg": 94.7, "measles": 86.8, "dpt3": 86.1},
    {"id": "AP", "name": "Andhra Pradesh", "fullImmunization": 73.0, "bcg": 94.6, "measles": 87.1, "dpt3": 88.4},
    {"id": "TS", "name": "Telangana", "fullImmunization": 79.1, "bcg": 93.5, "measles": 90.6, "dpt3": 89.2},
    {"id": "OD", "name": "Odisha", "fullImmunization": 90.5, "bcg": 97.3, "measles": 95.9, "dpt3": 94.7},
    {"id": "KL", "name": "Kerala", "fullImmunization": 77.8, "bcg": 97.6, "measles": 88.3, "dpt3": 85.2},
    {"id": "JH", "name": "Jharkhand", "fullImmunization": 73.9, "bcg": 95.0, "measles": 86.7, "dpt3": 85.6},
    {"id": "AS", "name": "Assam", "fullImmunization": 66.4, "bcg": 92.5, "measles": 82.8, "dpt3": 81.7},
    {"id": "PB", "name": "Punjab", "fullImmunization": 76.2, "bcg": 95.3, "measles": 88.1, "dpt3": 88.5},
    {"id": "CG", "name": "Chhattisgarh", "fullImmunization": 79.7, "bcg": 96.4, "measles": 90.2, "dpt3": 87.5},
    {"id": "HR", "name": "Haryana", "fullImmunization": 76.9, "bcg": 95.0, "measles": 89.4, "dpt3": 88.5},
    {"id": "UK", "name": "Uttarakhand", "fullImmunization": 80.8, "bcg": 95.2, "measles": 90.6, "dpt3": 89.7},
    {"id": "JK", "name": "Jammu & Kashmir", "fullImmunization": 86.2, "bcg": 95.1, "measles": 91.7, "dpt3": 92.8},
    {"id": "HP", "name": "Himachal Pradesh", "fullImmunization": 89.3, "bcg": 98.2, "measles": 95.9, "dpt3": 96.1},
    {"id": "DL", "name": "Delhi", "fullImmunization": 76.0, "bcg": 96.8, "measles": 90.1, "dpt3": 85.0},
    {"id": "GA", "name": "Goa", "fullImmunization": 81.9, "bcg": 97.9, "measles": 92.9, "dpt3": 90.8},
    {"id": "TR", "name": "Tripura", "fullImmunization": 69.5, "bcg": 94.7, "measles": 86.3, "dpt3": 85.9},
    {"id": "MN", "name": "Manipur", "fullImmunization": 68.8, "bcg": 95.4, "measles": 76.6, "dpt3": 81.4},
    {"id": "ML", "name": "Meghalaya", "fullImmunization": 63.8, "bcg": 89.3, "measles": 72.5, "dpt3": 73.1},
    {"id": "NL", "name": "Nagaland", "fullImmunization": 57.9, "bcg": 85.5, "measles": 73.8, "dpt3": 71.5},
    {"id": "MZ", "name": "Mizoram", "fullImmunization": 72.5, "bcg": 83.4, "measles": 80.9, "dpt3": 80.7},
    {"id": "SK", "name": "Sikkim", "fullImmunization": 80.6, "bcg": 96.6, "measles": 90.5, "dpt3": 91.4},
    {"id": "AR", "name": "Arunachal Pradesh", "fullImmunization": 64.9, "bcg": 87.9, "measles": 80.7, "dpt3": 77.7},
]

# ── National headline numbers ──────────────────────────────────────
# Source: NHP 2022 + World Bank 2022
NATIONAL_TOTALS = {
    "hospitalBedsPer1000": 0.5,         # NHP 2022 (govt hospitals only)
    "physiciansPer1000": 0.7,           # World Bank 2022
    "healthExpGDP": 3.3,                # World Bank 2021 (latest)
    "outOfPocketPct": 45.1,              # World Bank 2021 (SH.XPD.OOPC.CH.ZS = 45.11)
    "dptImmunization": 91.0,            # World Bank 2023
    "tbIncidence": 199.0,               # WHO/World Bank 2023, per 100K
}
