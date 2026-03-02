import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS11_GEOGRAPHY_ENVIRONMENT: LessonPlanDef = {
  id: 'class11-geography-environment',
  title: 'Environmental Concerns in India',
  subtitle: 'Air quality, forests, energy transition, and water stress — India\'s environmental challenges in data.',
  accent: '#14B8A6',
  subject: 'geography',
  class: 11,
  chapter: 'Chapter: Environment and Natural Resources / Hazards and Disasters (NCERT Geography)',
  learningObjectives: [
    'Analyze India\'s air quality crisis using PM2.5 and AQI data',
    'Understand forest cover trends and the role of protected areas',
    'Examine India\'s energy transition from coal to renewables',
    'Assess water stress indicators and groundwater depletion',
  ],
  charts: [
    {
      registryKey: 'environment/air-quality',
      teachingNote: 'Show PM2.5 trends and city-level AQI. Delhi is the obvious case, but show that even "clean" cities like Bangalore have worsened. The WHO guideline (5 µg/m³) makes even the best Indian cities look bad.',
      discussionQuestions: [
        'Why is Delhi\'s air quality worse than most other cities?',
        'What can individuals do vs. what requires government policy to fix air pollution?',
      ],
    },
    {
      registryKey: 'environment/forest-cover',
      teachingNote: 'Forest cover has been stable at ~22% but the target is 33%. Show the state-level variation — northeast states are heavily forested while Punjab and Haryana have almost none. Discuss deforestation vs. afforestation.',
      discussionQuestions: [
        'India\'s forest cover percentage hasn\'t changed much. Is that a success or a failure?',
        'Should development (roads, factories) be allowed in forest areas? How do you balance growth and conservation?',
      ],
    },
    {
      registryKey: 'environment/energy-transition',
      teachingNote: 'Show the renewable capacity growth (solar + wind) vs. coal dependence. India committed to 50% non-fossil power by 2030 at COP26. Are we on track? This chart answers that question.',
      discussionQuestions: [
        'Should India shut down coal power plants immediately, or transition gradually?',
        'India argues it shouldn\'t sacrifice growth for climate goals since developed countries polluted first. Is this fair?',
      ],
    },
    {
      registryKey: 'environment/water-stress',
      teachingNote: 'Water stress is less visible than air pollution but potentially more dangerous. Show reservoir storage levels and groundwater depletion. Punjab and Rajasthan are in critical stage. This connects directly to agriculture sustainability.',
      discussionQuestions: [
        'Why is groundwater depletion a bigger crisis than river pollution?',
        'How does water stress in Punjab affect India\'s food security?',
      ],
    },
  ],
  wrapUpQuestions: [
    'Rank India\'s environmental challenges by urgency: air, water, forests, climate. Justify your ranking.',
    'India is the 3rd largest CO2 emitter but has very low per-capita emissions. Should India be held to the same climate standards as the US or EU?',
    'Based on the data, is India\'s environment getting better or worse?',
  ],
  furtherReading: [
    { label: 'Environment Data Story', url: '/environment' },
    { label: 'Environment Explorer', url: '/environment/explore' },
    { label: 'Cross-Domain Topic: Climate & Energy', url: '/topics/climate-energy' },
  ],
};
