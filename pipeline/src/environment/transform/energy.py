"""
Transform World Bank energy/carbon time series + CEA capacity mix into energy.json.

Energy data sources (priority order):
  1. MOSPI Energy API (api.mospi.gov.in) — supply-side KToE data
  2. CEA installed capacity reports (curated)
  3. World Bank Development Indicators (time series)
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


def build_energy(
    wb_data: dict,
    cea_mix: list[dict],
    year: str,
    mospi_energy: list[dict[str, Any]] | None = None,
) -> dict:
    fuel_capacity = [
        {
            "year": entry["year"],
            "coal": entry["coal"],
            "gas": entry["gas"],
            "nuclear": entry["nuclear"],
            "hydro": entry["hydro"],
            "solar": entry["solar"],
            "wind": entry["wind"],
            "biomass": entry["biomass"],
            "smallHydro": entry["smallHydro"],
        }
        for entry in cea_mix
    ]

    logger.info(f"  Energy: {len(wb_data.get('renewables_pct', []))} WB renewables points, {len(fuel_capacity)} CEA years")

    sources = ["World Bank", "CEA Installed Capacity Reports"]

    result = {
        "year": year,
        "renewablesPctTimeSeries": wb_data.get("renewables_pct", []),
        "renewableElecTimeSeries": wb_data.get("renewable_elec", []),
        "coalElecTimeSeries": wb_data.get("coal_elec", []),
        "energyUsePerCapitaTimeSeries": wb_data.get("energy_use_pc", []),
        "co2PerCapitaTimeSeries": wb_data.get("co2_per_capita", []),
        "co2TotalTimeSeries": wb_data.get("co2_total", []),
        "ghgTotalTimeSeries": wb_data.get("ghg_total", []),
        "fuelCapacityMix": fuel_capacity,
    }

    # MOSPI energy supply (KToE by commodity). Always emit energySupply as a
    # list — never omit the key — so the writer's last-known-good preservation
    # (_preserve_nonempty_series) protects it: if MOSPI is unreachable this run,
    # an empty list lets the previously published series be restored instead of
    # the field silently vanishing from the open-data endpoint.
    result["energySupply"] = mospi_energy or []
    if mospi_energy:
        sources.insert(0, "MOSPI Energy API (api.mospi.gov.in)")
        logger.info(f"  MOSPI energy supply: {len(mospi_energy)} commodities added")
    else:
        logger.info("  MOSPI energy supply unavailable — emitting [] (writer will preserve last-known-good)")

    result["source"] = " + ".join(sources)
    return result
