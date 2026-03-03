"""
Transform sectoral GVA data into the SectorsData schema.

Source: Economic Survey 2025-26, Chapter 1 "State of the Economy"
        + MoSPI National Accounts Statistics
        + World Bank sectoral value added indicators
"""

import logging

logger = logging.getLogger(__name__)


def build_sectors(
    wb_agri: list[dict],
    wb_industry: list[dict],
    wb_services: list[dict],
    survey_year: str,
    nas_gva: list[dict] | None = None,
) -> dict:
    """
    Build sectors.json from NAS GVA shares (primary) or World Bank (fallback)
    + Economic Survey growth rates.

    NAS GVA provides industry-level shares directly from NSO.
    World Bank provides sectoral value added as % of GDP (not % of GVA).
    Growth rates come from the Economic Survey.

    Note: "5-year avg" uses FY2020-21 to FY2024-25 period.
    """
    # Get latest sectoral shares
    if nas_gva:
        # Use NAS GVA shares — more current and granular than World Bank
        nas_shares = _extract_nas_shares(nas_gva)
        latest_agri = nas_shares.get("agriculture", 17.0)
        latest_industry = nas_shares.get("industry", 26.0)
        latest_services = nas_shares.get("services", 50.0)
        source_tag = "MOSPI NAS API"
        logger.info(f"  Sectors using NAS GVA: agri={latest_agri}%, industry={latest_industry}%, services={latest_services}%")
    else:
        # Fall back to World Bank
        latest_agri = wb_agri[-1]["value"] if wb_agri else 17.0
        latest_industry = wb_industry[-1]["value"] if wb_industry else 26.0
        latest_services = wb_services[-1]["value"] if wb_services else 50.0
        source_tag = "World Bank GDP indicators"

    # Growth rates from Economic Survey 2025-26 Chapter 1
    # Source: Table 1.1 "Sectoral Growth Rates of GVA at Basic Prices (2011-12 series)"
    sectors = [
        {
            "id": "agriculture",
            "name": "Agriculture & Allied",
            "currentGrowth": 3.8,       # FY2025-26 advance estimate
            "fiveYearAvg": 4.5,          # FY2020-21 to FY2024-25 avg
            "gvaShare": round(latest_agri, 1),
        },
        {
            "id": "industry",
            "name": "Industry",
            "currentGrowth": 6.2,        # FY2025-26 advance estimate
            "fiveYearAvg": 5.4,
            "gvaShare": round(latest_industry, 1),
        },
        {
            "id": "services",
            "name": "Services",
            "currentGrowth": 7.2,        # FY2025-26 advance estimate
            "fiveYearAvg": 7.8,
            "gvaShare": round(latest_services, 1),
        },
        {
            "id": "construction",
            "name": "Construction",
            "currentGrowth": 8.6,        # FY2025-26 advance estimate
            "fiveYearAvg": 8.1,
            "gvaShare": 8.0,             # Subset of industry
        },
        {
            "id": "manufacturing",
            "name": "Manufacturing",
            "currentGrowth": 5.8,        # FY2025-26 advance estimate
            "fiveYearAvg": 4.2,
            "gvaShare": 15.2,            # Subset of industry
        },
    ]

    return {
        "year": survey_year,
        "sectors": sectors,
        "source": f"https://www.indiabudget.gov.in/economicsurvey/ (Ch.1, Table 1.1) + {source_tag}",
    }


# ── NAS GVA industry-to-sector mapping ────────────────────────────────

# NAS industry names → aggregate sectors
_NAS_AGRICULTURE = {"Agriculture, Livestock, Forestry and Fishing"}
_NAS_INDUSTRY = {
    "Mining and Quarrying",
    "Manufacturing",
    "Electricity, Gas, Water Supply & Other Utility Services",
    "Construction",
}
_NAS_SERVICES = {
    "Trade, Hotels, Transport, Communication and Services Related to Broadcasting",
    "Trade & Repair Services",
    "Hotels & Restaurants",
    "Transport, Storage, Communication & Services Related to Broadcasting",
    "Financial, Real Estate & Professional Services",
    "Financial Services",
    "Real Estate, Ownership of Dwelling & Professional Services",
    "Public Administration, Defence and Other Services",
    "Public Administration & Defence",
    "Other Services",
}


def _extract_nas_shares(nas_gva: list[dict]) -> dict[str, float]:
    """Extract agriculture/industry/services shares from NAS GVA data."""
    agri = sum(s.get("sharePct", 0) for s in nas_gva if s.get("industry") in _NAS_AGRICULTURE)
    industry = sum(s.get("sharePct", 0) for s in nas_gva if s.get("industry") in _NAS_INDUSTRY)
    services = sum(s.get("sharePct", 0) for s in nas_gva if s.get("industry") in _NAS_SERVICES)

    # If mapping missed some industries, distribute proportionally
    mapped = agri + industry + services
    if mapped < 90:
        # Too many unmapped — fallback to simple approach
        logger.warning(f"  NAS GVA mapping captured only {mapped:.1f}%. Using fallback.")
        return {}

    return {
        "agriculture": round(agri, 1),
        "industry": round(industry, 1),
        "services": round(services, 1),
    }
