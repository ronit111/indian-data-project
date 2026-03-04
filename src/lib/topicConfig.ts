/**
 * Cross-domain topic types — the type system for composing data from
 * multiple domains into coherent narrative "views."
 *
 * Topics are NOT new data. They compose existing domain JSON files
 * into themed stories that span multiple domains.
 */

import type { ChartType } from './chartRegistry.ts';

// ─── Domain Data Keys ───────────────────────────────────────────────
// Every loadable JSON file across all 11 domains, keyed for lookup.

export type DomainDataKey =
  // Budget
  | 'budget/summary'
  | 'budget/receipts'
  | 'budget/expenditure'
  | 'budget/sankey'
  | 'budget/treemap'
  | 'budget/statewise'
  | 'budget/schemes'
  | 'budget/trends'
  | 'budget/budget-vs-actual'
  // Economy
  | 'economy/summary'
  | 'economy/gdp-growth'
  | 'economy/inflation'
  | 'economy/fiscal'
  | 'economy/external'
  | 'economy/sectors'
  | 'economy/indicators'
  // RBI
  | 'rbi/summary'
  | 'rbi/monetary-policy'
  | 'rbi/liquidity'
  | 'rbi/credit'
  | 'rbi/forex'
  | 'rbi/indicators'
  // States
  | 'states/summary'
  | 'states/gsdp'
  | 'states/revenue'
  | 'states/fiscal-health'
  | 'states/indicators'
  // Census
  | 'census/summary'
  | 'census/population'
  | 'census/literacy'
  | 'census/demographics'
  | 'census/health'
  | 'census/indicators'
  // Education
  | 'education/summary'
  | 'education/enrollment'
  | 'education/quality'
  | 'education/spending'
  | 'education/indicators'
  // Employment
  | 'employment/summary'
  | 'employment/unemployment'
  | 'employment/participation'
  | 'employment/sectoral'
  | 'employment/indicators'
  // Healthcare
  | 'healthcare/summary'
  | 'healthcare/infrastructure'
  | 'healthcare/spending'
  | 'healthcare/disease'
  | 'healthcare/indicators'
  // Environment
  | 'environment/summary'
  | 'environment/air-quality'
  | 'environment/forest'
  | 'environment/energy'
  | 'environment/water'
  | 'environment/indicators'
  // Elections
  | 'elections/summary'
  | 'elections/turnout'
  | 'elections/results'
  | 'elections/candidates'
  | 'elections/representation'
  | 'elections/indicators'
  // Crime
  | 'crime/summary'
  | 'crime/overview'
  | 'crime/women-safety'
  | 'crime/road-accidents'
  | 'crime/cybercrime'
  | 'crime/police'
  | 'crime/justice'
  | 'crime/indicators';

// ─── Contributing Domain ────────────────────────────────────────────

export type DomainId =
  | 'budget'
  | 'economy'
  | 'rbi'
  | 'states'
  | 'census'
  | 'education'
  | 'employment'
  | 'healthcare'
  | 'environment'
  | 'elections'
  | 'crime';

// ─── Data Bag ───────────────────────────────────────────────────────
// Partial record — some keys may fail to load (allSettled pattern).

export type TopicDataBag = Partial<Record<DomainDataKey, unknown>>;

// ─── Chart Definition ───────────────────────────────────────────────

export interface TopicChartDef {
  chartType: ChartType | 'stat-row';
  chartTitle: string;
  unit?: string;
  accent?: string;
  /** Extracts chart-ready data from the bag. Returns null if data is unavailable. */
  extractData: (bag: TopicDataBag) => unknown | null;
}

// ─── Deep Link ──────────────────────────────────────────────────────

export interface TopicDeepLink {
  label: string;
  route: string;
  domain: DomainId;
}

// ─── Cross Link ─────────────────────────────────────────────────────
// Maps a domain section to this topic for RelatedTopics pills.

export interface TopicCrossLink {
  domain: DomainId;
  sectionId: string;
}

// ─── Section Definition ─────────────────────────────────────────────

export interface TopicSectionDef {
  id: string;
  sectionNumber: number;
  title: string;
  annotation: string;
  domains: DomainId[];
  sources: string[];
  charts: TopicChartDef[];
  deepLinks: TopicDeepLink[];
}

// ─── CTA Link ───────────────────────────────────────────────────────

export interface TopicCTALink {
  label: string;
  route: string;
  domain: DomainId;
  description: string;
}

// ─── Takeaway Pill ──────────────────────────────────────────────────

export interface TopicTakeaway {
  value: string | ((bag: TopicDataBag) => string);
  label: string;
  sectionId: string;
}

// ─── Hero Stat ──────────────────────────────────────────────────────

export interface TopicHeroStat {
  value: string | ((bag: TopicDataBag) => string);
  label: string;
  context: string;
}

// ─── Topic Definition ───────────────────────────────────────────────

export interface TopicDef {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  contributingDomains: DomainId[];
  requiredData: DomainDataKey[];

  /** Subset of requiredData for the hub card (summary files only) */
  summaryData: DomainDataKey[];

  heroStat: TopicHeroStat;
  takeaways: TopicTakeaway[];
  narrativeBridge: string;

  sections: TopicSectionDef[];
  crossLinks: TopicCrossLink[];
  ctaLinks: TopicCTALink[];
}
