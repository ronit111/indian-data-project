"""
RBI Handbook of Statistics on Indian Economy — data extraction.

Downloads and parses XLSX tables to provide:
  - Table 43: Monetary policy rate history (repo, CRR, SLR, SDF, MSF)
  - Table 62: Interest rate structure (lending, deposit, WALR, MCLR)
  - Table 147: Foreign exchange reserves time series

Supplements curated data and fills gaps in World Bank series.

Source: RBI Handbook of Statistics on Indian Economy
https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+Economy
"""

import logging
from typing import Any

from src.common.rbi_handbook import (
    fetch_economy_tables,
    parse_rate_table,
    parse_interest_rate_table,
    parse_forex_table,
)

logger = logging.getLogger(__name__)


def fetch_rate_history() -> list[dict[str, Any]] | None:
    """
    Fetch monetary policy rate history from Table 43.

    Returns list of rate change events sorted chronologically:
    [{date, bankRate, repo, reverseRepo, sdf, msf, crr, slr}]

    Values are None for fields that didn't change in that event.
    Returns None if the Handbook is unreachable.

    Note: This is supplementary to our curated REPO_RATE_DECISIONS
    which includes more recent MPC decisions (Table 43 has ~6 month lag).
    """
    tables = fetch_economy_tables([43])
    if 43 not in tables:
        logger.warning("Table 43 unavailable — will use curated data only")
        return None

    events = parse_rate_table(tables[43])
    logger.info(f"  Handbook Table 43: {len(events)} rate events from {events[0]['date']} to {events[-1]['date']}")
    return events if events else None


def fetch_interest_rates() -> list[dict[str, Any]] | None:
    """
    Fetch interest rate structure from Table 62.

    Returns annual data: [{year, callMoneyRate, depositRate1to3, lendingRate,
    mclr1Year, walrOutstanding, walrFresh, wadtdr}]

    This fills the empty World Bank lending/deposit rate series.
    Returns None if the Handbook is unreachable.
    """
    tables = fetch_economy_tables([62])
    if 62 not in tables:
        logger.warning("Table 62 unavailable — lending/deposit rates remain empty")
        return None

    rates = parse_interest_rate_table(tables[62])
    logger.info(f"  Handbook Table 62: {len(rates)} years of interest rate data")
    return rates if rates else None


def fetch_forex_reserves() -> list[dict[str, Any]] | None:
    """
    Fetch forex reserves history from Table 147.

    Returns annual data: [{year, totalCrore, totalUsdMillion}]
    from 1967-68 onwards.

    Returns None if the Handbook is unreachable.
    """
    tables = fetch_economy_tables([147])
    if 147 not in tables:
        logger.warning("Table 147 unavailable — using World Bank reserves data only")
        return None

    reserves = parse_forex_table(tables[147])
    logger.info(f"  Handbook Table 147: {len(reserves)} years of forex data")
    return reserves if reserves else None
