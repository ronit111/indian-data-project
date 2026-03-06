import { registerChart } from '../chartRegistry.ts';
import type { AirQualityData, ForestData, EnergyData, WaterData } from '../data/schema.ts';

const DOMAIN = 'environment';
const ACCENT = '#14B8A6';
const YEAR = '2025-26';
const base = `/data/environment/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'air-quality',
  title: 'Air Quality — PM2.5 & City AQI',
  source: 'World Bank, CPCB NAQI',
  accentColor: ACCENT,
  dataFiles: [`${base}/air-quality.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as AirQualityData;
    return {
      headers: ['Year', 'PM2.5 (μg/m³)'],
      rows: d.pm25TimeSeries.map((p) => [p.year, p.value]),
    };
  },
  heroStat: (data) => {
    const d = data as AirQualityData;
    const latest = d.pm25TimeSeries[d.pm25TimeSeries.length - 1];
    if (!latest) return null;
    return {
      label: 'PM2.5 Annual Mean',
      value: `${latest.value.toFixed(1)} μg/m³`,
      context: `WHO guideline is 5 μg/m³. India is ${Math.round(latest.value / 5)}× above.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'forest-cover',
  title: 'Forest Cover — India\'s Green Balance Sheet',
  source: 'World Bank, ISFR 2023',
  accentColor: ACCENT,
  dataFiles: [`${base}/forest.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as ForestData;
    return {
      headers: ['Year', 'Forest Cover (% of land)'],
      rows: d.forestPctTimeSeries.map((p) => [p.year, p.value]),
    };
  },
  heroStat: (data) => {
    const d = data as ForestData;
    const latest = d.forestPctTimeSeries[d.forestPctTimeSeries.length - 1];
    if (!latest) return null;
    return {
      label: 'Forest Cover',
      value: `${latest.value.toFixed(1)}%`,
      context: `Percentage of India's land area under forest cover (ISFR 2023).`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'energy-transition',
  title: 'Energy Transition — Installed Capacity Mix',
  source: 'CEA All India Reports',
  accentColor: ACCENT,
  dataFiles: [`${base}/energy.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as EnergyData;
    return {
      headers: ['Year', 'Coal (MW)', 'Gas (MW)', 'Nuclear (MW)', 'Hydro (MW)', 'Solar (MW)', 'Wind (MW)', 'Biomass (MW)', 'Small Hydro (MW)'],
      rows: d.fuelCapacityMix.map((e) => [
        e.year, e.coal, e.gas, e.nuclear, e.hydro, e.solar, e.wind, e.biomass, e.smallHydro,
      ]),
    };
  },
  heroStat: (data) => {
    const d = data as EnergyData;
    const latest = d.fuelCapacityMix[d.fuelCapacityMix.length - 1];
    if (!latest) return null;
    const total = latest.coal + latest.gas + latest.nuclear + latest.hydro + latest.solar + latest.wind + latest.biomass + latest.smallHydro;
    const renewableShare = ((latest.solar + latest.wind + latest.hydro + latest.biomass + latest.smallHydro) / total * 100);
    return {
      label: 'Renewable Installed Capacity Share',
      value: `${renewableShare.toFixed(1)}%`,
      context: `Share of India's installed electricity capacity from renewable sources (${latest.year}). Coal still generates 70%+ of actual electricity.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'carbon-footprint',
  title: 'Carbon Footprint — CO₂ & Coal Dependency',
  source: 'World Bank (IEA)',
  accentColor: ACCENT,
  dataFiles: [`${base}/energy.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as EnergyData;
    return {
      headers: ['Year', 'Coal Electricity (%)', 'CO₂ per Capita (tonnes)'],
      rows: d.coalElecTimeSeries.map((p, i) => [
        p.year, p.value, d.co2PerCapitaTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'water-stress',
  title: 'Water Stress — Groundwater & Reservoirs',
  source: 'CWC, CGWB',
  accentColor: ACCENT,
  dataFiles: [`${base}/water.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as WaterData;
    return {
      headers: ['State', 'Groundwater Stage (%)'],
      rows: d.groundwaterStage.map((s) => [s.name, s.stagePct]),
    };
  },
  heroStat: (data) => {
    const d = data as WaterData;
    const overExploited = d.groundwaterStage.filter((s) => s.stagePct > 100).length;
    return {
      label: 'Over-Exploited States',
      value: `${overExploited}`,
      context: `States where annual groundwater extraction exceeds annual recharge (>100%).`,
    };
  },
});
