"""
Transform World Bank sectoral data + PLFS broad-industry shares into sectoral.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_sectoral(wb_data: dict, sectors: list[dict], year: str) -> dict:
    """
    Build sectoral.json matching the SectoralData TypeScript interface.
    """
    logger.info(f"  Sectoral: {len(wb_data.get('emp_agri', []))} agri points, {len(sectors)} current sectors")

    return {
        "year": year,
        "agricultureTimeSeries": wb_data.get("emp_agri", []),
        "industryTimeSeries": wb_data.get("emp_industry", []),
        "servicesTimeSeries": wb_data.get("emp_services", []),
        "selfEmployedTimeSeries": wb_data.get("emp_self", []),
        "vulnerableTimeSeries": wb_data.get("vulnerable_emp", []),
        "currentSectors": sectors,
        "source": "World Bank (ILO modelled) + PLFS Annual Report 2025",
    }
