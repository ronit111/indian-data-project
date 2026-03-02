import { registerChart } from '../chartRegistry.ts';
import type { PopulationData, DemographicsData, HealthData, LiteracyData } from '../data/schema.ts';

const DOMAIN = 'census';
const ACCENT = '#8B5CF6';
const YEAR = '2025-26';
const base = `/data/census/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'population',
  title: 'Population & Growth',
  source: 'World Bank, Census 2011, NPC 2026',
  accentColor: ACCENT,
  dataFiles: [`${base}/population.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as PopulationData;
    return {
      headers: ['Year', 'Population', 'Growth Rate (%)'],
      rows: d.nationalTimeSeries.map((p, i) => [
        p.year,
        p.value,
        d.growthTimeSeries[i]?.value ?? '',
      ]),
    };
  },
  heroStat: (data) => {
    const d = data as PopulationData;
    const latest = d.nationalTimeSeries[d.nationalTimeSeries.length - 1];
    if (!latest) return null;
    return {
      label: 'India Population',
      value: `${(latest.value / 1e9).toFixed(2)} billion`,
      context: `As of ${latest.year}. India is the world's most populous nation.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'age',
  title: 'Age Structure & Demographic Dividend',
  source: 'World Bank',
  accentColor: ACCENT,
  dataFiles: [`${base}/demographics.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as DemographicsData;
    return {
      headers: ['Year', 'Young 0-14 (%)', 'Working 15-64 (%)', 'Elderly 65+ (%)'],
      rows: d.ageStructure.young.map((p, i) => [
        p.year,
        p.value,
        d.ageStructure.working[i]?.value ?? '',
        d.ageStructure.elderly[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'vital-stats',
  title: 'Vital Statistics',
  source: 'World Bank, SRS 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/demographics.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as DemographicsData;
    return {
      headers: ['Year', 'Birth Rate', 'Death Rate', 'Fertility Rate', 'Life Expectancy'],
      rows: d.vitalStats.birthRate.map((p, i) => [
        p.year,
        p.value,
        d.vitalStats.deathRate[i]?.value ?? '',
        d.vitalStats.fertilityRate[i]?.value ?? '',
        d.vitalStats.lifeExpectancy[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'health',
  title: 'Health Indicators',
  source: 'World Bank, NFHS-5, SRS 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/health.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as HealthData;
    return {
      headers: ['Year', 'IMR (per 1000)', 'Under-5 Mortality', 'Life Expectancy'],
      rows: d.imrNational.map((p, i) => [
        p.year,
        p.value,
        d.under5[i]?.value ?? '',
        d.lifeExpectancy[i]?.value ?? '',
      ]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'literacy',
  title: 'Literacy Rates & Gender Gap',
  source: 'World Bank, Census 2011',
  accentColor: ACCENT,
  dataFiles: [`${base}/literacy.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as LiteracyData;
    return {
      headers: ['State', 'Overall (%)', 'Male (%)', 'Female (%)', 'Gender Gap (pp)'],
      rows: d.states.map((s) => [s.name, s.overallRate, s.maleRate, s.femaleRate, s.genderGap]),
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'urbanization',
  title: 'Urbanization Trends',
  source: 'World Bank, Census 2011',
  accentColor: ACCENT,
  dataFiles: [`${base}/demographics.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as DemographicsData;
    return {
      headers: ['Year', 'Urban Population (%)'],
      rows: d.urbanization.map((p) => [p.year, p.value]),
    };
  },
});
