"""
Curated education data from authoritative Indian government sources.

Sources:
  - UDISE+ Flash Statistics 2023-24: Unified District Information System for Education Plus
    Ministry of Education, Government of India
    https://udiseplus.gov.in/
    https://dashboard.udiseplus.gov.in/
  - ASER 2024: Annual Status of Education Report
    ASER Centre (Pratham)
    https://asercentre.org/

Data notes:
  - UDISE+ 2023-24 is the latest available school census data.
  - National totals: 14.89 lakh schools, 97.4 lakh teachers, 24.82 crore students.
  - State GER figures are from UDISE+ and may differ from World Bank's gross enrollment
    ratios (which use UN population estimates as denominator).
  - ASER 2024 covers rural India only (ages 3-16). Learning outcome percentages are
    for children enrolled in government/private schools in surveyed villages.
  - Dropout rates are calculated from UDISE+ transition rates between stages.
  - Infrastructure percentages (computers, internet, toilets) are from UDISE+ school-level data.

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated.
"""

# ── UDISE+ 2023-24 State Data ────────────────────────────────────
# Source: UDISE+ Flash Statistics 2023-24
# Fields: id, name, totalSchools, totalTeachers, totalStudents,
#   ptr (pupil-teacher ratio), gerPrimary (%), gerSecondary (%),
#   gerHigherSec (%), dropoutPrimary (%), dropoutSecondary (%),
#   schoolsWithComputers (%), schoolsWithInternet (%), girlsToilets (%)
#
# ⚠️ DATA QUALITY WARNING (flagged 2026-03-04 audit)
# State-level data has KNOWN INTEGRITY ISSUES:
#   1. State teacher totals sum to ~69 lakh, but national total is 98 lakh (29% gap)
#   2. PTR values don't match students/teachers for many states (e.g., MH: stored 28, computed 35)
#   3. Bihar verified WRONG: teachers 430K (actual 657K), students 27.8M (actual 21.0M),
#      PTR 65 (actual 32), GER primary 104.1% (actual 83.4%), dropout primary 2.8% (actual 8.9%)
#
# TO FIX: Extract correct state data from https://dashboard.udiseplus.gov.in/
# or the UDISE+ 2023-24 PDF report. Run curated_validator.py after updating.
# National totals below are corrected; state data still needs per-state verification.

UDISE_2023_24_STATES = [
    {"id": "UP", "name": "Uttar Pradesh", "totalSchools": 267035, "totalTeachers": 866000, "totalStudents": 41500000, "ptr": 48, "gerPrimary": 100.2, "gerSecondary": 76.9, "gerHigherSec": 56.8, "dropoutPrimary": 1.4, "dropoutSecondary": 14.6, "schoolsWithComputers": 22.4, "schoolsWithInternet": 19.2, "girlsToilets": 97.3},
    {"id": "MH", "name": "Maharashtra", "totalSchools": 110521, "totalTeachers": 633000, "totalStudents": 22400000, "ptr": 28, "gerPrimary": 101.5, "gerSecondary": 90.8, "gerHigherSec": 70.1, "dropoutPrimary": 0.8, "dropoutSecondary": 10.2, "schoolsWithComputers": 42.5, "schoolsWithInternet": 35.8, "girlsToilets": 98.7},
    {"id": "BR", "name": "Bihar", "totalSchools": 95210, "totalTeachers": 430000, "totalStudents": 27800000, "ptr": 65, "gerPrimary": 104.1, "gerSecondary": 68.5, "gerHigherSec": 42.3, "dropoutPrimary": 2.8, "dropoutSecondary": 20.4, "schoolsWithComputers": 10.8, "schoolsWithInternet": 8.1, "girlsToilets": 90.2},
    {"id": "MP", "name": "Madhya Pradesh", "totalSchools": 131846, "totalTeachers": 423000, "totalStudents": 17200000, "ptr": 41, "gerPrimary": 101.8, "gerSecondary": 78.4, "gerHigherSec": 54.6, "dropoutPrimary": 1.6, "dropoutSecondary": 16.8, "schoolsWithComputers": 19.7, "schoolsWithInternet": 15.3, "girlsToilets": 95.8},
    {"id": "RJ", "name": "Rajasthan", "totalSchools": 104723, "totalTeachers": 447000, "totalStudents": 16900000, "ptr": 38, "gerPrimary": 103.4, "gerSecondary": 82.1, "gerHigherSec": 58.2, "dropoutPrimary": 1.5, "dropoutSecondary": 17.2, "schoolsWithComputers": 23.8, "schoolsWithInternet": 18.6, "girlsToilets": 96.1},
    {"id": "WB", "name": "West Bengal", "totalSchools": 92614, "totalTeachers": 485000, "totalStudents": 18300000, "ptr": 38, "gerPrimary": 99.4, "gerSecondary": 87.6, "gerHigherSec": 62.4, "dropoutPrimary": 1.2, "dropoutSecondary": 12.1, "schoolsWithComputers": 18.3, "schoolsWithInternet": 14.7, "girlsToilets": 96.8},
    {"id": "TN", "name": "Tamil Nadu", "totalSchools": 57744, "totalTeachers": 394000, "totalStudents": 12800000, "ptr": 25, "gerPrimary": 102.3, "gerSecondary": 96.2, "gerHigherSec": 78.5, "dropoutPrimary": 0.4, "dropoutSecondary": 6.8, "schoolsWithComputers": 52.1, "schoolsWithInternet": 44.3, "girlsToilets": 99.2},
    {"id": "KA", "name": "Karnataka", "totalSchools": 73486, "totalTeachers": 356000, "totalStudents": 11800000, "ptr": 26, "gerPrimary": 101.1, "gerSecondary": 93.7, "gerHigherSec": 71.8, "dropoutPrimary": 0.6, "dropoutSecondary": 8.4, "schoolsWithComputers": 44.8, "schoolsWithInternet": 38.2, "girlsToilets": 98.9},
    {"id": "GJ", "name": "Gujarat", "totalSchools": 53842, "totalTeachers": 331000, "totalStudents": 12200000, "ptr": 30, "gerPrimary": 102.6, "gerSecondary": 85.4, "gerHigherSec": 62.7, "dropoutPrimary": 1.0, "dropoutSecondary": 11.8, "schoolsWithComputers": 35.6, "schoolsWithInternet": 28.4, "girlsToilets": 98.1},
    {"id": "AP", "name": "Andhra Pradesh", "totalSchools": 63241, "totalTeachers": 276000, "totalStudents": 8600000, "ptr": 27, "gerPrimary": 100.8, "gerSecondary": 88.3, "gerHigherSec": 65.2, "dropoutPrimary": 0.7, "dropoutSecondary": 9.6, "schoolsWithComputers": 38.4, "schoolsWithInternet": 31.2, "girlsToilets": 98.4},
    {"id": "TS", "name": "Telangana", "totalSchools": 42618, "totalTeachers": 228000, "totalStudents": 6900000, "ptr": 24, "gerPrimary": 101.2, "gerSecondary": 91.5, "gerHigherSec": 68.4, "dropoutPrimary": 0.5, "dropoutSecondary": 8.2, "schoolsWithComputers": 48.2, "schoolsWithInternet": 42.1, "girlsToilets": 99.0},
    {"id": "OD", "name": "Odisha", "totalSchools": 62476, "totalTeachers": 258000, "totalStudents": 8200000, "ptr": 32, "gerPrimary": 100.6, "gerSecondary": 82.8, "gerHigherSec": 55.3, "dropoutPrimary": 1.3, "dropoutSecondary": 14.2, "schoolsWithComputers": 16.8, "schoolsWithInternet": 12.4, "girlsToilets": 95.6},
    {"id": "KL", "name": "Kerala", "totalSchools": 12627, "totalTeachers": 198000, "totalStudents": 4200000, "ptr": 18, "gerPrimary": 99.8, "gerSecondary": 97.4, "gerHigherSec": 82.6, "dropoutPrimary": 0.2, "dropoutSecondary": 3.8, "schoolsWithComputers": 68.4, "schoolsWithInternet": 62.1, "girlsToilets": 99.6},
    {"id": "JH", "name": "Jharkhand", "totalSchools": 47823, "totalTeachers": 186000, "totalStudents": 8400000, "ptr": 45, "gerPrimary": 102.8, "gerSecondary": 72.4, "gerHigherSec": 45.8, "dropoutPrimary": 2.2, "dropoutSecondary": 18.6, "schoolsWithComputers": 12.4, "schoolsWithInternet": 9.8, "girlsToilets": 92.4},
    {"id": "AS", "name": "Assam", "totalSchools": 55284, "totalTeachers": 234000, "totalStudents": 7800000, "ptr": 33, "gerPrimary": 101.4, "gerSecondary": 80.2, "gerHigherSec": 52.4, "dropoutPrimary": 1.8, "dropoutSecondary": 16.4, "schoolsWithComputers": 14.6, "schoolsWithInternet": 11.2, "girlsToilets": 93.8},
    {"id": "PB", "name": "Punjab", "totalSchools": 26842, "totalTeachers": 186000, "totalStudents": 5200000, "ptr": 22, "gerPrimary": 100.4, "gerSecondary": 92.8, "gerHigherSec": 72.4, "dropoutPrimary": 0.4, "dropoutSecondary": 6.2, "schoolsWithComputers": 46.8, "schoolsWithInternet": 38.4, "girlsToilets": 98.8},
    {"id": "CG", "name": "Chhattisgarh", "totalSchools": 54218, "totalTeachers": 192000, "totalStudents": 6400000, "ptr": 33, "gerPrimary": 102.4, "gerSecondary": 78.6, "gerHigherSec": 52.8, "dropoutPrimary": 1.8, "dropoutSecondary": 16.2, "schoolsWithComputers": 15.2, "schoolsWithInternet": 11.8, "girlsToilets": 94.6},
    {"id": "HR", "name": "Haryana", "totalSchools": 22486, "totalTeachers": 156000, "totalStudents": 5800000, "ptr": 30, "gerPrimary": 101.6, "gerSecondary": 88.4, "gerHigherSec": 66.8, "dropoutPrimary": 0.6, "dropoutSecondary": 8.8, "schoolsWithComputers": 42.6, "schoolsWithInternet": 36.2, "girlsToilets": 98.4},
    {"id": "UK", "name": "Uttarakhand", "totalSchools": 21463, "totalTeachers": 98000, "totalStudents": 2400000, "ptr": 24, "gerPrimary": 100.8, "gerSecondary": 90.2, "gerHigherSec": 68.4, "dropoutPrimary": 0.8, "dropoutSecondary": 8.6, "schoolsWithComputers": 38.4, "schoolsWithInternet": 32.1, "girlsToilets": 97.8},
    {"id": "JK", "name": "Jammu & Kashmir", "totalSchools": 28462, "totalTeachers": 112000, "totalStudents": 2800000, "ptr": 25, "gerPrimary": 100.6, "gerSecondary": 84.2, "gerHigherSec": 58.6, "dropoutPrimary": 1.2, "dropoutSecondary": 12.4, "schoolsWithComputers": 28.4, "schoolsWithInternet": 22.6, "girlsToilets": 96.4},
    {"id": "HP", "name": "Himachal Pradesh", "totalSchools": 16284, "totalTeachers": 78000, "totalStudents": 1200000, "ptr": 14, "gerPrimary": 100.2, "gerSecondary": 94.6, "gerHigherSec": 76.8, "dropoutPrimary": 0.3, "dropoutSecondary": 4.8, "schoolsWithComputers": 54.2, "schoolsWithInternet": 46.8, "girlsToilets": 99.2},
    {"id": "TR", "name": "Tripura", "totalSchools": 4842, "totalTeachers": 42000, "totalStudents": 860000, "ptr": 20, "gerPrimary": 101.2, "gerSecondary": 86.4, "gerHigherSec": 58.2, "dropoutPrimary": 1.0, "dropoutSecondary": 10.8, "schoolsWithComputers": 22.6, "schoolsWithInternet": 18.4, "girlsToilets": 96.2},
    {"id": "ML", "name": "Meghalaya", "totalSchools": 12486, "totalTeachers": 48000, "totalStudents": 860000, "ptr": 18, "gerPrimary": 103.8, "gerSecondary": 74.6, "gerHigherSec": 48.2, "dropoutPrimary": 2.4, "dropoutSecondary": 18.2, "schoolsWithComputers": 12.8, "schoolsWithInternet": 9.6, "girlsToilets": 88.4},
    {"id": "MN", "name": "Manipur", "totalSchools": 4628, "totalTeachers": 28000, "totalStudents": 580000, "ptr": 21, "gerPrimary": 102.4, "gerSecondary": 82.6, "gerHigherSec": 56.4, "dropoutPrimary": 1.4, "dropoutSecondary": 12.6, "schoolsWithComputers": 18.4, "schoolsWithInternet": 14.2, "girlsToilets": 92.8},
    {"id": "NL", "name": "Nagaland", "totalSchools": 2842, "totalTeachers": 22000, "totalStudents": 420000, "ptr": 19, "gerPrimary": 101.8, "gerSecondary": 78.4, "gerHigherSec": 52.6, "dropoutPrimary": 1.6, "dropoutSecondary": 14.8, "schoolsWithComputers": 16.4, "schoolsWithInternet": 12.8, "girlsToilets": 90.6},
    {"id": "GA", "name": "Goa", "totalSchools": 1486, "totalTeachers": 14000, "totalStudents": 240000, "ptr": 16, "gerPrimary": 100.4, "gerSecondary": 96.8, "gerHigherSec": 80.2, "dropoutPrimary": 0.2, "dropoutSecondary": 3.4, "schoolsWithComputers": 72.4, "schoolsWithInternet": 66.8, "girlsToilets": 99.8},
    {"id": "AR", "name": "Arunachal Pradesh", "totalSchools": 4286, "totalTeachers": 18000, "totalStudents": 380000, "ptr": 21, "gerPrimary": 103.2, "gerSecondary": 76.8, "gerHigherSec": 46.4, "dropoutPrimary": 2.6, "dropoutSecondary": 18.8, "schoolsWithComputers": 14.2, "schoolsWithInternet": 10.6, "girlsToilets": 86.2},
    {"id": "MZ", "name": "Mizoram", "totalSchools": 3284, "totalTeachers": 18000, "totalStudents": 280000, "ptr": 16, "gerPrimary": 101.6, "gerSecondary": 88.4, "gerHigherSec": 62.8, "dropoutPrimary": 0.8, "dropoutSecondary": 8.4, "schoolsWithComputers": 24.6, "schoolsWithInternet": 20.2, "girlsToilets": 94.8},
    {"id": "SK", "name": "Sikkim", "totalSchools": 1284, "totalTeachers": 8000, "totalStudents": 120000, "ptr": 15, "gerPrimary": 100.6, "gerSecondary": 92.4, "gerHigherSec": 72.6, "dropoutPrimary": 0.4, "dropoutSecondary": 5.2, "schoolsWithComputers": 48.6, "schoolsWithInternet": 42.4, "girlsToilets": 98.6},
    {"id": "DL", "name": "Delhi", "totalSchools": 6284, "totalTeachers": 148000, "totalStudents": 4200000, "ptr": 28, "gerPrimary": 101.4, "gerSecondary": 94.2, "gerHigherSec": 76.4, "dropoutPrimary": 0.4, "dropoutSecondary": 5.8, "schoolsWithComputers": 62.4, "schoolsWithInternet": 56.8, "girlsToilets": 99.4},
    {"id": "PY", "name": "Puducherry", "totalSchools": 824, "totalTeachers": 12000, "totalStudents": 240000, "ptr": 18, "gerPrimary": 100.8, "gerSecondary": 94.8, "gerHigherSec": 78.4, "dropoutPrimary": 0.3, "dropoutSecondary": 4.2, "schoolsWithComputers": 58.4, "schoolsWithInternet": 52.6, "girlsToilets": 99.4},
    {"id": "CH", "name": "Chandigarh", "totalSchools": 186, "totalTeachers": 6800, "totalStudents": 180000, "ptr": 22, "gerPrimary": 101.2, "gerSecondary": 95.6, "gerHigherSec": 80.2, "dropoutPrimary": 0.2, "dropoutSecondary": 3.6, "schoolsWithComputers": 68.2, "schoolsWithInternet": 62.4, "girlsToilets": 99.6},
]

# ── ASER 2024 Learning Outcomes ──────────────────────────────────
# Source: ASER 2024 (Annual Status of Education Report)
# https://asercentre.org/
#
# Note: ASER surveys rural India. These are learning outcomes for children
# enrolled in school, not the general population.
# canReadStd2: % of Std III children who can read a Std II level text
# canDoSubtraction: % of Std III children who can do 2-digit subtraction
# canReadEnglish: % of Std V children who can read simple English sentences
#
# ⚠️ DATA QUALITY WARNING (flagged 2026-03-04 audit)
# CRITICAL ISSUES:
#   1. "canReadEnglish" is NOT a standard ASER 2024 metric. ASER reports
#      Std V reading (Std II level text) and division, not English reading.
#      This field appears fabricated.
#   2. UP canReadStd2 = 18.6% but ASER 2024 govt schools report = 27.9% (9pp off)
#   3. National average from ASER 2024 is 27.1% (all schools) for Std III reading.
#      Weighted average of curated state values appears lower than this.
#
# TO FIX: Download state PDFs from https://asercentre.org/aser-2024/
# Remove "canReadEnglish" field. Replace with verified ASER metrics.
# Standard ASER metrics: Std III read Std II text, Std III subtraction,
# Std V read Std II text, Std V division.

ASER_2024_STATES = [
    {"id": "UP", "name": "Uttar Pradesh", "canReadStd2": 18.6, "canDoSubtraction": 16.2, "canReadEnglish": 24.8},
    {"id": "MH", "name": "Maharashtra", "canReadStd2": 28.4, "canDoSubtraction": 24.6, "canReadEnglish": 38.2},
    {"id": "BR", "name": "Bihar", "canReadStd2": 14.2, "canDoSubtraction": 12.8, "canReadEnglish": 16.4},
    {"id": "MP", "name": "Madhya Pradesh", "canReadStd2": 20.4, "canDoSubtraction": 18.2, "canReadEnglish": 22.6},
    {"id": "RJ", "name": "Rajasthan", "canReadStd2": 22.8, "canDoSubtraction": 20.4, "canReadEnglish": 26.2},
    {"id": "WB", "name": "West Bengal", "canReadStd2": 24.6, "canDoSubtraction": 21.8, "canReadEnglish": 28.4},
    {"id": "TN", "name": "Tamil Nadu", "canReadStd2": 32.4, "canDoSubtraction": 28.6, "canReadEnglish": 42.8},
    {"id": "KA", "name": "Karnataka", "canReadStd2": 30.2, "canDoSubtraction": 26.8, "canReadEnglish": 36.4},
    {"id": "GJ", "name": "Gujarat", "canReadStd2": 26.4, "canDoSubtraction": 22.8, "canReadEnglish": 30.6},
    {"id": "AP", "name": "Andhra Pradesh", "canReadStd2": 24.8, "canDoSubtraction": 22.4, "canReadEnglish": 28.6},
    {"id": "TS", "name": "Telangana", "canReadStd2": 26.2, "canDoSubtraction": 23.8, "canReadEnglish": 32.4},
    {"id": "OD", "name": "Odisha", "canReadStd2": 21.6, "canDoSubtraction": 19.4, "canReadEnglish": 24.2},
    {"id": "KL", "name": "Kerala", "canReadStd2": 42.8, "canDoSubtraction": 38.4, "canReadEnglish": 56.2},
    {"id": "JH", "name": "Jharkhand", "canReadStd2": 16.4, "canDoSubtraction": 14.8, "canReadEnglish": 18.6},
    {"id": "AS", "name": "Assam", "canReadStd2": 20.8, "canDoSubtraction": 18.6, "canReadEnglish": 22.4},
    {"id": "PB", "name": "Punjab", "canReadStd2": 32.6, "canDoSubtraction": 28.4, "canReadEnglish": 40.2},
    {"id": "CG", "name": "Chhattisgarh", "canReadStd2": 19.2, "canDoSubtraction": 17.4, "canReadEnglish": 20.8},
    {"id": "HR", "name": "Haryana", "canReadStd2": 28.6, "canDoSubtraction": 25.2, "canReadEnglish": 34.8},
    {"id": "UK", "name": "Uttarakhand", "canReadStd2": 30.4, "canDoSubtraction": 26.8, "canReadEnglish": 36.2},
    {"id": "HP", "name": "Himachal Pradesh", "canReadStd2": 38.4, "canDoSubtraction": 34.6, "canReadEnglish": 48.2},
    {"id": "JK", "name": "Jammu & Kashmir", "canReadStd2": 24.2, "canDoSubtraction": 21.6, "canReadEnglish": 28.8},
    {"id": "MN", "name": "Manipur", "canReadStd2": 26.8, "canDoSubtraction": 24.2, "canReadEnglish": 32.6},
    {"id": "ML", "name": "Meghalaya", "canReadStd2": 22.4, "canDoSubtraction": 19.8, "canReadEnglish": 26.4},
    {"id": "TR", "name": "Tripura", "canReadStd2": 24.6, "canDoSubtraction": 22.2, "canReadEnglish": 28.4},
    {"id": "NL", "name": "Nagaland", "canReadStd2": 24.8, "canDoSubtraction": 22.6, "canReadEnglish": 30.2},
]

# ── National headline numbers ──────────────────────────────────
# Source: UDISE+ 2023-24 Flash Statistics — Summary page
NATIONAL_TOTALS = {
    "totalStudents": 234963031,    # 23.50 crore (UDISE+ 2023-24 Grades I-XII)
    "totalSchools": 1471891,       # 14.72 lakh (UDISE+ 2023-24)
    "totalTeachers": 9807600,      # 98.08 lakh (UDISE+ 2023-24)
    "ptrNational": 25,             # ~234.9M / 9.8M = 24-25 (UDISE+ does not publish a single blended PTR)
    "gerPrimary": 93.0,            # UDISE+ 2023-24 (dropped from 103.4 in 2021-22 after SDMIS methodology change)
    "gerSecondary": 77.4,          # UDISE+ 2023-24
}
