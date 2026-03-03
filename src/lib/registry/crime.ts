import { registerChart } from '../chartRegistry.ts';
import type {
  CrimeOverviewData,
  WomenSafetyData,
  RoadAccidentData,
  CybercrimeData,
  PoliceData,
  JusticeData,
  CrimeIndicatorsData,
} from '../data/schema.ts';

const DOMAIN = 'crime';
const ACCENT = '#DC2626';
const YEAR = '2025-26';
const base = `/data/crime/${YEAR}`;

registerChart({
  domain: DOMAIN,
  sectionId: 'overview',
  title: 'Crime Overview — IPC & SLL Trends 2014–2022',
  source: 'NCRB Crime in India 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/overview.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as CrimeOverviewData;
    return {
      headers: ['Year', 'Total', 'IPC', 'SLL', 'Rate per Lakh'],
      rows: d.nationalTrend.map((t) => [t.year, t.total, t.ipc, t.sll, t.rate]),
    };
  },
  heroStat: (data) => {
    const d = data as CrimeOverviewData;
    const latest = d.nationalTrend[d.nationalTrend.length - 1];
    if (!latest) return null;
    return {
      label: 'Total Crimes 2022',
      value: `${(latest.total / 100000).toFixed(1)}L`,
      context: `Crime rate: ${latest.rate} per lakh population. IPC: ${(latest.ipc / 100000).toFixed(1)}L, SLL: ${(latest.sll / 100000).toFixed(1)}L.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'crimes-against-women',
  title: 'Crimes Against Women — Types & State Rates',
  source: 'NCRB Crime in India 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/women-safety.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as WomenSafetyData;
    return {
      headers: ['Type', 'Cases', 'Percentage (%)'],
      rows: d.crimeTypes.map((ct) => [ct.name, ct.cases, ct.pct]),
    };
  },
  heroStat: (data) => {
    const d = data as WomenSafetyData;
    const latest = d.nationalTrend[d.nationalTrend.length - 1];
    if (!latest) return null;
    return {
      label: 'Crimes Against Women',
      value: `${(latest.total / 1000).toFixed(0)}K`,
      context: `Rate: ${latest.rate} per lakh women. ${Math.round(latest.total / 365)} cases reported every day.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'road-accidents',
  title: 'Road Accident Deaths & Causes',
  source: 'MoRTH Annual Report 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/road-accidents.json`],
  chartType: 'area',
  toTabular: (data) => {
    const d = data as RoadAccidentData;
    return {
      headers: ['Year', 'Killed', 'Injured', 'Total Accidents'],
      rows: d.nationalTrend.map((t) => [t.year, t.killed, t.injured, t.accidents]),
    };
  },
  heroStat: (data) => {
    const d = data as RoadAccidentData;
    const latest = d.nationalTrend[d.nationalTrend.length - 1];
    if (!latest) return null;
    return {
      label: 'Road Deaths 2022',
      value: `${(latest.killed / 1000).toFixed(1)}K`,
      context: `${Math.round(latest.killed / 365)} deaths per day. Over-speeding causes 69% of fatal accidents.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'cybercrime',
  title: 'Cybercrime — NCRB FIRs & I4C Complaints',
  source: 'NCRB + I4C',
  accentColor: ACCENT,
  dataFiles: [`${base}/cybercrime.json`],
  chartType: 'line',
  toTabular: (data) => {
    const d = data as CybercrimeData;
    return {
      headers: ['Year', 'FIRs Registered'],
      rows: d.ncrbTrend.map((t) => [t.year, t.cases]),
    };
  },
  heroStat: (data) => {
    const d = data as CybercrimeData;
    const latest = d.ncrbTrend[d.ncrbTrend.length - 1];
    if (!latest) return null;
    return {
      label: 'Cybercrime FIRs',
      value: `${(latest.cases / 1000).toFixed(1)}K`,
      context: `I4C portal received ${(d.i4cComplaints / 100000).toFixed(1)}L complaints. Only ~3% become FIRs.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'police',
  title: 'Police Infrastructure — Strength & Ratios',
  source: 'BPRD Data on Police Organisations 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/police.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as PoliceData;
    return {
      headers: ['State', 'Actual Ratio', 'Sanctioned Ratio'],
      rows: d.stateRatios.map((s) => [s.name, s.actual, s.sanctioned]),
    };
  },
  heroStat: (data) => {
    const d = data as PoliceData;
    return {
      label: 'Police per Lakh',
      value: `${d.actualRatePerLakh}`,
      context: `UN recommended: ${d.unRecommended}. Vacancy: ${d.vacancyPct}%. Women: ${d.womenPolicePct}%.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'justice',
  title: 'Justice Pipeline — FIR to Conviction',
  source: 'NCRB Crime in India 2022',
  accentColor: ACCENT,
  dataFiles: [`${base}/justice.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as JusticeData;
    return {
      headers: ['Stage', 'Cases'],
      rows: [
        ['For Investigation', d.funnel.totalForInvestigation],
        ['Investigated', d.funnel.investigated],
        ['Chargesheeted', d.funnel.chargesheeted],
        ['Trial Completed', d.funnel.trialCompleted],
        ['Convicted', d.funnel.convicted],
      ],
    };
  },
  heroStat: (data) => {
    const d = data as JusticeData;
    return {
      label: 'Conviction Rate',
      value: `${d.funnel.convictionRate}%`,
      context: `Of every 100 cases, only ~13 end in conviction. Average trial: ${d.trialDuration.avgYears} years.`,
    };
  },
});

registerChart({
  domain: DOMAIN,
  sectionId: 'indicators',
  title: 'Crime & Safety Indicators — State Comparison',
  source: 'NCRB + MoRTH + BPRD',
  accentColor: ACCENT,
  dataFiles: [`${base}/indicators.json`],
  chartType: 'horizontal-bar',
  toTabular: (data) => {
    const d = data as CrimeIndicatorsData;
    if (d.indicators.length === 0) return { headers: [], rows: [] };
    const first = d.indicators[0];
    return {
      headers: ['State', ...d.indicators.map((ind) => ind.name)],
      rows: first.states.map((s, si) => [
        s.name,
        ...d.indicators.map((ind) => ind.states[si]?.value ?? ''),
      ]),
    };
  },
  heroStat: () => ({
    label: 'State Indicators',
    value: '5',
    context: 'Crime rate, women crime rate, road fatality rate, police ratio, and police vacancy across states.',
  }),
});
