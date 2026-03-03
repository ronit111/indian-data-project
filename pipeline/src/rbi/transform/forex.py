"""
Transform World Bank + RBI Handbook external/forex data into the forex.json schema.

Covers:
- Total reserves including gold (US$) — FI.RES.TOTL.CD + Handbook Table 147
- Official exchange rate (INR/USD)    — PA.NUS.FCRF

Source: World Bank Development Indicators for India, RBI Handbook Table 147

Note: World Bank reserves are in current US dollars. We convert to
US$ billion for readability (divide by 1e9, round to 2 decimals).
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    """Convert calendar year to Indian fiscal year string: '2020' -> '2020-21'."""
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def build_forex(
    wb_reserves: list[dict],
    wb_exchange_rate: list[dict],
    survey_year: str,
    handbook_forex: list[dict] | None = None,
) -> dict:
    """
    Build forex.json from World Bank reserves and exchange rate data.

    If Handbook Table 147 data is available, it supplements the reserves
    series with longer historical coverage (from 1967-68).

    Reserves are converted to US$ billion for chart readability.
    Exchange rate is INR per 1 USD (annual average).
    """
    # Convert WB reserves from raw US$ to US$ billion
    reserves_series = [
        {
            "year": calendar_to_fiscal(p["year"]),
            "value": round(p["value"] / 1e9, 2),
        }
        for p in wb_reserves
    ]

    reserves_source = "World Bank FI.RES.TOTL.CD"

    # Supplement with Handbook Table 147 if available
    if handbook_forex:
        wb_years = {p["year"] for p in reserves_series}
        handbook_points = []
        for r in handbook_forex:
            year = r["year"]
            usd_million = r.get("totalUsdMillion")
            if year not in wb_years and usd_million is not None and usd_million > 0:
                handbook_points.append({
                    "year": year,
                    "value": round(usd_million / 1000, 2),  # US$ million → billion
                })

        if handbook_points:
            reserves_series = handbook_points + reserves_series
            reserves_series.sort(key=lambda p: p["year"])
            reserves_source = "World Bank + RBI Handbook Table 147"
            logger.info(f"  Handbook extended reserves by {len(handbook_points)} historical years")

    exchange_series = [
        {
            "year": calendar_to_fiscal(p["year"]),
            "value": round(p["value"], 2),
        }
        for p in wb_exchange_rate
    ]

    logger.info(f"  reservesUSD: {len(reserves_series)} data points")
    logger.info(f"  exchangeRate: {len(exchange_series)} data points")

    return {
        "year": survey_year,
        "reservesUSD": {
            "series": reserves_series,
            "unit": "US$ billion",
            "source": reserves_source,
        },
        "exchangeRate": {
            "series": exchange_series,
            "unit": "INR per USD",
            "source": "World Bank PA.NUS.FCRF",
        },
    }
