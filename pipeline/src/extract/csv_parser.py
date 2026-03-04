"""
Parse CSV/Excel budget data into pandas DataFrames.
If no downloaded files are available, returns curated budget data
based on the Union Budget 2025-26 documents.
"""

import logging
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)


def parse_budget_file(file_path: str, fmt: str = "csv") -> pd.DataFrame:
    """Parse a downloaded CSV or Excel file into a DataFrame."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Budget file not found: {file_path}")

    if fmt in ("xlsx", "xls"):
        return pd.read_excel(path)
    return pd.read_csv(path)


def get_curated_expenditure_data() -> pd.DataFrame:
    """
    Curated Union Budget 2025-26 expenditure data by ministry/department.
    Based on Budget at a Glance and Expenditure Budget documents.
    Amounts in Rs crore.
    """
    data = [
        # (id, name, budget_estimate_2025_26, budget_estimate_2024_25, schemes_json)
        ("interest-payments", "Interest Payments", 1080000, 998411, "[]"),
        ("defence", "Ministry of Defence", 681210, 651700, '[{"id":"defence-revenue","name":"Revenue Expenditure","amount":314000},{"id":"defence-capital","name":"Capital Expenditure","amount":367210}]'),
        ("rural-development", "Ministry of Rural Development", 178482, 159147, '[{"id":"mgnrega","name":"MGNREGA","amount":86000},{"id":"pmay-g","name":"PMAY-G (Rural Housing)","amount":54500},{"id":"pmgsy","name":"PMGSY (Rural Roads)","amount":19000}]'),
        ("agriculture", "Ministry of Agriculture & Farmers Welfare", 135580, 127570, '[{"id":"pm-kisan","name":"PM-KISAN","amount":60000},{"id":"crop-insurance","name":"PM Fasal Bima Yojana","amount":15500}]'),
        ("education", "Ministry of Education", 125638, 118780, '[{"id":"samagra-shiksha","name":"Samagra Shiksha","amount":37500},{"id":"mid-day-meal","name":"PM POSHAN (Mid-Day Meal)","amount":12800},{"id":"higher-education","name":"Higher Education","amount":44500}]'),
        ("health", "Ministry of Health & Family Welfare", 90959, 84816, '[{"id":"ayushman-bharat","name":"Ayushman Bharat","amount":7500},{"id":"nhm","name":"National Health Mission","amount":36000}]'),
        ("railways", "Ministry of Railways", 265200, 257200, "[]"),
        ("home-affairs", "Ministry of Home Affairs", 221049, 209291, "[]"),
        ("road-transport", "Ministry of Road Transport & Highways", 278000, 270435, "[]"),
        ("transfers-to-states", "Transfers to States & UTs", 1200000, 1126921, "[]"),
        ("subsidies", "Subsidies (Food, Fertilizer, Fuel)", 396000, 432000, '[{"id":"food-subsidy","name":"Food Subsidy","amount":205000},{"id":"fertilizer-subsidy","name":"Fertilizer Subsidy","amount":145000},{"id":"fuel-subsidy","name":"Petroleum Subsidy","amount":11500}]'),
    ]

    df = pd.DataFrame(data, columns=[
        "id", "name", "budget_estimate", "previous_year", "schemes_json"
    ])
    return df


def get_curated_receipts_data() -> pd.DataFrame:
    """
    Curated Union Budget 2025-26 receipts data.
    Based on Budget at a Glance / Receipt Budget.
    """
    data = [
        ("income-tax", "Income Tax", 1438000, 1256000),
        ("corporate-tax", "Corporate Tax", 1082000, 980000),
        ("gst", "GST", 1178000, 1062000),
        ("excise", "Excise Duty", 317000, 300000),
        ("customs", "Customs Duty", 240000, 223000),
        ("non-tax-revenue", "Non-Tax Revenue", 659000, 600000),
        ("borrowings", "Borrowings & Other Liabilities", 1568936, 1586000),
    ]

    df = pd.DataFrame(data, columns=[
        "id", "name", "amount", "previous_year"
    ])
    return df


def get_curated_summary() -> dict:
    """Key summary numbers from Union Budget 2025-26."""
    return {
        "year": "2025-26",
        "totalExpenditure": 5065345,
        "totalReceipts": 3496409,
        "revenueReceipts": 3420409,
        "capitalReceipts": 76000,
        "fiscalDeficit": 1568936,
        "fiscalDeficitPercentGDP": 4.4,
        "gdp": 35698000,
    }


def get_curated_statewise_data() -> pd.DataFrame:
    """
    State-wise transfer data based on Finance Commission recommendations
    and Union Budget documents. Amounts in Rs crore.
    """
    data = [
        ("UP", "Uttar Pradesh", 210000, 224500000),
        ("BH", "Bihar", 120000, 123400000),
        ("MP", "Madhya Pradesh", 96000, 87000000),
        ("WB", "West Bengal", 90000, 96800000),
        ("MH", "Maharashtra", 84000, 126500000),
        ("RJ", "Rajasthan", 72000, 80100000),
        ("TN", "Tamil Nadu", 54000, 77500000),
        ("KA", "Karnataka", 48000, 67300000),
        ("GJ", "Gujarat", 42000, 70800000),
        ("AP", "Andhra Pradesh", 48000, 52400000),
        ("OD", "Odisha", 54000, 46700000),
        ("TS", "Telangana", 30000, 40000000),
        ("KL", "Kerala", 24000, 35200000),
        ("JH", "Jharkhand", 42000, 38000000),
        ("CG", "Chhattisgarh", 42000, 30000000),
        ("AS", "Assam", 42000, 35100000),
        ("PB", "Punjab", 18000, 30500000),
        ("HR", "Haryana", 12000, 29100000),
        ("JK", "Jammu & Kashmir", 18000, 13600000),
        ("UK", "Uttarakhand", 12000, 11200000),
        ("HP", "Himachal Pradesh", 10800, 7500000),
        ("GA", "Goa", 3600, 1600000),
        ("NE", "Other NE States", 27600, 20000000),
    ]

    df = pd.DataFrame(data, columns=["id", "name", "transfer", "population"])
    return df


def get_curated_schemes_data() -> pd.DataFrame:
    """Major government schemes with allocations."""
    data = [
        ("mgnrega", "MGNREGA", "rural-development", "Rural Development", 86000, 73000, "Guaranteed 100 days of wages for 14.6 crore rural households"),
        ("pm-kisan", "PM-KISAN", "agriculture", "Agriculture", 60000, 60000, "Rs 6,000/year directly to 8 crore farmer bank accounts"),
        ("pmay-g", "PMAY-Gramin (Rural Housing)", "rural-development", "Rural Development", 54500, 48000, "Rs 1.2 lakh per house for families below poverty line"),
        ("samagra-shiksha", "Samagra Shiksha Abhiyan", "education", "Education", 37500, 35000, "Unified program covering 11.6 lakh schools, pre-primary to class 12"),
        ("nhm", "National Health Mission", "health", "Health", 36000, 33000, "Primary healthcare for 70% of India's population in rural areas"),
        ("pmgsy", "PMGSY (Rural Roads)", "rural-development", "Rural Development", 19000, 18000, "Connecting 178,000+ unconnected habitations with all-weather roads"),
        ("crop-insurance", "PM Fasal Bima Yojana", "agriculture", "Agriculture", 15500, 14000, "Crop insurance for 5.5 crore farmers at just 2% premium"),
        ("mid-day-meal", "PM POSHAN (Mid-Day Meal)", "education", "Education", 12800, 11600, "Hot meals for 12 crore schoolchildren every school day"),
        ("ayushman-bharat", "Ayushman Bharat", "health", "Health", 7500, 7200, "Rs 5 lakh free health insurance for 55 crore citizens"),
        ("food-subsidy", "Food Subsidy (NFSA)", "subsidies", "Consumer Affairs", 205000, 197000, "5 kg free food grains/month to 80 crore people"),
    ]

    df = pd.DataFrame(data, columns=[
        "id", "name", "ministry", "ministryName", "allocation",
        "previous_year", "humanContext"
    ])
    return df
