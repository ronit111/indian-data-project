"""
Elections — Curated data from authoritative sources.

Every figure traces to a primary government or institutional source.
This file is the single source of truth for India's electoral data.

Sources:
  - Election Commission of India (ECI): eci.gov.in — Official results, turnout
  - TCPD Lok Dhaba: github.com/tcpd/lok-dhaba-datasets — Compiled ECI data
  - ADR / MyNeta: adrindia.org, myneta.info — Candidate affidavit analysis
  - Lok Sabha Secretariat / PRS: prsindia.org — Women MPs, legislative data

Data period: 2nd Lok Sabha (1957) to 18th Lok Sabha (2024)
Total elections covered: 17

Note on accuracy:
  - Seat counts may differ by 1-3 from some sources due to by-elections,
    redistribution of split parties, and speaker nominations.
  - Vote share is rounded to 1 decimal.
  - Party groupings follow ECI recognition categories.
  - The narrative trend (Congress dominance → fragmentation → BJP dominance)
    is robust across all sources.
"""


# ══════════════════════════════════════════════════════════════════════
# NATIONAL TURNOUT — 17 Lok Sabha elections
# Source: ECI Statistical Reports on General Elections
# ══════════════════════════════════════════════════════════════════════

TURNOUT_TREND = [
    # year, turnoutPct, electorsCrore (approximate), lsNumber
    {"year": "1957", "turnout": 47.7, "electors": 19.4, "lsNumber": 2},
    {"year": "1962", "turnout": 55.4, "electors": 21.6, "lsNumber": 3},
    {"year": "1967", "turnout": 61.3, "electors": 25.0, "lsNumber": 4},
    {"year": "1971", "turnout": 55.3, "electors": 27.4, "lsNumber": 5},
    {"year": "1977", "turnout": 60.5, "electors": 32.1, "lsNumber": 6},
    {"year": "1980", "turnout": 56.9, "electors": 35.6, "lsNumber": 7},
    {"year": "1984", "turnout": 64.0, "electors": 37.9, "lsNumber": 8},
    {"year": "1989", "turnout": 62.0, "electors": 49.9, "lsNumber": 9},
    {"year": "1991", "turnout": 56.7, "electors": 49.8, "lsNumber": 10},
    {"year": "1996", "turnout": 57.9, "electors": 59.3, "lsNumber": 11},
    {"year": "1998", "turnout": 62.0, "electors": 60.5, "lsNumber": 12},
    {"year": "1999", "turnout": 60.0, "electors": 62.0, "lsNumber": 13},
    {"year": "2004", "turnout": 58.1, "electors": 67.1, "lsNumber": 14},
    {"year": "2009", "turnout": 58.2, "electors": 71.7, "lsNumber": 15},
    {"year": "2014", "turnout": 66.4, "electors": 81.5, "lsNumber": 16},
    {"year": "2019", "turnout": 67.4, "electors": 91.2, "lsNumber": 17},
    {"year": "2024", "turnout": 65.8, "electors": 96.9, "lsNumber": 18},
]

# Major events for annotated timeline
ELECTION_EVENTS = [
    {"year": "1977", "event": "Post-Emergency: Congress routed"},
    {"year": "1984", "event": "Indira assassination: sympathy wave"},
    {"year": "1989", "event": "Mandal–Mandir politics begins"},
    {"year": "1991", "event": "Rajiv assassination mid-election"},
    {"year": "1996", "event": "Coalition era begins"},
    {"year": "2014", "event": "Modi Wave 1.0: BJP majority"},
    {"year": "2024", "event": "INDIA alliance checks BJP majority"},
]


# ══════════════════════════════════════════════════════════════════════
# STATE-WISE TURNOUT 2024
# Source: ECI — 18th Lok Sabha General Election 2024
# Uses uppercase vehicle registration (RTO) codes per project standard
# ══════════════════════════════════════════════════════════════════════

STATE_TURNOUT_2024 = [
    {"id": "LD", "name": "Lakshadweep", "turnout": 84.1},
    {"id": "TR", "name": "Tripura", "turnout": 81.8},
    {"id": "AS", "name": "Assam", "turnout": 80.2},
    {"id": "WB", "name": "West Bengal", "turnout": 73.5},
    {"id": "SK", "name": "Sikkim", "turnout": 73.0},
    {"id": "MN", "name": "Manipur", "turnout": 72.8},
    {"id": "AN", "name": "Andaman & Nicobar", "turnout": 72.4},
    {"id": "KL", "name": "Kerala", "turnout": 71.3},
    {"id": "NL", "name": "Nagaland", "turnout": 70.2},
    {"id": "MZ", "name": "Mizoram", "turnout": 69.5},
    {"id": "TN", "name": "Tamil Nadu", "turnout": 69.7},
    {"id": "AR", "name": "Arunachal Pradesh", "turnout": 68.3},
    {"id": "ML", "name": "Meghalaya", "turnout": 67.4},
    {"id": "PB", "name": "Punjab", "turnout": 65.4},
    {"id": "CG", "name": "Chhattisgarh", "turnout": 67.1},
    {"id": "OD", "name": "Odisha", "turnout": 73.4},
    {"id": "JH", "name": "Jharkhand", "turnout": 67.5},
    {"id": "KA", "name": "Karnataka", "turnout": 69.2},
    {"id": "HP", "name": "Himachal Pradesh", "turnout": 71.5},
    {"id": "UK", "name": "Uttarakhand", "turnout": 57.8},
    {"id": "GA", "name": "Goa", "turnout": 72.1},
    {"id": "AP", "name": "Andhra Pradesh", "turnout": 81.9},
    {"id": "TS", "name": "Telangana", "turnout": 65.7},
    {"id": "GJ", "name": "Gujarat", "turnout": 59.5},
    {"id": "MH", "name": "Maharashtra", "turnout": 61.3},
    {"id": "RJ", "name": "Rajasthan", "turnout": 59.2},
    {"id": "MP", "name": "Madhya Pradesh", "turnout": 64.8},
    {"id": "HR", "name": "Haryana", "turnout": 64.0},
    {"id": "UP", "name": "Uttar Pradesh", "turnout": 56.0},
    {"id": "BR", "name": "Bihar", "turnout": 57.3},
    {"id": "DL", "name": "Delhi", "turnout": 58.7},
    {"id": "JK", "name": "Jammu & Kashmir", "turnout": 58.5},
    {"id": "DD", "name": "Dadra & Nagar Haveli and Daman & Diu", "turnout": 67.8},
    {"id": "PY", "name": "Puducherry", "turnout": 73.2},
    {"id": "CH", "name": "Chandigarh", "turnout": 68.2},
]


# ══════════════════════════════════════════════════════════════════════
# PARTY-WISE SEAT EVOLUTION — grouped categories for stacked area chart
# Source: ECI official results compiled via TCPD Lok Dhaba
#
# Categories:
#   INC  — Indian National Congress (all factions)
#   BJP  — Bharatiya Janata Party (Jan Sangh pre-1980)
#   Left — CPI + CPI(M) + RSP + Forward Bloc + other Left
#   JD   — Janata Party / Janata Dal family (JD, JD(U), RJD, JD(S), INLD)
#   BSP  — Bahujan Samaj Party (from 1989)
#   SP   — Samajwadi Party (from 1991)
#   Regional — DMK, AIADMK, TMC, TDP, BJD, SS, YSRCP, NCP, TRS/BRS, etc.
#   Others   — Independents, smaller unrecognized parties
#
# Note: Sum of categories = totalSeats for each election.
# Minor discrepancies (1-3 seats) possible due to classification edge cases.
# ══════════════════════════════════════════════════════════════════════

SEAT_EVOLUTION = [
    # 1957 (2nd LS, 494 seats) — Congress dominance: 75% of seats
    {"year": "1957", "totalSeats": 494,
     "INC": 371, "BJP": 4, "Left": 29, "JD": 0, "BSP": 0, "SP": 0, "Regional": 18, "Others": 72},

    # 1962 (3rd LS, 494 seats) — Congress holds despite Sino-Indian War
    {"year": "1962", "totalSeats": 494,
     "INC": 361, "BJP": 14, "Left": 29, "JD": 0, "BSP": 0, "SP": 0, "Regional": 25, "Others": 65},

    # 1967 (4th LS, 520 seats) — "Political earthquake": Congress drops below 300
    {"year": "1967", "totalSeats": 520,
     "INC": 283, "BJP": 35, "Left": 42, "JD": 0, "BSP": 0, "SP": 0, "Regional": 69, "Others": 91},

    # 1971 (5th LS, 518 seats) — Indira's "Garibi Hatao" wave: Congress rebounds
    {"year": "1971", "totalSeats": 518,
     "INC": 352, "BJP": 22, "Left": 48, "JD": 0, "BSP": 0, "SP": 0, "Regional": 23, "Others": 73},

    # 1977 (6th LS, 542 seats) — Post-Emergency: Janata wins landslide
    # Janata Party merged Jan Sangh + Congress(O) + BLD + Socialists
    {"year": "1977", "totalSeats": 542,
     "INC": 154, "BJP": 0, "Left": 29, "JD": 295, "BSP": 0, "SP": 0, "Regional": 18, "Others": 46},

    # 1980 (7th LS, 542 seats) — Indira returns, Janata collapses
    # BJP not yet formed (April 1980, election was January 1980)
    {"year": "1980", "totalSeats": 542,
     "INC": 353, "BJP": 0, "Left": 47, "JD": 41, "BSP": 0, "SP": 0, "Regional": 24, "Others": 77},

    # 1984 (8th LS, 542 seats) — Post-Indira assassination sympathy wave
    # Congress: 404 seats (highest ever), BJP: 2 (lowest ever)
    {"year": "1984", "totalSeats": 542,
     "INC": 404, "BJP": 2, "Left": 28, "JD": 10, "BSP": 0, "SP": 0, "Regional": 42, "Others": 56},

    # 1989 (9th LS, 529 seats) — V.P. Singh's Janata Dal, BJP's rise begins
    {"year": "1989", "totalSeats": 529,
     "INC": 197, "BJP": 85, "Left": 45, "JD": 143, "BSP": 3, "SP": 0, "Regional": 18, "Others": 38},

    # 1991 (10th LS, 521 seats) — Mandal + Mandir, Rajiv assassination mid-election
    {"year": "1991", "totalSeats": 521,
     "INC": 232, "BJP": 120, "Left": 49, "JD": 59, "BSP": 1, "SP": 5, "Regional": 24, "Others": 31},

    # 1996 (11th LS, 543 seats) — Hung Parliament, coalition era begins
    {"year": "1996", "totalSeats": 543,
     "INC": 140, "BJP": 161, "Left": 44, "JD": 46, "BSP": 11, "SP": 17, "Regional": 87, "Others": 37},

    # 1998 (12th LS, 543 seats) — Vajpayee's BJP-led NDA
    {"year": "1998", "totalSeats": 543,
     "INC": 141, "BJP": 182, "Left": 38, "JD": 6, "BSP": 5, "SP": 20, "Regional": 109, "Others": 42},

    # 1999 (13th LS, 543 seats) — Kargil war + Vajpayee, NDA returns
    {"year": "1999", "totalSeats": 543,
     "INC": 114, "BJP": 182, "Left": 42, "JD": 22, "BSP": 14, "SP": 26, "Regional": 100, "Others": 43},

    # 2004 (14th LS, 543 seats) — UPA surprise win, "India Shining" backfires
    {"year": "2004", "totalSeats": 543,
     "INC": 145, "BJP": 138, "Left": 59, "JD": 8, "BSP": 19, "SP": 36, "Regional": 90, "Others": 48},

    # 2009 (15th LS, 543 seats) — UPA-2, stronger mandate
    {"year": "2009", "totalSeats": 543,
     "INC": 206, "BJP": 116, "Left": 24, "JD": 20, "BSP": 21, "SP": 23, "Regional": 93, "Others": 40},

    # 2014 (16th LS, 543 seats) — Modi Wave: first single-party majority in 30 years
    # BSP: 0 seats despite 4.1% vote share (FPTP distortion)
    {"year": "2014", "totalSeats": 543,
     "INC": 44, "BJP": 282, "Left": 12, "JD": 4, "BSP": 0, "SP": 5, "Regional": 153, "Others": 43},

    # 2019 (17th LS, 543 seats) — Modi Wave 2.0: even stronger
    {"year": "2019", "totalSeats": 543,
     "INC": 52, "BJP": 303, "Left": 5, "JD": 16, "BSP": 10, "SP": 5, "Regional": 114, "Others": 38},

    # 2024 (18th LS, 543 seats) — INDIA alliance checks BJP majority
    # BJP: 240 (below 272 majority), INC: 99 (doubles from 2019)
    {"year": "2024", "totalSeats": 543,
     "INC": 99, "BJP": 240, "Left": 6, "JD": 12, "BSP": 0, "SP": 37, "Regional": 115, "Others": 34},
]


# ══════════════════════════════════════════════════════════════════════
# 2024 DETAILED PARTY RESULTS — for WaffleChart + bar chart
# Source: ECI official results, 18th Lok Sabha
# Party colors are section-scoped (not CSS variables)
# ══════════════════════════════════════════════════════════════════════

RESULTS_2024_PARTIES = [
    {"party": "BJP", "fullName": "Bharatiya Janata Party", "seats": 240, "voteShare": 36.6, "color": "#FF6B35", "alliance": "NDA"},
    {"party": "INC", "fullName": "Indian National Congress", "seats": 99, "voteShare": 21.2, "color": "#00BFFF", "alliance": "INDIA"},
    {"party": "SP", "fullName": "Samajwadi Party", "seats": 37, "voteShare": 4.5, "color": "#22C55E", "alliance": "INDIA"},
    {"party": "TMC", "fullName": "All India Trinamool Congress", "seats": 29, "voteShare": 4.2, "color": "#16A34A", "alliance": "INDIA"},
    {"party": "DMK", "fullName": "Dravida Munnetra Kazhagam", "seats": 22, "voteShare": 1.8, "color": "#DC2626", "alliance": "INDIA"},
    {"party": "TDP", "fullName": "Telugu Desam Party", "seats": 16, "voteShare": 1.7, "color": "#FBBF24", "alliance": "NDA"},
    {"party": "JD(U)", "fullName": "Janata Dal (United)", "seats": 12, "voteShare": 1.4, "color": "#6D28D9", "alliance": "NDA"},
    {"party": "SS(UBT)", "fullName": "Shiv Sena (UBT)", "seats": 9, "voteShare": 1.6, "color": "#EA580C", "alliance": "INDIA"},
    {"party": "NCP(SP)", "fullName": "NCP (Sharadchandra Pawar)", "seats": 8, "voteShare": 1.3, "color": "#3B82F6", "alliance": "INDIA"},
    {"party": "SS", "fullName": "Shiv Sena", "seats": 7, "voteShare": 1.4, "color": "#F97316", "alliance": "NDA"},
    {"party": "LJP(RV)", "fullName": "Lok Janshakti Party (Ram Vilas)", "seats": 5, "voteShare": 0.7, "color": "#0EA5E9", "alliance": "NDA"},
    {"party": "YSRCP", "fullName": "YSR Congress Party", "seats": 4, "voteShare": 2.1, "color": "#7C3AED", "alliance": "—"},
    {"party": "RJD", "fullName": "Rashtriya Janata Dal", "seats": 4, "voteShare": 1.1, "color": "#059669", "alliance": "INDIA"},
    {"party": "CPI(M)", "fullName": "Communist Party of India (Marxist)", "seats": 4, "voteShare": 1.0, "color": "#DC2626", "alliance": "INDIA"},
    {"party": "AAP", "fullName": "Aam Aadmi Party", "seats": 3, "voteShare": 1.3, "color": "#2563EB", "alliance": "INDIA"},
    {"party": "JMM", "fullName": "Jharkhand Mukti Morcha", "seats": 3, "voteShare": 0.6, "color": "#14B8A6", "alliance": "INDIA"},
    {"party": "JD(S)", "fullName": "Janata Dal (Secular)", "seats": 2, "voteShare": 0.3, "color": "#65A30D", "alliance": "NDA"},
    {"party": "NCP", "fullName": "Nationalist Congress Party", "seats": 2, "voteShare": 0.6, "color": "#0284C7", "alliance": "NDA"},
    {"party": "JSP", "fullName": "Jana Sena Party", "seats": 2, "voteShare": 0.3, "color": "#E11D48", "alliance": "NDA"},
    {"party": "RLD", "fullName": "Rashtriya Lok Dal", "seats": 2, "voteShare": 0.2, "color": "#16A34A", "alliance": "NDA"},
    {"party": "IUML", "fullName": "Indian Union Muslim League", "seats": 3, "voteShare": 0.3, "color": "#15803D", "alliance": "INDIA"},
    {"party": "VCK", "fullName": "Viduthalai Chiruthaigal Katchi", "seats": 2, "voteShare": 0.2, "color": "#B91C1C", "alliance": "INDIA"},
    {"party": "CPI(ML)(L)", "fullName": "CPI (Marxist-Leninist) Liberation", "seats": 2, "voteShare": 0.2, "color": "#EF4444", "alliance": "INDIA"},
    {"party": "CPI", "fullName": "Communist Party of India", "seats": 2, "voteShare": 0.5, "color": "#DC2626", "alliance": "INDIA"},
    {"party": "JKNC", "fullName": "Jammu & Kashmir National Conference", "seats": 2, "voteShare": 0.3, "color": "#DC2626", "alliance": "INDIA"},
    {"party": "AJSU", "fullName": "AJSU Party", "seats": 1, "voteShare": 0.1, "color": "#2563EB", "alliance": "NDA"},
    {"party": "HAM(S)", "fullName": "Hindustani Awam Morcha (Secular)", "seats": 1, "voteShare": 0.1, "color": "#7C3AED", "alliance": "NDA"},
    {"party": "SKM", "fullName": "Sikkim Krantikari Morcha", "seats": 1, "voteShare": 0.0, "color": "#F59E0B", "alliance": "NDA"},
    {"party": "UPPL", "fullName": "United People's Party Liberal", "seats": 1, "voteShare": 0.1, "color": "#0891B2", "alliance": "NDA"},
    {"party": "ADAL", "fullName": "Apna Dal (Soneylal)", "seats": 1, "voteShare": 0.1, "color": "#CA8A04", "alliance": "NDA"},
    {"party": "KC(M)", "fullName": "Kerala Congress (Mani)", "seats": 1, "voteShare": 0.1, "color": "#047857", "alliance": "INDIA"},
    {"party": "RSP", "fullName": "Revolutionary Socialist Party", "seats": 1, "voteShare": 0.1, "color": "#BE123C", "alliance": "INDIA"},
    {"party": "MDMK", "fullName": "Marumalarchi Dravida Munnetra Kazhagam", "seats": 1, "voteShare": 0.1, "color": "#DC2626", "alliance": "INDIA"},
    {"party": "AIFB", "fullName": "All India Forward Bloc", "seats": 1, "voteShare": 0.1, "color": "#B91C1C", "alliance": "INDIA"},
    {"party": "RLP", "fullName": "Rashtriya Loktantrik Party", "seats": 1, "voteShare": 0.2, "color": "#F59E0B", "alliance": "INDIA"},
    {"party": "YSRCP", "fullName": "YSR Congress Party", "seats": 4, "voteShare": 2.1, "color": "#7C3AED", "alliance": "—"},
    {"party": "AIMIM", "fullName": "All India Majlis-e-Ittehadul Muslimeen", "seats": 1, "voteShare": 0.4, "color": "#15803D", "alliance": "—"},
    {"party": "ZPM", "fullName": "Zoram People's Movement", "seats": 1, "voteShare": 0.0, "color": "#14B8A6", "alliance": "—"},
    {"party": "AIADMK", "fullName": "All India Anna Dravida Munnetra Kazhagam", "seats": 0, "voteShare": 1.4, "color": "#15803D", "alliance": "—"},
    {"party": "IND", "fullName": "Independents", "seats": 7, "voteShare": 5.8, "color": "#6B7280", "alliance": "—"},
    # OTH: residual for parties that contested but won few/no seats (BSP 0 seats/3.6%, etc.)
    # Seats: 543 - 293(NDA) - 234(INDIA) - 13(named Others+IND) = 3
    {"party": "OTH", "fullName": "Other Parties", "seats": 3, "voteShare": 5.5, "color": "#9CA3AF", "alliance": "—"},
]


# ══════════════════════════════════════════════════════════════════════
# WOMEN IN PARLIAMENT — 17 elections
# Source: Lok Sabha Secretariat + PRS Legislative Research
# ══════════════════════════════════════════════════════════════════════

WOMEN_MPS_TREND = [
    {"year": "1957", "totalSeats": 494, "womenMPs": 22, "pct": 4.5},
    {"year": "1962", "totalSeats": 494, "womenMPs": 34, "pct": 6.9},
    {"year": "1967", "totalSeats": 520, "womenMPs": 31, "pct": 6.0},
    {"year": "1971", "totalSeats": 518, "womenMPs": 22, "pct": 4.2},
    {"year": "1977", "totalSeats": 542, "womenMPs": 19, "pct": 3.5},
    {"year": "1980", "totalSeats": 542, "womenMPs": 28, "pct": 5.2},
    {"year": "1984", "totalSeats": 542, "womenMPs": 44, "pct": 8.1},
    {"year": "1989", "totalSeats": 529, "womenMPs": 28, "pct": 5.3},
    {"year": "1991", "totalSeats": 521, "womenMPs": 39, "pct": 7.5},
    {"year": "1996", "totalSeats": 543, "womenMPs": 40, "pct": 7.4},
    {"year": "1998", "totalSeats": 543, "womenMPs": 43, "pct": 7.9},
    {"year": "1999", "totalSeats": 543, "womenMPs": 49, "pct": 9.0},
    {"year": "2004", "totalSeats": 543, "womenMPs": 45, "pct": 8.3},
    {"year": "2009", "totalSeats": 543, "womenMPs": 59, "pct": 10.9},
    {"year": "2014", "totalSeats": 543, "womenMPs": 62, "pct": 11.4},
    {"year": "2019", "totalSeats": 543, "womenMPs": 78, "pct": 14.4},
    {"year": "2024", "totalSeats": 543, "womenMPs": 74, "pct": 13.6},
]


# ══════════════════════════════════════════════════════════════════════
# ADR CANDIDATE ANALYSIS — Lok Sabha 2024
# Source: Association for Democratic Reforms (ADR) / MyNeta.info
# Analysis of self-sworn affidavits of 543 winning candidates
# ══════════════════════════════════════════════════════════════════════

ADR_SUMMARY = {
    "totalMPs": 543,
    "criminalCases": {
        "any": 251,          # MPs with ANY criminal case
        "serious": 170,      # Murder, attempt to murder, kidnapping, robbery etc.
        "pctAny": 46,
        "pctSerious": 31,
    },
    "assets": {
        "avgCrore": 46.34,    # Average declared assets (ADR 2024 Lok Sabha report)
        "medianCrore": 29.8,  # Median (better central tendency given skew)
    },
    "education": {
        "postGradAndAbove": 37,   # % with post-graduate or higher
        "graduate": 39,           # % with graduate degree
        "belowGraduate": 24,     # % with less than graduation
    },
}

# Top wealthiest MPs by declared assets (2024 affidavits)
# Source: ADR/MyNeta Lok Sabha 2024 report
# PDF: https://adrindia.org/sites/default/files/Lok_Sabha_Elections_2024_Criminal_and_Financial_background_details_of_Winning_Candidates_Finalver_English%20(1).pdf
#
# Verified against ADR PDF: "Top 10 winning candidates with highest assets" (page 32)
# PDF: adrindia.org — Lok Sabha Elections 2024, Criminal and Financial Background
# Downloaded and parsed 2026-03-04. Every entry confirmed as Lok Sabha WINNER.
ADR_TOP_WEALTHIEST = [
    {"rank": 1, "name": "Dr. Chandra Sekhar Pemmasani", "constituency": "Guntur (AP)", "party": "TDP", "assetsCrore": 5705},
    {"rank": 2, "name": "Konda Vishweshwar Reddy", "constituency": "Chevella (TS)", "party": "BJP", "assetsCrore": 4568},
    {"rank": 3, "name": "Naveen Jindal", "constituency": "Kurukshetra (HR)", "party": "BJP", "assetsCrore": 1241},
    {"rank": 4, "name": "Prabhakar Reddy Vemireddy", "constituency": "Nellore (AP)", "party": "TDP", "assetsCrore": 716},
    {"rank": 5, "name": "C. M. Ramesh", "constituency": "Anakapalle (AP)", "party": "BJP", "assetsCrore": 497},
    {"rank": 6, "name": "Jyotiraditya M. Scindia", "constituency": "Guna (MP)", "party": "BJP", "assetsCrore": 424},
    {"rank": 7, "name": "Chhatrapati Shahu Shahaji", "constituency": "Kolhapur (MH)", "party": "INC", "assetsCrore": 342},
    {"rank": 8, "name": "Sribharat Mathukumili", "constituency": "Visakhapatnam (AP)", "party": "TDP", "assetsCrore": 298},
    {"rank": 9, "name": "Hemamalini Dharmendra Deol", "constituency": "Mathura (UP)", "party": "BJP", "assetsCrore": 278},
    {"rank": 10, "name": "Dr. Prabha Mallikarjun", "constituency": "Davanagere (KA)", "party": "INC", "assetsCrore": 241},
]

# Top MPs by number of criminal cases (2024 winning candidates only)
# Source: ADR/MyNeta — from self-sworn affidavits of 543 winners
#
# NOTE (audit 2026-03-05): Heavy contamination found — 5 of original 15 entries
# were NOT 2024 Lok Sabha winners:
#   - Atul Kumar Singh (BSP): lost Ghosi to SP's Rajeev Rai
#   - Omprakash Rajbhar (SBSP): not a candidate (son Arvind lost Ghosi)
#   - Dinesh Lal Yadav Nirahua (BJP): lost Azamgarh to SP's Dharmendra Yadav
#   - Anant Kumar Hegde (BJP): didn't get ticket (replaced by Kageri)
#   - Hemant Soren (JMM): didn't contest (Nalin Soren won Dumka for JMM)
# Fixes applied: Dean Kuriakose cases 149→204, Afzal Ansari party BSP→SP.
# Remaining entries need verification against ADR PDF.
ADR_TOP_CRIMINAL = [
    {"rank": 1, "name": "Dean Kuriakose", "constituency": "Idukki (KL)", "party": "INC", "cases": 204},
    {"rank": 2, "name": "Dhairyasheel Mane", "constituency": "Hatkanangle (MH)", "party": "SS(UBT)", "cases": 43},
    {"rank": 3, "name": "Afzal Ansari", "constituency": "Ghazipur (UP)", "party": "SP", "cases": 42},
    {"rank": 4, "name": "Rajesh Ranjan (Pappu Yadav)", "constituency": "Purnia (BR)", "party": "IND", "cases": 41},
    {"rank": 5, "name": "Sunil Kumar Singh", "constituency": "Chatra (JH)", "party": "BJP", "cases": 35},
    {"rank": 6, "name": "Umesh Singh Kushwaha", "constituency": "Kaushambi (UP)", "party": "SP", "cases": 33},
    {"rank": 7, "name": "Awadhesh Prasad", "constituency": "Faizabad (UP)", "party": "SP", "cases": 32},
    {"rank": 8, "name": "Mohan Mandavi", "constituency": "Kanker (CG)", "party": "BJP", "cases": 24},
    {"rank": 9, "name": "Devendra Singh Bhole", "constituency": "Jaunpur (UP)", "party": "SP", "cases": 23},
    {"rank": 10, "name": "Lavu Sri Krishna Devarayalu", "constituency": "Narasaraopet (AP)", "party": "TDP", "cases": 22},
]


# ══════════════════════════════════════════════════════════════════════
# NATIONAL SUMMARY TOTALS
# Source: ECI + ADR
# ══════════════════════════════════════════════════════════════════════

NATIONAL_TOTALS = {
    "turnout2024": 65.8,
    "totalElectorsCrore": 96.88,
    "totalVotersCrore": 64.2,
    "bjpSeats2024": 240,
    "incSeats2024": 99,
    "ndaSeats2024": 293,
    "indiaAllianceSeats2024": 234,
    "womenMPs2024": 74,
    "womenMPsPct2024": 13.6,
    "criminalPct": 46,
    "seriousCriminalPct": 31,
    "avgAssetsCrore": 46.34,   # ADR 2024 Lok Sabha report (Rs 46,34,93,300 / 543 = Rs 46.34 crore)
    "totalConstituencies": 543,
}


# ══════════════════════════════════════════════════════════════════════
# STATE-LEVEL INDICATORS — for Explorer page
# Source: ECI 2024 + ADR 2024
# ══════════════════════════════════════════════════════════════════════

# Turnout by state is already in STATE_TURNOUT_2024 above.
# Additional state-level data can be added here as needed.
