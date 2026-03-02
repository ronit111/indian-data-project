import { registerChart } from '../chartRegistry.ts';
import type { ParticipationData, SectoralData, UnemploymentData } from '../data/schema.ts';

const DOMAIN = 'employment';
const ACCENT = '#F59E0B';
const YEAR = '2025-26';
const base = `/data/employment/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'participation',
  title: 'Labour Force Participation',
  source: 'World Bank, PLFS 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/participation.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as ParticipationData;
    return {
      headers: ['Year', 'LFPR Total (%)', 'LFPR Male (%)', 'LFPR Female (%)'],
      rows: d.lfprTotalTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.lfprMaleTimeSeries[i]?.value ?? '',
        d.lfprFemaleTimeSeries[i]?.value ?? '',
      ]),
    };
  },
  heroStat: (data) => {
    const d = data as ParticipationData;
    const latest = d.lfprTotalTimeSeries[d.lfprTotalTimeSeries.length - 1];
    if (!latest) return null;
    return {
      label: 'Labour Force Participation',
      value: `${latest.value.toFixed(1)}%`,
      context: `India's LFPR as of ${latest.year}`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'structural',
  title: 'Sectoral Employment Shifts',
  source: 'World Bank, RBI KLEMS',
  accentColor: ACCENT,
  dataFiles: [`${base}/sectoral.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as SectoralData;
    return {
      headers: ['Year', 'Agriculture (%)', 'Industry (%)', 'Services (%)'],
      rows: d.agricultureTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.industryTimeSeries[i]?.value ?? '',
        d.servicesTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'youth',
  title: 'Youth Unemployment',
  source: 'World Bank, PLFS 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/unemployment.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as UnemploymentData;
    return {
      headers: ['Year', 'Total Unemployment (%)', 'Youth Unemployment (%)'],
      rows: d.totalTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.youthTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'gender-gap',
  title: 'Gender Employment Gap',
  source: 'World Bank, PLFS 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/unemployment.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as UnemploymentData;
    return {
      headers: ['Year', 'Female Unemployment (%)', 'Male Unemployment (%)'],
      rows: d.femaleTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.maleTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'informality',
  title: 'Informal Employment',
  source: 'World Bank, PLFS 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/sectoral.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as SectoralData;
    return {
      headers: ['Year', 'Self-Employed (%)', 'Vulnerable Employment (%)'],
      rows: d.selfEmployedTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.vulnerableTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'rural-urban',
  title: 'Rural vs Urban Employment',
  source: 'World Bank, PLFS 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/participation.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as ParticipationData;
    return {
      headers: ['State', 'LFPR (%)'],
      rows: d.stateLfpr.map((s) => [s.name, s.value]),
    };
  },
});
