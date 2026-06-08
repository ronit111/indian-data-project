"""
Transform World Bank PM2.5 time series + CPCB state AQI + city AQI into air-quality.json.
"""

import logging

logger = logging.getLogger(__name__)


def build_air_quality(wb_data: dict, cpcb_states: list[dict], cpcb_cities: list[dict], year: str) -> dict:
    state_aqi = [
        {
            "id": s["id"],
            "name": s["name"],
            "aqi": s["aqi"],
            "category": s["category"],
        }
        for s in cpcb_states
    ]

    city_aqi = [
        {
            "city": c["city"],
            "state": c["state"],
            "aqi": c["aqi"],
        }
        for c in cpcb_cities
    ]

    logger.info(f"  Air quality: {len(wb_data.get('pm25', []))} PM2.5 points, {len(state_aqi)} states, {len(city_aqi)} cities")

    return {
        "year": year,
        "pm25TimeSeries": wb_data.get("pm25", []),
        "stateAQI": state_aqi,
        "cityAQI": city_aqi,
        "source": "World Bank (PM2.5 annual mean)",
    }
