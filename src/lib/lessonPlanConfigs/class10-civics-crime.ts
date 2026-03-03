import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS10_CIVICS_CRIME: LessonPlanDef = {
  id: 'class10-civics-crime',
  title: 'Crime, Safety & the Justice System',
  subtitle: 'Understanding how India\'s criminal justice system works — from FIR to conviction — using real data.',
  accent: '#DC2626',
  subject: 'political-science',
  class: 10,
  chapter: 'Chapter 8: Challenges to Democracy / Chapter 5: Popular Struggles and Movements (NCERT Political Science)',
  learningObjectives: [
    'Understand the scale and composition of crime in India using NCRB data',
    'Analyze the justice pipeline — from FIR to chargesheet to conviction — and identify where cases are lost',
    'Evaluate whether the criminal justice system treats all citizens equally, using data on crimes against women',
    'Discuss why data transparency matters for holding institutions accountable',
  ],
  charts: [
    {
      registryKey: 'crime/overview',
      teachingNote: 'Begin by establishing scale: India recorded 58.2 lakh crimes in 2022. Show the IPC vs SLL breakdown and the national trend. Ask students what surprises them — most expect violent crime to dominate, but property crime and cruelty cases lead.',
      discussionQuestions: [
        'Why might some states have higher crime rates but also higher development indicators?',
        'If a crime is not reported, does it still count? What does this mean for official crime statistics?',
      ],
    },
    {
      registryKey: 'crime/crimes-against-women',
      teachingNote: 'Connect to the textbook discussion on gender inequality and democratic challenges. Show that 4.45 lakh cases were registered in 2022, but experts estimate the actual number is many times higher due to underreporting. Discuss why women may not report crimes.',
      discussionQuestions: [
        'What barriers prevent women from reporting crimes? Think of social, economic, and institutional reasons.',
        'Do you think stricter laws alone can reduce crimes against women? What else is needed?',
      ],
    },
    {
      registryKey: 'crime/justice',
      teachingNote: 'The justice funnel is the key visual. Show how 54 lakh FIRs become just 7 lakh convictions. Average trial time: 3.5 years. Connect to the textbook concept of "rule of law" — if the system is slow and under-resourced, does the rule of law function in practice?',
      discussionQuestions: [
        'If it takes 3.5 years for a trial, what does that mean for victims and the accused?',
        'India has 21 judges per million people. The global average is 50. What are the consequences of this gap?',
      ],
    },
  ],
  wrapUpQuestions: [
    'Based on the data, would you say India\'s criminal justice system is working effectively? Give evidence.',
    'The textbook talks about "challenges to democracy." How is the justice gap a challenge to Indian democracy?',
    'If you were in charge, what single change would you make to improve the system? Use data to support your answer.',
  ],
  furtherReading: [
    { label: 'Crime & Safety Data Story', url: '/crime' },
    { label: 'Crime Explorer', url: '/crime/explore' },
    { label: 'Crime Methodology & Sources', url: '/crime/methodology' },
    { label: 'Cross-Domain Topic: Women in India', url: '/topics/women-in-india' },
  ],
};
