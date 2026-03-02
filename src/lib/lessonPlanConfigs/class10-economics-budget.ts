import type { LessonPlanDef } from '../multiplierTypes.ts';

export const CLASS10_ECONOMICS_BUDGET: LessonPlanDef = {
  id: 'class10-economics-budget',
  title: 'Understanding the Government Budget',
  subtitle: 'How the government earns and spends money — using Union Budget 2025-26 data.',
  accent: '#FF6B35',
  subject: 'economics',
  class: 10,
  chapter: 'Chapter 3: Money and Credit / Chapter on Government Budget (NCERT Economics)',
  learningObjectives: [
    'Understand the difference between revenue receipts and capital receipts',
    'Identify major sources of government income (tax vs. non-tax)',
    'Explain where government spends money and why',
    'Understand what fiscal deficit means in simple terms',
  ],
  charts: [
    {
      registryKey: 'budget/revenue',
      teachingNote: 'Start by asking: "Where does the government get its money?" Show the revenue breakdown. Explain that income tax and GST are the two largest sources. Point out the borrowing component — this connects to fiscal deficit.',
      discussionQuestions: [
        'Why does the government need to borrow money even when it collects taxes?',
        'If you were the Finance Minister, which tax would you increase and why?',
      ],
    },
    {
      registryKey: 'budget/expenditure',
      teachingNote: 'Now show where the money goes. Defence, interest payments, and rural development are the top 3. Ask students to compare — is more spent on education or defence? This creates a natural debate.',
      discussionQuestions: [
        'Do you think India spends enough on education compared to defence?',
        'Why are interest payments so large? What happens if the government borrows too much?',
      ],
    },
    {
      registryKey: 'budget/deficit',
      teachingNote: 'Explain fiscal deficit as the gap between income and spending. Use the analogy: if your family earns Rs 50,000 but spends Rs 65,000, the deficit is Rs 15,000. The FRBM Act says deficit should be below 3% of GDP.',
      discussionQuestions: [
        'Is it always bad for a government to run a deficit? When might it be necessary?',
        'How does the fiscal deficit affect future generations?',
      ],
    },
  ],
  wrapUpQuestions: [
    'If the government had Rs 10 extra to spend, which area should get it and why?',
    'Why is the Budget presented every year on February 1st?',
    'How does the government budget affect your daily life?',
  ],
  furtherReading: [
    { label: 'Full Budget Story', url: '/budget' },
    { label: 'Budget Explorer', url: '/budget/explore' },
    { label: 'Budget Methodology', url: '/budget/methodology' },
  ],
};
