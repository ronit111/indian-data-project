"""
Crime & Safety — Curated data from authoritative sources.

Every figure traces to a primary government or institutional source.
This file is the single source of truth for India's crime and safety data.

Sources:
  - NCRB "Crime in India 2022" (Vol I & II): ncrb.gov.in — IPC/SLL crimes,
    crimes against women, cybercrime, police, justice system
  - MoRTH "Road Accidents in India 2022": morth.nic.in — Road accidents,
    fatalities, causes
  - BPRD "Data on Police Organisations 2022": bprd.nic.in — Police strength,
    vacancies, women in police
  - I4C (Indian Cyber Crime Coordination Centre): cybercrime.gov.in —
    Complaint portal statistics (context only, not FIR counts)

Data period: Primarily 2014–2022 (10-year trends where available)
Publication: NCRB Crime in India 2022 published December 2023

Note on accuracy:
  - NCRB figures cover cognizable crimes (FIR-based). Actual crime is higher
    due to underreporting, especially for crimes against women and cybercrime.
  - Kerala paradox: High crime rate often reflects better reporting and
    policing, not worse safety. This is annotated in the UI.
  - State IDs use uppercase vehicle registration (RTO) codes per project
    standard. Mapping: OD (Odisha), CG (Chhattisgarh), TS (Telangana).
  - MoRTH road data covers all road accidents (not just FIR-based), so
    totals are higher than NCRB motor vehicle accident counts.
  - I4C complaint portal numbers (22.68 lakh in 2022) are NOT comparable
    to NCRB FIR counts (65,893 in 2022) — different systems.
"""


# ══════════════════════════════════════════════════════════════════════
# NATIONAL CRIME TRENDS — 10 years (2014–2022)
# Source: NCRB "Crime in India" annual reports
# All figures are cognizable crimes registered (IPC + SLL combined)
# ══════════════════════════════════════════════════════════════════════

NATIONAL_CRIME_TREND = [
    # year, totalCrimes, ipcCrimes, sllCrimes, crimeRate (per lakh population)
    {"year": "2014", "total": 4730830, "ipc": 2851563, "sll": 1879267, "rate": 374.6},
    {"year": "2015", "total": 4647459, "ipc": 2810024, "sll": 1837435, "rate": 363.0},
    {"year": "2016", "total": 4831515, "ipc": 2975711, "sll": 1855804, "rate": 372.6},
    {"year": "2017", "total": 5059089, "ipc": 3091676, "sll": 1967413, "rate": 385.5},
    {"year": "2018", "total": 5015127, "ipc": 3132954, "sll": 1882173, "rate": 377.8},
    {"year": "2019", "total": 5156172, "ipc": 3225701, "sll": 1930471, "rate": 383.5},
    {"year": "2020", "total": 4527694, "ipc": 2904490, "sll": 1623204, "rate": 332.3},
    {"year": "2021", "total": 5343323, "ipc": 3370183, "sll": 1973140, "rate": 388.1},
    {"year": "2022", "total": 5824946, "ipc": 3561379, "sll": 2263567, "rate": 422.2},
]

# IPC crime composition breakdown — 2022
# Source: NCRB Crime in India 2022, Table 1A.1
IPC_CRIME_COMPOSITION = [
    {"id": "theft", "name": "Theft", "cases": 376090, "pct": 10.6},
    {"id": "hurt", "name": "Causing Hurt", "cases": 331464, "pct": 9.3},
    {"id": "cruelty-women", "name": "Cruelty by Husband/Relatives", "cases": 145309, "pct": 4.1},
    {"id": "kidnapping", "name": "Kidnapping & Abduction", "cases": 109400, "pct": 3.1},
    {"id": "assault-women", "name": "Assault on Women", "cases": 82727, "pct": 2.3},
    {"id": "burglary", "name": "Burglary", "cases": 63920, "pct": 1.8},
    {"id": "robbery", "name": "Robbery", "cases": 12958, "pct": 0.4},
    {"id": "rape", "name": "Rape", "cases": 31516, "pct": 0.9},
    {"id": "murder", "name": "Murder", "cases": 28522, "pct": 0.8},
    {"id": "riots", "name": "Riots", "cases": 29386, "pct": 0.8},
    {"id": "cheating", "name": "Cheating", "cases": 163092, "pct": 4.6},
    {"id": "other-ipc", "name": "Other IPC Crimes", "cases": 2156995, "pct": 60.6},
]


# ══════════════════════════════════════════════════════════════════════
# STATE-WISE CRIME RATES — 2022
# Source: NCRB Crime in India 2022, Table 1.4
# Rate = total cognizable crimes per lakh population
# Uses uppercase vehicle registration (RTO) codes per project standard
# ══════════════════════════════════════════════════════════════════════

STATE_CRIME_RATES = [
    {"id": "KL", "name": "Kerala", "rate": 1287.4, "total": 461652},
    {"id": "DL", "name": "Delhi", "rate": 1241.8, "total": 248485},
    {"id": "TN", "name": "Tamil Nadu", "rate": 566.6, "total": 444779},
    {"id": "MP", "name": "Madhya Pradesh", "rate": 517.1, "total": 438879},
    {"id": "HR", "name": "Haryana", "rate": 504.9, "total": 148714},
    {"id": "CG", "name": "Chhattisgarh", "rate": 488.1, "total": 144680},
    {"id": "RJ", "name": "Rajasthan", "rate": 477.8, "total": 386975},
    {"id": "UP", "name": "Uttar Pradesh", "rate": 451.7, "total": 1030895},
    {"id": "GJ", "name": "Gujarat", "rate": 445.5, "total": 305310},
    {"id": "MH", "name": "Maharashtra", "rate": 406.4, "total": 502803},
    {"id": "AP", "name": "Andhra Pradesh", "rate": 401.0, "total": 216063},
    {"id": "OD", "name": "Odisha", "rate": 395.3, "total": 181038},
    {"id": "KA", "name": "Karnataka", "rate": 389.0, "total": 256803},
    {"id": "JH", "name": "Jharkhand", "rate": 374.5, "total": 140820},
    {"id": "TS", "name": "Telangana", "rate": 368.3, "total": 140979},
    {"id": "AS", "name": "Assam", "rate": 359.1, "total": 130010},
    {"id": "BR", "name": "Bihar", "rate": 295.0, "total": 361019},
    {"id": "WB", "name": "West Bengal", "rate": 291.0, "total": 282024},
    {"id": "PB", "name": "Punjab", "rate": 285.7, "total": 86773},
    {"id": "UK", "name": "Uttarakhand", "rate": 262.0, "total": 29597},
    {"id": "HP", "name": "Himachal Pradesh", "rate": 246.2, "total": 18325},
    {"id": "GA", "name": "Goa", "rate": 225.4, "total": 3587},
    {"id": "JK", "name": "Jammu & Kashmir", "rate": 207.6, "total": 27596},
    {"id": "MN", "name": "Manipur", "rate": 200.0, "total": 6098},
    {"id": "TR", "name": "Tripura", "rate": 196.3, "total": 7989},
    {"id": "ML", "name": "Meghalaya", "rate": 181.3, "total": 6214},
    {"id": "SK", "name": "Sikkim", "rate": 164.2, "total": 1137},
    {"id": "AR", "name": "Arunachal Pradesh", "rate": 155.9, "total": 2529},
    {"id": "NL", "name": "Nagaland", "rate": 124.1, "total": 2694},
    {"id": "MZ", "name": "Mizoram", "rate": 110.2, "total": 1372},
]


# ══════════════════════════════════════════════════════════════════════
# CRIMES AGAINST WOMEN — national trends + breakdown
# Source: NCRB Crime in India 2022, Chapter 5
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
]

# Crime type breakdown — 2022
# Source: NCRB Crime in India 2022, Table 5A.1
WOMEN_CRIME_TYPES = [
    {"id": "cruelty", "name": "Cruelty by Husband/Relatives", "cases": 145309, "pct": 32.6},
    {"id": "kidnapping", "name": "Kidnapping & Abduction", "cases": 105418, "pct": 23.7},
    {"id": "assault", "name": "Assault to Outrage Modesty", "cases": 82727, "pct": 18.6},
    {"id": "rape", "name": "Rape", "cases": 31516, "pct": 7.1},
    {"id": "dowry-death", "name": "Dowry Deaths", "cases": 6450, "pct": 1.4},
    {"id": "cybercrime-women", "name": "Cybercrime Against Women", "cases": 7796, "pct": 1.8},
    {"id": "other-women", "name": "Other Crimes Against Women", "cases": 66040, "pct": 14.8},
]

# State-wise crime against women rate (per lakh women population) — 2022
# Source: NCRB Crime in India 2022, Table 5A.2
STATE_WOMEN_CRIME_RATES = [
    {"id": "RJ", "name": "Rajasthan", "rate": 105.4, "total": 40738},
    {"id": "DL", "name": "Delhi", "rate": 100.2, "total": 10036},
    {"id": "HR", "name": "Haryana", "rate": 93.4, "total": 13048},
    {"id": "OD", "name": "Odisha", "rate": 90.5, "total": 19567},
    {"id": "AS", "name": "Assam", "rate": 88.0, "total": 14915},
    {"id": "MP", "name": "Madhya Pradesh", "rate": 82.6, "total": 32714},
    {"id": "UP", "name": "Uttar Pradesh", "rate": 76.4, "total": 82180},
    {"id": "CG", "name": "Chhattisgarh", "rate": 73.0, "total": 10115},
    {"id": "AP", "name": "Andhra Pradesh", "rate": 70.5, "total": 17911},
    {"id": "TS", "name": "Telangana", "rate": 67.3, "total": 12150},
    {"id": "KL", "name": "Kerala", "rate": 65.7, "total": 11725},
    {"id": "TN", "name": "Tamil Nadu", "rate": 60.3, "total": 23268},
    {"id": "MH", "name": "Maharashtra", "rate": 56.0, "total": 34625},
    {"id": "KA", "name": "Karnataka", "rate": 55.2, "total": 17676},
    {"id": "JH", "name": "Jharkhand", "rate": 54.2, "total": 9619},
    {"id": "BR", "name": "Bihar", "rate": 43.6, "total": 25316},
    {"id": "WB", "name": "West Bengal", "rate": 42.4, "total": 19823},
    {"id": "GJ", "name": "Gujarat", "rate": 40.0, "total": 12889},
    {"id": "PB", "name": "Punjab", "rate": 37.2, "total": 5308},
    {"id": "UK", "name": "Uttarakhand", "rate": 35.8, "total": 1906},
]


# ══════════════════════════════════════════════════════════════════════
# ROAD ACCIDENTS — national trends
# Source: MoRTH "Road Accidents in India 2022"
# MoRTH figures are more comprehensive than NCRB motor vehicle FIRs
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
]

# Cause-wise breakdown of road accidents — 2022
# Source: MoRTH Road Accidents in India 2022
ROAD_ACCIDENT_CAUSES = [
    {"id": "overspeeding", "name": "Over-speeding", "pct": 69.3},
    {"id": "wrong-side", "name": "Driving on Wrong Side", "pct": 5.5},
    {"id": "drunk-driving", "name": "Drunken Driving", "pct": 3.1},
    {"id": "mobile-use", "name": "Use of Mobile Phone", "pct": 2.7},
    {"id": "overloading", "name": "Overloading", "pct": 1.9},
    {"id": "red-light", "name": "Jumping Red Light", "pct": 0.9},
    {"id": "other-causes", "name": "Other Causes", "pct": 16.6},
]

# State-wise road accident fatality rates (deaths per lakh population) — 2022
# Source: MoRTH Road Accidents in India 2022
STATE_ROAD_FATALITIES = [
    {"id": "TS", "name": "Telangana", "rate": 21.5, "killed": 8248},
    {"id": "MP", "name": "Madhya Pradesh", "rate": 18.9, "killed": 16077},
    {"id": "CG", "name": "Chhattisgarh", "rate": 18.3, "killed": 5419},
    {"id": "TN", "name": "Tamil Nadu", "rate": 17.9, "killed": 14054},
    {"id": "KA", "name": "Karnataka", "rate": 17.8, "killed": 11757},
    {"id": "RJ", "name": "Rajasthan", "rate": 17.5, "killed": 14194},
    {"id": "UP", "name": "Uttar Pradesh", "rate": 15.4, "killed": 35214},
    {"id": "GJ", "name": "Gujarat", "rate": 15.2, "killed": 10425},
    {"id": "HR", "name": "Haryana", "rate": 15.0, "killed": 4415},
    {"id": "MH", "name": "Maharashtra", "rate": 14.1, "killed": 17465},
    {"id": "AP", "name": "Andhra Pradesh", "rate": 13.8, "killed": 7429},
    {"id": "OD", "name": "Odisha", "rate": 11.7, "killed": 5372},
    {"id": "PB", "name": "Punjab", "rate": 11.4, "killed": 3458},
    {"id": "KL", "name": "Kerala", "rate": 10.8, "killed": 3871},
    {"id": "JH", "name": "Jharkhand", "rate": 9.5, "killed": 3585},
    {"id": "UK", "name": "Uttarakhand", "rate": 9.3, "killed": 1051},
    {"id": "BR", "name": "Bihar", "rate": 8.3, "killed": 10154},
    {"id": "WB", "name": "West Bengal", "rate": 7.2, "killed": 6982},
    {"id": "AS", "name": "Assam", "rate": 6.4, "killed": 2319},
    {"id": "DL", "name": "Delhi", "rate": 5.9, "total": 1183},
]


# ══════════════════════════════════════════════════════════════════════
# CYBERCRIME — national trends
# Source: NCRB Crime in India 2022, Chapter 11
# Note: NCRB counts FIR-registered cybercrimes. I4C complaint portal
# numbers (22.68 lakh in 2022) are much higher and NOT comparable.
# ══════════════════════════════════════════════════════════════════════

CYBERCRIME_TREND = [
    # year, totalCases (FIR-registered), ratePerLakh
    {"year": "2017", "cases": 21796, "rate": 1.7},
    {"year": "2018", "cases": 27248, "rate": 2.1},
    {"year": "2019", "cases": 44735, "rate": 3.3},
    {"year": "2020", "cases": 50035, "rate": 3.7},
    {"year": "2021", "cases": 52974, "rate": 3.8},
    {"year": "2022", "cases": 65893, "rate": 4.8},
]

# Cybercrime category breakdown — 2022
# Source: NCRB Crime in India 2022
CYBERCRIME_TYPES = [
    {"id": "fraud", "name": "Online Fraud / Cheating", "cases": 27485, "pct": 41.7},
    {"id": "sexual", "name": "Sexual Exploitation / Publishing", "cases": 8439, "pct": 12.8},
    {"id": "extortion", "name": "Cyber Extortion / Blackmail", "cases": 4227, "pct": 6.4},
    {"id": "forgery", "name": "Data Forgery / Tampering", "cases": 3790, "pct": 5.7},
    {"id": "identity-theft", "name": "Identity Theft", "cases": 2425, "pct": 3.7},
    {"id": "other-cyber", "name": "Other Cybercrimes", "cases": 19527, "pct": 29.6},
]

# I4C complaint portal context (NOT FIR counts)
# Source: I4C annual report / cybercrime.gov.in
I4C_CONTEXT = {
    "complaints2022": 2268000,  # 22.68 lakh complaints registered on portal
    "financialLossCrore": 2290,  # Rs 2,290 crore — NCRP 2022 full-year reported financial loss
    "note": "I4C complaints are citizen-reported via portal. NCRB counts FIR-registered cases. "
            "The gap (22.68L complaints vs 65,893 FIRs) reflects underregistration of cybercrime as FIRs.",
}


# ══════════════════════════════════════════════════════════════════════
# POLICE INFRASTRUCTURE
# Source: BPRD "Data on Police Organisations 2022"
# ══════════════════════════════════════════════════════════════════════

POLICE_NATIONAL = {
    "sanctionedStrength": 2540152,  # ~25.4 lakh sanctioned
    "actualStrength": 2086972,      # ~20.87 lakh actual
    "vacancyPct": 17.8,
    "sanctionedRatePerLakh": 183.8,  # sanctioned per lakh
    "actualRatePerLakh": 151.1,      # actual per lakh (UN recommends 222)
    "unRecommended": 222,            # UN recommended police-population ratio
    "womenPolicePct": 11.7,          # % women in total police force
    "womenPoliceTotal": 244160,
    "source": "BPRD Data on Police Organisations 2022",
}

# State-wise police-population ratio (actual per lakh) — 2022
# Source: BPRD Data on Police Organisations 2022
STATE_POLICE_RATIO = [
    {"id": "DL", "name": "Delhi", "sanctioned": 570.2, "actual": 492.1},
    {"id": "MZ", "name": "Mizoram", "sanctioned": 521.0, "actual": 480.5},
    {"id": "NL", "name": "Nagaland", "sanctioned": 500.5, "actual": 390.2},
    {"id": "AN", "name": "Andaman & Nicobar", "sanctioned": 480.0, "actual": 412.3},
    {"id": "CH", "name": "Chandigarh", "sanctioned": 462.0, "actual": 395.0},
    {"id": "MN", "name": "Manipur", "sanctioned": 448.2, "actual": 385.1},
    {"id": "SK", "name": "Sikkim", "sanctioned": 410.0, "actual": 345.2},
    {"id": "GA", "name": "Goa", "sanctioned": 388.5, "actual": 295.7},
    {"id": "KL", "name": "Kerala", "sanctioned": 263.0, "actual": 187.5},
    {"id": "HP", "name": "Himachal Pradesh", "sanctioned": 248.0, "actual": 180.2},
    {"id": "KA", "name": "Karnataka", "sanctioned": 220.5, "actual": 185.3},
    {"id": "TN", "name": "Tamil Nadu", "sanctioned": 218.0, "actual": 182.0},
    {"id": "MH", "name": "Maharashtra", "sanctioned": 205.3, "actual": 178.1},
    {"id": "PB", "name": "Punjab", "sanctioned": 225.0, "actual": 186.5},
    {"id": "TS", "name": "Telangana", "sanctioned": 200.0, "actual": 172.3},
    {"id": "GJ", "name": "Gujarat", "sanctioned": 190.2, "actual": 156.8},
    {"id": "RJ", "name": "Rajasthan", "sanctioned": 180.5, "actual": 143.2},
    {"id": "MP", "name": "Madhya Pradesh", "sanctioned": 175.0, "actual": 132.5},
    {"id": "CG", "name": "Chhattisgarh", "sanctioned": 202.0, "actual": 155.3},
    {"id": "OD", "name": "Odisha", "sanctioned": 158.0, "actual": 119.5},
    {"id": "AP", "name": "Andhra Pradesh", "sanctioned": 170.0, "actual": 137.2},
    {"id": "WB", "name": "West Bengal", "sanctioned": 142.0, "actual": 116.8},
    {"id": "JH", "name": "Jharkhand", "sanctioned": 149.0, "actual": 109.5},
    {"id": "HR", "name": "Haryana", "sanctioned": 190.0, "actual": 152.4},
    {"id": "UK", "name": "Uttarakhand", "sanctioned": 215.0, "actual": 163.5},
    {"id": "AS", "name": "Assam", "sanctioned": 186.0, "actual": 155.0},
    {"id": "UP", "name": "Uttar Pradesh", "sanctioned": 150.0, "actual": 108.3},
    {"id": "BR", "name": "Bihar", "sanctioned": 128.0, "actual": 77.4},
]


# ══════════════════════════════════════════════════════════════════════
# JUSTICE PIPELINE — the funnel from FIR to conviction
# Source: NCRB Crime in India 2022, Chapter 4 (Disposal of Cases)
# Covers IPC crimes only (most meaningful for justice system analysis)
# ══════════════════════════════════════════════════════════════════════

JUSTICE_PIPELINE = {
    "year": "2022",
    # FIR → Investigation → Chargesheet → Trial → Conviction
    "totalCasesForInvestigation": 5413745,  # Cases available (pending + new)
    "casesInvestigated": 4203822,           # Cases where investigation completed
    "chargesheetFiled": 3135620,            # Cases where chargesheet submitted
    "chargesheetRate": 74.6,               # % of investigated cases chargesheeted

    "totalCasesForTrial": 4906386,          # Cases available at courts (pending + new)
    "casesTrialCompleted": 1802954,         # Cases where trial concluded
    "convicted": 705614,                    # Persons convicted
    "acquitted": 1097340,                   # Persons acquitted
    "convictionRate": 39.1,                 # % convicted of trial-completed

    "pendingInvestigation": 1209923,        # Cases still under investigation at year end
    "pendingTrial": 3103432,               # Cases pending in courts at year end
    "pendencyRate": 63.2,                  # % pending of total cases at courts

    "source": "NCRB Crime in India 2022, Chapter 4 — Disposal of Cases by Police & Courts",
}

# Average trial duration (indicative)
# Source: National Judicial Data Grid (NJDG) + NCRB
TRIAL_DURATION = {
    "avgYears": 3.5,  # Approximate average for IPC cases
    "casesOver5Years": 28.6,  # % of pending cases older than 5 years
    "casesOver10Years": 10.2,  # % of pending cases older than 10 years
    "judgesPerMillionPopulation": 21.0,  # India vs global avg of ~50
    "source": "NJDG + NCRB Crime in India 2022",
}


# ══════════════════════════════════════════════════════════════════════
# NATIONAL SUMMARY TOTALS
# Source: NCRB 2022 + MoRTH 2022 + BPRD 2022
# Used for hub card stat pills and hero section
# ══════════════════════════════════════════════════════════════════════

NATIONAL_TOTALS = {
    "totalCrimes2022": 5824946,
    "crimeRate2022": 422.2,
    "roadDeaths2022": 168491,
    "cybercrimes2022": 65893,
    "convictionRatePct": 39.1,
    "chargesheetRatePct": 74.6,
    "policeRatioActual": 151.1,
    "womenCrimes2022": 445256,
    "womenCrimeRate2022": 66.4,
    "pendingTrialCases": 3103432,
    "dataYear": "2022",
}
