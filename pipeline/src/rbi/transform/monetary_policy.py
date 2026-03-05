"""
Transform curated RBI monetary policy data into the monetary-policy.json schema.

All data points are sourced from official RBI Monetary Policy Statements
published at: https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx

CRR/SLR/SDF/MSF rates are from RBI's current rates page:
https://www.rbi.org.in/Scripts/BS_NSDPDisplay.aspx

This module uses NO World Bank data — it is entirely curated from
primary RBI publications. Updated ~6 times per year after MPC meetings.
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: int) -> str:
    """Convert calendar year to Indian fiscal year string: 2020 -> '2020-21'."""
    return f"{cal_year}-{str(cal_year + 1)[-2:]}"


# ── Curated repo rate decisions ──────────────────────────────────────────
# Source: RBI Monetary Policy Statements (https://www.rbi.org.in)
# Pre-MPC era decisions were made by the RBI Governor unilaterally.
# MPC (Monetary Policy Committee) was constituted in October 2016.

REPO_RATE_DECISIONS = [
    # Pre-MPC era (RBI Governor decisions)
    # Source: RBI press releases 2014-2016
    {"date": "2014-01-28", "rate": 8.00, "change": 0.25,  "stance": "Tightening"},
    {"date": "2015-01-15", "rate": 7.75, "change": -0.25, "stance": "Easing"},
    {"date": "2015-03-04", "rate": 7.50, "change": -0.25, "stance": "Easing"},
    {"date": "2015-06-02", "rate": 7.25, "change": -0.25, "stance": "Easing"},
    {"date": "2015-09-29", "rate": 6.75, "change": -0.50, "stance": "Easing"},

    # MPC era (Oct 2016 onwards)
    # Source: RBI MPC Statements — https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx
    {"date": "2016-10-04", "rate": 6.25, "change": -0.25, "stance": "Accommodative"},
    {"date": "2017-08-02", "rate": 6.00, "change": -0.25, "stance": "Neutral"},
    {"date": "2018-06-06", "rate": 6.25, "change": 0.25,  "stance": "Neutral"},
    {"date": "2018-08-01", "rate": 6.50, "change": 0.25,  "stance": "Neutral"},
    {"date": "2019-02-07", "rate": 6.25, "change": -0.25, "stance": "Neutral"},
    {"date": "2019-04-04", "rate": 6.00, "change": -0.25, "stance": "Neutral"},
    {"date": "2019-06-06", "rate": 5.75, "change": -0.25, "stance": "Accommodative"},
    {"date": "2019-08-07", "rate": 5.40, "change": -0.35, "stance": "Accommodative"},
    {"date": "2019-10-04", "rate": 5.15, "change": -0.25, "stance": "Accommodative"},

    # COVID emergency cuts
    # Source: RBI emergency MPC statements, March & May 2020
    {"date": "2020-03-27", "rate": 4.40, "change": -0.75, "stance": "Accommodative"},
    {"date": "2020-05-22", "rate": 4.00, "change": -0.40, "stance": "Accommodative"},

    # Post-COVID tightening cycle
    # Source: RBI MPC statements 2022-2023
    {"date": "2022-05-04", "rate": 4.40, "change": 0.40, "stance": "Withdrawal of Accommodation"},
    {"date": "2022-06-08", "rate": 4.90, "change": 0.50, "stance": "Withdrawal of Accommodation"},
    {"date": "2022-08-05", "rate": 5.40, "change": 0.50, "stance": "Withdrawal of Accommodation"},
    {"date": "2022-09-30", "rate": 5.90, "change": 0.50, "stance": "Withdrawal of Accommodation"},
    {"date": "2022-12-07", "rate": 6.25, "change": 0.35, "stance": "Withdrawal of Accommodation"},
    {"date": "2023-02-08", "rate": 6.50, "change": 0.25, "stance": "Withdrawal of Accommodation"},

    # 2024-2025 easing cycle
    # Source: RBI MPC statements Oct 2024, Feb 2025
    {"date": "2024-10-09", "rate": 6.50, "change": 0.0,   "stance": "Neutral"},  # stance change only
    {"date": "2025-02-07", "rate": 6.25, "change": -0.25, "stance": "Neutral"},
]


# ── Current policy rates ─────────────────────────────────────────────────
# Source: RBI Current Rates — https://www.rbi.org.in/Scripts/BS_NSDPDisplay.aspx
# As of February 7, 2025 MPC decision
CURRENT_RATES = {
    "repo_rate": 6.25,         # Policy rate (Feb 2025 cut)
    "sdf_rate": 6.00,          # Standing Deposit Facility (repo - 25bps)
    "msf_rate": 6.50,          # Marginal Standing Facility (repo + 25bps)
    "bank_rate": 6.50,         # Same as MSF
    "crr": 4.00,               # Cash Reserve Ratio (Dec 2024 cut to 4.0%)
    "slr": 18.00,              # Statutory Liquidity Ratio
}


# ── CRR history (fiscal year end values) ─────────────────────────────────
# Source: RBI Handbook of Statistics on Indian Economy, Table 45
# https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=22654
# Dec 2024: cut 50bps to 4.00% (phased: Dec 14 to 4.25%, Dec 28 to 4.00%)
CRR_HISTORY = [
    {"year": "2014-15", "value": 4.00},
    {"year": "2015-16", "value": 4.00},
    {"year": "2016-17", "value": 4.00},
    {"year": "2017-18", "value": 4.00},
    {"year": "2018-19", "value": 4.00},
    {"year": "2019-20", "value": 4.00},
    {"year": "2020-21", "value": 3.50},   # Reduced during COVID (Mar 2020)
    {"year": "2021-22", "value": 4.00},   # Restored in phases
    {"year": "2022-23", "value": 4.50},   # Hiked May 2022
    {"year": "2023-24", "value": 4.50},
    {"year": "2024-25", "value": 4.00},   # Cut 50bps Dec 2024
]


def build_monetary_policy(survey_year: str) -> dict:
    """
    Build monetary-policy.json from curated RBI MPC decision data.

    Returns the full repo rate decision history, current stance, and
    CRR history for charting the policy rate trajectory.
    """
    # Sort decisions newest-first for the JSON (frontend shows newest first)
    decisions_sorted = sorted(REPO_RATE_DECISIONS, key=lambda d: d["date"], reverse=True)

    current = decisions_sorted[0]

    logger.info(
        f"  Current repo rate: {current['rate']}% ({current['stance']}) "
        f"as of {current['date']}"
    )

    return {
        "year": survey_year,
        "currentRate": current["rate"],
        "currentStance": current["stance"],
        "decisions": decisions_sorted,
        "crrHistory": CRR_HISTORY,
        "source": "RBI Monetary Policy Statements — https://www.rbi.org.in",
    }
