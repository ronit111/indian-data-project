"""
Crime & Safety — Curated data from authoritative sources.

Every figure traces to a primary government or institutional source.
This file is the single source of truth for India's crime and safety data.

Sources (2023 edition refresh):
  - NCRB "Crime in India 2023" (Part I, II & III): ncrb.gov.in — IPC/SLL crimes,
    crimes against women, cybercrime, court disposal, justice system.
    Part I = chapters 1–5 (overall, human-body, women, children); Part III =
    chapters 12–19 (incl. Table 18A.1 court disposal / conviction).
  - MoRTH "Road Accidents in India 2023": morth.gov.in — Road accidents,
    fatalities, causes.
  - BPRD "Data on Police Organisations" (as on 01.01.2023): bprd.nic.in —
    Police strength, vacancies, women in police.
  - I4C (Indian Cyber Crime Coordination Centre): cybercrime.gov.in —
    Complaint portal statistics (context only, not FIR counts).

Data period: Primarily 2014–2023 (10-year trends where available)
Publication: NCRB Crime in India 2023 published October 2025; MoRTH RAI 2023;
             BPRD DoPO as on 01.01.2023.

Note on accuracy:
  - NCRB figures cover cognizable crimes (FIR-based). Actual crime is higher
    due to underreporting, especially for crimes against women and cybercrime.
  - Kerala paradox: High crime rate often reflects better reporting and
    policing, not worse safety. This is annotated in the UI.
  - State IDs use uppercase vehicle registration (RTO) codes per project
    standard. Mapping: OD (Odisha), CG (Chhattisgarh), TS (Telangana).
  - MoRTH road data covers all road accidents (not just FIR-based), so
    totals are higher than NCRB motor vehicle accident counts.
  - "IPC" labels are retained because Crime in India 2023 still reports under
    IPC (the BNS transition begins with the 2024 data-year).

Derivations explicitly documented inline:
  - STATE_ROAD_FATALITIES.rate (deaths per lakh population): MoRTH publishes
    a state-wise rate only per-10,000-vehicles (Chart 4.3) and a per-lakh-
    population rate only at the all-India level (Table 1.8 = 12.5 in 2023).
    The per-lakh-population *state* rate below is COMPUTED as MoRTH-2023
    persons-killed (Table 5.6) ÷ NCRB-2023 mid-year projected population
    (Crime in India 2023, Table 1A.3), then rounded to 1 dp.
"""


# ══════════════════════════════════════════════════════════════════════
# NATIONAL CRIME TRENDS — 10 years (2014–2023)
# Source: NCRB "Crime in India" annual reports.
# 2021-2023 verified against NCRB Crime in India 2023, Table 1.1.
# 2020 verified against the 2023 "at-a-glance IPC" series (IPC 4,254,356)
# and NCRB CII-2022 Vol I. All figures = cognizable crimes (IPC + SLL).
# ══════════════════════════════════════════════════════════════════════

NATIONAL_CRIME_TREND = [
    # year, totalCrimes, ipcCrimes, sllCrimes, crimeRate (per lakh population)
    {"year": "2014", "total": 4730830, "ipc": 2851563, "sll": 1879267, "rate": 374.6},
    {"year": "2015", "total": 4647459, "ipc": 2810024, "sll": 1837435, "rate": 363.0},
    {"year": "2016", "total": 4831515, "ipc": 2975711, "sll": 1855804, "rate": 372.6},
    {"year": "2017", "total": 5059089, "ipc": 3091676, "sll": 1967413, "rate": 385.5},
    {"year": "2018", "total": 5015127, "ipc": 3132954, "sll": 1882173, "rate": 377.8},
    {"year": "2019", "total": 5156172, "ipc": 3225701, "sll": 1930471, "rate": 383.5},
    {"year": "2020", "total": 6601285, "ipc": 4254356, "sll": 2346929, "rate": 487.8},
    {"year": "2021", "total": 6096310, "ipc": 3663360, "sll": 2432950, "rate": 445.9},
    {"year": "2022", "total": 5824946, "ipc": 3561379, "sll": 2263567, "rate": 422.2},
    {"year": "2023", "total": 6241569, "ipc": 3763102, "sll": 2478467, "rate": 448.3},
]

# IPC crime composition breakdown — 2023
# Source: NCRB Crime in India 2023, Table 1.2 (IPC Crimes, Crime Head-wise).
# `pct` = published "Percentage Share of IPC Crimes" (col 9). other-ipc is the
# remainder so the slices sum to 100% of the 37,63,102 total IPC crimes.
IPC_CRIME_COMPOSITION = [
    {"id": "theft", "name": "Theft", "cases": 689580, "pct": 18.3},
    {"id": "hurt", "name": "Causing Hurt", "cases": 636767, "pct": 16.9},
    {"id": "cheating", "name": "Forgery, Cheating & Fraud", "cases": 181553, "pct": 4.8},
    {"id": "cruelty-women", "name": "Cruelty by Husband/Relatives", "cases": 133676, "pct": 3.6},
    {"id": "kidnapping", "name": "Kidnapping & Abduction", "cases": 113564, "pct": 3.0},
    {"id": "burglary", "name": "Burglary", "cases": 107573, "pct": 2.9},
    {"id": "assault-women", "name": "Assault on Women", "cases": 83891, "pct": 2.2},
    {"id": "riots", "name": "Riots", "cases": 39260, "pct": 1.0},
    {"id": "rape", "name": "Rape", "cases": 29670, "pct": 0.8},
    {"id": "murder", "name": "Murder", "cases": 27721, "pct": 0.7},
    {"id": "robbery", "name": "Robbery", "cases": 26599, "pct": 0.7},
    {"id": "other-ipc", "name": "Other IPC Crimes", "cases": 1693248, "pct": 45.1},
]


# ══════════════════════════════════════════════════════════════════════
# STATE-WISE CRIME RATES — 2023
# Source: NCRB Crime in India 2023, Table 1A.3 (Total Cognizable Crimes,
# State/UT-wise). Rate = total cognizable crimes per lakh population (2023).
# Uses uppercase vehicle registration (RTO) codes per project standard.
# ══════════════════════════════════════════════════════════════════════

STATE_CRIME_RATES = [
    {"id": "KL", "name": "Kerala", "rate": 1631.2, "total": 584373},
    {"id": "DL", "name": "Delhi", "rate": 1602.0, "total": 344263},
    {"id": "GJ", "name": "Gujarat", "rate": 806.3, "total": 578879},
    {"id": "HR", "name": "Haryana", "rate": 739.2, "total": 224216},
    {"id": "TN", "name": "Tamil Nadu", "rate": 701.4, "total": 539651},
    {"id": "MN", "name": "Manipur", "rate": 627.8, "total": 20283},
    {"id": "MP", "name": "Madhya Pradesh", "rate": 570.3, "total": 495708},
    {"id": "TS", "name": "Telangana", "rate": 481.6, "total": 183644},
    {"id": "MH", "name": "Maharashtra", "rate": 470.4, "total": 596103},
    {"id": "OD", "name": "Odisha", "rate": 431.2, "total": 199954},
    {"id": "RJ", "name": "Rajasthan", "rate": 390.4, "total": 317480},
    {"id": "CG", "name": "Chhattisgarh", "rate": 381.2, "total": 115493},
    {"id": "AP", "name": "Andhra Pradesh", "rate": 346.3, "total": 184293},
    {"id": "UP", "name": "Uttar Pradesh", "rate": 335.3, "total": 793020},
    {"id": "MZ", "name": "Mizoram", "rate": 326.3, "total": 4050},
    {"id": "KA", "name": "Karnataka", "rate": 315.8, "total": 214234},
    {"id": "UK", "name": "Uttarakhand", "rate": 291.3, "total": 34017},
    {"id": "BR", "name": "Bihar", "rate": 277.5, "total": 353502},
    {"id": "HP", "name": "Himachal Pradesh", "rate": 267.2, "total": 19987},
    {"id": "PB", "name": "Punjab", "rate": 227.1, "total": 69944},
    {"id": "JK", "name": "Jammu & Kashmir", "rate": 217.0, "total": 29595},
    {"id": "GA", "name": "Goa", "rate": 195.4, "total": 3082},
    {"id": "AR", "name": "Arunachal Pradesh", "rate": 187.9, "total": 2941},
    {"id": "WB", "name": "West Bengal", "rate": 181.6, "total": 180272},
    {"id": "AS", "name": "Assam", "rate": 181.3, "total": 64959},
    {"id": "JH", "name": "Jharkhand", "rate": 161.1, "total": 63838},
    {"id": "TR", "name": "Tripura", "rate": 120.4, "total": 5002},
    {"id": "ML", "name": "Meghalaya", "rate": 105.2, "total": 3532},
    {"id": "SK", "name": "Sikkim", "rate": 103.9, "total": 718},
    {"id": "NL", "name": "Nagaland", "rate": 84.9, "total": 1899},
]


# ══════════════════════════════════════════════════════════════════════
# CRIMES AGAINST WOMEN — national trends + breakdown
# Source: NCRB Crime in India 2023, Chapter 3A (Table 3A.1, 3A.2).
# ══════════════════════════════════════════════════════════════════════

WOMEN_CRIME_TREND = [
    # year, totalCases, ratePerLakhWomen
    {"year": "2014", "total": 337922, "rate": 56.3},
    {"year": "2015", "total": 327394, "rate": 53.9},
    {"year": "2016", "total": 338954, "rate": 55.2},
    {"year": "2017", "total": 359849, "rate": 57.9},
    {"year": "2018", "total": 378236, "rate": 58.8},
    {"year": "2019", "total": 405861, "rate": 62.4},
    {"year": "2020", "total": 371503, "rate": 56.5},
    {"year": "2021", "total": 428278, "rate": 64.5},
    {"year": "2022", "total": 445256, "rate": 66.4},
    {"year": "2023", "total": 448211, "rate": 66.2},
]

# Crime-against-women head breakdown — 2023
# Source: NCRB Crime in India 2023, "Crime against Women" snapshot (Table 3A.2):
# cruelty 1,33,676 (29.8%), kidnapping-of-women 88,605 (19.8%), assault/modesty
# 83,891 (18.71%), POCSO 66,232 (14.8%). Rape (29,670) and dowry deaths (6,156)
# from Table 1.2; other-women is the remainder to the 4,48,211 total.
# (Cyber crimes against women — 19,510, Table 9A.10 — are counted under the
# cyber chapter, not within this 4,48,211 total, so they are not a slice here.)
WOMEN_CRIME_TYPES = [
    {"id": "cruelty", "name": "Cruelty by Husband/Relatives", "cases": 133676, "pct": 29.8},
    {"id": "kidnapping", "name": "Kidnapping & Abduction of Women", "cases": 88605, "pct": 19.8},
    {"id": "assault", "name": "Assault to Outrage Modesty", "cases": 83891, "pct": 18.7},
    {"id": "pocso", "name": "POCSO (Child Sexual Offences)", "cases": 66232, "pct": 14.8},
    {"id": "rape", "name": "Rape", "cases": 29670, "pct": 6.6},
    {"id": "dowry-death", "name": "Dowry Deaths", "cases": 6156, "pct": 1.4},
    {"id": "other-women", "name": "Other Crimes Against Women", "cases": 39981, "pct": 8.9},
]

# State-wise crime against women rate (per lakh women population) — 2023
# Source: NCRB Crime in India 2023, Table 3A.1 (col 7 = rate, col 5 = total 2023).
STATE_WOMEN_CRIME_RATES = [
    {"id": "DL", "name": "Delhi", "rate": 133.6, "total": 13439},
    {"id": "TS", "name": "Telangana", "rate": 124.9, "total": 23678},
    {"id": "RJ", "name": "Rajasthan", "rate": 114.8, "total": 45450},
    {"id": "OD", "name": "Odisha", "rate": 112.4, "total": 25914},
    {"id": "HR", "name": "Haryana", "rate": 110.3, "total": 15758},
    {"id": "KL", "name": "Kerala", "rate": 86.1, "total": 16025},
    {"id": "AP", "name": "Andhra Pradesh", "rate": 84.2, "total": 22418},
    {"id": "MH", "name": "Maharashtra", "rate": 77.5, "total": 47101},
    {"id": "MP", "name": "Madhya Pradesh", "rate": 76.8, "total": 32342},
    {"id": "WB", "name": "West Bengal", "rate": 71.3, "total": 34691},
    {"id": "AS", "name": "Assam", "rate": 68.6, "total": 12070},
    {"id": "UK", "name": "Uttarakhand", "rate": 66.9, "total": 3808},
    {"id": "KA", "name": "Karnataka", "rate": 60.9, "total": 20336},
    {"id": "UP", "name": "Uttar Pradesh", "rate": 58.6, "total": 66381},
    {"id": "CG", "name": "Chhattisgarh", "rate": 53.2, "total": 8035},
    {"id": "HP", "name": "Himachal Pradesh", "rate": 43.5, "total": 1604},
    {"id": "AR", "name": "Arunachal Pradesh", "rate": 42.8, "total": 326},
    {"id": "SK", "name": "Sikkim", "rate": 41.0, "total": 134},
    {"id": "TR", "name": "Tripura", "rate": 38.7, "total": 791},
    {"id": "BR", "name": "Bihar", "rate": 37.5, "total": 22952},
    {"id": "ML", "name": "Meghalaya", "rate": 37.5, "total": 628},
    {"id": "GA", "name": "Goa", "rate": 36.5, "total": 286},
    {"id": "JH", "name": "Jharkhand", "rate": 36.1, "total": 6989},
    {"id": "PB", "name": "Punjab", "rate": 35.9, "total": 5258},
    {"id": "MZ", "name": "Mizoram", "rate": 29.9, "total": 184},
    {"id": "TN", "name": "Tamil Nadu", "rate": 23.2, "total": 8943},
    {"id": "GJ", "name": "Gujarat", "rate": 22.9, "total": 7805},
    {"id": "MN", "name": "Manipur", "rate": 12.5, "total": 201},
    {"id": "NL", "name": "Nagaland", "rate": 5.2, "total": 56},
]


# ══════════════════════════════════════════════════════════════════════
# ROAD ACCIDENTS — national trends
# Source: MoRTH "Road Accidents in India 2023".
# MoRTH figures are more comprehensive than NCRB motor vehicle FIRs.
# ══════════════════════════════════════════════════════════════════════

ROAD_ACCIDENT_TREND = [
    # year, accidents, killed, injured
    {"year": "2014", "accidents": 489400, "killed": 139671, "injured": 493474},
    {"year": "2015", "accidents": 501423, "killed": 146133, "injured": 500279},
    {"year": "2016", "accidents": 480652, "killed": 150785, "injured": 494624},
    {"year": "2017", "accidents": 464910, "killed": 147913, "injured": 470975},
    {"year": "2018", "accidents": 467044, "killed": 151417, "injured": 469418},
    {"year": "2019", "accidents": 449002, "killed": 151113, "injured": 451361},
    {"year": "2020", "accidents": 354796, "killed": 131714, "injured": 348279},
    {"year": "2021", "accidents": 412432, "killed": 153972, "injured": 384448},
    {"year": "2022", "accidents": 461312, "killed": 168491, "injured": 443366},
    {"year": "2023", "accidents": 480583, "killed": 172890, "injured": 462825},
]

# Cause-wise breakdown of road accidents — 2023 (% share of total accidents)
# Source: MoRTH Road Accidents in India 2023, Table 3.1 (Road Accidents by
# Type of Traffic Rule Violation). MoRTH 2023 groups all remaining violations
# (incl. overloading) under "Others".
ROAD_ACCIDENT_CAUSES = [
    {"id": "overspeeding", "name": "Over-speeding", "pct": 68.4},
    {"id": "wrong-side", "name": "Driving on Wrong Side / Lane Indiscipline", "pct": 5.25},
    {"id": "drunk-driving", "name": "Drunken Driving", "pct": 1.9},
    {"id": "mobile-use", "name": "Use of Mobile Phone", "pct": 1.48},
    {"id": "red-light", "name": "Jumping Red Light", "pct": 0.51},
    {"id": "other-causes", "name": "Other Causes", "pct": 22.45},
]

# State-wise road accident fatality rate (deaths per lakh population) — 2023
# `killed`: MoRTH Road Accidents in India 2023, Table 5.6 (verbatim).
# `rate`:   COMPUTED = killed ÷ NCRB-2023 mid-year projected population
#           (Crime in India 2023, Table 1A.3, in lakhs), rounded to 1 dp —
#           because MoRTH publishes a per-lakh-population rate only at the
#           all-India level (12.5 in 2023), not state-wise. See module docstring.
STATE_ROAD_FATALITIES = [
    {"id": "TN", "name": "Tamil Nadu", "rate": 23.8, "killed": 18347},
    {"id": "CG", "name": "Chhattisgarh", "rate": 20.4, "killed": 6166},
    {"id": "TS", "name": "Telangana", "rate": 20.1, "killed": 7660},
    {"id": "GA", "name": "Goa", "rate": 18.4, "killed": 290},
    {"id": "KA", "name": "Karnataka", "rate": 18.2, "killed": 12321},
    {"id": "HR", "name": "Haryana", "rate": 16.4, "killed": 4968},
    {"id": "MP", "name": "Madhya Pradesh", "rate": 15.9, "killed": 13798},
    {"id": "PB", "name": "Punjab", "rate": 15.7, "killed": 4829},
    {"id": "AP", "name": "Andhra Pradesh", "rate": 15.3, "killed": 8137},
    {"id": "RJ", "name": "Rajasthan", "rate": 14.5, "killed": 11762},
    {"id": "OD", "name": "Odisha", "rate": 12.4, "killed": 5739},
    {"id": "MH", "name": "Maharashtra", "rate": 12.1, "killed": 15366},
    {"id": "HP", "name": "Himachal Pradesh", "rate": 11.9, "killed": 889},
    {"id": "KL", "name": "Kerala", "rate": 11.4, "killed": 4080},
    {"id": "GJ", "name": "Gujarat", "rate": 10.9, "killed": 7854},
    {"id": "JH", "name": "Jharkhand", "rate": 10.5, "killed": 4173},
    {"id": "UP", "name": "Uttar Pradesh", "rate": 10.0, "killed": 23652},
    {"id": "AR", "name": "Arunachal Pradesh", "rate": 9.2, "killed": 145},
    {"id": "AS", "name": "Assam", "rate": 9.2, "killed": 3296},
    {"id": "UK", "name": "Uttarakhand", "rate": 9.0, "killed": 1054},
    {"id": "SK", "name": "Sikkim", "rate": 8.3, "killed": 57},
    {"id": "MZ", "name": "Mizoram", "rate": 7.7, "killed": 96},
    {"id": "BR", "name": "Bihar", "rate": 7.0, "killed": 8873},
    {"id": "DL", "name": "Delhi", "rate": 6.8, "killed": 1457},
    {"id": "TR", "name": "Tripura", "rate": 6.3, "killed": 261},
    {"id": "WB", "name": "West Bengal", "rate": 6.1, "killed": 6027},
    {"id": "ML", "name": "Meghalaya", "rate": 5.0, "killed": 168},
    {"id": "NL", "name": "Nagaland", "rate": 3.8, "killed": 86},
    {"id": "MN", "name": "Manipur", "rate": 2.3, "killed": 73},
]


# ══════════════════════════════════════════════════════════════════════
# CYBERCRIME — national trends
# Source: NCRB Crime in India 2023, Chapter 9A.
# Note: NCRB counts FIR-registered cybercrimes. I4C complaint portal
# numbers are much higher and NOT comparable.
# ══════════════════════════════════════════════════════════════════════

CYBERCRIME_TREND = [
    # year, totalCases (FIR-registered), ratePerLakh
    {"year": "2017", "cases": 21796, "rate": 1.7},
    {"year": "2018", "cases": 27248, "rate": 2.1},
    {"year": "2019", "cases": 44735, "rate": 3.3},
    {"year": "2020", "cases": 50035, "rate": 3.7},
    {"year": "2021", "cases": 52974, "rate": 3.8},
    {"year": "2022", "cases": 65893, "rate": 4.8},
    {"year": "2023", "cases": 86420, "rate": 6.2},
]

# Cybercrime motive breakdown — 2023
# Source: NCRB Crime in India 2023, Table 9A.3 (Cyber Crime Motives) +
# Chapter-9 snapshot: of 86,420 cases, fraud 59,526 (68.9%), sexual
# exploitation 4,199 (4.9%), extortion 3,326 (3.8%); other-cyber is the
# remainder. (2023 is reported by motive, not by the older crime-head split.)
CYBERCRIME_TYPES = [
    {"id": "fraud", "name": "Fraud", "cases": 59526, "pct": 68.9},
    {"id": "sexual", "name": "Sexual Exploitation", "cases": 4199, "pct": 4.9},
    {"id": "extortion", "name": "Extortion", "cases": 3326, "pct": 3.8},
    {"id": "other-cyber", "name": "Other Motives", "cases": 19369, "pct": 22.4},
]

# I4C complaint portal context (NOT FIR counts)
# Source: I4C annual report / cybercrime.gov.in. Complaint figure retained at
# the 2022 portal total (latest verified); compared against 2023 NCRB FIRs.
I4C_CONTEXT = {
    "complaints2022": 2268000,  # 22.68 lakh complaints registered on portal (2022, latest verified)
    "financialLossCrore": 2290,  # Rs 2,290 crore — NCRP reported financial loss (2022)
    "note": "I4C complaints are citizen-reported via portal. NCRB counts FIR-registered cases. "
            "The gap (22.68L complaints vs 86,420 cyber FIRs in 2023) reflects underregistration "
            "of cybercrime as FIRs.",
}


# ══════════════════════════════════════════════════════════════════════
# POLICE INFRASTRUCTURE
# Source: BPRD "Data on Police Organisations" (as on 01.01.2023)
# ══════════════════════════════════════════════════════════════════════

POLICE_NATIONAL = {
    "sanctionedStrength": 2722669,  # Table 3.1.1, All-India (Civil+DAR+Special Armed+IRB)
    "actualStrength": 2141305,      # Table 3.1.1, All-India actual
    "vacancyPct": 21.35,            # derived: 5,81,364 vacancy / 27,22,669 sanctioned
    "sanctionedRatePerLakh": 196.88,  # Table 2.1.3, All-India sanctioned per lakh (PPR)
    "actualRatePerLakh": 154.84,      # Table 2.1.3, All-India actual per lakh (UN recommends 222)
    "unRecommended": 222,            # UN recommended police-population ratio
    "womenPolicePct": 12.32,          # % women in actual total police force
    "womenPoliceTotal": 263762,
    "source": "BPRD Data on Police Organisations (as on 01.01.2023)",
}

# State-wise police-population ratio (per lakh) — as on 01.01.2023
# Source: BPRD DoPO 2023, Table 2.1.3 (TOTAL sanctioned / actual per lakh).
STATE_POLICE_RATIO = [
    {"id": "DL", "name": "Delhi", "sanctioned": 444.70, "actual": 380.20},
    {"id": "MN", "name": "Manipur", "sanctioned": 1093.80, "actual": 941.63},
    {"id": "NL", "name": "Nagaland", "sanctioned": 1201.48, "actual": 1135.94},
    {"id": "AR", "name": "Arunachal Pradesh", "sanctioned": 983.79, "actual": 766.75},
    {"id": "SK", "name": "Sikkim", "sanctioned": 999.56, "actual": 834.40},
    {"id": "MZ", "name": "Mizoram", "sanctioned": 916.63, "actual": 595.21},
    {"id": "GA", "name": "Goa", "sanctioned": 687.84, "actual": 498.47},
    {"id": "TR", "name": "Tripura", "sanctioned": 719.04, "actual": 555.57},
    {"id": "ML", "name": "Meghalaya", "sanctioned": 505.25, "actual": 422.92},
    {"id": "HP", "name": "Himachal Pradesh", "sanctioned": 257.71, "actual": 240.40},
    {"id": "PB", "name": "Punjab", "sanctioned": 278.39, "actual": 241.02},
    {"id": "CG", "name": "Chhattisgarh", "sanctioned": 266.79, "actual": 214.74},
    {"id": "AS", "name": "Assam", "sanctioned": 229.86, "actual": 205.74},
    {"id": "HR", "name": "Haryana", "sanctioned": 292.15, "actual": 199.08},
    {"id": "AP", "name": "Andhra Pradesh", "sanctioned": 200.40, "actual": 165.89},
    {"id": "TS", "name": "Telangana", "sanctioned": 226.47, "actual": 162.66},
    {"id": "TN", "name": "Tamil Nadu", "sanctioned": 172.56, "actual": 159.54},
    {"id": "JH", "name": "Jharkhand", "sanctioned": 211.04, "actual": 157.71},
    {"id": "KA", "name": "Karnataka", "sanctioned": 165.04, "actual": 150.95},
    {"id": "KL", "name": "Kerala", "sanctioned": 172.73, "actual": 150.68},
    {"id": "MH", "name": "Maharashtra", "sanctioned": 184.92, "actual": 136.83},
    {"id": "UP", "name": "Uttar Pradesh", "sanctioned": 182.24, "actual": 135.39},
    {"id": "GJ", "name": "Gujarat", "sanctioned": 173.50, "actual": 123.84},
    {"id": "MP", "name": "Madhya Pradesh", "sanctioned": 145.54, "actual": 121.13},
    {"id": "OD", "name": "Odisha", "sanctioned": 150.99, "actual": 120.58},
    {"id": "RJ", "name": "Rajasthan", "sanctioned": 140.61, "actual": 118.18},
    {"id": "UK", "name": "Uttarakhand", "sanctioned": 193.45, "actual": 183.96},
    {"id": "WB", "name": "West Bengal", "sanctioned": 166.93, "actual": 101.13},
    {"id": "BR", "name": "Bihar", "sanctioned": 114.57, "actual": 81.49},
]


# ══════════════════════════════════════════════════════════════════════
# JUSTICE PIPELINE — the funnel from FIR to conviction (IPC crimes)
# Source: NCRB Crime in India 2023 — police disposal (Part I snapshot Y +
# Part III Table 18A.1 col 3-6/19) and court disposal (Part III Table 18A.1).
# All figures are CASE-level and internally consistent for 2023.
# ══════════════════════════════════════════════════════════════════════

JUSTICE_PIPELINE = {
    "year": "2023",
    # FIR → Investigation → Chargesheet → Trial → Conviction (IPC cases)
    "totalCasesForInvestigation": 5361518,  # 15,84,912 pending + 37,63,102 new + 13,504 reopened
    "casesInvestigated": 3785839,           # cases disposed of by police
    "chargesheetFiled": 2753235,            # cases chargesheeted (= cases sent for trial)
    "chargesheetRate": 72.7,                # chargesheeted / disposed by police

    "totalCasesForTrial": 17990929,         # Table 18A.1: 1,52,37,694 pending + 27,53,235 new
    "casesTrialCompleted": 1678367,         # cases in which trials were completed
    "convicted": 907028,                    # CASES convicted (Table 18A.1)
    "acquitted": 706718,                    # CASES acquitted (excl. 64,621 discharged)
    "convictionRate": 54.0,                 # cases convicted / trials completed (NCRB official)

    "pendingInvestigation": 1565450,        # IPC cases pending investigation at year end (Table 18A pre)
    "pendingTrial": 15880050,               # cases pending trial at year end (Table 18A.1)
    "pendencyRate": 88.3,                   # % pending of total cases at courts

    "source": "NCRB Crime in India 2023 — Disposal of IPC Cases by Police & Courts (Table 18A.1)",
}

# Average trial duration (indicative)
# Source: National Judicial Data Grid (NJDG) + NCRB
TRIAL_DURATION = {
    "avgYears": 3.5,  # Approximate average for IPC cases
    "casesOver5Years": 28.6,  # % of pending cases older than 5 years
    "casesOver10Years": 10.2,  # % of pending cases older than 10 years
    "judgesPerMillionPopulation": 21.0,  # India vs global avg of ~50
    "source": "NJDG + NCRB Crime in India 2023",
}


# ══════════════════════════════════════════════════════════════════════
# NATIONAL SUMMARY TOTALS — 2023
# Source: NCRB CII 2023 + MoRTH RAI 2023 + BPRD DoPO 2023
# Used for hub card stat pills and hero section.
# ══════════════════════════════════════════════════════════════════════

NATIONAL_TOTALS = {
    "totalCrimes": 6241569,
    "crimeRate": 448.3,
    "roadDeaths": 172890,
    "cybercrimes": 86420,
    "convictionRatePct": 54.0,
    "chargesheetRatePct": 72.7,
    "policeRatioActual": 154.84,
    "womenCrimes": 448211,
    "womenCrimeRate": 66.2,
    "pendingTrialCases": 15880050,
    "dataYear": "2023",
}
