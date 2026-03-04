"""
Curated environment data from authoritative Indian government sources.

Sources:
  - CPCB (Central Pollution Control Board) — NAQI portal / ENVIS
    State-wise annual average AQI + top 30 most polluted cities
    https://airquality.cpcb.gov.in/ and https://cpcb.nic.in/
  - India State of Forest Report (ISFR) 2023 — Forest Survey of India
    State/UT-wise forest cover, % geographic area, change from ISFR 2021
    https://fsi.nic.in/isfr-2023
  - Central Electricity Authority (CEA) — All India Installed Capacity reports
    Monthly fuel-wise capacity (MW): coal, gas, nuclear, hydro, solar, wind, biomass, small hydro
    https://cea.nic.in/installed-capacity-report/
  - Central Water Commission (CWC) — Weekly reservoir bulletin
    Major reservoir storage by region (% of capacity)
    https://cwc.gov.in/
  - Central Ground Water Board (CGWB) — Dynamic Ground Water Resources Assessment 2023
    State-wise groundwater development stage classification
    https://cgwb.gov.in/

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated.
"""

# ── CPCB — State-wise Annual Average AQI 2023 ────────────────────
# Source: CPCB National Air Quality Index (NAQI) Bulletin 2023
# AQI scale: 0-50 Good, 51-100 Satisfactory, 101-200 Moderate,
#   201-300 Poor, 301-400 Very Poor, 401-500 Severe
# Values represent annual average AQI across monitoring stations in each state.
# Data from CPCB's continuous ambient air quality monitoring stations (CAAQMS).

CPCB_AQI_STATES = [
    {"id": "DL", "name": "Delhi", "aqi": 263, "category": "Poor"},
    {"id": "UP", "name": "Uttar Pradesh", "aqi": 196, "category": "Moderate"},
    {"id": "BR", "name": "Bihar", "aqi": 188, "category": "Moderate"},
    {"id": "HR", "name": "Haryana", "aqi": 179, "category": "Moderate"},
    {"id": "RJ", "name": "Rajasthan", "aqi": 156, "category": "Moderate"},
    {"id": "WB", "name": "West Bengal", "aqi": 151, "category": "Moderate"},
    {"id": "MP", "name": "Madhya Pradesh", "aqi": 143, "category": "Moderate"},
    {"id": "JH", "name": "Jharkhand", "aqi": 141, "category": "Moderate"},
    {"id": "PB", "name": "Punjab", "aqi": 139, "category": "Moderate"},
    {"id": "MH", "name": "Maharashtra", "aqi": 126, "category": "Moderate"},
    {"id": "CG", "name": "Chhattisgarh", "aqi": 122, "category": "Moderate"},
    {"id": "OD", "name": "Odisha", "aqi": 118, "category": "Moderate"},
    {"id": "GJ", "name": "Gujarat", "aqi": 115, "category": "Moderate"},
    {"id": "TS", "name": "Telangana", "aqi": 108, "category": "Moderate"},
    {"id": "AP", "name": "Andhra Pradesh", "aqi": 96, "category": "Satisfactory"},
    {"id": "TN", "name": "Tamil Nadu", "aqi": 89, "category": "Satisfactory"},
    {"id": "KA", "name": "Karnataka", "aqi": 86, "category": "Satisfactory"},
    {"id": "UK", "name": "Uttarakhand", "aqi": 84, "category": "Satisfactory"},
    {"id": "AS", "name": "Assam", "aqi": 79, "category": "Satisfactory"},
    {"id": "KL", "name": "Kerala", "aqi": 72, "category": "Satisfactory"},
    {"id": "GA", "name": "Goa", "aqi": 62, "category": "Satisfactory"},
    {"id": "HP", "name": "Himachal Pradesh", "aqi": 58, "category": "Satisfactory"},
    {"id": "JK", "name": "Jammu & Kashmir", "aqi": 55, "category": "Satisfactory"},
    {"id": "SK", "name": "Sikkim", "aqi": 42, "category": "Good"},
    {"id": "MZ", "name": "Mizoram", "aqi": 38, "category": "Good"},
    {"id": "ML", "name": "Meghalaya", "aqi": 36, "category": "Good"},
    {"id": "NL", "name": "Nagaland", "aqi": 34, "category": "Good"},
    {"id": "AR", "name": "Arunachal Pradesh", "aqi": 28, "category": "Good"},
    {"id": "MN", "name": "Manipur", "aqi": 32, "category": "Good"},
    {"id": "TR", "name": "Tripura", "aqi": 45, "category": "Good"},
]

# ── CPCB — Top 30 Most Polluted Cities (Annual Average AQI 2023) ─
# Source: CPCB NAQI Bulletin / IQAir World Air Quality Report 2023
# WHO guideline PM2.5: 5 μg/m3 annual. India NAAQS: 40 μg/m3.

CPCB_AQI_CITIES = [
    {"city": "Begusarai", "state": "Bihar", "aqi": 312},
    {"city": "Delhi", "state": "Delhi", "aqi": 263},
    {"city": "Guwahati", "state": "Assam", "aqi": 248},
    {"city": "Patna", "state": "Bihar", "aqi": 240},
    {"city": "Muzaffarpur", "state": "Bihar", "aqi": 235},
    {"city": "Hapur", "state": "Uttar Pradesh", "aqi": 228},
    {"city": "Ghaziabad", "state": "Uttar Pradesh", "aqi": 225},
    {"city": "Lucknow", "state": "Uttar Pradesh", "aqi": 220},
    {"city": "Noida", "state": "Uttar Pradesh", "aqi": 216},
    {"city": "Greater Noida", "state": "Uttar Pradesh", "aqi": 213},
    {"city": "Bulandshahr", "state": "Uttar Pradesh", "aqi": 210},
    {"city": "Faridabad", "state": "Haryana", "aqi": 207},
    {"city": "Gurugram", "state": "Haryana", "aqi": 204},
    {"city": "Kanpur", "state": "Uttar Pradesh", "aqi": 198},
    {"city": "Varanasi", "state": "Uttar Pradesh", "aqi": 195},
    {"city": "Agra", "state": "Uttar Pradesh", "aqi": 192},
    {"city": "Jodhpur", "state": "Rajasthan", "aqi": 186},
    {"city": "Jaipur", "state": "Rajasthan", "aqi": 178},
    {"city": "Kolkata", "state": "West Bengal", "aqi": 175},
    {"city": "Muzaffarnagar", "state": "Uttar Pradesh", "aqi": 172},
    {"city": "Bhiwadi", "state": "Rajasthan", "aqi": 168},
    {"city": "Hisar", "state": "Haryana", "aqi": 165},
    {"city": "Dhanbad", "state": "Jharkhand", "aqi": 162},
    {"city": "Meerut", "state": "Uttar Pradesh", "aqi": 159},
    {"city": "Rohtak", "state": "Haryana", "aqi": 156},
    {"city": "Amritsar", "state": "Punjab", "aqi": 152},
    {"city": "Ludhiana", "state": "Punjab", "aqi": 148},
    {"city": "Mumbai", "state": "Maharashtra", "aqi": 142},
    {"city": "Raipur", "state": "Chhattisgarh", "aqi": 138},
    {"city": "Bhopal", "state": "Madhya Pradesh", "aqi": 134},
]

# ── FSI — India State of Forest Report (ISFR) 2023 ───────────────
# Source: Forest Survey of India (fsi.nic.in/isfr-2023)
# forestCoverKm2: Total forest cover (very dense + moderately dense + open)
# pctGeographicArea: Forest cover as % of state geographic area
# changeKm2: Change from ISFR 2021 (positive = gain, negative = loss)
# National total forest cover: 8,27,357 km2 (25.17% of geographic area)

FSI_FOREST_STATES = [
    {"id": "MP", "name": "Madhya Pradesh", "forestCoverKm2": 77073, "pctGeographicArea": 25.11, "changeKm2": 8},
    {"id": "AR", "name": "Arunachal Pradesh", "forestCoverKm2": 66688, "pctGeographicArea": 79.63, "changeKm2": -258},
    {"id": "CG", "name": "Chhattisgarh", "forestCoverKm2": 55717, "pctGeographicArea": 41.21, "changeKm2": 11},
    {"id": "MH", "name": "Maharashtra", "forestCoverKm2": 50778, "pctGeographicArea": 16.52, "changeKm2": -89},
    {"id": "OD", "name": "Odisha", "forestCoverKm2": 51619, "pctGeographicArea": 33.15, "changeKm2": 275},
    {"id": "KA", "name": "Karnataka", "forestCoverKm2": 38575, "pctGeographicArea": 20.12, "changeKm2": -30},
    {"id": "UP", "name": "Uttar Pradesh", "forestCoverKm2": 14806, "pctGeographicArea": 6.15, "changeKm2": 18},
    {"id": "RJ", "name": "Rajasthan", "forestCoverKm2": 16572, "pctGeographicArea": 4.84, "changeKm2": 33},
    {"id": "TN", "name": "Tamil Nadu", "forestCoverKm2": 26364, "pctGeographicArea": 20.27, "changeKm2": -106},
    {"id": "AP", "name": "Andhra Pradesh", "forestCoverKm2": 29784, "pctGeographicArea": 18.19, "changeKm2": 12},
    {"id": "JH", "name": "Jharkhand", "forestCoverKm2": 23553, "pctGeographicArea": 29.55, "changeKm2": -73},
    {"id": "TS", "name": "Telangana", "forestCoverKm2": 21214, "pctGeographicArea": 18.93, "changeKm2": 32},
    {"id": "KL", "name": "Kerala", "forestCoverKm2": 21144, "pctGeographicArea": 54.42, "changeKm2": -14},
    {"id": "AS", "name": "Assam", "forestCoverKm2": 28312, "pctGeographicArea": 36.08, "changeKm2": -339},
    {"id": "MZ", "name": "Mizoram", "forestCoverKm2": 17820, "pctGeographicArea": 85.34, "changeKm2": 242},  # ISFR 2023: max increase among states
    {"id": "GJ", "name": "Gujarat", "forestCoverKm2": 14857, "pctGeographicArea": 7.57, "changeKm2": -8},
    {"id": "ML", "name": "Meghalaya", "forestCoverKm2": 17046, "pctGeographicArea": 76.00, "changeKm2": -73},
    {"id": "NL", "name": "Nagaland", "forestCoverKm2": 12251, "pctGeographicArea": 73.90, "changeKm2": -23},
    {"id": "MN", "name": "Manipur", "forestCoverKm2": 16598, "pctGeographicArea": 74.34, "changeKm2": -249},
    {"id": "WB", "name": "West Bengal", "forestCoverKm2": 16832, "pctGeographicArea": 18.95, "changeKm2": -56},
    {"id": "HP", "name": "Himachal Pradesh", "forestCoverKm2": 15434, "pctGeographicArea": 27.72, "changeKm2": 15},
    {"id": "TR", "name": "Tripura", "forestCoverKm2": 7726, "pctGeographicArea": 73.68, "changeKm2": -32},
    {"id": "UK", "name": "Uttarakhand", "forestCoverKm2": 24303, "pctGeographicArea": 45.44, "changeKm2": -22},
    {"id": "BR", "name": "Bihar", "forestCoverKm2": 7381, "pctGeographicArea": 7.84, "changeKm2": 12},
    {"id": "SK", "name": "Sikkim", "forestCoverKm2": 3341, "pctGeographicArea": 47.10, "changeKm2": -2},
    {"id": "JK", "name": "Jammu & Kashmir", "forestCoverKm2": 20230, "pctGeographicArea": 49.18, "changeKm2": -24},
    {"id": "PB", "name": "Punjab", "forestCoverKm2": 1849, "pctGeographicArea": 3.67, "changeKm2": 18},
    {"id": "HR", "name": "Haryana", "forestCoverKm2": 1603, "pctGeographicArea": 3.63, "changeKm2": -5},
    {"id": "GA", "name": "Goa", "forestCoverKm2": 2237, "pctGeographicArea": 60.34, "changeKm2": -3},
    {"id": "DL", "name": "Delhi", "forestCoverKm2": 195, "pctGeographicArea": 13.18, "changeKm2": -0.5},
]

# ── CEA — Installed Capacity Mix (MW), 2015-2024 ─────────────────
# Source: Central Electricity Authority — All India Installed Capacity reports
# https://cea.nic.in/installed-capacity-report/
# Values as of 31 March each year (end of fiscal year)
# Categories: coal, gas, nuclear, hydro, solar, wind, biomass, smallHydro

CEA_ENERGY_MIX = [
    {
        "year": "2015",
        "coal": 164636, "gas": 23062, "nuclear": 5780, "hydro": 41267,
        "solar": 3744, "wind": 23354, "biomass": 4418, "smallHydro": 3990,
    },
    {
        "year": "2016",
        "coal": 176163, "gas": 24509, "nuclear": 5780, "hydro": 42783,
        "solar": 6763, "wind": 26777, "biomass": 4831, "smallHydro": 4274,
    },
    {
        "year": "2017",
        "coal": 188898, "gas": 25329, "nuclear": 6780, "hydro": 44478,
        "solar": 12289, "wind": 32280, "biomass": 8182, "smallHydro": 4380,
    },
    {
        "year": "2018",
        "coal": 197172, "gas": 24897, "nuclear": 6780, "hydro": 45399,
        "solar": 21651, "wind": 34046, "biomass": 8839, "smallHydro": 4486,
    },
    {
        "year": "2019",
        "coal": 200704, "gas": 24937, "nuclear": 6780, "hydro": 45399,
        "solar": 28181, "wind": 36625, "biomass": 9524, "smallHydro": 4647,
    },
    {
        "year": "2020",
        "coal": 205135, "gas": 24955, "nuclear": 6780, "hydro": 45699,
        "solar": 34628, "wind": 37694, "biomass": 9942, "smallHydro": 4744,
    },
    {
        "year": "2021",
        "coal": 209285, "gas": 24924, "nuclear": 6780, "hydro": 46209,
        "solar": 40085, "wind": 39248, "biomass": 10145, "smallHydro": 4786,
    },
    {
        "year": "2022",
        "coal": 210700, "gas": 24824, "nuclear": 6780, "hydro": 46722,
        "solar": 50778, "wind": 40080, "biomass": 10176, "smallHydro": 4841,
    },
    {
        "year": "2023",
        "coal": 211666, "gas": 24824, "nuclear": 7480, "hydro": 46850,
        "solar": 66780, "wind": 42633, "biomass": 10261, "smallHydro": 4943,
    },
    {
        "year": "2024",
        "coal": 213950, "gas": 24824, "nuclear": 7480, "hydro": 47073,
        "solar": 82788, "wind": 46160, "biomass": 10544, "smallHydro": 5011,
    },
]

# ── CWC — Major Reservoir Storage (Jan 2024 snapshot) ─────────────
# Source: Central Water Commission — Weekly Reservoir Storage Bulletin
# https://cwc.gov.in/
# storagePct = live storage as % of full reservoir level
# Regions: North, East, West, Central, South

CWC_RESERVOIR_STORAGE = [
    {"region": "North", "storagePct": 47, "reservoirCount": 15, "capacityBCM": 19.66},
    {"region": "East", "storagePct": 39, "reservoirCount": 23, "capacityBCM": 21.38},
    {"region": "West", "storagePct": 51, "reservoirCount": 36, "capacityBCM": 37.13},
    {"region": "Central", "storagePct": 43, "reservoirCount": 26, "capacityBCM": 48.30},
    {"region": "South", "storagePct": 56, "reservoirCount": 50, "capacityBCM": 53.33},
]

# ── CGWB — State-wise Groundwater Stage (2023 Assessment) ─────────
# Source: CGWB Dynamic Ground Water Resources Assessment 2023
# https://cgwb.gov.in/
# stage: Safe (<70%), Semi-Critical (70-90%), Critical (90-100%),
#        Over-Exploited (>100%)
# stagePct = stage of groundwater development (extraction/recharge * 100)

CGWB_GROUNDWATER_STATES = [
    {"id": "DL", "name": "Delhi", "stagePct": 137, "stage": "Over-Exploited"},
    {"id": "RJ", "name": "Rajasthan", "stagePct": 140, "stage": "Over-Exploited"},
    {"id": "HR", "name": "Haryana", "stagePct": 137, "stage": "Over-Exploited"},
    {"id": "PB", "name": "Punjab", "stagePct": 165, "stage": "Over-Exploited"},
    {"id": "TN", "name": "Tamil Nadu", "stagePct": 77, "stage": "Semi-Critical"},
    {"id": "UP", "name": "Uttar Pradesh", "stagePct": 74, "stage": "Semi-Critical"},
    {"id": "KA", "name": "Karnataka", "stagePct": 73, "stage": "Semi-Critical"},
    {"id": "GJ", "name": "Gujarat", "stagePct": 69, "stage": "Safe"},
    {"id": "MP", "name": "Madhya Pradesh", "stagePct": 56, "stage": "Safe"},
    {"id": "MH", "name": "Maharashtra", "stagePct": 54, "stage": "Safe"},
    {"id": "AP", "name": "Andhra Pradesh", "stagePct": 51, "stage": "Safe"},
    {"id": "TS", "name": "Telangana", "stagePct": 48, "stage": "Safe"},
    {"id": "WB", "name": "West Bengal", "stagePct": 44, "stage": "Safe"},
    {"id": "BR", "name": "Bihar", "stagePct": 42, "stage": "Safe"},
    {"id": "OD", "name": "Odisha", "stagePct": 35, "stage": "Safe"},
    {"id": "JH", "name": "Jharkhand", "stagePct": 32, "stage": "Safe"},
    {"id": "CG", "name": "Chhattisgarh", "stagePct": 28, "stage": "Safe"},
    {"id": "AS", "name": "Assam", "stagePct": 22, "stage": "Safe"},
    {"id": "KL", "name": "Kerala", "stagePct": 47, "stage": "Safe"},
    {"id": "UK", "name": "Uttarakhand", "stagePct": 38, "stage": "Safe"},
    {"id": "HP", "name": "Himachal Pradesh", "stagePct": 24, "stage": "Safe"},
    {"id": "JK", "name": "Jammu & Kashmir", "stagePct": 19, "stage": "Safe"},
    {"id": "GA", "name": "Goa", "stagePct": 26, "stage": "Safe"},
    {"id": "SK", "name": "Sikkim", "stagePct": 8, "stage": "Safe"},
    {"id": "NL", "name": "Nagaland", "stagePct": 6, "stage": "Safe"},
    {"id": "MZ", "name": "Mizoram", "stagePct": 5, "stage": "Safe"},
    {"id": "ML", "name": "Meghalaya", "stagePct": 4, "stage": "Safe"},
    {"id": "MN", "name": "Manipur", "stagePct": 3, "stage": "Safe"},
    {"id": "AR", "name": "Arunachal Pradesh", "stagePct": 2, "stage": "Safe"},
    {"id": "TR", "name": "Tripura", "stagePct": 15, "stage": "Safe"},
]

# ── National headline numbers ──────────────────────────────────────
# Sources:
#   CO2/capita: World Bank 2021 (latest available)
#   Forest %: ISFR 2023 (25.17% of geographic area = 8,27,357 km2)
#   Renewables %: CEA March 2024 (renewable % of installed capacity)
#   PM2.5: World Bank 2021 / WHO Global Air Quality Database
#   Coal %: CEA March 2024 (coal % of installed capacity)
#   GHG: World Bank 2021 (including LULUCF)

NATIONAL_TOTALS = {
    "co2PerCapita": 1.9,                # tonnes, World Bank 2021
    "forestPct": 25.17,                  # ISFR 2023
    "renewablesPct": 43.4,              # CEA Mar 2024 (solar+wind+hydro+bio+smallHydro / total)
    "pm25": 53.3,                        # μg/m3, World Bank 2021
    "coalPct": 48.8,                    # CEA Mar 2024 (coal / total installed capacity)
    "ghgTotal": 3347.9,                 # Mt CO2e, World Bank 2021
}
