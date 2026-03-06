import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type {
  BudgetSummary,
  EconomySummary,
  RBISummary,
  FiscalData,
  MonetaryPolicyData,
  GDPGrowthData,
} from '../data/schema.ts';

// ─── Typed accessors ────────────────────────────────────────────────

const budgetSummary = (bag: TopicDataBag) =>
  bag['budget/summary'] as BudgetSummary | undefined;

const economySummary = (bag: TopicDataBag) =>
  bag['economy/summary'] as EconomySummary | undefined;

const rbiSummary = (bag: TopicDataBag) =>
  bag['rbi/summary'] as RBISummary | undefined;

const fiscal = (bag: TopicDataBag) =>
  bag['economy/fiscal'] as FiscalData | undefined;

const monetaryPolicy = (bag: TopicDataBag) =>
  bag['rbi/monetary-policy'] as MonetaryPolicyData | undefined;

const gdpGrowth = (bag: TopicDataBag) =>
  bag['economy/gdp-growth'] as GDPGrowthData | undefined;

// ─── Config ─────────────────────────────────────────────────────────

export const fiscalHealth: TopicDef = {
  id: 'fiscal-health',
  title: "India's Fiscal Health",
  subtitle:
    'The budget borrows, the RBI manages rates, and the economy grows — is the math adding up?',
  accent: '#FF6B35',
  contributingDomains: ['budget', 'economy', 'rbi', 'states'],
  requiredData: [
    'budget/summary',
    'budget/trends',
    'economy/summary',
    'economy/gdp-growth',
    'economy/fiscal',
    'rbi/summary',
    'rbi/monetary-policy',
    'states/summary',
  ],
  summaryData: [
    'budget/summary',
    'economy/summary',
    'rbi/summary',
  ],

  heroStat: {
    value: (bag) => {
      const b = budgetSummary(bag);
      return b ? `${b.fiscalDeficitPercentGDP}%` : '—';
    },
    label: 'Fiscal Deficit (% of GDP)',
    context: 'The government borrows this fraction of GDP each year to fund its spending',
  },

  takeaways: [
    {
      value: (bag) => {
        const e = economySummary(bag);
        return e ? `${e.realGDPGrowth}%` : '—';
      },
      label: 'Real GDP growth',
      sectionId: 'growth-engine',
    },
    {
      value: (bag) => {
        const r = rbiSummary(bag);
        return r ? `${r.repoRate}%` : '—';
      },
      label: 'Repo rate',
      sectionId: 'monetary-lever',
    },
    {
      value: (bag) => {
        const b = budgetSummary(bag);
        if (!b) return '—';
        return `₹${Math.round(b.perCapitaDailyExpenditure)}`;
      },
      label: 'Govt spends per citizen per day',
      sectionId: 'spending-story',
    },
    {
      value: (bag) => {
        const e = economySummary(bag);
        return e ? `${e.cpiInflation}%` : '—';
      },
      label: 'CPI inflation',
      sectionId: 'monetary-lever',
    },
  ],

  narrativeBridge:
    'India\'s fiscal story is a balancing act: borrow enough to invest in growth, but not so much that debt spirals. Meanwhile, the RBI walks a tightrope between controlling inflation and keeping credit flowing. Here\'s how the three pillars — budget, monetary policy, and growth — connect.',

  sections: [
    // ── Section 1: Growth engine ──────────────────────────────────
    {
      id: 'growth-engine',
      sectionNumber: 1,
      title: 'The Growth Engine',
      annotation:
        'India\'s GDP growth has averaged 6-7% over the past decade, making it the fastest-growing major economy. But growth is volatile — pandemic, recovery, normalization — and the fiscal math depends on this engine keeping pace.',
      domains: ['economy'],
      sources: ['NSO', 'World Bank'],
      charts: [
        {
          chartType: 'area',
          chartTitle: 'Real GDP Growth (%)',
          unit: '%',
          accent: '#4AEADC',
          extractData: (bag) => {
            const d = gdpGrowth(bag);
            if (!d?.series?.length || d.series.length < 3) return null;
            return [
              {
                name: 'GDP Growth',
                color: '#4AEADC',
                data: d.series.map((p) => ({
                  label: p.year,
                  value: p.value,
                })),
              },
            ];
          },
        },
      ],
      deepLinks: [
        { label: 'Full growth story', route: '/economy#growth', domain: 'economy' },
      ],
    },

    // ── Section 2: Spending vs borrowing ──────────────────────────
    {
      id: 'spending-story',
      sectionNumber: 2,
      title: 'Spending vs Borrowing',
      annotation:
        'The fiscal deficit tells you how much the government borrows to fund its spending. India has been on a consolidation path — from 9.2% during COVID to a target of 4.4% in 2025-26 — but the absolute deficit is still ₹15.69 lakh crore.',
      domains: ['budget', 'economy'],
      sources: ['Union Budget 2025-26', 'Economic Survey'],
      charts: [
        {
          chartType: 'area',
          chartTitle: 'Fiscal Deficit (% of GDP)',
          unit: '% of GDP',
          accent: '#FF6B35',
          extractData: (bag) => {
            const d = fiscal(bag);
            if (!d?.series?.length || d.series.length < 3) return null;
            return [
              {
                name: 'Fiscal Deficit',
                color: '#FF6B35',
                data: d.series.map((p) => ({
                  label: p.year,
                  value: p.fiscalDeficitPctGDP,
                })),
              },
            ];
          },
        },
      ],
      deepLinks: [
        { label: 'Budget breakdown', route: '/budget#flow', domain: 'budget' },
        { label: 'Fiscal consolidation path', route: '/economy#fiscal', domain: 'economy' },
      ],
    },

    // ── Section 3: Monetary lever ─────────────────────────────────
    {
      id: 'monetary-lever',
      sectionNumber: 3,
      title: 'The Monetary Lever',
      annotation:
        'The RBI\'s repo rate is the single most powerful lever affecting loans, deposits, and investment. After hiking aggressively to tame inflation, the RBI has begun cautious cuts — signaling that growth now matters as much as price stability.',
      domains: ['rbi'],
      sources: ['RBI MPC Statements'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'Repo Rate History',
          unit: '%',
          accent: '#4AEADC',
          extractData: (bag) => {
            const d = monetaryPolicy(bag);
            if (!d?.decisions?.length || d.decisions.length < 3) return null;
            return [
              {
                name: 'Repo Rate',
                color: '#4AEADC',
                data: d.decisions.map((p) => ({
                  label: p.date,
                  value: p.rate,
                })),
              },
            ];
          },
        },
      ],
      deepLinks: [
        { label: 'Full RBI story', route: '/rbi#monetary-policy', domain: 'rbi' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'budget', sectionId: 'flow' },
    { domain: 'budget', sectionId: 'borrowing' },
    { domain: 'economy', sectionId: 'growth' },
    { domain: 'economy', sectionId: 'fiscal' },
    { domain: 'rbi', sectionId: 'monetary-policy' },
    { domain: 'states', sectionId: 'fiscal-health' },
  ],

  ctaLinks: [
    {
      label: 'Union Budget',
      route: '/budget',
      domain: 'budget',
      description: 'Where does the money come from, and where does it go?',
    },
    {
      label: 'Economic Survey',
      route: '/economy',
      domain: 'economy',
      description: 'GDP growth, inflation, and the macro picture',
    },
    {
      label: 'RBI & Monetary Policy',
      route: '/rbi',
      domain: 'rbi',
      description: 'Repo rate, liquidity, and forex reserves',
    },
  ],
};
