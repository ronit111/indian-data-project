import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS12_ECONOMICS_BUDGET: LessonPlanDef = {
  id: 'class12-economics-budget',
  title: 'Government Budget & Fiscal Policy',
  subtitle: 'Advanced analysis of India\'s fiscal framework — deficit, debt, and policy trade-offs.',
  accent: '#FF6B35',
  subject: 'economics',
  class: 12,
  chapter: 'Chapter 5: Government Budget and the Economy (NCERT Macroeconomics)',
  learningObjectives: [
    'Distinguish between revenue deficit, fiscal deficit, and primary deficit',
    'Analyze the Sankey flow of budget receipts to expenditure',
    'Evaluate the FRBM Act framework and India\'s fiscal consolidation path',
    'Compare budget estimates vs. actual spending for accountability analysis',
  ],
  charts: [
    {
      registryKey: 'budget/flow',
      teachingNote: 'The Sankey diagram shows the complete money flow. Have students trace a single stream — e.g., income tax → general revenue → defence. This builds understanding of how earmarked vs. general revenue works.',
      discussionQuestions: [
        'Can you trace the path from corporate tax collection to education spending?',
        'Why can\'t the government simply earmark each tax for a specific purpose?',
      ],
    },
    {
      registryKey: 'budget/deficit',
      teachingNote: 'This is the core chart for Chapter 5. Walk through: revenue deficit (current income < current spending), fiscal deficit (total income < total spending), primary deficit (fiscal deficit minus interest). The textbook definitions come alive here.',
      discussionQuestions: [
        'What is the difference between revenue deficit and fiscal deficit? Why does it matter?',
        'If primary deficit is zero but fiscal deficit is 4%, what does that tell us about the government\'s past borrowing?',
      ],
    },
    {
      registryKey: 'budget/budget-vs-actual',
      teachingNote: 'This chart is unique — not in any textbook. It shows whether the government actually spent what it planned to. Systematic underspending (e.g., health, education) or overspending (e.g., food subsidy) reveals policy priorities vs. political promises.',
      discussionQuestions: [
        'Which ministries consistently underspend? What might explain this?',
        'If a ministry underspends its allocation, should the money be redirected?',
      ],
    },
    {
      registryKey: 'budget/trends',
      teachingNote: 'Show the long-run fiscal trend. Students can see how deficits ballooned during COVID (2020-21) and the subsequent consolidation. Connect to the textbook discussion of counter-cyclical fiscal policy.',
      discussionQuestions: [
        'Was the government right to increase the deficit during COVID? What would have happened otherwise?',
        'What is the "crowding out" effect, and can you see evidence of it in the data?',
      ],
    },
  ],
  wrapUpQuestions: [
    'The FRBM Act says the fiscal deficit should be 3% of GDP. India is at 4.4%. Is this a problem? Justify your answer.',
    'If you were the Finance Minister, would you cut spending or raise taxes to reduce the deficit?',
    'How does the government budget affect monetary policy and the RBI\'s decisions?',
  ],
  furtherReading: [
    { label: 'Budget Story (full)', url: '/budget' },
    { label: 'Budget vs. Actual Analysis', url: '/budget#budget-vs-actual' },
    { label: 'Cross-Domain Topic: Fiscal Health', url: '/topics/fiscal-health' },
  ],
};
