import type { StoryKitDef } from '../multiplierTypes.ts';

export const BUDGET_BREAKDOWN: StoryKitDef = {
  id: 'budget-breakdown',
  title: "Where Rs 50 Lakh Crore Goes",
  subtitle: "The Union Budget is India's largest single financial plan. Here's a data-first breakdown for newsrooms covering the 2025-26 allocation.",
  accent: '#FF6B35',
  narrativeContext: `India's Union Budget 2025-26 allocates over Rs 50 lakh crore in total expenditure. But the headline number is just the beginning — the real story is in how money flows from taxpayers through government machinery to citizens. This kit gives you the building blocks: revenue composition, spending priorities, fiscal deficit trajectory, state-level transfers, and how actuals compare to estimates. Each chart is embeddable and CSV-exportable.`,
  charts: [
    {
      registryKey: 'budget/revenue',
      caption: 'Where the money comes from: tax vs. non-tax receipts. Income tax and GST dominate, but borrowing funds nearly a third of spending.',
    },
    {
      registryKey: 'budget/expenditure',
      caption: 'Ministry-wise spending allocation. Defence, rural development, and interest payments are the three largest heads.',
    },
    {
      registryKey: 'budget/flow',
      caption: 'The full flow from receipts to expenditure as a Sankey diagram — trace how each revenue source maps to spending categories.',
    },
    {
      registryKey: 'budget/deficit',
      caption: 'Fiscal deficit as a percentage of GDP. The government targets 4.4% for 2025-26 — down from pandemic highs but still above the FRBM Act\'s 3% benchmark.',
    },
    {
      registryKey: 'budget/budget-vs-actual',
      caption: 'Do budgets match reality? This chart compares estimates vs. actuals by ministry — useful for accountability reporting.',
    },
  ],
  suggestedAngles: [
    "Which ministries consistently underspend their allocation? Compare budget-vs-actual for the past 5 years.",
    "The borrowing story: Rs 15+ lakh crore in borrowing funds this budget. What does that mean for future generations?",
    "State-level equity: which states receive the most per capita in central transfers, and why?",
    "The subsidy narrative: food, fertilizer, and fuel subsidies — who really benefits?",
    "Defence vs. development: how the spending split has shifted over the last decade.",
  ],
  dataSources: ['Open Budgets India', 'indiabudget.gov.in'],
  lastUpdated: '2025-07',
};
