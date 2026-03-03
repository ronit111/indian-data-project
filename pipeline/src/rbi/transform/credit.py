"""
Transform World Bank credit/banking data into the credit.json schema.

Covers:
- Domestic credit by financial sector (% of GDP) — FS.AST.DOMS.GD.ZS
- Credit to private sector (% of GDP)            — FD.AST.PRVT.GD.ZS
- Lending interest rate (%)                      — FR.INR.LEND
- Deposit interest rate (%)                      — FR.INR.DPST

Source: World Bank Development Indicators for India
"""

import logging

logger = logging.getLogger(__name__)


def calendar_to_fiscal(cal_year: str) -> str:
    """Convert calendar year to Indian fiscal year string: '2020' -> '2020-21'."""
    y = int(cal_year)
    return f"{y}-{str(y + 1)[-2:]}"


def _build_series(wb_data: list[dict]) -> list[dict]:
    """Convert World Bank data points to fiscal-year series."""
    return [
        {"year": calendar_to_fiscal(p["year"]), "value": round(p["value"], 2)}
        for p in wb_data
    ]


def build_credit(
    wb_domestic_credit: list[dict],
    wb_private_credit: list[dict],
    wb_lending_rate: list[dict],
    wb_deposit_rate: list[dict],
    survey_year: str,
    handbook_rates: list[dict] | None = None,
) -> dict:
    """
    Build credit.json from World Bank credit and interest rate data.

    If Handbook Table 62 data is available, it fills the lending/deposit rate
    series that World Bank often returns empty for India.

    Each indicator is a nested object with series, unit, and source.
    """
    domestic_series = _build_series(wb_domestic_credit)
    private_series = _build_series(wb_private_credit)
    lending_series = _build_series(wb_lending_rate)
    deposit_series = _build_series(wb_deposit_rate)

    # Fill lending/deposit from Handbook Table 62 if WB series are empty
    lending_source = "World Bank FR.INR.LEND"
    deposit_source = "World Bank FR.INR.DPST"

    if handbook_rates:
        if not lending_series:
            lending_series = [
                {"year": r["year"], "value": r["lendingRate"]}
                for r in handbook_rates
                if r.get("lendingRate") is not None
            ]
            lending_source = "RBI Handbook Table 62 (BPLR/Base Rate/MCLR)"
            logger.info(f"  lendingRate: filled from Handbook ({len(lending_series)} points)")

        if not deposit_series:
            deposit_series = [
                {"year": r["year"], "value": r["depositRate1to3"]}
                for r in handbook_rates
                if r.get("depositRate1to3") is not None
            ]
            deposit_source = "RBI Handbook Table 62 (1-3yr Term Deposits, midpoint)"
            logger.info(f"  depositRate: filled from Handbook ({len(deposit_series)} points)")

    logger.info(f"  domesticCreditPctGDP: {len(domestic_series)} data points")
    logger.info(f"  privateCreditPctGDP: {len(private_series)} data points")
    logger.info(f"  lendingRate: {len(lending_series)} data points")
    logger.info(f"  depositRate: {len(deposit_series)} data points")

    return {
        "year": survey_year,
        "domesticCreditPctGDP": {
            "series": domestic_series,
            "unit": "% of GDP",
            "source": "World Bank FS.AST.DOMS.GD.ZS",
        },
        "privateCreditPctGDP": {
            "series": private_series,
            "unit": "% of GDP",
            "source": "World Bank FD.AST.PRVT.GD.ZS",
        },
        "lendingRate": {
            "series": lending_series,
            "unit": "%",
            "source": lending_source,
        },
        "depositRate": {
            "series": deposit_series,
            "unit": "%",
            "source": deposit_source,
        },
    }
