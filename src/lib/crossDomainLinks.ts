/**
 * Cross-domain link configuration — directional links between
 * scrollytelling sections across different data domains.
 *
 * Each entry is one direction. Bidirectional connections = 2 entries.
 * The lookup function returns max 2 links per section, preferring Tier 1.
 */

import type { DomainId } from './topicConfig.ts';

// ─── Domain Metadata ────────────────────────────────────────────────

export interface DomainMeta {
  name: string;
  accent: string;
  route: string;
}

export const DOMAIN_META: Record<DomainId, DomainMeta> = {
  budget:      { name: 'Budget',           accent: '#FF6B35', route: '/budget' },
  economy:     { name: 'Economy',          accent: '#4AEADC', route: '/economy' },
  rbi:         { name: 'RBI',              accent: '#FFC857', route: '/rbi' },
  states:      { name: 'State Finances',   accent: '#4ADE80', route: '/states' },
  census:      { name: 'Census',           accent: '#8B5CF6', route: '/census' },
  education:   { name: 'Education',        accent: '#3B82F6', route: '/education' },
  employment:  { name: 'Employment',       accent: '#F59E0B', route: '/employment' },
  healthcare:  { name: 'Healthcare',       accent: '#F43F5E', route: '/healthcare' },
  environment: { name: 'Environment',      accent: '#14B8A6', route: '/environment' },
  elections:   { name: 'Elections',         accent: '#6366F1', route: '/elections' },
  crime:       { name: 'Crime & Safety',   accent: '#DC2626', route: '/crime' },
};

// ─── Link Definition ────────────────────────────────────────────────

interface CrossDomainLinkDef {
  fromDomain: DomainId;
  fromSection: string;
  toDomain: DomainId;
  toSection: string;
  label: string;
  tier: 1 | 2;
}

// ─── All 34 Directional Entries ─────────────────────────────────────

const LINKS: CrossDomainLinkDef[] = [
  // #1  Economy ↔ RBI (inflation)
  { fromDomain: 'economy',     fromSection: 'inflation',        toDomain: 'rbi',         toSection: 'inflation-target', label: 'How is RBI responding to inflation?',              tier: 1 },
  { fromDomain: 'rbi',         fromSection: 'inflation-target', toDomain: 'economy',     toSection: 'inflation',        label: 'See the full inflation picture',                   tier: 1 },

  // #2  Census ↔ Employment (demographics → jobs)
  { fromDomain: 'census',      fromSection: 'age',              toDomain: 'employment',  toSection: 'youth',            label: 'Are there jobs for this generation?',              tier: 1 },
  { fromDomain: 'employment',  fromSection: 'youth',            toDomain: 'census',      toSection: 'age',              label: 'The generation behind the numbers',                tier: 1 },

  // #3  Budget ↔ States (allocations)
  { fromDomain: 'budget',      fromSection: 'map',              toDomain: 'states',      toSection: 'gsdp',             label: 'How states spend their allocations',               tier: 1 },
  { fromDomain: 'states',      fromSection: 'gsdp',             toDomain: 'budget',      toSection: 'map',              label: 'Where does the Centre send money?',                tier: 1 },

  // #4  Healthcare ↔ Census (health gaps)
  { fromDomain: 'healthcare',  fromSection: 'disease',          toDomain: 'census',      toSection: 'health',           label: 'Why life expectancy varies so much',               tier: 1 },
  { fromDomain: 'census',      fromSection: 'health',           toDomain: 'healthcare',  toSection: 'disease',          label: "What's driving these health gaps?",                 tier: 1 },

  // #5  Environment ↔ Healthcare (air pollution)
  { fromDomain: 'environment', fromSection: 'air-quality',      toDomain: 'healthcare',  toSection: 'disease',          label: 'Air pollution as a health crisis',                 tier: 1 },
  { fromDomain: 'healthcare',  fromSection: 'disease',          toDomain: 'environment', toSection: 'air-quality',      label: 'The pollution behind the disease burden',          tier: 1 },

  // #6  Education ↔ Employment (dropouts)
  { fromDomain: 'education',   fromSection: 'dropout',          toDomain: 'employment',  toSection: 'youth',            label: 'What happens to students who drop out?',           tier: 1 },
  { fromDomain: 'employment',  fromSection: 'youth',            toDomain: 'education',   toSection: 'dropout',          label: 'Why many never finished school',                   tier: 1 },

  // #7  Crime ↔ Employment (women's safety → participation)
  { fromDomain: 'crime',       fromSection: 'women-safety',     toDomain: 'employment',  toSection: 'gender-gap',       label: "How safety shapes women's economic participation", tier: 1 },
  { fromDomain: 'employment',  fromSection: 'gender-gap',       toDomain: 'crime',       toSection: 'women-safety',     label: 'The safety crisis behind the gender gap',          tier: 1 },

  // #8  Economy ↔ Employment (sectors → structural shift)
  { fromDomain: 'economy',     fromSection: 'sectors',          toDomain: 'employment',  toSection: 'structural',       label: 'Workers shifting between sectors',                 tier: 2 },
  { fromDomain: 'employment',  fromSection: 'structural',       toDomain: 'economy',     toSection: 'sectors',          label: 'The economy behind the shift',                     tier: 2 },

  // #9  States ↔ Budget (revenue vs transfers)
  { fromDomain: 'states',      fromSection: 'revenue',          toDomain: 'budget',      toSection: 'map',              label: 'Own revenue vs central transfers',                 tier: 2 },
  { fromDomain: 'budget',      fromSection: 'map',              toDomain: 'states',      toSection: 'revenue',          label: 'How self-sufficient is each state?',               tier: 2 },

  // #10 Healthcare spending → Budget (unidirectional)
  { fromDomain: 'healthcare',  fromSection: 'spending',         toDomain: 'budget',      toSection: 'expenditure',      label: 'Is the budget matching the health need?',          tier: 2 },

  // #11 Education spending → Budget (unidirectional)
  { fromDomain: 'education',   fromSection: 'spending',         toDomain: 'budget',      toSection: 'expenditure',      label: 'What does India spend on its students?',           tier: 2 },

  // #12 Crime ↔ Healthcare (road accidents)
  { fromDomain: 'crime',       fromSection: 'road-accidents',   toDomain: 'healthcare',  toSection: 'disease',          label: "Roads: India's silent health crisis",              tier: 2 },
  { fromDomain: 'healthcare',  fromSection: 'disease',          toDomain: 'crime',       toSection: 'road-accidents',   label: 'Road accidents drive the numbers',                 tier: 2 },

  // #13 RBI ↔ Economy (monetary ↔ fiscal)
  { fromDomain: 'rbi',         fromSection: 'monetary-policy',  toDomain: 'economy',     toSection: 'fiscal',           label: 'The fiscal side of the coin',                      tier: 2 },
  { fromDomain: 'economy',     fromSection: 'fiscal',           toDomain: 'rbi',         toSection: 'monetary-policy',  label: 'How RBI shapes borrowing costs',                   tier: 2 },

  // #14 Census ↔ Education (literacy → learning)
  { fromDomain: 'census',      fromSection: 'literacy',         toDomain: 'education',   toSection: 'quality',          label: 'Is literacy translating to learning?',             tier: 2 },
  { fromDomain: 'education',   fromSection: 'quality',          toDomain: 'census',      toSection: 'literacy',         label: 'The literacy foundation',                          tier: 2 },

  // #15 Elections ↔ Employment (gender representation)
  { fromDomain: 'elections',   fromSection: 'gender-gap',       toDomain: 'employment',  toSection: 'gender-gap',       label: 'Women in Parliament vs the workforce',             tier: 1 },
  { fromDomain: 'employment',  fromSection: 'gender-gap',       toDomain: 'elections',   toSection: 'gender-gap',       label: 'Who represents working women in Parliament?',      tier: 1 },

  // #16 Environment ↔ Healthcare (water stress)
  { fromDomain: 'environment', fromSection: 'water-stress',     toDomain: 'healthcare',  toSection: 'disease',          label: 'When water becomes a health threat',               tier: 2 },
  { fromDomain: 'healthcare',  fromSection: 'infrastructure',   toDomain: 'environment', toSection: 'water-stress',     label: 'The water quality behind health gaps',             tier: 2 },

  // #17 Elections ↔ Census (turnout demographics)
  { fromDomain: 'elections',   fromSection: 'turnout',          toDomain: 'census',      toSection: 'age',              label: "Who's turning out to vote?",                       tier: 2 },
  { fromDomain: 'census',      fromSection: 'age',              toDomain: 'elections',   toSection: 'turnout',          label: "Does India's youngest generation vote?",           tier: 2 },
];

// ─── Lookup ─────────────────────────────────────────────────────────

export interface CrossDomainLinkEntry {
  toDomain: DomainId;
  toSection: string;
  label: string;
  tier: 1 | 2;
}

/**
 * Get cross-domain links for a given section.
 * Returns max 2, sorted by tier (Tier 1 first).
 */
export function getCrossDomainLinks(
  domain: DomainId,
  sectionId: string,
): CrossDomainLinkEntry[] {
  return LINKS
    .filter((l) => l.fromDomain === domain && l.fromSection === sectionId)
    .sort((a, b) => a.tier - b.tier)
    .slice(0, 2)
    .map(({ toDomain, toSection, label, tier }) => ({
      toDomain,
      toSection,
      label,
      tier,
    }));
}

// ─── CTA Related Domains ────────────────────────────────────────────

export interface RelatedDomainDef {
  domain: DomainId;
  description: string;
}

export const CTA_RELATED_DOMAINS: Record<DomainId, RelatedDomainDef[]> = {
  budget:      [
    { domain: 'states',      description: 'Where allocations land' },
    { domain: 'economy',     description: 'The broader economic picture' },
  ],
  economy:     [
    { domain: 'rbi',         description: 'Monetary policy response' },
    { domain: 'budget',      description: 'Government spending' },
  ],
  rbi:         [
    { domain: 'economy',     description: 'Growth & inflation context' },
    { domain: 'states',      description: 'State borrowing impact' },
  ],
  states:      [
    { domain: 'budget',      description: 'Central transfers' },
    { domain: 'census',      description: 'Who lives in each state' },
  ],
  census:      [
    { domain: 'healthcare',  description: 'Health infrastructure' },
    { domain: 'employment',  description: 'Jobs for this population' },
  ],
  education:   [
    { domain: 'employment',  description: 'School-to-work pipeline' },
    { domain: 'census',      description: 'Literacy foundations' },
  ],
  employment:  [
    { domain: 'education',   description: 'Skills & dropouts' },
    { domain: 'economy',     description: 'Sectoral shifts' },
  ],
  healthcare:  [
    { domain: 'census',      description: 'Life expectancy gaps' },
    { domain: 'environment', description: 'Pollution & disease' },
  ],
  environment: [
    { domain: 'healthcare',  description: 'Pollution as health crisis' },
    { domain: 'economy',     description: 'Energy & growth' },
  ],
  elections:   [
    { domain: 'employment',  description: 'Women in the workforce vs Parliament' },
    { domain: 'census',      description: 'The demographics behind the vote' },
  ],
  crime:       [
    { domain: 'healthcare',  description: 'Road accidents as health burden' },
    { domain: 'employment',  description: "How safety shapes women's participation" },
  ],
};

// ─── CTA Config ─────────────────────────────────────────────────────

export interface DomainCTAConfig {
  subtitle: string;
  accentGradient: string;
  accentTextColor: string;
}

export const DOMAIN_CTA_CONFIG: Record<DomainId, DomainCTAConfig> = {
  budget:      { subtitle: '', accentGradient: '', accentTextColor: '' }, // Budget keeps its unique GlowCard CTA
  economy:     { subtitle: 'Explore individual indicators across a decade of data, or read about our data sources and methodology.',                                                       accentGradient: 'linear-gradient(135deg, var(--cyan), #7CF5E9)',         accentTextColor: '#06080f' },
  rbi:         { subtitle: 'Explore individual RBI indicators across monetary policy, liquidity, credit, and external sectors, or read about our data sources and methodology.',             accentGradient: 'linear-gradient(135deg, var(--gold), #FFE08A)',         accentTextColor: '#06080f' },
  states:      { subtitle: 'Explore individual state indicators across GSDP, revenue, fiscal health, and per capita income, or read about our data sources and methodology.',               accentGradient: 'linear-gradient(135deg, var(--emerald), #86EFAC)',      accentTextColor: '#06080f' },
  census:      { subtitle: 'Explore state-level indicators across population, health, literacy, and demographics, or read about our data sources and multi-vintage methodology.',            accentGradient: 'linear-gradient(135deg, var(--violet), var(--violet-light))', accentTextColor: '#fff' },
  education:   { subtitle: 'Explore state-level indicators across enrollment, quality, infrastructure, and spending, or read about our data sources and methodology.',                       accentGradient: 'linear-gradient(135deg, var(--blue), var(--blue-light))',     accentTextColor: '#fff' },
  employment:  { subtitle: 'Explore state-level indicators across unemployment, participation, sectoral employment, and informality, or read about our data sources and methodology.',       accentGradient: 'linear-gradient(135deg, var(--amber), var(--amber-light))',   accentTextColor: '#fff' },
  healthcare:  { subtitle: 'Explore state-level indicators across infrastructure, spending, immunization, and disease burden, or read about our data sources and methodology.',              accentGradient: 'linear-gradient(135deg, var(--rose), var(--rose-light))',     accentTextColor: '#fff' },
  environment: { subtitle: 'Explore state-level indicators across air quality, forests, energy, and water, or read about our data sources and methodology.',                                 accentGradient: 'linear-gradient(135deg, var(--teal), var(--teal-light))',     accentTextColor: '#fff' },
  elections:   { subtitle: 'Explore state-level election data, or read about our sources and how we compiled 67 years of Lok Sabha results.',                                                accentGradient: 'linear-gradient(135deg, var(--indigo), var(--indigo-light))', accentTextColor: '#fff' },
  crime:       { subtitle: 'Explore state-level crime indicators, or read about our NCRB sources and the limitations of FIR-based data.',                                                   accentGradient: 'linear-gradient(135deg, var(--crimson), var(--crimson-light))', accentTextColor: '#fff' },
};
