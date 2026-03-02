import { registerChart } from '../chartRegistry.ts';
import type { EnrollmentData, QualityData, SpendingData } from '../data/schema.ts';

const DOMAIN = 'education';
const ACCENT = '#3B82F6';
const YEAR = '2025-26';
const base = `/data/education/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'enrollment',
  title: 'Gross Enrollment Ratios',
  source: 'World Bank, UDISE+ 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/enrollment.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as EnrollmentData;
    return {
      headers: ['Year', 'Primary GER (%)', 'Secondary GER (%)', 'Tertiary GER (%)'],
      rows: d.primaryTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.secondaryTimeSeries[i]?.value ?? '',
        d.tertiaryTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'gender',
  title: 'Gender Parity in Education',
  source: 'World Bank, UDISE+ 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/enrollment.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as EnrollmentData;
    return {
      headers: ['Year', 'Female Secondary GER (%)', 'Male Secondary GER (%)'],
      rows: d.femaleSecondary.map((p, i) => [
        p.year,
        p.value,
        d.maleSecondary[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'dropout',
  title: 'Primary Completion & Dropout',
  source: 'World Bank, UDISE+ 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/enrollment.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as EnrollmentData;
    return {
      headers: ['Year', 'Primary Completion (%)'],
      rows: d.primaryCompletion.map((p) => [p.year, p.value]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'quality',
  title: 'Learning Outcomes & Teacher Availability',
  source: 'World Bank, ASER 2024',
  accentColor: ACCENT,
  dataFiles: [`${base}/quality.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as QualityData;
    return {
      headers: ['Year', 'PTR Primary', 'PTR Secondary'],
      rows: d.ptrPrimaryTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.ptrSecondaryTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'teacher',
  title: 'Teacher Availability',
  source: 'World Bank, UDISE+ 2023-24',
  accentColor: ACCENT,
  dataFiles: [`${base}/quality.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as QualityData;
    return {
      headers: ['State', 'PTR', 'Schools with Computers (%)', 'Schools with Internet (%)'],
      rows: d.stateInfrastructure.map((s) => [s.name, s.ptr, s.schoolsWithComputers, s.schoolsWithInternet]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'spending',
  title: 'Education Spending',
  source: 'World Bank',
  accentColor: ACCENT,
  dataFiles: [`${base}/spending.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as SpendingData;
    return {
      headers: ['Year', 'Spending (% GDP)', 'Spending (% Govt)', 'Out-of-School Children'],
      rows: d.spendGDPTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.spendGovtTimeSeries[i]?.value ?? '',
        d.outOfSchoolTimeSeries[i]?.value ?? '',
      ]),
    };
  },
});
