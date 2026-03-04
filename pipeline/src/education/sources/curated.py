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
  - National totals: 14.72 lakh schools, 98.08 lakh teachers, 24.80 crore students (Pre-Primary to HS).
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
# ✅ VERIFIED 2026-03-04: All state data cross-checked against UDISE+ 2023-24 PDF
# Tables 2.2 (schools/enrolments/teachers/PTR), 2.5 (infrastructure counts),
# 6.1 (GER by level), 6.13 (dropout rates).
# Infrastructure %s computed from Table 2.5 raw counts / total schools × 100.
# Note: Some GER values >100% are legitimate (children from neighboring areas enrolled).

UDISE_2023_24_STATES = [
    # Source: UDISE+ 2023-24, Tables 2.2, 2.5, 6.1, 6.13 (verified against PDF)
    # Infrastructure %s computed from Table 2.5 raw counts / total schools × 100
    # GER from Table 6.1 (All Social Groups, Total column)
    # Dropout from Table 6.13 (Total column)
    {"id": "UP", "name": "Uttar Pradesh", "totalSchools": 255087, "totalTeachers": 1538479, "totalStudents": 41662794, "ptr": 27, "gerPrimary": 82.0, "gerSecondary": 62.4, "gerHigherSec": 53.2, "dropoutPrimary": 1.7, "dropoutSecondary": 9.8, "schoolsWithComputers": 40.2, "schoolsWithInternet": 38.6, "girlsToilets": 96.2},
    {"id": "MH", "name": "Maharashtra", "totalSchools": 108237, "totalTeachers": 738114, "totalStudents": 21375970, "ptr": 29, "gerPrimary": 100.1, "gerSecondary": 92.6, "gerHigherSec": 69.2, "dropoutPrimary": 0.0, "dropoutSecondary": 11.0, "schoolsWithComputers": 81.4, "schoolsWithInternet": 67.6, "girlsToilets": 98.7},
    {"id": "BR", "name": "Bihar", "totalSchools": 94686, "totalTeachers": 657063, "totalStudents": 21348149, "ptr": 32, "gerPrimary": 83.4, "gerSecondary": 45.6, "gerHigherSec": 30.0, "dropoutPrimary": 8.9, "dropoutSecondary": 25.6, "schoolsWithComputers": 19.9, "schoolsWithInternet": 18.4, "girlsToilets": 92.1},
    {"id": "MP", "name": "Madhya Pradesh", "totalSchools": 123412, "totalTeachers": 639525, "totalStudents": 15361543, "ptr": 24, "gerPrimary": 78.9, "gerSecondary": 66.4, "gerHigherSec": 43.9, "dropoutPrimary": 1.0, "dropoutSecondary": 19.6, "schoolsWithComputers": 49.0, "schoolsWithInternet": 43.4, "girlsToilets": 93.8},
    {"id": "RJ", "name": "Rajasthan", "totalSchools": 107757, "totalTeachers": 775745, "totalStudents": 16786065, "ptr": 22, "gerPrimary": 93.7, "gerSecondary": 79.0, "gerHigherSec": 57.4, "dropoutPrimary": 7.6, "dropoutSecondary": 12.2, "schoolsWithComputers": 51.5, "schoolsWithInternet": 46.4, "girlsToilets": 96.5},
    {"id": "WB", "name": "West Bengal", "totalSchools": 93945, "totalTeachers": 576557, "totalStudents": 18015525, "ptr": 31, "gerPrimary": 108.8, "gerSecondary": 104.2, "gerHigherSec": 66.1, "dropoutPrimary": 0.0, "dropoutSecondary": 21.5, "schoolsWithComputers": 22.3, "schoolsWithInternet": 17.5, "girlsToilets": 99.3},
    {"id": "TN", "name": "Tamil Nadu", "totalSchools": 58722, "totalTeachers": 550558, "totalStudents": 12993050, "ptr": 24, "gerPrimary": 94.6, "gerSecondary": 98.1, "gerHigherSec": 82.9, "dropoutPrimary": 0.0, "dropoutSecondary": 10.8, "schoolsWithComputers": 72.6, "schoolsWithInternet": 68.0, "girlsToilets": 98.9},
    {"id": "KA", "name": "Karnataka", "totalSchools": 75869, "totalTeachers": 433942, "totalStudents": 11926303, "ptr": 27, "gerPrimary": 105.8, "gerSecondary": 100.2, "gerHigherSec": 58.5, "dropoutPrimary": 1.7, "dropoutSecondary": 15.2, "schoolsWithComputers": 52.9, "schoolsWithInternet": 46.9, "girlsToilets": 99.0},
    {"id": "GJ", "name": "Gujarat", "totalSchools": 53626, "totalTeachers": 394053, "totalStudents": 11496709, "ptr": 29, "gerPrimary": 78.7, "gerSecondary": 72.5, "gerHigherSec": 43.0, "dropoutPrimary": 0.1, "dropoutSecondary": 10.2, "schoolsWithComputers": 98.3, "schoolsWithInternet": 94.1, "girlsToilets": 96.5},
    {"id": "AP", "name": "Andhra Pradesh", "totalSchools": 61373, "totalTeachers": 338293, "totalStudents": 8741885, "ptr": 26, "gerPrimary": 95.9, "gerSecondary": 95.9, "gerHigherSec": 65.4, "dropoutPrimary": 0.2, "dropoutSecondary": 14.2, "schoolsWithComputers": 87.3, "schoolsWithInternet": 58.0, "girlsToilets": 98.2},
    {"id": "TS", "name": "Telangana", "totalSchools": 42901, "totalTeachers": 341460, "totalStudents": 7293644, "ptr": 21, "gerPrimary": 110.0, "gerSecondary": 98.7, "gerHigherSec": 72.3, "dropoutPrimary": 0.0, "dropoutSecondary": 13.3, "schoolsWithComputers": 77.9, "schoolsWithInternet": 70.2, "girlsToilets": 92.1},
    {"id": "OD", "name": "Odisha", "totalSchools": 61693, "totalTeachers": 335496, "totalStudents": 7756910, "ptr": 23, "gerPrimary": 96.0, "gerSecondary": 82.6, "gerHigherSec": 58.6, "dropoutPrimary": 0.0, "dropoutSecondary": 14.1, "schoolsWithComputers": 59.3, "schoolsWithInternet": 49.1, "girlsToilets": 99.4},
    {"id": "KL", "name": "Kerala", "totalSchools": 15864, "totalTeachers": 291096, "totalStudents": 6281704, "ptr": 22, "gerPrimary": 95.3, "gerSecondary": 99.1, "gerHigherSec": 88.1, "dropoutPrimary": 0.0, "dropoutSecondary": 4.3, "schoolsWithComputers": 99.4, "schoolsWithInternet": 92.1, "girlsToilets": 99.8},
    {"id": "JH", "name": "Jharkhand", "totalSchools": 44475, "totalTeachers": 206591, "totalStudents": 7143255, "ptr": 35, "gerPrimary": 92.0, "gerSecondary": 64.7, "gerHigherSec": 41.3, "dropoutPrimary": 0.9, "dropoutSecondary": 15.2, "schoolsWithComputers": 75.3, "schoolsWithInternet": 52.7, "girlsToilets": 98.6},
    {"id": "AS", "name": "Assam", "totalSchools": 56630, "totalTeachers": 342199, "totalStudents": 6922533, "ptr": 20, "gerPrimary": 107.6, "gerSecondary": 85.5, "gerHigherSec": 37.6, "dropoutPrimary": 6.2, "dropoutSecondary": 20.4, "schoolsWithComputers": 68.1, "schoolsWithInternet": 26.3, "girlsToilets": 92.3},
    {"id": "PB", "name": "Punjab", "totalSchools": 27404, "totalTeachers": 273092, "totalStudents": 5988681, "ptr": 22, "gerPrimary": 107.3, "gerSecondary": 94.2, "gerHigherSec": 79.2, "dropoutPrimary": 0.1, "dropoutSecondary": 6.9, "schoolsWithComputers": 98.8, "schoolsWithInternet": 75.4, "girlsToilets": 100.0},
    {"id": "CG", "name": "Chhattisgarh", "totalSchools": 56615, "totalTeachers": 278798, "totalStudents": 5776548, "ptr": 21, "gerPrimary": 88.9, "gerSecondary": 72.8, "gerHigherSec": 51.9, "dropoutPrimary": 1.8, "dropoutSecondary": 20.2, "schoolsWithComputers": 67.3, "schoolsWithInternet": 61.2, "girlsToilets": 97.4},
    {"id": "HR", "name": "Haryana", "totalSchools": 23517, "totalTeachers": 250909, "totalStudents": 5599742, "ptr": 22, "gerPrimary": 90.6, "gerSecondary": 89.0, "gerHigherSec": 65.6, "dropoutPrimary": 1.2, "dropoutSecondary": 15.7, "schoolsWithComputers": 99.7, "schoolsWithInternet": 96.6, "girlsToilets": 99.8},
    {"id": "UK", "name": "Uttarakhand", "totalSchools": 22551, "totalTeachers": 130741, "totalStudents": 2372400, "ptr": 18, "gerPrimary": 110.5, "gerSecondary": 93.0, "gerHigherSec": 77.5, "dropoutPrimary": 0.1, "dropoutSecondary": 8.6, "schoolsWithComputers": 86.6, "schoolsWithInternet": 70.3, "girlsToilets": 92.9},
    {"id": "JK", "name": "Jammu & Kashmir", "totalSchools": 24296, "totalTeachers": 167046, "totalStudents": 2629949, "ptr": 16, "gerPrimary": 114.0, "gerSecondary": 66.3, "gerHigherSec": 42.8, "dropoutPrimary": 1.6, "dropoutSecondary": 14.1, "schoolsWithComputers": 41.8, "schoolsWithInternet": 17.8, "girlsToilets": 96.7},
    {"id": "HP", "name": "Himachal Pradesh", "totalSchools": 17826, "totalTeachers": 101131, "totalStudents": 1426412, "ptr": 14, "gerPrimary": 105.3, "gerSecondary": 102.1, "gerHigherSec": 81.6, "dropoutPrimary": 0.0, "dropoutSecondary": 5.8, "schoolsWithComputers": 84.0, "schoolsWithInternet": 83.9, "girlsToilets": 100.0},
    {"id": "TR", "name": "Tripura", "totalSchools": 4923, "totalTeachers": 37661, "totalStudents": 689408, "ptr": 18, "gerPrimary": 118.7, "gerSecondary": 93.7, "gerHigherSec": 56.6, "dropoutPrimary": 0.5, "dropoutSecondary": 10.7, "schoolsWithComputers": 49.3, "schoolsWithInternet": 38.2, "girlsToilets": 89.7},
    {"id": "ML", "name": "Meghalaya", "totalSchools": 14601, "totalTeachers": 55726, "totalStudents": 1052884, "ptr": 19, "gerPrimary": 176.5, "gerSecondary": 96.7, "gerHigherSec": 39.8, "dropoutPrimary": 12.4, "dropoutSecondary": 23.2, "schoolsWithComputers": 18.8, "schoolsWithInternet": 9.5, "girlsToilets": 40.7},
    {"id": "MN", "name": "Manipur", "totalSchools": 4646, "totalTeachers": 40921, "totalStudents": 647434, "ptr": 16, "gerPrimary": 135.2, "gerSecondary": 77.6, "gerHigherSec": 56.4, "dropoutPrimary": 4.5, "dropoutSecondary": 15.6, "schoolsWithComputers": 33.5, "schoolsWithInternet": 12.7, "girlsToilets": 83.6},
    {"id": "NL", "name": "Nagaland", "totalSchools": 2725, "totalTeachers": 32602, "totalStudents": 412975, "ptr": 13, "gerPrimary": 92.0, "gerSecondary": 55.5, "gerHigherSec": 40.4, "dropoutPrimary": 4.5, "dropoutSecondary": 12.2, "schoolsWithComputers": 40.0, "schoolsWithInternet": 35.5, "girlsToilets": 66.5},
    {"id": "GA", "name": "Goa", "totalSchools": 1487, "totalTeachers": 14594, "totalStudents": 304735, "ptr": 21, "gerPrimary": 123.0, "gerSecondary": 110.8, "gerHigherSec": 92.2, "dropoutPrimary": 0.8, "dropoutSecondary": 10.2, "schoolsWithComputers": 56.2, "schoolsWithInternet": 93.5, "girlsToilets": 99.3},
    {"id": "AR", "name": "Arunachal Pradesh", "totalSchools": 3490, "totalTeachers": 24700, "totalStudents": 323717, "ptr": 13, "gerPrimary": 113.6, "gerSecondary": 70.5, "gerHigherSec": 45.9, "dropoutPrimary": 5.4, "dropoutSecondary": 20.4, "schoolsWithComputers": 37.7, "schoolsWithInternet": 30.5, "girlsToilets": 89.6},
    {"id": "MZ", "name": "Mizoram", "totalSchools": 3941, "totalTeachers": 23013, "totalStudents": 293763, "ptr": 13, "gerPrimary": 151.2, "gerSecondary": 103.7, "gerHigherSec": 53.3, "dropoutPrimary": 3.5, "dropoutSecondary": 15.2, "schoolsWithComputers": 46.5, "schoolsWithInternet": 42.6, "girlsToilets": 89.8},
    {"id": "SK", "name": "Sikkim", "totalSchools": 1254, "totalTeachers": 15489, "totalStudents": 121395, "ptr": 8, "gerPrimary": 100.6, "gerSecondary": 75.9, "gerHigherSec": 57.4, "dropoutPrimary": 2.6, "dropoutSecondary": 21.0, "schoolsWithComputers": 91.9, "schoolsWithInternet": 46.5, "girlsToilets": 99.0},
    {"id": "DL", "name": "Delhi", "totalSchools": 5497, "totalTeachers": 160479, "totalStudents": 4506578, "ptr": 28, "gerPrimary": 98.8, "gerSecondary": 105.4, "gerHigherSec": 83.2, "dropoutPrimary": 0.0, "dropoutSecondary": 11.6, "schoolsWithComputers": 100.0, "schoolsWithInternet": 100.0, "girlsToilets": 100.0},
    {"id": "PY", "name": "Puducherry", "totalSchools": 735, "totalTeachers": 13202, "totalStudents": 244828, "ptr": 19, "gerPrimary": 97.4, "gerSecondary": 102.5, "gerHigherSec": 90.9, "dropoutPrimary": 1.2, "dropoutSecondary": 10.4, "schoolsWithComputers": 100.0, "schoolsWithInternet": 100.0, "girlsToilets": 96.5},
    {"id": "CH", "name": "Chandigarh", "totalSchools": 230, "totalTeachers": 10237, "totalStudents": 265706, "ptr": 26, "gerPrimary": 97.7, "gerSecondary": 118.3, "gerHigherSec": 109.3, "dropoutPrimary": 0.0, "dropoutSecondary": 4.2, "schoolsWithComputers": 100.0, "schoolsWithInternet": 100.0, "girlsToilets": 100.0},
]

# ── ASER 2024 Learning Outcomes ──────────────────────────────────
# Source: ASER 2024 Final Report — "Annual Status of Education Report (Rural) 2024"
# Published: January 28, 2025 by ASER Centre (Pratham)
# https://asercentre.org/aser-2024/
#
# Note: ASER surveys RURAL India only. These are learning outcomes for children
# enrolled in government schools, not the general population.
# canReadStd2: % of Std III govt school children who can read Std II level text (p.52)
# canDoSubtraction: % of Std III govt school children who can do at least subtraction (p.53)
#
# ✅ VERIFIED 2026-03-05 against ASER 2024 Final Report (26.4MB PDF)
# All 27 states from state-wise maps, pages 52-53, 2024 column.
# 47 of 50 previous values were WRONG (AI-fabricated). Replaced with PDF data.
# Manipur excluded (insufficient sample size per ASER footnote).
# Added: Arunachal Pradesh, Mizoram, Sikkim (previously missing).

ASER_2024_STATES = [
    # ── VERIFIED from ASER 2024 Final Report (Jan 28, 2025) ──
    # Pages 52-53: State-wise maps for govt school children, Std III, 2024 column
    # canReadStd2 = % Std III govt school children who can read Std II level text (p.52)
    # canDoSubtraction = % Std III govt school children who can do at least subtraction (p.53)
    # Manipur excluded — ASER 2024 footnote: "Data is not presented where sample size is insufficient"
    {"id": "UP", "name": "Uttar Pradesh", "canReadStd2": 27.9, "canDoSubtraction": 31.6},
    {"id": "MH", "name": "Maharashtra", "canReadStd2": 37.0, "canDoSubtraction": 31.6},
    {"id": "BR", "name": "Bihar", "canReadStd2": 20.1, "canDoSubtraction": 28.2},
    {"id": "MP", "name": "Madhya Pradesh", "canReadStd2": 14.8, "canDoSubtraction": 13.0},
    {"id": "RJ", "name": "Rajasthan", "canReadStd2": 12.1, "canDoSubtraction": 10.4},
    {"id": "WB", "name": "West Bengal", "canReadStd2": 34.0, "canDoSubtraction": 37.5},
    {"id": "TN", "name": "Tamil Nadu", "canReadStd2": 13.2, "canDoSubtraction": 27.6},
    {"id": "KA", "name": "Karnataka", "canReadStd2": 15.4, "canDoSubtraction": 23.9},
    {"id": "GJ", "name": "Gujarat", "canReadStd2": 24.7, "canDoSubtraction": 16.5},
    {"id": "AP", "name": "Andhra Pradesh", "canReadStd2": 14.7, "canDoSubtraction": 40.9},
    {"id": "TS", "name": "Telangana", "canReadStd2": 6.8, "canDoSubtraction": 29.1},
    {"id": "OD", "name": "Odisha", "canReadStd2": 37.7, "canDoSubtraction": 34.6},
    {"id": "KL", "name": "Kerala", "canReadStd2": 44.4, "canDoSubtraction": 26.9},
    {"id": "JH", "name": "Jharkhand", "canReadStd2": 14.1, "canDoSubtraction": 24.6},
    {"id": "AS", "name": "Assam", "canReadStd2": 13.2, "canDoSubtraction": 22.3},
    {"id": "PB", "name": "Punjab", "canReadStd2": 32.6, "canDoSubtraction": 45.8},
    {"id": "CG", "name": "Chhattisgarh", "canReadStd2": 24.5, "canDoSubtraction": 21.9},
    {"id": "HR", "name": "Haryana", "canReadStd2": 32.1, "canDoSubtraction": 33.1},
    {"id": "UK", "name": "Uttarakhand", "canReadStd2": 35.6, "canDoSubtraction": 26.7},
    {"id": "HP", "name": "Himachal Pradesh", "canReadStd2": 49.7, "canDoSubtraction": 49.5},
    {"id": "JK", "name": "Jammu & Kashmir", "canReadStd2": 6.7, "canDoSubtraction": 22.7},
    {"id": "ML", "name": "Meghalaya", "canReadStd2": 15.6, "canDoSubtraction": 18.9},
    {"id": "TR", "name": "Tripura", "canReadStd2": 19.5, "canDoSubtraction": 28.0},
    {"id": "NL", "name": "Nagaland", "canReadStd2": 7.1, "canDoSubtraction": 31.4},
    {"id": "AR", "name": "Arunachal Pradesh", "canReadStd2": 7.2, "canDoSubtraction": 30.2},
    {"id": "MZ", "name": "Mizoram", "canReadStd2": 25.0, "canDoSubtraction": 55.3},
    {"id": "SK", "name": "Sikkim", "canReadStd2": 24.7, "canDoSubtraction": 35.1},
]

# ── National headline numbers ──────────────────────────────────
# Source: UDISE+ 2023-24 Flash Statistics — Summary page
NATIONAL_TOTALS = {
    "totalStudents": 248045828,    # 24.80 crore (UDISE+ 2023-24 Pre-Primary to Higher Secondary)
    "totalSchools": 1471891,       # 14.72 lakh (UDISE+ 2023-24)
    "totalTeachers": 9807600,      # 98.08 lakh (UDISE+ 2023-24)
    "ptrNational": 25,             # ~248M / 9.8M = 25 (UDISE+ Table 2.2 shows PTR 25 for India)
    "gerPrimary": 93.0,            # UDISE+ 2023-24 (dropped from 103.4 in 2021-22 after SDMIS methodology change)
    "gerSecondary": 77.4,          # UDISE+ 2023-24
}
