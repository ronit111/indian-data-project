import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS10_POLSCI_ELECTIONS: LessonPlanDef = {
  id: 'class10-polsci-elections',
  title: 'Elections in India',
  subtitle: 'Understanding Indian democracy through 62 years of election data — from turnout to representation.',
  accent: '#6366F1',
  subject: 'political-science',
  class: 10,
  chapter: 'Chapter 4: Gender, Religion and Caste / Chapter 3: Democracy and Diversity (NCERT Political Science)',
  learningObjectives: [
    'Understand how voter turnout has evolved since 1962',
    'Analyze party competition and the shift from one-party dominance to multi-party system',
    'Examine representation gaps — women, wealth, criminal records',
    'Evaluate what makes Indian elections democratic using evidence',
  ],
  charts: [
    {
      registryKey: 'elections/turnout',
      teachingNote: 'Start with the simplest democratic indicator: do people vote? Show turnout from 1962 to 2024. Turnout has generally risen — from 55% to 65%. Ask: is this good enough? Compare to other democracies.',
      discussionQuestions: [
        'Why do you think turnout has increased over the decades?',
        'If your area has 40% turnout and the winner gets 35% of votes, what percentage of the total population actually chose the representative?',
      ],
    },
    {
      registryKey: 'elections/party-landscape',
      teachingNote: 'The stacked area chart shows how India moved from Congress dominance (1962-1977) to a fragmented multi-party system. This directly relates to the textbook chapter on challenges to democracy.',
      discussionQuestions: [
        'Is a multi-party system better than a two-party system? Why?',
        'What events in Indian history caused the party landscape to change?',
      ],
    },
    {
      registryKey: 'elections/gender-gap',
      teachingNote: 'Only ~15% of Lok Sabha MPs are women. Connect to the Gender, Religion and Caste chapter. The Women\'s Reservation Bill (2023) reserves 33% seats but awaits delimitation. Ask students what they think about reservation.',
      discussionQuestions: [
        'Why are there so few women in the Lok Sabha?',
        'Do you think reservation for women in parliament is a good idea? Argue both sides.',
      ],
    },
    {
      registryKey: 'elections/money-muscle',
      teachingNote: 'This chart shows the share of candidates with criminal cases and high assets. It challenges the textbook ideal of "free and fair elections." Use it to discuss the gap between constitutional principles and ground reality.',
      discussionQuestions: [
        'Should candidates with criminal cases be allowed to contest elections?',
        'Does having more money help win elections? Is that fair?',
      ],
    },
  ],
  wrapUpQuestions: [
    'Based on the data, how democratic are Indian elections in practice? Give evidence for your answer.',
    'If you could change one thing about Indian elections, what would it be?',
    'Why is data important for holding a democracy accountable?',
  ],
  furtherReading: [
    { label: 'Elections Data Story', url: '/elections' },
    { label: 'Elections Explorer', url: '/elections/explore' },
    { label: 'Cross-Domain Topic: Democratic Health', url: '/topics/democratic-health' },
  ],
};
