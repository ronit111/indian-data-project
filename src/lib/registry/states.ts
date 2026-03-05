import { registerChart } from '../chartRegistry.ts';
import type { GSDPData, RevenueData, FiscalHealthData } from '../data/schema.ts';

const DOMAIN = 'states';
const ACCENT = '#4ADE80';
const YEAR = '2025-26';
const base = `/data/states/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'gsdp',
  title: 'State GSDP Rankings',
  source: 'RBI Handbook of Statistics on Indian States',
  accentColor: ACCENT,
  dataFiles: [`${base}/gsdp.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as GSDPData;
    return {
      headers: ['State', 'GSDP (Rs Cr)', 'Growth Rate (%)', 'Per Capita (Rs)'],
      rows: d.states.map((s) => [s.name, s.gsdp, s.growthRate, s.perCapitaNsdp]),
    };
  },
  heroStat: (data) => {
    const d = data as GSDPData;
    const top = d.states.sort((a, b) => b.gsdp - a.gsdp)[0];
    if (!top) return null;
    return {
      label: 'Largest State Economy',
      value: `${top.name}`,
      context: `GSDP: Rs ${(top.gsdp / 100000).toFixed(1)} lakh crore (${d.year})`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'growth',
  title: 'GSDP Growth Rates',
  source: 'RBI Handbook of Statistics on Indian States',
  accentColor: ACCENT,
  dataFiles: [`${base}/gsdp.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as GSDPData;
    return {
      headers: ['State', 'Growth Rate (%)'],
      rows: d.states
        .sort((a, b) => b.growthRate - a.growthRate)
        .map((s) => [s.name, s.growthRate]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'revenue',
  title: 'Revenue Self-Sufficiency',
  source: 'RBI Handbook of Statistics on Indian States',
  accentColor: ACCENT,
  dataFiles: [`${base}/revenue.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as RevenueData;
    return {
      headers: ['State', 'Own Tax Revenue (Rs Cr)', 'Central Transfers (Rs Cr)', 'Self-Sufficiency (%)'],
      rows: d.states.map((s) => [s.name, s.ownTaxRevenue, s.centralTransfers, s.selfSufficiencyRatio]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'fiscal-health',
  title: 'State Fiscal Health',
  source: 'RBI Handbook of Statistics on Indian States',
  accentColor: ACCENT,
  dataFiles: [`${base}/fiscal-health.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as FiscalHealthData;
    return {
      headers: ['State', 'Fiscal Deficit (% GSDP)', 'Debt-to-GSDP (%)'],
      rows: d.states.map((s) => [s.name, s.fiscalDeficitPctGsdp, s.debtToGsdp]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'percapita',
  title: 'Per Capita NSDP',
  source: 'RBI Handbook of Statistics on Indian States',
  accentColor: ACCENT,
  dataFiles: [`${base}/gsdp.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as GSDPData;
    return {
      headers: ['State', 'Per Capita NSDP (Rs)'],
      rows: d.states
        .sort((a, b) => b.perCapitaNsdp - a.perCapitaNsdp)
        .map((s) => [s.name, s.perCapitaNsdp]),
    };
  },
});
