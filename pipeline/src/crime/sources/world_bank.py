"""
Crime & Safety — World Bank indicator fetcher (thin wrapper).

Fetches intentional homicide rate for long-run national trend context.
All the heavy lifting is in the shared client at src/common/world_bank.py.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))

from src.common.world_bank import fetch_multiple

# World Bank indicator codes for Crime & Safety
INDICATORS = {
    "homicideRate": "VC.IHR.PSRC.P5",  # Intentional homicides (per 100,000 people)
}


def fetch_world_bank_data(
    start_year: int = 1990,
    end_year: int = 2025,
) -> dict:
    """Fetch all crime-related World Bank indicators."""
    return fetch_multiple(INDICATORS, start_year=start_year, end_year=end_year, precision=2)
