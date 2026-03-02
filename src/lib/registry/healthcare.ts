import { registerChart } from '../chartRegistry.ts';
import type { InfrastructureData, HealthSpendingData, DiseaseData } from '../data/schema.ts';

const DOMAIN = 'healthcare';
const ACCENT = '#F43F5E';
const YEAR = '2025-26';
const base = `/data/healthcare/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'infrastructure',
  title: 'Healthcare Infrastructure',
  source: 'World Bank, NHP 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/infrastructure.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as InfrastructureData;
    return {
      headers: ['Year', 'Hospital Beds (per 1000)', 'Physicians (per 1000)', 'Nurses (per 1000)'],
      rows: d.hospitalBedsTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.physiciansTimeSeries[i]?.value ?? '',
        d.nursesTimeSeries[i]?.value ?? '',
      ]),
    };
  },
  heroStat: (data) => {
    const d = data as InfrastructureData;
    const latest = d.hospitalBedsTimeSeries[d.hospitalBedsTimeSeries.length - 1];
    if (!latest) return null;
    return {
      label: 'Hospital Beds per 1,000',
      value: `${latest.value.toFixed(1)}`,
      context: `India's hospital bed density. WHO recommends 3.0 per 1,000.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'spending',
  title: 'Healthcare Spending',
  source: 'World Bank',
  accentColor: ACCENT,
  dataFiles: [`${base}/spending.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as HealthSpendingData;
    return {
      headers: ['Year', 'Health Exp (% GDP)', 'Govt Health Exp (% GDP)', 'OOP (%)'],
      rows: d.healthExpGDPTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.govtHealthExpTimeSeries[i]?.value ?? '',
        d.outOfPocketTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'oop',
  title: 'Out-of-Pocket Health Expenditure',
  source: 'World Bank',
  accentColor: ACCENT,
  dataFiles: [`${base}/spending.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as HealthSpendingData;
    return {
      headers: ['Year', 'Out-of-Pocket (%)'],
      rows: d.outOfPocketTimeSeries.map((p) => [p.year, p.value]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'immunization',
  title: 'Immunization Coverage',
  source: 'World Bank, NFHS-5',
  accentColor: ACCENT,
  dataFiles: [`${base}/disease.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as DiseaseData;
    return {
      headers: ['Year', 'DPT Immunization (%)', 'Measles Immunization (%)'],
      rows: d.dptTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.measlesTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'disease',
  title: 'Disease Burden',
  source: 'World Bank',
  accentColor: ACCENT,
  dataFiles: [`${base}/disease.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as DiseaseData;
    return {
      headers: ['Year', 'TB Incidence (per 100k)', 'HIV Prevalence (%)'],
      rows: d.tbIncidenceTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.hivTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'doctor-gap',
  title: 'Doctor Shortages by State',
  source: 'NHP 2022, NFHS-5',
  accentColor: ACCENT,
  dataFiles: [`${base}/infrastructure.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as InfrastructureData;
    return {
      headers: ['State', 'Beds per Lakh', 'Doctors per 10K', 'PHCs', 'CHCs'],
      rows: d.stateInfrastructure.map((s) => [s.name, s.bedsPerLakh, s.doctorsPer10K, s.phcs, s.chcs]),
    };
  },
});
