"""
Curated employment data from authoritative Indian government sources.

Sources:
  - PLFS (Periodic Labour Force Survey) Annual Report 2023-24
    Ministry of Statistics & Programme Implementation (MoSPI)
    https://mospi.gov.in/publication/annual-report-plfs-2023-24
  - PLFS Quarterly Bulletin Oct-Dec 2025
    https://mospi.gov.in/publication/plfs-quarterly-bulletin
  - PLFS Annual Report 2025, Statement 8 (broad-industry employment shares)
    https://mospi.gov.in/publication/annual-report-plfs

Data notes:
  - PLFS uses "Usual Status" (principal + subsidiary) for annual estimates.
  - Quarterly estimates use "Current Weekly Status" (CWS) for urban areas.
  - LFPR = Labour Force Participation Rate (employed + seeking work as % of 15+ population).
  - WPR = Worker Population Ratio (employed as % of 15+ population).
  - Self-employed includes own-account workers + unpaid family workers.
  - India's ILO-modelled estimates (World Bank) differ from PLFS national estimates.
    We display both — WB for time series consistency, PLFS for latest granular data.
  - Sectoral shares (PLFS Statement 8) are by broad NIC-2008 industry division;
    they may differ from World Bank ILO-modelled sector estimates slightly.

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

# ── PLFS State-Level Data (Annual Report 2025) ────────────────────
# Refreshed 2026-06 to PLFS Annual Report 2025 (survey period Jan–Dec 2025),
# usual status (ps+ss), age 15 years and above, rural+urban combined.
# LFPR / lfprMale / lfprFemale / WPR / UR: sourced from the MOSPI eSankhyiki
#   PLFS API (api.mospi.gov.in, year=2025), the same machine-readable source
#   behind the report. National aggregates cross-verified against the printed
#   report (LFPR 59.3, WPR 57.4, UR 3.1, female-LFPR 40.0, youth-UR 9.9 — all match).
# selfEmployed: PLFS 2025 report Table 19 ("all self employed", rural+urban,
#   persons); the table instance was anchor-validated to the all-India 56.2 and
#   every state row was checked to sum to 100 (all-self + regular + casual).
PLFS_STATE_DATA = [
    {"id": "UP", "name": "Uttar Pradesh", "lfpr": 55.2, "lfprMale": 78.9, "lfprFemale": 32.4, "unemploymentRate": 2.7, "wpr": 53.7, "selfEmployed": 67.4},
    {"id": "MH", "name": "Maharashtra", "lfpr": 59.5, "lfprMale": 78.4, "lfprFemale": 39.9, "unemploymentRate": 2.4, "wpr": 58.0, "selfEmployed": 46.9},
    {"id": "BR", "name": "Bihar", "lfpr": 49.3, "lfprMale": 75.7, "lfprFemale": 24.7, "unemploymentRate": 3.8, "wpr": 47.4, "selfEmployed": 64.7},
    {"id": "WB", "name": "West Bengal", "lfpr": 59.1, "lfprMale": 82.3, "lfprFemale": 37.5, "unemploymentRate": 2.8, "wpr": 57.4, "selfEmployed": 55.4},
    {"id": "MP", "name": "Madhya Pradesh", "lfpr": 65.1, "lfprMale": 83.5, "lfprFemale": 46.1, "unemploymentRate": 1.5, "wpr": 64.1, "selfEmployed": 66.1},
    {"id": "TN", "name": "Tamil Nadu", "lfpr": 62.3, "lfprMale": 78.3, "lfprFemale": 47.3, "unemploymentRate": 3.4, "wpr": 60.1, "selfEmployed": 36.2},
    {"id": "RJ", "name": "Rajasthan", "lfpr": 64.5, "lfprMale": 77.0, "lfprFemale": 52.3, "unemploymentRate": 4.3, "wpr": 61.7, "selfEmployed": 68.3},
    {"id": "KA", "name": "Karnataka", "lfpr": 59.4, "lfprMale": 79.4, "lfprFemale": 39.8, "unemploymentRate": 2.3, "wpr": 58.0, "selfEmployed": 47.5},
    {"id": "GJ", "name": "Gujarat", "lfpr": 65.2, "lfprMale": 83.4, "lfprFemale": 46.2, "unemploymentRate": 0.9, "wpr": 64.6, "selfEmployed": 56.9},
    {"id": "AP", "name": "Andhra Pradesh", "lfpr": 60.9, "lfprMale": 78.3, "lfprFemale": 44.8, "unemploymentRate": 4.2, "wpr": 58.3, "selfEmployed": 46.6},
    {"id": "TS", "name": "Telangana", "lfpr": 61.4, "lfprMale": 77.1, "lfprFemale": 46.4, "unemploymentRate": 5.0, "wpr": 58.3, "selfEmployed": 52.1},
    {"id": "OD", "name": "Odisha", "lfpr": 63.2, "lfprMale": 80.6, "lfprFemale": 47.3, "unemploymentRate": 2.9, "wpr": 61.3, "selfEmployed": 61.1},
    {"id": "KL", "name": "Kerala", "lfpr": 57.4, "lfprMale": 75.8, "lfprFemale": 41.2, "unemploymentRate": 4.4, "wpr": 54.9, "selfEmployed": 37.6},
    {"id": "JH", "name": "Jharkhand", "lfpr": 59.8, "lfprMale": 77.0, "lfprFemale": 43.7, "unemploymentRate": 2.7, "wpr": 58.2, "selfEmployed": 68.0},
    {"id": "AS", "name": "Assam", "lfpr": 61.9, "lfprMale": 81.7, "lfprFemale": 42.8, "unemploymentRate": 3.7, "wpr": 59.6, "selfEmployed": 59.8},
    {"id": "PB", "name": "Punjab", "lfpr": 55.2, "lfprMale": 79.2, "lfprFemale": 30.2, "unemploymentRate": 5.3, "wpr": 52.3, "selfEmployed": 44.5},
    {"id": "CG", "name": "Chhattisgarh", "lfpr": 71.6, "lfprMale": 83.5, "lfprFemale": 59.8, "unemploymentRate": 2.3, "wpr": 70.0, "selfEmployed": 63.3},
    {"id": "HR", "name": "Haryana", "lfpr": 50.4, "lfprMale": 75.0, "lfprFemale": 23.8, "unemploymentRate": 4.5, "wpr": 48.1, "selfEmployed": 44.0},
    {"id": "UK", "name": "Uttarakhand", "lfpr": 56.3, "lfprMale": 75.5, "lfprFemale": 37.8, "unemploymentRate": 5.1, "wpr": 53.4, "selfEmployed": 57.6},
    {"id": "JK", "name": "Jammu & Kashmir", "lfpr": 64.9, "lfprMale": 76.3, "lfprFemale": 53.1, "unemploymentRate": 4.9, "wpr": 61.7, "selfEmployed": 64.7},
    {"id": "HP", "name": "Himachal Pradesh", "lfpr": 73.2, "lfprMale": 82.5, "lfprFemale": 64.7, "unemploymentRate": 4.5, "wpr": 69.9, "selfEmployed": 67.6},
    {"id": "DL", "name": "Delhi", "lfpr": 44.2, "lfprMale": 71.5, "lfprFemale": 13.1, "unemploymentRate": 5.9, "wpr": 41.6, "selfEmployed": 39.1},
    {"id": "GA", "name": "Goa", "lfpr": 51.2, "lfprMale": 73.4, "lfprFemale": 27.4, "unemploymentRate": 8.3, "wpr": 46.9, "selfEmployed": 35.4},
    {"id": "TR", "name": "Tripura", "lfpr": 62.1, "lfprMale": 78.9, "lfprFemale": 46.3, "unemploymentRate": 2.7, "wpr": 60.4, "selfEmployed": 55.8},
    {"id": "MN", "name": "Manipur", "lfpr": 63.1, "lfprMale": 74.1, "lfprFemale": 52.6, "unemploymentRate": 5.2, "wpr": 59.8, "selfEmployed": 67.2},
    {"id": "ML", "name": "Meghalaya", "lfpr": 72.3, "lfprMale": 80.6, "lfprFemale": 64.3, "unemploymentRate": 4.8, "wpr": 68.9, "selfEmployed": 44.9},
    {"id": "NL", "name": "Nagaland", "lfpr": 72.1, "lfprMale": 79.7, "lfprFemale": 64.5, "unemploymentRate": 6.7, "wpr": 67.3, "selfEmployed": 67.3},
    {"id": "MZ", "name": "Mizoram", "lfpr": 53.9, "lfprMale": 67.8, "lfprFemale": 38.0, "unemploymentRate": 2.4, "wpr": 52.6, "selfEmployed": 64.6},
    {"id": "SK", "name": "Sikkim", "lfpr": 74.7, "lfprMale": 81.3, "lfprFemale": 66.7, "unemploymentRate": 3.2, "wpr": 72.3, "selfEmployed": 49.0},
    {"id": "AR", "name": "Arunachal Pradesh", "lfpr": 71.3, "lfprMale": 80.5, "lfprFemale": 61.7, "unemploymentRate": 6.6, "wpr": 66.6, "selfEmployed": 71.8},
]

# ── Sectoral Employment (PLFS 2025, Statement 8) ───────────────────
# Source: PLFS Annual Report 2025 (Jan–Dec 2025), Statement 8 — percentage
# distribution of workers in usual status (ps+ss) by broad industry division
# (NIC-2008), all-India, rural+urban, persons. Shares sum to ~100.
# Note: PLFS reports services as a single "other services" division (NIC
# sections K–U: finance/insurance, real estate, professional, public admin &
# defence, education, health, etc.) and does not split it further at the broad-
# division level. The earlier finance / public-admin / other split came from
# the RBI KLEMS database (a different source and methodology); it has been
# dropped so the whole employment domain is single-source PLFS 2025.
SECTORAL_EMPLOYMENT = [
    {"id": "agriculture", "name": "Agriculture & Allied", "employmentShare": 43.0},
    {"id": "other_services", "name": "Other Services", "employmentShare": 13.1},
    {"id": "trade_hotel", "name": "Trade, Hotel & Restaurant", "employmentShare": 12.9},
    {"id": "manufacturing", "name": "Manufacturing", "employmentShare": 12.1},
    {"id": "construction", "name": "Construction", "employmentShare": 12.0},
    {"id": "transport_comm", "name": "Transport, Storage & Communications", "employmentShare": 5.8},
    {"id": "utilities", "name": "Electricity, Water & Utilities", "employmentShare": 0.7},
    {"id": "mining", "name": "Mining & Quarrying", "employmentShare": 0.3},
]

# ── National headline numbers ──────────────────────────────────────
# Source: PLFS Annual Report 2025 (Jan–Dec 2025) + Quarterly Bulletin Oct-Dec 2025
# Annual figures refreshed 2026-06; each cross-verified between the MOSPI PLFS API
# (year=2025) and the printed PLFS 2025 report (Statements 1, 2 & 7).
NATIONAL_TOTALS = {
    "unemploymentRate": 3.1,        # PLFS 2025, usual status (ps+ss), 15+ (national)
    "lfpr": 59.3,                   # PLFS 2025, usual status (ps+ss), 15+
    "youthUnemployment": 9.9,       # PLFS 2025, usual status (ps+ss), 15-29 age group
    "femaleLfpr": 40.0,             # PLFS 2025, usual status (ps+ss), 15+ female (rural+urban)
    "workforceTotal": 57.4,         # crores (PLFS Oct-Dec 2025 quarterly)
    "selfEmployedPct": 56.2,        # PLFS 2025, Statement 7 (all self-employed, ps+ss, rural+urban, person)
}
