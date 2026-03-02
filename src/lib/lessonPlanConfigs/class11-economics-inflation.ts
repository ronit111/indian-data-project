import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS11_ECONOMICS_INFLATION: LessonPlanDef = {
  id: 'class11-economics-inflation',
  title: 'Money and Inflation',
  subtitle: 'Understanding how prices rise, how the RBI responds, and what it means for households.',
  accent: '#FFC857',
  subject: 'economics',
  class: 11,
  chapter: 'Chapter: Money and Banking / Inflation (NCERT Economics)',
  learningObjectives: [
    'Define inflation, CPI, and the inflation targeting framework',
    'Understand how the RBI uses the repo rate to control inflation',
    'Read and interpret inflation trend charts with target bands',
    'Analyze the relationship between monetary policy and price levels',
  ],
  charts: [
    {
      registryKey: 'economy/inflation',
      teachingNote: 'Show the CPI inflation trend. The green band shows the RBI\'s 2-6% target. When inflation breaches the band, the RBI must explain to the government why. Ask students to find the months where this happened.',
      discussionQuestions: [
        'Why does the RBI target 4% inflation rather than 0%?',
        'What happens to a family earning Rs 30,000/month when inflation is 7%?',
      ],
    },
    {
      registryKey: 'rbi/monetary-policy',
      teachingNote: 'Show the repo rate decisions timeline. Explain: when the RBI raises the repo rate, borrowing becomes expensive, people spend less, and prices cool down. Connect each rate change to the inflation chart — they should move inversely.',
      discussionQuestions: [
        'If you were the RBI Governor, would you raise or lower rates right now? Why?',
        'How does a repo rate hike affect someone with a home loan?',
      ],
    },
    {
      registryKey: 'rbi/inflation-target',
      teachingNote: 'This chart directly shows how well the RBI has met its targets. Use it as a performance scorecard. The 2020-22 period was challenging due to supply shocks from COVID and the Ukraine conflict.',
      discussionQuestions: [
        'Should the RBI be blamed for inflation caused by oil price shocks? Why or why not?',
        'Do you think the inflation target of 4% is the right number for India?',
      ],
    },
  ],
  wrapUpQuestions: [
    'Your grandparents say "things were so cheap in our time." Is this inflation? Calculate how much Rs 100 in 1990 is worth today.',
    'Why do newspapers always report what the RBI decided about the repo rate?',
    'If inflation is bad for consumers, who benefits from it?',
  ],
  furtherReading: [
    { label: 'RBI Data Story', url: '/rbi' },
    { label: 'Cost of Living Calculator', url: '/economy/calculator' },
    { label: 'EMI Calculator', url: '/rbi/calculator' },
  ],
};
