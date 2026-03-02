import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS11_ECONOMICS_GDP: LessonPlanDef = {
  id: 'class11-economics-gdp',
  title: 'National Income & GDP Growth',
  subtitle: 'Measuring the size and growth of the Indian economy using real data.',
  accent: '#4AEADC',
  subject: 'economics',
  class: 11,
  chapter: 'Chapter 2: Indian Economy 1950-1990 / National Income Accounting (NCERT Economics)',
  learningObjectives: [
    'Define GDP, GNP, and national income in the Indian context',
    'Read and interpret GDP growth rate charts',
    'Understand the composition of GDP by sectors (agriculture, industry, services)',
    'Analyze India\'s growth trajectory from 1991 liberalization to present',
  ],
  charts: [
    {
      registryKey: 'economy/growth',
      teachingNote: 'Show the GDP growth trend. Highlight key events: 1991 crisis, 2003-08 boom, 2008 global crisis, COVID crash, and recovery. Ask students to connect events to growth rate changes.',
      discussionQuestions: [
        'What happened to India\'s GDP growth in 2020? Why?',
        'Why do economists say 7%+ growth is necessary for India to become a developed country?',
      ],
    },
    {
      registryKey: 'economy/sectors',
      teachingNote: 'Show how services now dominate GDP while agriculture\'s share has fallen. But connect to employment: 42% still work in agriculture that produces only 17% of GDP. This mismatch is the key insight.',
      discussionQuestions: [
        'If agriculture employs the most people but contributes the least to GDP, what does that tell us about productivity?',
        'Which sector do you think will grow the fastest in the next decade?',
      ],
    },
    {
      registryKey: 'economy/fiscal',
      teachingNote: 'Connect government spending to growth. The fiscal deficit chart shows how the government borrows to invest. Link back to the multiplier effect concept from textbook — government spending can accelerate or slow GDP growth.',
      discussionQuestions: [
        'Should the government spend more during a recession even if it increases the deficit?',
        'How does the fiscal deficit relate to national income?',
      ],
    },
  ],
  wrapUpQuestions: [
    'India\'s GDP is the 5th largest in the world. But its per-capita income is 140th. Why?',
    'Does GDP growth alone mean development? What\'s missing?',
    'How would you explain the difference between GDP and well-being to a friend?',
  ],
  furtherReading: [
    { label: 'Economy Story', url: '/economy' },
    { label: 'Economy Explorer', url: '/economy/explore' },
    { label: 'Cross-Domain Topic: Fiscal Health', url: '/topics/fiscal-health' },
  ],
};
