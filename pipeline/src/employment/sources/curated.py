"""
Curated employment data from authoritative Indian government sources.

Sources:
  - PLFS (Periodic Labour Force Survey) Annual Report 2023-24
    Ministry of Statistics & Programme Implementation (MoSPI)
    https://mospi.gov.in/publication/annual-report-plfs-2023-24
  - PLFS Quarterly Bulletin Oct-Dec 2025
    https://mospi.gov.in/publication/plfs-quarterly-bulletin
  - RBI KLEMS Database (sectoral employment)
    https://rbi.org.in/Scripts/KLEMS.aspx

Data notes:
  - PLFS uses "Usual Status" (principal + subsidiary) for annual estimates.
  - Quarterly estimates use "Current Weekly Status" (CWS) for urban areas.
  - LFPR = Labour Force Participation Rate (employed + seeking work as % of 15+ population).
  - WPR = Worker Population Ratio (employed as % of 15+ population).
  - Self-employed includes own-account workers + unpaid family workers.
  - India's ILO-modelled estimates (World Bank) differ from PLFS national estimates.
    We display both — WB for time series consistency, PLFS for latest granular data.
  - Sectoral shares from RBI KLEMS are at basic prices and may differ from
    World Bank ILO-modelled estimates slightly.

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated.
"""

# ── PLFS Quarterly Bulletin Oct-Dec 2025 (Latest) ─────────────────
# Source: PLFS Quarterly Bulletin, Oct-Dec 2025
# Current Weekly Status (CWS) estimates for 15+ population
PLFS_QUARTERLY_2025 = {
    "quarter": "Oct-Dec 2025",
    "unemploymentTotal": 5.0,             # Estimated all-India CWS (rural 4.0 + urban 6.7, weighted ~60:40)
    "unemploymentRural": 4.0,             # PLFS Oct-Dec 2025 CWS (was 4.4 in Jul-Sep 2025)
    "unemploymentUrban": 6.7,             # PLFS Oct-Dec 2025 CWS (was 6.9 in Jul-Sep 2025)
    "lfprTotal": 55.8,                    # PLFS Oct-Dec 2025 CWS
    "lfprRural": 58.4,                    # PLFS Oct-Dec 2025 CWS (was 57.2 in Jul-Sep 2025)
    "lfprUrban": 51.4,                    # PLFS Oct-Dec 2025 CWS (broadly steady)
    "lfprMale": 75.8,                     # PLFS Oct-Dec 2025 CWS (NOTE: annual usual status 2023-24 = 78.8%)
    "lfprFemale": 34.9,                   # PLFS Oct-Dec 2025 CWS (was 33.7 in Jul-Sep 2025)
    "wprTotal": 53.1,                     # PLFS Oct-Dec 2025 CWS (was 52.2 in Jul-Sep 2025)
}

# ── PLFS State-Level Data (Annual Report 2023-24) ─────────────────
# All values verified against PLFS Annual Report 2023-24, Appendix A:
#   - LFPR: Table 16, age group 15 years and above, usual status (ps+ss), rural+urban
#   - WPR:  Table 17, age group 15 years and above, usual status (ps+ss), rural+urban
#   - UR:   Table 18, age group 15 years and above, usual status (ps+ss), rural+urban
#   - Self-employed: Table 19, rural+urban, persons, column "all self employed"
PLFS_STATE_DATA = [
    {"id": "UP", "name": "Uttar Pradesh", "lfpr": 56.9, "lfprMale": 79.5, "lfprFemale": 34.5, "unemploymentRate": 3.0, "wpr": 55.1, "selfEmployed": 72.7},
    {"id": "MH", "name": "Maharashtra", "lfpr": 59.0, "lfprMale": 77.2, "lfprFemale": 41.0, "unemploymentRate": 3.3, "wpr": 57.0, "selfEmployed": 47.0},
    {"id": "BR", "name": "Bihar", "lfpr": 53.2, "lfprMale": 75.8, "lfprFemale": 30.5, "unemploymentRate": 3.0, "wpr": 51.6, "selfEmployed": 67.5},
    {"id": "WB", "name": "West Bengal", "lfpr": 61.1, "lfprMale": 82.4, "lfprFemale": 40.4, "unemploymentRate": 2.5, "wpr": 59.6, "selfEmployed": 56.5},
    {"id": "MP", "name": "Madhya Pradesh", "lfpr": 68.9, "lfprMale": 85.0, "lfprFemale": 52.3, "unemploymentRate": 1.0, "wpr": 68.3, "selfEmployed": 68.2},
    {"id": "TN", "name": "Tamil Nadu", "lfpr": 58.8, "lfprMale": 75.7, "lfprFemale": 43.2, "unemploymentRate": 3.5, "wpr": 56.8, "selfEmployed": 34.2},
    {"id": "RJ", "name": "Rajasthan", "lfpr": 64.4, "lfprMale": 78.2, "lfprFemale": 50.9, "unemploymentRate": 4.2, "wpr": 61.7, "selfEmployed": 68.7},
    {"id": "KA", "name": "Karnataka", "lfpr": 56.8, "lfprMale": 75.5, "lfprFemale": 38.0, "unemploymentRate": 2.7, "wpr": 55.2, "selfEmployed": 51.1},
    {"id": "GJ", "name": "Gujarat", "lfpr": 64.6, "lfprMale": 82.4, "lfprFemale": 46.0, "unemploymentRate": 1.1, "wpr": 63.9, "selfEmployed": 56.1},
    {"id": "AP", "name": "Andhra Pradesh", "lfpr": 60.2, "lfprMale": 76.7, "lfprFemale": 44.8, "unemploymentRate": 4.1, "wpr": 57.8, "selfEmployed": 49.1},
    {"id": "TS", "name": "Telangana", "lfpr": 62.2, "lfprMale": 78.5, "lfprFemale": 46.7, "unemploymentRate": 4.8, "wpr": 59.2, "selfEmployed": 55.9},
    {"id": "OD", "name": "Odisha", "lfpr": 64.9, "lfprMale": 81.7, "lfprFemale": 49.4, "unemploymentRate": 3.1, "wpr": 62.9, "selfEmployed": 62.0},
    {"id": "KL", "name": "Kerala", "lfpr": 56.2, "lfprMale": 74.4, "lfprFemale": 40.8, "unemploymentRate": 7.2, "wpr": 52.2, "selfEmployed": 41.1},
    {"id": "JH", "name": "Jharkhand", "lfpr": 63.8, "lfprMale": 78.3, "lfprFemale": 49.8, "unemploymentRate": 1.3, "wpr": 63.0, "selfEmployed": 68.0},
    {"id": "AS", "name": "Assam", "lfpr": 66.9, "lfprMale": 83.3, "lfprFemale": 50.2, "unemploymentRate": 3.9, "wpr": 64.3, "selfEmployed": 61.4},
    {"id": "PB", "name": "Punjab", "lfpr": 55.7, "lfprMale": 79.8, "lfprFemale": 31.1, "unemploymentRate": 5.5, "wpr": 52.7, "selfEmployed": 46.6},
    {"id": "CG", "name": "Chhattisgarh", "lfpr": 71.5, "lfprMale": 83.4, "lfprFemale": 59.5, "unemploymentRate": 2.5, "wpr": 69.7, "selfEmployed": 65.6},
    {"id": "HR", "name": "Haryana", "lfpr": 49.5, "lfprMale": 72.7, "lfprFemale": 24.2, "unemploymentRate": 3.4, "wpr": 47.8, "selfEmployed": 46.6},
    {"id": "UK", "name": "Uttarakhand", "lfpr": 60.7, "lfprMale": 76.4, "lfprFemale": 45.6, "unemploymentRate": 4.3, "wpr": 58.1, "selfEmployed": 61.5},
    {"id": "JK", "name": "Jammu & Kashmir", "lfpr": 64.3, "lfprMale": 75.7, "lfprFemale": 52.1, "unemploymentRate": 6.1, "wpr": 60.4, "selfEmployed": 66.7},
    {"id": "HP", "name": "Himachal Pradesh", "lfpr": 74.4, "lfprMale": 81.7, "lfprFemale": 67.6, "unemploymentRate": 5.5, "wpr": 70.3, "selfEmployed": 66.2},
    {"id": "DL", "name": "Delhi", "lfpr": 46.4, "lfprMale": 70.1, "lfprFemale": 18.5, "unemploymentRate": 2.1, "wpr": 45.5, "selfEmployed": 37.8},
    {"id": "GA", "name": "Goa", "lfpr": 51.8, "lfprMale": 74.1, "lfprFemale": 29.3, "unemploymentRate": 8.5, "wpr": 47.4, "selfEmployed": 36.8},
    {"id": "TR", "name": "Tripura", "lfpr": 63.0, "lfprMale": 78.9, "lfprFemale": 47.1, "unemploymentRate": 1.7, "wpr": 62.0, "selfEmployed": 61.6},
    {"id": "MN", "name": "Manipur", "lfpr": 59.6, "lfprMale": 70.8, "lfprFemale": 48.7, "unemploymentRate": 6.1, "wpr": 56.0, "selfEmployed": 72.6},
    {"id": "ML", "name": "Meghalaya", "lfpr": 76.9, "lfprMale": 82.3, "lfprFemale": 71.8, "unemploymentRate": 6.2, "wpr": 72.1, "selfEmployed": 52.6},
    {"id": "NL", "name": "Nagaland", "lfpr": 73.3, "lfprMale": 82.4, "lfprFemale": 64.3, "unemploymentRate": 7.1, "wpr": 68.1, "selfEmployed": 66.3},
    {"id": "MZ", "name": "Mizoram", "lfpr": 54.2, "lfprMale": 66.1, "lfprFemale": 41.7, "unemploymentRate": 2.3, "wpr": 53.0, "selfEmployed": 68.5},
    {"id": "SK", "name": "Sikkim", "lfpr": 76.2, "lfprMale": 83.4, "lfprFemale": 68.2, "unemploymentRate": 2.3, "wpr": 74.4, "selfEmployed": 61.3},
    {"id": "AR", "name": "Arunachal Pradesh", "lfpr": 73.0, "lfprMale": 79.2, "lfprFemale": 66.5, "unemploymentRate": 6.1, "wpr": 68.5, "selfEmployed": 78.0},
]

# ── Sectoral Employment (RBI KLEMS + PLFS) ─────────────────────────
# Source: RBI KLEMS Database + PLFS Annual Report 2023-24
# Employment shares for 2023-24 (latest available)
SECTORAL_EMPLOYMENT = [
    {"id": "agriculture", "name": "Agriculture & Allied", "employmentShare": 46.1},  # PLFS 2023-24 (was 45.8)
    {"id": "manufacturing", "name": "Manufacturing", "employmentShare": 11.4},
    {"id": "construction", "name": "Construction", "employmentShare": 12.0},  # PLFS 2023-24 (was 12.1)
    {"id": "trade", "name": "Trade, Hotels & Transport", "employmentShare": 13.8},
    {"id": "finance", "name": "Finance & Business Services", "employmentShare": 4.2},
    {"id": "public_admin", "name": "Public Administration & Defence", "employmentShare": 3.8},
    {"id": "other_services", "name": "Other Services", "employmentShare": 8.9},
]

# ── National headline numbers ──────────────────────────────────────
# Source: PLFS Annual Report 2023-24 + Quarterly Bulletin Oct-Dec 2025
NATIONAL_TOTALS = {
    "unemploymentRate": 3.2,        # PLFS Annual Report 2023-24, usual status (ps+ss), 15+ (national)
    "lfpr": 60.1,                   # PLFS Annual Report 2023-24, usual status (ps+ss), 15+
    "youthUnemployment": 10.2,      # PLFS Annual Report 2023-24 (usual status, 15-29 age group)
    "femaleLfpr": 41.7,             # PLFS Annual Report 2023-24, usual status (ps+ss), 15+ female
    "workforceTotal": 57.4,         # crores (PLFS Oct-Dec 2025 quarterly)
    "selfEmployedPct": 58.4,        # PLFS Annual Report 2023-24 (usual status, ps+ss)
}
