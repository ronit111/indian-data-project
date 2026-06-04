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
# ✅ VERIFIED 2026-03-04 (UDISE+ 2023-24); REFRESHED 2026-06 to UDISE+ 2024-25 (academic fields)
# Tables 2.2 (schools/enrolments/teachers/PTR), 2.5 (infrastructure counts),
# 6.1 (GER by level), 6.13 (dropout rates).
# Infrastructure %s computed from Table 2.5 raw counts / total schools × 100.
# Note: Some GER values >100% are legitimate (children from neighboring areas enrolled).

# ── UDISE+ 2024-25 (refreshed 2026-06) ───────────────────────────
# Schools/Teachers/Enrolments/PTR: Table 2.2 (anchor India 1471473/246932680/10122420/24)
# GER (Primary 1-5, Secondary 9-10, Higher Sec 11-12), Total col: Table 6.1 (anchor 90.9/78.7/58.4)
# Dropout (Primary, Secondary), Total col: Table 6.13 (anchor 0.3/11.5)
# All per-state values extracted programmatically + validated vs the printed national anchors.
# schoolsWithComputers/schoolsWithInternet/girlsToilets RETAINED from UDISE+ 2023-24
# (Table 2.5's multi-header infra layout did not extract reliably; infra refresh = follow-up).
UDISE_2024_25_STATES = [
    {"id": "UP", "name": "Uttar Pradesh", "totalSchools": 262358, "totalTeachers": 1615427, "totalStudents": 42789347, "ptr": 26, "gerPrimary": 83.1, "gerSecondary": 64.3, "gerHigherSec": 57.4, "dropoutPrimary": 0.0, "dropoutSecondary": 7.0, "schoolsWithComputers": 40.2, "schoolsWithInternet": 38.6, "girlsToilets": 96.2},
    {"id": "MH", "name": "Maharashtra", "totalSchools": 108250, "totalTeachers": 747501, "totalStudents": 21272611, "ptr": 28, "gerPrimary": 104.5, "gerSecondary": 93.6, "gerHigherSec": 70.8, "dropoutPrimary": 0.0, "dropoutSecondary": 11.5, "schoolsWithComputers": 81.4, "schoolsWithInternet": 67.6, "girlsToilets": 98.7},
    {"id": "BR", "name": "Bihar", "totalSchools": 94339, "totalTeachers": 707516, "totalStudents": 21133228, "ptr": 30, "gerPrimary": 77.2, "gerSecondary": 51.1, "gerHigherSec": 38.1, "dropoutPrimary": 2.9, "dropoutSecondary": 6.9, "schoolsWithComputers": 19.9, "schoolsWithInternet": 18.4, "girlsToilets": 92.1},
    {"id": "MP", "name": "Madhya Pradesh", "totalSchools": 122120, "totalTeachers": 717493, "totalStudents": 15172607, "ptr": 21, "gerPrimary": 76.3, "gerSecondary": 68.2, "gerHigherSec": 45.0, "dropoutPrimary": 0.0, "dropoutSecondary": 16.8, "schoolsWithComputers": 49.0, "schoolsWithInternet": 43.4, "girlsToilets": 93.8},
    {"id": "RJ", "name": "Rajasthan", "totalSchools": 106302, "totalTeachers": 792265, "totalStudents": 16364187, "ptr": 21, "gerPrimary": 88.3, "gerSecondary": 82.2, "gerHigherSec": 66.1, "dropoutPrimary": 3.6, "dropoutSecondary": 7.7, "schoolsWithComputers": 51.5, "schoolsWithInternet": 46.4, "girlsToilets": 96.5},
    {"id": "WB", "name": "West Bengal", "totalSchools": 93715, "totalTeachers": 583825, "totalStudents": 17081511, "ptr": 29, "gerPrimary": 106.6, "gerSecondary": 99.4, "gerHigherSec": 51.5, "dropoutPrimary": 1.4, "dropoutSecondary": 20.0, "schoolsWithComputers": 22.3, "schoolsWithInternet": 17.5, "girlsToilets": 99.3},
    {"id": "TN", "name": "Tamil Nadu", "totalSchools": 57935, "totalTeachers": 549850, "totalStudents": 12518167, "ptr": 23, "gerPrimary": 91.6, "gerSecondary": 95.5, "gerHigherSec": 83.4, "dropoutPrimary": 2.7, "dropoutSecondary": 8.5, "schoolsWithComputers": 72.6, "schoolsWithInternet": 68.0, "girlsToilets": 98.9},
    {"id": "KA", "name": "Karnataka", "totalSchools": 74859, "totalTeachers": 452602, "totalStudents": 11780251, "ptr": 26, "gerPrimary": 104.5, "gerSecondary": 101.3, "gerHigherSec": 61.4, "dropoutPrimary": 0.0, "dropoutSecondary": 18.3, "schoolsWithComputers": 52.9, "schoolsWithInternet": 46.9, "girlsToilets": 99.0},
    {"id": "GJ", "name": "Gujarat", "totalSchools": 53355, "totalTeachers": 389063, "totalStudents": 11501328, "ptr": 30, "gerPrimary": 79.6, "gerSecondary": 74.7, "gerHigherSec": 47.3, "dropoutPrimary": 0.2, "dropoutSecondary": 16.9, "schoolsWithComputers": 98.3, "schoolsWithInternet": 94.1, "girlsToilets": 96.5},
    {"id": "AP", "name": "Andhra Pradesh", "totalSchools": 61317, "totalTeachers": 342721, "totalStudents": 8454817, "ptr": 25, "gerPrimary": 91.9, "gerSecondary": 89.4, "gerHigherSec": 67.8, "dropoutPrimary": 1.4, "dropoutSecondary": 15.5, "schoolsWithComputers": 87.3, "schoolsWithInternet": 58.0, "girlsToilets": 98.2},
    {"id": "TS", "name": "Telangana", "totalSchools": 43154, "totalTeachers": 357911, "totalStudents": 7457851, "ptr": 21, "gerPrimary": 114.0, "gerSecondary": 99.9, "gerHigherSec": 67.6, "dropoutPrimary": 0.0, "dropoutSecondary": 13.2, "schoolsWithComputers": 77.9, "schoolsWithInternet": 70.2, "girlsToilets": 92.1},
    {"id": "OD", "name": "Odisha", "totalSchools": 61565, "totalTeachers": 344116, "totalStudents": 7644052, "ptr": 22, "gerPrimary": 93.2, "gerSecondary": 84.0, "gerHigherSec": 60.7, "dropoutPrimary": 0.7, "dropoutSecondary": 15.0, "schoolsWithComputers": 59.3, "schoolsWithInternet": 49.1, "girlsToilets": 99.4},
    {"id": "KL", "name": "Kerala", "totalSchools": 15757, "totalTeachers": 292072, "totalStudents": 6164059, "ptr": 21, "gerPrimary": 93.2, "gerSecondary": 98.7, "gerHigherSec": 89.5, "dropoutPrimary": 0.8, "dropoutSecondary": 4.8, "schoolsWithComputers": 99.4, "schoolsWithInternet": 92.1, "girlsToilets": 99.8},
    {"id": "JH", "name": "Jharkhand", "totalSchools": 44376, "totalTeachers": 209203, "totalStudents": 7436931, "ptr": 36, "gerPrimary": 92.5, "gerSecondary": 72.6, "gerHigherSec": 48.6, "dropoutPrimary": 0.0, "dropoutSecondary": 3.5, "schoolsWithComputers": 75.3, "schoolsWithInternet": 52.7, "girlsToilets": 98.6},
    {"id": "AS", "name": "Assam", "totalSchools": 55283, "totalTeachers": 340471, "totalStudents": 7041824, "ptr": 21, "gerPrimary": 108.1, "gerSecondary": 79.6, "gerHigherSec": 43.5, "dropoutPrimary": 3.8, "dropoutSecondary": 17.5, "schoolsWithComputers": 68.1, "schoolsWithInternet": 26.3, "girlsToilets": 92.3},
    {"id": "PB", "name": "Punjab", "totalSchools": 27281, "totalTeachers": 273130, "totalStudents": 5908507, "ptr": 22, "gerPrimary": 105.6, "gerSecondary": 92.6, "gerHigherSec": 79.5, "dropoutPrimary": 2.5, "dropoutSecondary": 6.2, "schoolsWithComputers": 98.8, "schoolsWithInternet": 75.4, "girlsToilets": 100.0},
    {"id": "CG", "name": "Chhattisgarh", "totalSchools": 56802, "totalTeachers": 285248, "totalStudents": 5806871, "ptr": 20, "gerPrimary": 89.2, "gerSecondary": 77.5, "gerHigherSec": 53.5, "dropoutPrimary": 0.7, "dropoutSecondary": 15.3, "schoolsWithComputers": 67.3, "schoolsWithInternet": 61.2, "girlsToilets": 97.4},
    {"id": "HR", "name": "Haryana", "totalSchools": 23494, "totalTeachers": 263942, "totalStudents": 5769330, "ptr": 22, "gerPrimary": 91.6, "gerSecondary": 90.3, "gerHigherSec": 71.7, "dropoutPrimary": 0.0, "dropoutSecondary": 6.6, "schoolsWithComputers": 99.7, "schoolsWithInternet": 96.6, "girlsToilets": 99.8},
    {"id": "UK", "name": "Uttarakhand", "totalSchools": 22452, "totalTeachers": 134263, "totalStudents": 2426815, "ptr": 18, "gerPrimary": 109.9, "gerSecondary": 93.4, "gerHigherSec": 80.9, "dropoutPrimary": 0.9, "dropoutSecondary": 4.6, "schoolsWithComputers": 86.6, "schoolsWithInternet": 70.3, "girlsToilets": 92.9},
    {"id": "JK", "name": "Jammu & Kashmir", "totalSchools": 24192, "totalTeachers": 166717, "totalStudents": 2654012, "ptr": 16, "gerPrimary": 113.7, "gerSecondary": 66.1, "gerHigherSec": 44.8, "dropoutPrimary": 1.5, "dropoutSecondary": 12.9, "schoolsWithComputers": 41.8, "schoolsWithInternet": 17.8, "girlsToilets": 96.7},
    {"id": "HP", "name": "Himachal Pradesh", "totalSchools": 17330, "totalTeachers": 102825, "totalStudents": 1425266, "ptr": 14, "gerPrimary": 99.5, "gerSecondary": 102.6, "gerHigherSec": 84.7, "dropoutPrimary": 0.0, "dropoutSecondary": 6.2, "schoolsWithComputers": 84.0, "schoolsWithInternet": 83.9, "girlsToilets": 100.0},
    {"id": "TR", "name": "Tripura", "totalSchools": 4943, "totalTeachers": 37733, "totalStudents": 690084, "ptr": 18, "gerPrimary": 117.9, "gerSecondary": 80.2, "gerHigherSec": 56.4, "dropoutPrimary": 0.0, "dropoutSecondary": 11.3, "schoolsWithComputers": 49.3, "schoolsWithInternet": 38.2, "girlsToilets": 89.7},
    {"id": "ML", "name": "Meghalaya", "totalSchools": 14587, "totalTeachers": 57002, "totalStudents": 1061320, "ptr": 19, "gerPrimary": 180.7, "gerSecondary": 86.2, "gerHigherSec": 39.7, "dropoutPrimary": 4.2, "dropoutSecondary": 17.4, "schoolsWithComputers": 18.8, "schoolsWithInternet": 9.5, "girlsToilets": 40.7},
    {"id": "MN", "name": "Manipur", "totalSchools": 4666, "totalTeachers": 41490, "totalStudents": 673118, "ptr": 16, "gerPrimary": 140.5, "gerSecondary": 78.8, "gerHigherSec": 58.5, "dropoutPrimary": 2.9, "dropoutSecondary": 9.1, "schoolsWithComputers": 33.5, "schoolsWithInternet": 12.7, "girlsToilets": 83.6},
    {"id": "NL", "name": "Nagaland", "totalSchools": 2750, "totalTeachers": 33131, "totalStudents": 414421, "ptr": 13, "gerPrimary": 95.4, "gerSecondary": 61.8, "gerHigherSec": 39.8, "dropoutPrimary": 2.8, "dropoutSecondary": 12.1, "schoolsWithComputers": 40.0, "schoolsWithInternet": 35.5, "girlsToilets": 66.5},
    {"id": "GA", "name": "Goa", "totalSchools": 1479, "totalTeachers": 15196, "totalStudents": 300546, "ptr": 20, "gerPrimary": 117.8, "gerSecondary": 107.5, "gerHigherSec": 93.8, "dropoutPrimary": 0.3, "dropoutSecondary": 9.3, "schoolsWithComputers": 56.2, "schoolsWithInternet": 93.5, "girlsToilets": 99.3},
    {"id": "AR", "name": "Arunachal Pradesh", "totalSchools": 3229, "totalTeachers": 25117, "totalStudents": 319826, "ptr": 13, "gerPrimary": 113.2, "gerSecondary": 69.3, "gerHigherSec": 43.7, "dropoutPrimary": 4.8, "dropoutSecondary": 18.3, "schoolsWithComputers": 37.7, "schoolsWithInternet": 30.5, "girlsToilets": 89.6},
    {"id": "MZ", "name": "Mizoram", "totalSchools": 3974, "totalTeachers": 24952, "totalStudents": 279882, "ptr": 11, "gerPrimary": 138.0, "gerSecondary": 95.5, "gerHigherSec": 53.9, "dropoutPrimary": 10.8, "dropoutSecondary": 17.4, "schoolsWithComputers": 46.5, "schoolsWithInternet": 42.6, "girlsToilets": 89.8},
    {"id": "SK", "name": "Sikkim", "totalSchools": 1245, "totalTeachers": 14994, "totalStudents": 117576, "ptr": 8, "gerPrimary": 97.4, "gerSecondary": 72.0, "gerHigherSec": 49.6, "dropoutPrimary": 1.5, "dropoutSecondary": 11.4, "schoolsWithComputers": 91.9, "schoolsWithInternet": 46.5, "girlsToilets": 99.0},
    {"id": "DL", "name": "Delhi", "totalSchools": 5556, "totalTeachers": 161958, "totalStudents": 4491032, "ptr": 28, "gerPrimary": 101.8, "gerSecondary": 101.1, "gerHigherSec": 82.7, "dropoutPrimary": 0.0, "dropoutSecondary": 7.5, "schoolsWithComputers": 100.0, "schoolsWithInternet": 100.0, "girlsToilets": 100.0},
    {"id": "PY", "name": "Puducherry", "totalSchools": 763, "totalTeachers": 13639, "totalStudents": 240691, "ptr": 18, "gerPrimary": 93.0, "gerSecondary": 98.1, "gerHigherSec": 95.5, "dropoutPrimary": 0.0, "dropoutSecondary": 5.9, "schoolsWithComputers": 100.0, "schoolsWithInternet": 100.0, "girlsToilets": 96.5},
    {"id": "CH", "name": "Chandigarh", "totalSchools": 207, "totalTeachers": 9968, "totalStudents": 253012, "ptr": 25, "gerPrimary": 93.7, "gerSecondary": 110.1, "gerHigherSec": 107.4, "dropoutPrimary": 0.2, "dropoutSecondary": 2.0, "schoolsWithComputers": 100.0, "schoolsWithInternet": 100.0, "girlsToilets": 100.0},
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
    "totalStudents": 246932680,    # 24.69 crore (UDISE+ 2024-25 Pre-Primary to Higher Secondary)
    "totalSchools": 1471473,       # 14.71 lakh (UDISE+ 2024-25)
    "totalTeachers": 10122420,     # 1.01 crore (UDISE+ 2024-25)
    "ptrNational": 24,             # ~247M / 10.1M = 24 (UDISE+ 2024-25 Table 2.2)
    "gerPrimary": 90.9,            # UDISE+ 2024-25 Table 6.1 (Primary 1-5, person)
    "gerSecondary": 78.7,          # UDISE+ 2024-25 Table 6.1 (Secondary 9-10, person)
}
