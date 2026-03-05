import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type {
  EconomySummary,
  RBISummary,
  BudgetSummary,
  InflationData,
  MonetaryPolicyData,
} from '../data/schema.ts';

// ─── Typed accessors ────────────────────────────────────────────────

const economySummary = (bag: TopicDataBag) =>
  bag['economy/summary'] as EconomySummary | undefined;

const rbiSummary = (bag: TopicDataBag) =>
  bag['rbi/summary'] as RBISummary | undefined;

const budgetSummary = (bag: TopicDataBag) =>
  bag['budget/summary'] as BudgetSummary | undefined;

const inflation = (bag: TopicDataBag) =>
  bag['economy/inflation'] as InflationData | undefined;

const monetaryPolicy = (bag: TopicDataBag) =>
  bag['rbi/monetary-policy'] as MonetaryPolicyData | undefined;

// ─── Config ─────────────────────────────────────────────────────────

export const inflationCost: TopicDef = {
  id: 'inflation-cost',
  title: 'Inflation & Cost of Living',
  subtitle:
    'Prices rise, purchasing power erodes — what\'s driving inflation and what can the RBI do about it?',
  accent: '#FFC857',
  contributingDomains: ['economy', 'rbi', 'budget'],
  requiredData: [
    'economy/summary',
    'economy/inflation',
    'rbi/summary',
    'rbi/monetary-policy',
    'budget/summary',
  ],
  summaryData: [
    'economy/summary',
    'rbi/summary',
  ],

  heroStat: {
    value: (bag) => {
      const e = economySummary(bag);
      return e ? `${e.cpiInflation}%` : '—';
    },
    label: 'CPI Inflation',
    context: 'The RBI targets 4% ± 2%. Above 6% triggers policy action.',
  },

  takeaways: [
    {
      value: (bag) => {
        const e = economySummary(bag);
        return e ? `${e.cpiInflation}%` : '—';
      },
      label: 'Headline CPI inflation',
      sectionId: 'price-trajectory',
    },
    {
      value: (bag) => {
        const r = rbiSummary(bag);
        return r ? `${r.repoRate}%` : '—';
      },
      label: 'RBI repo rate',
      sectionId: 'rbi-response',
    },
    {
      value: '4 ± 2%',
      label: 'RBI inflation target band',
      sectionId: 'price-trajectory',
    },
    {
      value: (bag) => {
        const b = budgetSummary(bag);
        if (!b) return '—';
        return `₹${Math.round(b.perCapitaDailyExpenditure)}`;
      },
      label: 'Govt spending per citizen/day',
      sectionId: 'fiscal-link',
    },
  ],

  narrativeBridge:
    'Inflation is the invisible tax. When prices rise faster than wages, every rupee buys less. The RBI controls interest rates to manage demand, but food price spikes — driven by weather and supply chains — are harder to tame. This topic connects the dots between price trends, RBI policy, and what it means for your wallet.',

  sections: [
    // ── Section 1: Price trajectory ──────────────────────────────
    {
      id: 'price-trajectory',
      sectionNumber: 1,
      title: 'The Price Trajectory',
      annotation:
        'India\'s CPI inflation spiked to 7.8% in April 2022, then gradually eased below 5%. Food inflation remains volatile — vegetables and pulses can swing 10-20% in a season. Core inflation (excluding food and fuel) has been more stable around 4-5%.',
      domains: ['economy'],
      sources: ['MOSPI (CPI)', 'World Bank'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'CPI Inflation (%)',
          unit: '%',
          accent: '#FFC857',
          extractData: (bag) => {
            const d = inflation(bag);
            if (!d?.series?.length || d.series.length < 3) return null;
            const series = [
              {
                name: 'CPI Headline',
                color: '#FFC857',
                data: d.series.map((p) => ({
                  label: p.period,
                  value: p.cpiHeadline,
                })),
              },
            ];
            // Add food CPI if available
            const foodData = d.series
              .filter((p) => p.cpiFood != null)
              .map((p) => ({ label: p.period, value: p.cpiFood! }));
            if (foodData.length >= 3) {
              series.push({
                name: 'Food CPI',
                color: '#F43F5E',
                data: foodData,
              });
            }
            return series;
          },
        },
      ],
      deepLinks: [
        { label: 'Full inflation story', route: '/economy#inflation', domain: 'economy' },
      ],
    },

    // ── Section 2: RBI response ──────────────────────────────────
    {
      id: 'rbi-response',
      sectionNumber: 2,
      title: 'The RBI Response',
      annotation:
        'When inflation crossed 6%, the RBI hiked the repo rate by 250 basis points in just 10 months. Now, with inflation cooling, rate cuts have begun. Each 25 bps cut changes EMIs for millions of borrowers.',
      domains: ['rbi'],
      sources: ['RBI MPC Statements'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'Repo Rate vs CPI Inflation',
          unit: '%',
          accent: '#4AEADC',
          extractData: (bag) => {
            const d = monetaryPolicy(bag);
            const inf = inflation(bag);
            if (!d?.decisions?.length || d.decisions.length < 3) return null;

            const series: Array<{
              name: string;
              color: string;
              data: Array<{ label: string; value: number }>;
            }> = [
              {
                name: 'Repo Rate',
                color: '#4AEADC',
                data: d.decisions.map((p) => ({
                  label: p.date,
                  value: p.rate,
                })),
              },
            ];

            // Overlay CPI if available and matching timeline
            if (inf?.series?.length && inf.series.length >= 3) {
              series.push({
                name: 'CPI Inflation',
                color: '#FFC857',
                data: inf.series.map((p) => ({
                  label: p.period,
                  value: p.cpiHeadline,
                })),
              });
            }

            return series;
          },
        },
      ],
      deepLinks: [
        { label: 'Full RBI story', route: '/rbi#monetary-policy', domain: 'rbi' },
        { label: 'EMI calculator', route: '/rbi/calculator', domain: 'rbi' },
      ],
    },

    // ── Section 3: Fiscal link ────────────────────────────────────
    {
      id: 'fiscal-link',
      sectionNumber: 3,
      title: 'The Fiscal Connection',
      annotation:
        'Government spending can fuel demand-pull inflation. When the deficit widens, more money chases the same goods. The budget-inflation-RBI triangle is India\'s central macro balancing act.',
      domains: ['budget', 'economy'],
      sources: ['Union Budget 2025-26', 'Economic Survey'],
      charts: [
        {
          chartType: 'stat-row',
          chartTitle: 'The Macro Triangle',
          extractData: (bag) => {
            const b = budgetSummary(bag);
            const e = economySummary(bag);
            const r = rbiSummary(bag);
            if (!b && !e && !r) return null;
            return [
              {
                label: 'Fiscal Deficit',
                value: b ? `${b.fiscalDeficitPercentGDP}% of GDP` : '—',
                accent: '#FF6B35',
              },
              {
                label: 'CPI Inflation',
                value: e ? `${e.cpiInflation}%` : '—',
                accent: '#FFC857',
              },
              {
                label: 'Repo Rate',
                value: r ? `${r.repoRate}%` : '—',
                accent: '#4AEADC',
              },
              {
                label: 'GDP Growth',
                value: e ? `${e.realGDPGrowth}%` : '—',
                accent: '#4ADE80',
              },
            ];
          },
        },
      ],
      deepLinks: [
        { label: 'Budget flow', route: '/budget#flow', domain: 'budget' },
        { label: 'Cost of living calculator', route: '/economy/calculator', domain: 'economy' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'economy', sectionId: 'inflation' },
    { domain: 'rbi', sectionId: 'monetary-policy' },
    { domain: 'budget', sectionId: 'flow' },
    { domain: 'budget', sectionId: 'borrowing' },
  ],

  ctaLinks: [
    {
      label: 'Economic Survey',
      route: '/economy',
      domain: 'economy',
      description: 'The full inflation and growth picture',
    },
    {
      label: 'RBI & Monetary Policy',
      route: '/rbi',
      domain: 'rbi',
      description: 'Rate decisions and their impact',
    },
    {
      label: 'Cost of Living Calculator',
      route: '/economy/calculator',
      domain: 'economy',
      description: 'See how inflation has changed your purchasing power',
    },
  ],
};
