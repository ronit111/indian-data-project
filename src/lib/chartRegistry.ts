/**
 * Central chart registry — every shareable chart registers here.
 * Used by ChartActions (PNG/CSV/embed/permalink), embed routes, and share cards.
 */

// ─── Types ───────────────────────────────────────────────────────────

export type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'horizontal-bar'
  | 'treemap'
  | 'sankey'
  | 'waffle'
  | 'choropleth'
  | 'custom';

export interface TabularData {
  headers: string[];
  rows: (string | number)[][];
}

export interface HeroStat {
  label: string;
  value: string;
  context: string;
}

export interface ChartRegistryEntry {
  domain: string;
  sectionId: string;
  title: string;
  source: string;
  accentColor: string;
  dataFiles: string[];
  chartType: ChartType;
  /** Convert domain data → tabular format for CSV export */
  toTabular: (data: unknown) => TabularData;
  /** Featured stat for WhatsApp share card */
  heroStat?: (data: unknown) => HeroStat | null;
}

// ─── Domain Metadata ─────────────────────────────────────────────────

export interface DomainMeta {
  name: string;
  accent: string;
  accentLight: string;
  basePath: string;
  defaultYear: string;
}

export const DOMAIN_META: Record<string, DomainMeta> = {
  budget: {
    name: 'Union Budget',
    accent: '#FF6B35',
    accentLight: '#ff8c5a',
    basePath: '/budget',
    defaultYear: '2025-26',
  },
  economy: {
    name: 'Economic Survey',
    accent: '#4AEADC',
    accentLight: '#7ef0e6',
    basePath: '/economy',
    defaultYear: '2025-26',
  },
  rbi: {
    name: 'RBI & Monetary Policy',
    accent: '#4AEADC',
    accentLight: '#7ef0e6',
    basePath: '/rbi',
    defaultYear: '2025-26',
  },
  states: {
    name: 'State Finances',
    accent: '#4ADE80',
    accentLight: '#6ee7a0',
    basePath: '/states',
    defaultYear: '2022-23',
  },
  census: {
    name: 'Census & Demographics',
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    basePath: '/census',
    defaultYear: '2024',
  },
  education: {
    name: 'Education',
    accent: '#3B82F6',
    accentLight: '#60A5FA',
    basePath: '/education',
    defaultYear: '2024',
  },
  employment: {
    name: 'Employment',
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    basePath: '/employment',
    defaultYear: '2024',
  },
  healthcare: {
    name: 'Healthcare',
    accent: '#F43F5E',
    accentLight: '#FB7185',
    basePath: '/healthcare',
    defaultYear: '2024',
  },
  environment: {
    name: 'Environment',
    accent: '#14B8A6',
    accentLight: '#2DD4BF',
    basePath: '/environment',
    defaultYear: '2025-26',
  },
  elections: {
    name: 'Elections',
    accent: '#6366F1',
    accentLight: '#818CF8',
    basePath: '/elections',
    defaultYear: '2025-26',
  },
  crime: {
    name: 'Crime & Safety',
    accent: '#DC2626',
    accentLight: '#EF4444',
    basePath: '/crime',
    defaultYear: '2025-26',
  },
  topics: {
    name: 'Cross-Domain Topics',
    accent: '#A78BFA',
    accentLight: '#C4B5FD',
    basePath: '/topics',
    defaultYear: '',
  },
};

// ─── Registry Map ────────────────────────────────────────────────────

/** Key format: "{domain}/{sectionId}" e.g. "economy/growth" */
const registry = new Map<string, ChartRegistryEntry>();

export function registerChart(entry: ChartRegistryEntry): void {
  const key = `${entry.domain}/${entry.sectionId}`;
  registry.set(key, entry);
}

export function getChartEntry(key: string): ChartRegistryEntry | undefined {
  return registry.get(key);
}

export function getChartsByDomain(domain: string): ChartRegistryEntry[] {
  const entries: ChartRegistryEntry[] = [];
  for (const [key, entry] of registry) {
    if (key.startsWith(`${domain}/`)) entries.push(entry);
  }
  return entries;
}

export function getAllCharts(): Map<string, ChartRegistryEntry> {
  return registry;
}

/** Build the permalink URL for a chart section */
export function getPermalink(domain: string, sectionId: string): string {
  const meta = DOMAIN_META[domain];
  if (!meta) return `/#${sectionId}`;
  return `${meta.basePath}#${sectionId}`;
}

/** Build the embed URL for a chart section */
export function getEmbedUrl(domain: string, sectionId: string): string {
  return `/embed/${domain}/${sectionId}`;
}

/** Build iframe snippet for embedding */
export function getEmbedSnippet(domain: string, sectionId: string): string {
  const entry = getChartEntry(`${domain}/${sectionId}`);
  const title = entry?.title ?? `${domain} — ${sectionId}`;
  const url = `https://indiandataproject.org/embed/${domain}/${sectionId}`;
  return `<iframe src="${url}" width="100%" height="450" frameborder="0" title="${title}" loading="lazy"></iframe>`;
}
