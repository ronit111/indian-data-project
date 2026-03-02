import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS10_GEOGRAPHY_POPULATION: LessonPlanDef = {
  id: 'class10-geography-population',
  title: 'Population of India',
  subtitle: 'India is now the world\'s most populous country. What does the data tell us about structure, growth, and distribution?',
  accent: '#8B5CF6',
  subject: 'geography',
  class: 10,
  chapter: 'Chapter 6: Population (NCERT Geography)',
  learningObjectives: [
    'Understand India\'s population size, growth rate, and density distribution',
    'Interpret age structure and the concept of "demographic dividend"',
    'Compare urbanization trends across states',
    'Analyze literacy and sex ratio as development indicators',
  ],
  charts: [
    {
      registryKey: 'census/population',
      teachingNote: 'Start with the headline: 1.4 billion people. Show the growth curve — it\'s flattening. India\'s fertility rate is below replacement (2.0). The "population bomb" narrative is outdated. This is a key insight students should take away.',
      discussionQuestions: [
        'India\'s population growth rate is declining. Is this good or bad?',
        'Which states have the fastest-growing populations? Can you guess why?',
      ],
    },
    {
      registryKey: 'census/age',
      teachingNote: 'The age structure pyramid shows India\'s demographic dividend — a large working-age population (15-64). Compare with Japan (aging) or Nigeria (very young). India\'s window lasts until ~2055.',
      discussionQuestions: [
        'What is the "demographic dividend" and why do economists talk about it?',
        'What must India do to take advantage of its young population before the window closes?',
      ],
    },
    {
      registryKey: 'census/urbanization',
      teachingNote: 'Show urbanization trends. Only 35% of India is urban (compared to 55% globally). But urban share is rising fast. Connect to Chapter 6\'s discussion of rural-urban migration patterns.',
      discussionQuestions: [
        'Why are people moving from villages to cities?',
        'What problems does rapid urbanization create?',
      ],
    },
    {
      registryKey: 'census/literacy',
      teachingNote: 'Literacy varies hugely: Kerala 94%, Bihar 62%. Show both the national trend (rising) and state variation (persistent). This connects to the textbook\'s discussion of human development.',
      discussionQuestions: [
        'Why do southern states have higher literacy than northern states?',
        'Does literacy alone guarantee development? What else matters?',
      ],
    },
  ],
  wrapUpQuestions: [
    'India overtook China as the world\'s most populous country in 2023. Is population a strength or a weakness?',
    'If you were planning for 2050, what would India\'s population data tell you to prioritize?',
    'Why is census data important? What happens when a country doesn\'t have accurate population data?',
  ],
  furtherReading: [
    { label: 'Census & Demographics Story', url: '/census' },
    { label: 'Census Explorer', url: '/census/explore' },
    { label: 'Cross-Domain Topic: Regional Inequality', url: '/topics/regional-inequality' },
  ],
};
