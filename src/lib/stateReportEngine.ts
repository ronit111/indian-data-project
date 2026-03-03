/**
 * Cross-domain state data aggregator for the State Report Card.
 *
 * Loads metrics from 8 domains (States, Budget, Census, Education,
 * Employment, Healthcare, Environment, Elections), computes ranks and quartiles.
 */

import type {
  GSDPData,
  RevenueData,
  FiscalHealthData,
  StatewiseData,
  PopulationData,
  LiteracyData,
  HealthData,
  EnrollmentData,
  UnemploymentData,
  ParticipationData,
  InfrastructureData,
  DiseaseData,
  AirQualityData,
  ForestData,
  WaterData,
  TurnoutData,
  CrimeIndicatorsData,
} from './data/schema.ts';
import { ALL_STATE_CODES } from './stateMapping.ts';

// ─── Types ──────────────────────────────────────────────────────────

export interface MetricDef {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  domain: string;
  formatFn?: (v: number) => string;
}

export interface MetricResult {
  def: MetricDef;
  value: number | null;
  nationalAvg: number | null;
  rank: number;
  totalStates: number;
  quartile: 1 | 2 | 3 | 4;
}

export interface DomainPanel {
  domain: string;
  title: string;
  accentColor: string;
  metrics: MetricResult[];
  dataAvailable: boolean;
}

export interface StateReportCard {
  state: { id: string; name: string };
  panels: DomainPanel[];
}

export interface AllDomainData {
  gsdp?: GSDPData;
  revenue?: RevenueData;
  fiscalHealth?: FiscalHealthData;
  statewise?: StatewiseData;
  population?: PopulationData;
  literacy?: LiteracyData;
  health?: HealthData;
  enrollment?: EnrollmentData;
  unemployment?: UnemploymentData;
  participation?: ParticipationData;
  infrastructure?: InfrastructureData;
  disease?: DiseaseData;
  airQuality?: AirQualityData;
  forest?: ForestData;
  water?: WaterData;
  turnout?: TurnoutData;
  crimeIndicators?: CrimeIndicatorsData;
}

// ─── Metric Definitions ─────────────────────────────────────────────

const METRIC_DEFS: MetricDef[] = [
  // Economy (from gsdp.json)
  { key: 'perCapitaGsdp', label: 'Per Capita GSDP', unit: 'Rs', higherIsBetter: true, domain: 'economy' },
  { key: 'growthRate', label: 'GSDP Growth', unit: '%', higherIsBetter: true, domain: 'economy' },
  { key: 'gsdp', label: 'Total GSDP', unit: 'Rs Cr', higherIsBetter: true, domain: 'economy' },
  // Budget (from statewise.json)
  { key: 'perCapitaTransfer', label: 'Per Capita Transfer', unit: 'Rs', higherIsBetter: true, domain: 'budget' },
  { key: 'transfer', label: 'Central Transfer', unit: 'Rs Cr', higherIsBetter: true, domain: 'budget' },
  // Revenue (from revenue.json)
  { key: 'selfSufficiencyRatio', label: 'Revenue Self-Sufficiency', unit: '%', higherIsBetter: true, domain: 'revenue' },
  // Fiscal Health (from fiscal-health.json)
  { key: 'fiscalDeficitPctGsdp', label: 'Fiscal Deficit', unit: '% GSDP', higherIsBetter: false, domain: 'fiscal' },
  { key: 'debtToGsdp', label: 'Debt-to-GSDP', unit: '%', higherIsBetter: false, domain: 'fiscal' },
  // Demographics (from population.json, literacy.json)
  { key: 'density', label: 'Density', unit: '/sq km', higherIsBetter: false, domain: 'demographics' },
  { key: 'urbanPercent', label: 'Urban %', unit: '%', higherIsBetter: true, domain: 'demographics' },
  { key: 'literacyOverall', label: 'Literacy Rate', unit: '%', higherIsBetter: true, domain: 'demographics' },
  { key: 'genderGap', label: 'Literacy Gender Gap', unit: 'pp', higherIsBetter: false, domain: 'demographics' },
  // Education (from enrollment.json)
  { key: 'gerSecondary', label: 'GER Secondary', unit: '%', higherIsBetter: true, domain: 'education' },
  { key: 'dropoutSecondary', label: 'Dropout (Secondary)', unit: '%', higherIsBetter: false, domain: 'education' },
  // Employment (from unemployment.json, participation.json)
  { key: 'unemploymentRate', label: 'Unemployment Rate', unit: '%', higherIsBetter: false, domain: 'employment' },
  { key: 'lfpr', label: 'LFPR', unit: '%', higherIsBetter: true, domain: 'employment' },
  // Healthcare (from infrastructure.json)
  { key: 'bedsPerLakh', label: 'Hospital Beds', unit: 'per lakh', higherIsBetter: true, domain: 'healthcare' },
  { key: 'doctorsPer10K', label: 'Doctors', unit: 'per 10K', higherIsBetter: true, domain: 'healthcare' },
  // Health - NFHS-5 (from health.json, disease.json)
  { key: 'imr', label: 'Infant Mortality', unit: 'per 1000', higherIsBetter: false, domain: 'health' },
  { key: 'fullImmunization', label: 'Full Immunization', unit: '%', higherIsBetter: true, domain: 'health' },
  { key: 'stunting', label: 'Stunting', unit: '%', higherIsBetter: false, domain: 'health' },
  // Environment (from air-quality.json, forest.json, water.json)
  { key: 'stateAqi', label: 'AQI Average', unit: '', higherIsBetter: false, domain: 'environment' },
  { key: 'forestCoverPct', label: 'Forest Cover', unit: '% area', higherIsBetter: true, domain: 'environment' },
  { key: 'groundwaterSafe', label: 'Groundwater Stage', unit: '%', higherIsBetter: false, domain: 'environment' },
  // Elections (from turnout.json)
  { key: 'voterTurnout2024', label: 'Voter Turnout 2024', unit: '%', higherIsBetter: true, domain: 'elections' },
  // Crime (from indicators.json)
  { key: 'crimeRate', label: 'Crime Rate', unit: 'per lakh', higherIsBetter: false, domain: 'crime' },
  { key: 'womenCrimeRate', label: 'Crimes Against Women', unit: 'per lakh', higherIsBetter: false, domain: 'crime' },
  { key: 'policeRatio', label: 'Police Ratio', unit: 'per lakh', higherIsBetter: true, domain: 'crime' },
];

// ─── Domain panel config ────────────────────────────────────────────

const PANEL_CONFIG: Record<string, { title: string; accentColor: string }> = {
  economy: { title: 'Economy', accentColor: '#10B981' },
  budget: { title: 'Budget Allocation', accentColor: '#FF6B35' },
  revenue: { title: 'Revenue', accentColor: '#10B981' },
  fiscal: { title: 'Fiscal Health', accentColor: '#10B981' },
  demographics: { title: 'Demographics', accentColor: '#8B5CF6' },
  education: { title: 'Education', accentColor: '#3B82F6' },
  employment: { title: 'Employment', accentColor: '#F59E0B' },
  healthcare: { title: 'Healthcare Infrastructure', accentColor: '#F43F5E' },
  health: { title: 'Health Outcomes (NFHS-5)', accentColor: '#F43F5E' },
  environment: { title: 'Environment', accentColor: '#14B8A6' },
  elections: { title: 'Elections', accentColor: '#6366F1' },
  crime: { title: 'Crime & Safety', accentColor: '#DC2626' },
};

// ─── Data extraction helpers ────────────────────────────────────────

type Extractor = (stateId: string, data: AllDomainData) => { value: number | null; all: number[] };

function findInArray<T extends { id: string }>(
  arr: T[] | undefined,
  stateId: string
): T | undefined {
  if (!arr) return undefined;
  // Try exact match first, then case-insensitive
  return arr.find((s) => s.id === stateId) ?? arr.find((s) => s.id.toUpperCase() === stateId.toUpperCase());
}

const EXTRACTORS: Record<string, Extractor> = {
  perCapitaGsdp: (sid, d) => {
    const s = findInArray(d.gsdp?.states, sid);
    const all = d.gsdp?.states.map((x) => x.perCapitaGsdp) ?? [];
    return { value: s?.perCapitaGsdp ?? null, all };
  },
  growthRate: (sid, d) => {
    const s = findInArray(d.gsdp?.states, sid);
    const all = d.gsdp?.states.map((x) => x.growthRate) ?? [];
    return { value: s?.growthRate ?? null, all };
  },
  gsdp: (sid, d) => {
    const s = findInArray(d.gsdp?.states, sid);
    const all = d.gsdp?.states.map((x) => x.gsdp) ?? [];
    return { value: s?.gsdp ?? null, all };
  },
  perCapitaTransfer: (sid, d) => {
    const s = findInArray(d.statewise?.states, sid);
    const all = d.statewise?.states.map((x) => x.perCapita) ?? [];
    return { value: s?.perCapita ?? null, all };
  },
  transfer: (sid, d) => {
    const s = findInArray(d.statewise?.states, sid);
    const all = d.statewise?.states.map((x) => x.transfer) ?? [];
    return { value: s?.transfer ?? null, all };
  },
  selfSufficiencyRatio: (sid, d) => {
    const s = findInArray(d.revenue?.states, sid);
    const all = d.revenue?.states.map((x) => x.selfSufficiencyRatio) ?? [];
    return { value: s?.selfSufficiencyRatio ?? null, all };
  },
  fiscalDeficitPctGsdp: (sid, d) => {
    const s = findInArray(d.fiscalHealth?.states, sid);
    const all = d.fiscalHealth?.states.map((x) => x.fiscalDeficitPctGsdp) ?? [];
    return { value: s?.fiscalDeficitPctGsdp ?? null, all };
  },
  debtToGsdp: (sid, d) => {
    const s = findInArray(d.fiscalHealth?.states, sid);
    const all = d.fiscalHealth?.states.map((x) => x.debtToGsdp) ?? [];
    return { value: s?.debtToGsdp ?? null, all };
  },
  density: (sid, d) => {
    const s = findInArray(d.population?.states, sid);
    const all = d.population?.states.map((x) => x.density) ?? [];
    return { value: s?.density ?? null, all };
  },
  urbanPercent: (sid, d) => {
    const s = findInArray(d.population?.states, sid);
    const all = d.population?.states.map((x) => x.urbanPercent) ?? [];
    return { value: s?.urbanPercent ?? null, all };
  },
  literacyOverall: (sid, d) => {
    const s = findInArray(d.literacy?.states, sid);
    const all = d.literacy?.states.map((x) => x.overallRate) ?? [];
    return { value: s?.overallRate ?? null, all };
  },
  genderGap: (sid, d) => {
    const s = findInArray(d.literacy?.states, sid);
    const all = d.literacy?.states.map((x) => x.genderGap) ?? [];
    return { value: s?.genderGap ?? null, all };
  },
  gerSecondary: (sid, d) => {
    const s = findInArray(d.enrollment?.states, sid);
    const all = d.enrollment?.states.map((x) => x.gerSecondary) ?? [];
    return { value: s?.gerSecondary ?? null, all };
  },
  dropoutSecondary: (sid, d) => {
    const s = findInArray(d.enrollment?.states, sid);
    const all = d.enrollment?.states.map((x) => x.dropoutSecondary) ?? [];
    return { value: s?.dropoutSecondary ?? null, all };
  },
  unemploymentRate: (sid, d) => {
    const s = d.unemployment?.stateUnemployment.find(
      (x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase()
    );
    const all = d.unemployment?.stateUnemployment.map((x) => x.value) ?? [];
    return { value: s?.value ?? null, all };
  },
  lfpr: (sid, d) => {
    const s = d.participation?.stateLfpr.find(
      (x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase()
    );
    const all = d.participation?.stateLfpr.map((x) => x.value) ?? [];
    return { value: s?.value ?? null, all };
  },
  bedsPerLakh: (sid, d) => {
    const s = findInArray(d.infrastructure?.stateInfrastructure, sid);
    const all = d.infrastructure?.stateInfrastructure.map((x) => x.bedsPerLakh) ?? [];
    return { value: s?.bedsPerLakh ?? null, all };
  },
  doctorsPer10K: (sid, d) => {
    const s = findInArray(d.infrastructure?.stateInfrastructure, sid);
    const all = d.infrastructure?.stateInfrastructure.map((x) => x.doctorsPer10K) ?? [];
    return { value: s?.doctorsPer10K ?? null, all };
  },
  imr: (sid, d) => {
    // Try SRS data first (stateImr), then NFHS-5 (stateHealth)
    const srsEntry = d.health?.stateImr.find(
      (x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase()
    );
    if (srsEntry) {
      const all = d.health?.stateImr.map((x) => x.value) ?? [];
      return { value: srsEntry.value, all };
    }
    const nfhs = findInArray(d.health?.stateHealth, sid);
    const all = d.health?.stateHealth?.map((x) => x.imr) ?? [];
    return { value: nfhs?.imr ?? null, all };
  },
  fullImmunization: (sid, d) => {
    // Try disease.json immunization first, then health.json NFHS-5
    const immEntry = findInArray(d.disease?.stateImmunization, sid);
    if (immEntry) {
      const all = d.disease?.stateImmunization.map((x) => x.fullImmunization) ?? [];
      return { value: immEntry.fullImmunization, all };
    }
    const nfhs = findInArray(d.health?.stateHealth, sid);
    const all = d.health?.stateHealth?.map((x) => x.fullImmunization) ?? [];
    return { value: nfhs?.fullImmunization ?? null, all };
  },
  stunting: (sid, d) => {
    const nfhs = findInArray(d.health?.stateHealth, sid);
    const all = d.health?.stateHealth?.map((x) => x.stunting) ?? [];
    return { value: nfhs?.stunting ?? null, all };
  },
  stateAqi: (sid, d) => {
    const s = findInArray(d.airQuality?.stateAQI, sid);
    const all = d.airQuality?.stateAQI.map((x) => x.aqi) ?? [];
    return { value: s?.aqi ?? null, all };
  },
  forestCoverPct: (sid, d) => {
    const s = findInArray(d.forest?.stateForestCover, sid);
    const all = d.forest?.stateForestCover.map((x) => x.pctGeographicArea) ?? [];
    return { value: s?.pctGeographicArea ?? null, all };
  },
  groundwaterSafe: (sid, d) => {
    const s = findInArray(d.water?.groundwaterStage, sid);
    const all = d.water?.groundwaterStage.map((x) => x.stagePct) ?? [];
    return { value: s?.stagePct ?? null, all };
  },
  voterTurnout2024: (sid, d) => {
    const s = d.turnout?.stateBreakdown2024.find(
      (x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase()
    );
    const all = d.turnout?.stateBreakdown2024.map((x) => x.turnout) ?? [];
    return { value: s?.turnout ?? null, all };
  },
  crimeRate: (sid, d) => {
    const ind = d.crimeIndicators?.indicators.find((i) => i.id === 'crime_rate');
    const s = ind?.states.find((x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase());
    const all = ind?.states.map((x) => x.value) ?? [];
    return { value: s?.value ?? null, all };
  },
  womenCrimeRate: (sid, d) => {
    const ind = d.crimeIndicators?.indicators.find((i) => i.id === 'women_crime_rate');
    const s = ind?.states.find((x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase());
    const all = ind?.states.map((x) => x.value) ?? [];
    return { value: s?.value ?? null, all };
  },
  policeRatio: (sid, d) => {
    const ind = d.crimeIndicators?.indicators.find((i) => i.id === 'police_ratio');
    const s = ind?.states.find((x) => x.id === sid || x.id.toUpperCase() === sid.toUpperCase());
    const all = ind?.states.map((x) => x.value) ?? [];
    return { value: s?.value ?? null, all };
  },
};

// ─── Rank & quartile computation ────────────────────────────────────

function computeRank(value: number, allValues: number[], higherIsBetter: boolean): { rank: number; total: number; quartile: 1 | 2 | 3 | 4 } {
  const sorted = [...allValues].sort((a, b) => (higherIsBetter ? b - a : a - b));
  const rank = sorted.indexOf(value) + 1;
  const total = sorted.length;
  const percentile = rank / total;
  const quartile: 1 | 2 | 3 | 4 = percentile <= 0.25 ? 1 : percentile <= 0.5 ? 2 : percentile <= 0.75 ? 3 : 4;
  return { rank, total, quartile };
}

function computeAvg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

// ─── Main builder ───────────────────────────────────────────────────

export function buildReportCard(
  stateId: string,
  allData: AllDomainData
): StateReportCard {
  const sid = stateId.toUpperCase();

  // Compute all metrics
  const metricResults: MetricResult[] = METRIC_DEFS.map((def) => {
    const extractor = EXTRACTORS[def.key];
    if (!extractor) {
      return { def, value: null, nationalAvg: null, rank: 0, totalStates: 0, quartile: 4 as const };
    }

    const { value, all } = extractor(sid, allData);
    const validAll = all.filter((v) => v != null && !isNaN(v));

    if (value == null || validAll.length === 0) {
      return { def, value: null, nationalAvg: computeAvg(validAll), rank: 0, totalStates: validAll.length, quartile: 4 as const };
    }

    const { rank, total, quartile } = computeRank(value, validAll, def.higherIsBetter);
    return {
      def,
      value,
      nationalAvg: computeAvg(validAll),
      rank,
      totalStates: total,
      quartile,
    };
  });

  // Group by domain
  const domainOrder = ['economy', 'budget', 'revenue', 'fiscal', 'demographics', 'education', 'employment', 'healthcare', 'health', 'environment', 'elections'];
  const panels: DomainPanel[] = domainOrder.map((domain) => {
    const metrics = metricResults.filter((m) => m.def.domain === domain);
    const config = PANEL_CONFIG[domain] ?? { title: domain, accentColor: '#6B7280' };
    const dataAvailable = metrics.some((m) => m.value != null);

    return {
      domain,
      title: config.title,
      accentColor: config.accentColor,
      metrics,
      dataAvailable,
    };
  });

  const stateName = ALL_STATE_CODES[sid] ?? sid;

  return {
    state: { id: sid, name: stateName },
    panels,
  };
}

export { METRIC_DEFS };
