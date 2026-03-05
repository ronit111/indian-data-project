"""
Curated state-level data extracted from authoritative Indian government sources.

Sources:
  - RBI Handbook of Statistics on Indian States (2023-24 edition)
    https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States
  - MoSPI: National Statistical Office — State GDP estimates
    https://mospi.gov.in/
  - Finance Commission reports (central transfers)
  - CAG State Finance Audit Reports

Data vintage: FY 2022-23 (latest available with full state coverage)
Base year for constant prices: 2011-12

IMPORTANT: Every number must be cross-checked against primary source documents.
This file is manually curated — automated pipelines cannot reach this data.
"""

# Data vintage
DATA_YEAR = "2022-23"
BASE_YEAR = "2011-12"

# ── STATE GSDP DATA ─────────────────────────────────────────────────────
# Source: RBI Handbook of Statistics on Indian States, Table 4
# GSDP at current prices (Rs crore), growth rate (%), per capita NSDP (Rs), population (lakhs)
# All 28 states + 8 Union Territories
#
# FY 2022-23 values curated from RBI Handbook tables:
#   - Table 21: GSDP at current prices (Rs lakh)
#   - Table 22: GSDP at constant prices (2011-12 base, Rs lakh)
#   - Table 19: Per Capita NSDP at current prices (Rs)
# Notes:
#   - growthRate is computed as YoY % change in current-price GSDP (2022-23 vs 2021-22).
#   - population is implied population in lakhs: (GSDP Rs crore * 100) / perCapitaNsdp.
#     NOTE: This divides GSDP by per-capita-NSDP, inflating population by ~14%. Approximate only.
#   - For small UTs without comparable FY 2022-23 series in this pipeline (AN, CH, DN, LA, LD),
#     numeric fields are set to 0 as requested.
STATE_GSDP_DATA: list[dict] = [
    {"id": "AP", "name": "Andhra Pradesh", "gsdp": 1309463.97, "gsdpConstant": 757301.42, "growthRate": 11.00, "perCapitaNsdp": 219518, "population": 596.52},
    {"id": "AR", "name": "Arunachal Pradesh", "gsdp": 37851.14, "gsdpConstant": 24575.44, "growthRate": 13.65, "perCapitaNsdp": 205645, "population": 18.41},
    {"id": "AS", "name": "Assam", "gsdp": 493166.50, "gsdpConstant": 299561.72, "growthRate": 19.60, "perCapitaNsdp": 118504, "population": 416.16},
    {"id": "BR", "name": "Bihar", "gsdp": 855881.11, "gsdpConstant": 467036.02, "growthRate": 23.08, "perCapitaNsdp": 54383, "population": 1573.80},
    {"id": "CG", "name": "Chhattisgarh", "gsdp": 457608.99, "gsdpConstant": 298037.58, "growthRate": 10.62, "perCapitaNsdp": 147325, "population": 310.61},
    {"id": "GA", "name": "Goa", "gsdp": 95973.16, "gsdpConstant": 55256.59, "growthRate": 7.20, "perCapitaNsdp": 492114, "population": 19.50},
    {"id": "GJ", "name": "Gujarat", "gsdp": 2084274.05, "gsdpConstant": 1277785.66, "growthRate": 12.65, "perCapitaNsdp": 270043, "population": 771.83},
    {"id": "HR", "name": "Haryana", "gsdp": 1089166.20, "gsdpConstant": 620456.53, "growthRate": 13.87, "perCapitaNsdp": 296592, "population": 367.23},
    {"id": "HP", "name": "Himachal Pradesh", "gsdp": 190630.75, "gsdpConstant": 104925.45, "growthRate": 14.12, "perCapitaNsdp": 214535, "population": 88.86},
    {"id": "JH", "name": "Jharkhand", "gsdp": 400194.85, "gsdpConstant": 234506.76, "growthRate": 16.78, "perCapitaNsdp": 92579, "population": 432.27},
    {"id": "KA", "name": "Karnataka", "gsdp": 2241368.80, "gsdpConstant": 1420034.00, "growthRate": 13.50, "perCapitaNsdp": 332926, "population": 673.23},
    {"id": "KL", "name": "Kerala", "gsdp": 1097347.67, "gsdpConstant": 687246.11, "growthRate": 13.76, "perCapitaNsdp": 240573, "population": 456.14},
    {"id": "MP", "name": "Madhya Pradesh", "gsdp": 1049059.58, "gsdpConstant": 670295.74, "growthRate": 15.32, "perCapitaNsdp": 111065, "population": 944.55},
    {"id": "MH", "name": "Maharashtra", "gsdp": 3527922.12, "gsdpConstant": 2300636.24, "growthRate": 16.37, "perCapitaNsdp": 242247, "population": 1456.33},
    {"id": "MN", "name": "Manipur", "gsdp": 47381.86, "gsdpConstant": 25013.37, "growthRate": 20.96, "perCapitaNsdp": 108192, "population": 43.79},
    {"id": "ML", "name": "Meghalaya", "gsdp": 46600.95, "gsdpConstant": 31023.47, "growthRate": 9.14, "perCapitaNsdp": 113241, "population": 41.15},
    {"id": "MZ", "name": "Mizoram", "gsdp": 30454.31, "gsdpConstant": 18965.00, "growthRate": 25.36, "perCapitaNsdp": 198962, "population": 15.31},
    {"id": "NL", "name": "Nagaland", "gsdp": 35192.97, "gsdpConstant": 20945.58, "growthRate": 11.47, "perCapitaNsdp": 125887, "population": 27.96},
    {"id": "OD", "name": "Odisha", "gsdp": 745131.36, "gsdpConstant": 453389.95, "growthRate": 17.27, "perCapitaNsdp": 149162, "population": 499.55},
    {"id": "PB", "name": "Punjab", "gsdp": 680277.37, "gsdpConstant": 422944.70, "growthRate": 8.81, "perCapitaNsdp": 193770, "population": 351.07},
    {"id": "RJ", "name": "Rajasthan", "gsdp": 1413620.35, "gsdpConstant": 868935.36, "growthRate": 13.79, "perCapitaNsdp": 161882, "population": 873.24},
    {"id": "SK", "name": "Sikkim", "gsdp": 42756.58, "gsdpConstant": 24735.47, "growthRate": 14.63, "perCapitaNsdp": 437472, "population": 9.77},
    {"id": "TN", "name": "Tamil Nadu", "gsdp": 2721572.22, "gsdpConstant": 1639189.31, "growthRate": 12.09, "perCapitaNsdp": 268978, "population": 1011.82},
    {"id": "TS", "name": "Telangana", "gsdp": 1404860.89, "gsdpConstant": 853021.98, "growthRate": 11.97, "perCapitaNsdp": 309927, "population": 453.29},
    {"id": "TR", "name": "Tripura", "gsdp": 72636.14, "gsdpConstant": 45762.30, "growthRate": 12.57, "perCapitaNsdp": 141010, "population": 51.51},
    {"id": "UP", "name": "Uttar Pradesh", "gsdp": 2439203.03, "gsdpConstant": 1628425.15, "growthRate": 11.70, "perCapitaNsdp": 83636, "population": 2916.45},
    {"id": "UK", "name": "Uttarakhand", "gsdp": 315947.71, "gsdpConstant": 211129.68, "growthRate": 10.91, "perCapitaNsdp": 221547, "population": 142.61},
    {"id": "WB", "name": "West Bengal", "gsdp": 1759368.53, "gsdpConstant": 1043272.56, "growthRate": 10.15, "perCapitaNsdp": 136618, "population": 1287.80},
    {"id": "AN", "name": "Andaman and Nicobar Islands", "gsdp": 0, "gsdpConstant": 0, "growthRate": 0, "perCapitaNsdp": 0, "population": 0},
    {"id": "CH", "name": "Chandigarh", "gsdp": 0, "gsdpConstant": 0, "growthRate": 0, "perCapitaNsdp": 0, "population": 0},
    {"id": "DN", "name": "Dadra and Nagar Haveli and Daman and Diu", "gsdp": 0, "gsdpConstant": 0, "growthRate": 0, "perCapitaNsdp": 0, "population": 0},
    {"id": "DL", "name": "Delhi", "gsdp": 1108914.85, "gsdpConstant": 699205.66, "growthRate": 2.88, "perCapitaNsdp": 407643, "population": 272.03},
    {"id": "JK", "name": "Jammu and Kashmir", "gsdp": 230727.11, "gsdpConstant": 143852.56, "growthRate": 7.12, "perCapitaNsdp": 107944, "population": 213.75},
    {"id": "LA", "name": "Ladakh", "gsdp": 0, "gsdpConstant": 0, "growthRate": 0, "perCapitaNsdp": 0, "population": 0},
    {"id": "LD", "name": "Lakshadweep", "gsdp": 0, "gsdpConstant": 0, "growthRate": 0, "perCapitaNsdp": 0, "population": 0},
    {"id": "PY", "name": "Puducherry", "gsdp": 48425.13, "gsdpConstant": 32954.59, "growthRate": 10.53, "perCapitaNsdp": 328825, "population": 14.73},
]


# ── STATE GSDP HISTORY (Top 10 by GSDP, 3 Years) ──────────────────────────
# Source: RBI Handbook of Statistics on Indian States, Table 21
# GSDP at current prices (Rs crore) for FY 2020-21, 2021-22, 2022-23
# Used for trend visibility on the States domain
STATE_GSDP_HISTORY: list[dict] = [
    {"id": "MH", "name": "Maharashtra", "gsdp": [
        {"year": "2020-21", "value": 2502881.85},
        {"year": "2021-22", "value": 3031774.39},
        {"year": "2022-23", "value": 3527922.12},
    ]},
    {"id": "TN", "name": "Tamil Nadu", "gsdp": [
        {"year": "2020-21", "value": 1968827.80},
        {"year": "2021-22", "value": 2428412.51},
        {"year": "2022-23", "value": 2721572.22},
    ]},
    {"id": "UP", "name": "Uttar Pradesh", "gsdp": [
        {"year": "2020-21", "value": 1750133.08},
        {"year": "2021-22", "value": 2182794.78},
        {"year": "2022-23", "value": 2439203.03},
    ]},
    {"id": "KA", "name": "Karnataka", "gsdp": [
        {"year": "2020-21", "value": 1640513.81},
        {"year": "2021-22", "value": 1974918.00},
        {"year": "2022-23", "value": 2241368.80},
    ]},
    {"id": "GJ", "name": "Gujarat", "gsdp": [
        {"year": "2020-21", "value": 1573858.89},
        {"year": "2021-22", "value": 1850756.25},
        {"year": "2022-23", "value": 2084274.05},
    ]},
    {"id": "WB", "name": "West Bengal", "gsdp": [
        {"year": "2020-21", "value": 1322474.17},
        {"year": "2021-22", "value": 1596765.26},
        {"year": "2022-23", "value": 1759368.53},
    ]},
    {"id": "RJ", "name": "Rajasthan", "gsdp": [
        {"year": "2020-21", "value": 1019458.31},
        {"year": "2021-22", "value": 1242372.69},
        {"year": "2022-23", "value": 1413620.35},
    ]},
    {"id": "TS", "name": "Telangana", "gsdp": [
        {"year": "2020-21", "value": 1055757.98},
        {"year": "2021-22", "value": 1254607.46},
        {"year": "2022-23", "value": 1404860.89},
    ]},
    {"id": "AP", "name": "Andhra Pradesh", "gsdp": [
        {"year": "2020-21", "value": 988620.89},
        {"year": "2021-22", "value": 1179393.00},
        {"year": "2022-23", "value": 1309463.97},
    ]},
    {"id": "DL", "name": "Delhi", "gsdp": [
        {"year": "2020-21", "value": 824610.00},
        {"year": "2021-22", "value": 1077898.00},
        {"year": "2022-23", "value": 1108914.85},
    ]},
]


# ── STATE REVENUE DATA ──────────────────────────────────────────────────
# Source: RBI Handbook of Statistics on Indian States, Tables 24-28
# Own tax revenue, central transfers, total revenue (Rs crore)
# Self-sufficiency ratio = own tax revenue / total revenue × 100
#
# PLACEHOLDER — To be populated by Codex from RBI Handbook data
STATE_REVENUE_DATA: list[dict] = [
    {"id": "AP", "name": "Andhra Pradesh", "ownTaxRevenue": 78026, "centralTransfers": 74325, "totalRevenue": 157768, "selfSufficiencyRatio": 49.5},
    {"id": "AR", "name": "Arunachal Pradesh", "ownTaxRevenue": 2237, "centralTransfers": 20534, "totalRevenue": 23789, "selfSufficiencyRatio": 9.4},
    {"id": "AS", "name": "Assam", "ownTaxRevenue": 24502, "centralTransfers": 59480, "totalRevenue": 89743, "selfSufficiencyRatio": 27.3},
    {"id": "BR", "name": "Bihar", "ownTaxRevenue": 44018, "centralTransfers": 124535, "totalRevenue": 172688, "selfSufficiencyRatio": 25.5},
    {"id": "CG", "name": "Chhattisgarh", "ownTaxRevenue": 33122, "centralTransfers": 45507, "totalRevenue": 93877, "selfSufficiencyRatio": 35.3},
    {"id": "GA", "name": "Goa", "ownTaxRevenue": 7825, "centralTransfers": 5589, "totalRevenue": 17283, "selfSufficiencyRatio": 45.3},
    {"id": "GJ", "name": "Gujarat", "ownTaxRevenue": 124810, "centralTransfers": 56164, "totalRevenue": 199408, "selfSufficiencyRatio": 62.6},
    {"id": "HR", "name": "Haryana", "ownTaxRevenue": 62961, "centralTransfers": 17490, "totalRevenue": 89194, "selfSufficiencyRatio": 70.6},
    {"id": "HP", "name": "Himachal Pradesh", "ownTaxRevenue": 10595, "centralTransfers": 24618, "totalRevenue": 38089, "selfSufficiencyRatio": 27.8},
    {"id": "JH", "name": "Jharkhand", "ownTaxRevenue": 25118, "centralTransfers": 42298, "totalRevenue": 80246, "selfSufficiencyRatio": 31.3},
    {"id": "KA", "name": "Karnataka", "ownTaxRevenue": 143702, "centralTransfers": 71464, "totalRevenue": 229080, "selfSufficiencyRatio": 62.7},
    {"id": "KL", "name": "Kerala", "ownTaxRevenue": 71968, "centralTransfers": 45639, "totalRevenue": 132725, "selfSufficiencyRatio": 54.2},
    {"id": "MP", "name": "Madhya Pradesh", "ownTaxRevenue": 72611, "centralTransfers": 111497, "totalRevenue": 203986, "selfSufficiencyRatio": 35.6},
    {"id": "MH", "name": "Maharashtra", "ownTaxRevenue": 277486, "centralTransfers": 111415, "totalRevenue": 405677, "selfSufficiencyRatio": 68.4},
    {"id": "MN", "name": "Manipur", "ownTaxRevenue": 1879, "centralTransfers": 13556, "totalRevenue": 15893, "selfSufficiencyRatio": 11.8},
    {"id": "ML", "name": "Meghalaya", "ownTaxRevenue": 2651, "centralTransfers": 11712, "totalRevenue": 14820, "selfSufficiencyRatio": 17.9},
    {"id": "MZ", "name": "Mizoram", "ownTaxRevenue": 1102, "centralTransfers": 8152, "totalRevenue": 10282, "selfSufficiencyRatio": 10.7},
    {"id": "NL", "name": "Nagaland", "ownTaxRevenue": 1462, "centralTransfers": 12159, "totalRevenue": 14099, "selfSufficiencyRatio": 10.4},
    {"id": "OD", "name": "Odisha", "ownTaxRevenue": 46554, "centralTransfers": 61188, "totalRevenue": 150462, "selfSufficiencyRatio": 30.9},
    {"id": "PB", "name": "Punjab", "ownTaxRevenue": 42243, "centralTransfers": 39141, "totalRevenue": 87616, "selfSufficiencyRatio": 48.2},
    {"id": "RJ", "name": "Rajasthan", "ownTaxRevenue": 87346, "centralTransfers": 87078, "totalRevenue": 194988, "selfSufficiencyRatio": 44.8},
    {"id": "SK", "name": "Sikkim", "ownTaxRevenue": 1497, "centralTransfers": 5631, "totalRevenue": 8104, "selfSufficiencyRatio": 18.5},
    {"id": "TN", "name": "Tamil Nadu", "ownTaxRevenue": 150223, "centralTransfers": 76465, "totalRevenue": 243749, "selfSufficiencyRatio": 61.6},
    {"id": "TS", "name": "Telangana", "ownTaxRevenue": 106949, "centralTransfers": 32848, "totalRevenue": 159351, "selfSufficiencyRatio": 67.1},
    {"id": "TR", "name": "Tripura", "ownTaxRevenue": 2597, "centralTransfers": 15310, "totalRevenue": 18309, "selfSufficiencyRatio": 14.2},
    {"id": "UP", "name": "Uttar Pradesh", "ownTaxRevenue": 174087, "centralTransfers": 229665, "totalRevenue": 417241, "selfSufficiencyRatio": 41.7},
    {"id": "UK", "name": "Uttarakhand", "ownTaxRevenue": 17103, "centralTransfers": 27613, "totalRevenue": 49083, "selfSufficiencyRatio": 34.8},
    {"id": "WB", "name": "West Bengal", "ownTaxRevenue": 83609, "centralTransfers": 109738, "totalRevenue": 195544, "selfSufficiencyRatio": 42.8},
    {"id": "AN", "name": "Andaman and Nicobar Islands", "ownTaxRevenue": 0, "centralTransfers": 0, "totalRevenue": 0, "selfSufficiencyRatio": 0.0},
    {"id": "CH", "name": "Chandigarh", "ownTaxRevenue": 0, "centralTransfers": 0, "totalRevenue": 0, "selfSufficiencyRatio": 0.0},
    {"id": "DN", "name": "Dadra and Nagar Haveli and Daman and Diu", "ownTaxRevenue": 0, "centralTransfers": 0, "totalRevenue": 0, "selfSufficiencyRatio": 0.0},
    {"id": "DL", "name": "Delhi", "ownTaxRevenue": 47363, "centralTransfers": 14759, "totalRevenue": 62703, "selfSufficiencyRatio": 75.5},
    {"id": "JK", "name": "Jammu and Kashmir", "ownTaxRevenue": 12335, "centralTransfers": 51493, "totalRevenue": 68976, "selfSufficiencyRatio": 17.9},
    {"id": "LA", "name": "Ladakh", "ownTaxRevenue": 0, "centralTransfers": 0, "totalRevenue": 0, "selfSufficiencyRatio": 0.0},
    {"id": "LD", "name": "Lakshadweep", "ownTaxRevenue": 0, "centralTransfers": 0, "totalRevenue": 0, "selfSufficiencyRatio": 0.0},
    {"id": "PY", "name": "Puducherry", "ownTaxRevenue": 4297, "centralTransfers": 3374, "totalRevenue": 9635, "selfSufficiencyRatio": 44.6},
]


# ── STATE FISCAL DATA ───────────────────────────────────────────────────
# Source: RBI Handbook of Statistics on Indian States, Tables 29-33
# Fiscal deficit as % of GSDP, outstanding debt as % of GSDP
#
# PLACEHOLDER — To be populated by Codex from RBI Handbook data
STATE_FISCAL_DATA: list[dict] = [
    {"id": "AP", "name": "Andhra Pradesh", "fiscalDeficitPctGsdp": 4.0, "debtToGsdp": 33.1},
    {"id": "AR", "name": "Arunachal Pradesh", "fiscalDeficitPctGsdp": 5.0, "debtToGsdp": 51.4},
    {"id": "AS", "name": "Assam", "fiscalDeficitPctGsdp": 5.9, "debtToGsdp": 27.0},
    {"id": "BR", "name": "Bihar", "fiscalDeficitPctGsdp": 6.0, "debtToGsdp": 39.3},
    {"id": "CG", "name": "Chhattisgarh", "fiscalDeficitPctGsdp": 1.0, "debtToGsdp": 23.5},
    {"id": "GA", "name": "Goa", "fiscalDeficitPctGsdp": 1.2, "debtToGsdp": 34.1},
    {"id": "GJ", "name": "Gujarat", "fiscalDeficitPctGsdp": 0.8, "debtToGsdp": 19.2},
    {"id": "HR", "name": "Haryana", "fiscalDeficitPctGsdp": 3.2, "debtToGsdp": 31.4},
    {"id": "HP", "name": "Himachal Pradesh", "fiscalDeficitPctGsdp": 6.5, "debtToGsdp": 45.2},
    {"id": "JH", "name": "Jharkhand", "fiscalDeficitPctGsdp": 1.1, "debtToGsdp": 28.4},
    {"id": "KA", "name": "Karnataka", "fiscalDeficitPctGsdp": 2.1, "debtToGsdp": 25.1},
    {"id": "KL", "name": "Kerala", "fiscalDeficitPctGsdp": 2.5, "debtToGsdp": 37.9},
    {"id": "MP", "name": "Madhya Pradesh", "fiscalDeficitPctGsdp": 3.3, "debtToGsdp": 29.4},
    {"id": "MH", "name": "Maharashtra", "fiscalDeficitPctGsdp": 1.9, "debtToGsdp": 18.1},
    {"id": "MN", "name": "Manipur", "fiscalDeficitPctGsdp": 4.4, "debtToGsdp": 42.6},
    {"id": "ML", "name": "Meghalaya", "fiscalDeficitPctGsdp": 6.0, "debtToGsdp": 42.9},
    {"id": "MZ", "name": "Mizoram", "fiscalDeficitPctGsdp": 3.6, "debtToGsdp": 37.2},
    {"id": "NL", "name": "Nagaland", "fiscalDeficitPctGsdp": 4.2, "debtToGsdp": 45.7},
    {"id": "OD", "name": "Odisha", "fiscalDeficitPctGsdp": 2.0, "debtToGsdp": 19.5},
    {"id": "PB", "name": "Punjab", "fiscalDeficitPctGsdp": 5.0, "debtToGsdp": 47.1},
    {"id": "RJ", "name": "Rajasthan", "fiscalDeficitPctGsdp": 3.8, "debtToGsdp": 37.3},
    {"id": "SK", "name": "Sikkim", "fiscalDeficitPctGsdp": 4.5, "debtToGsdp": 31.3},
    {"id": "TN", "name": "Tamil Nadu", "fiscalDeficitPctGsdp": 3.4, "debtToGsdp": 31.7},
    {"id": "TS", "name": "Telangana", "fiscalDeficitPctGsdp": 2.5, "debtToGsdp": 26.7},
    {"id": "TR", "name": "Tripura", "fiscalDeficitPctGsdp": 2.1, "debtToGsdp": 31.4},
    {"id": "UP", "name": "Uttar Pradesh", "fiscalDeficitPctGsdp": 2.8, "debtToGsdp": 30.4},
    {"id": "UK", "name": "Uttarakhand", "fiscalDeficitPctGsdp": 1.0, "debtToGsdp": 26.5},
    {"id": "WB", "name": "West Bengal", "fiscalDeficitPctGsdp": 3.3, "debtToGsdp": 39.1},
    {"id": "AN", "name": "Andaman and Nicobar Islands", "fiscalDeficitPctGsdp": 0, "debtToGsdp": 0},
    {"id": "CH", "name": "Chandigarh", "fiscalDeficitPctGsdp": 0, "debtToGsdp": 0},
    {"id": "DN", "name": "Dadra and Nagar Haveli and Daman and Diu", "fiscalDeficitPctGsdp": 0, "debtToGsdp": 0},
    {"id": "DL", "name": "Delhi", "fiscalDeficitPctGsdp": -0.4, "debtToGsdp": 1.6},
    {"id": "JK", "name": "Jammu and Kashmir", "fiscalDeficitPctGsdp": 2.2, "debtToGsdp": 33.0},
    {"id": "LA", "name": "Ladakh", "fiscalDeficitPctGsdp": 0, "debtToGsdp": 0},
    {"id": "LD", "name": "Lakshadweep", "fiscalDeficitPctGsdp": 0, "debtToGsdp": 0},
    {"id": "PY", "name": "Puducherry", "fiscalDeficitPctGsdp": -0.8, "debtToGsdp": 27.5},
]
