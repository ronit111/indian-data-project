import type { StoryKitDef } from '../multiplierTypes.ts';

export const WOMEN_DATA: StoryKitDef = {
  id: 'women-data',
  title: "Women in Numbers: India's Gender Story",
  subtitle: "From parliament to the workforce to school enrollment — tracking where India is improving and where gaps persist.",
  accent: '#F43F5E',
  narrativeContext: `India's gender story is one of contradictions: female literacy is rising faster than male, but women's labor force participation collapsed by half over two decades before a recent recovery. Parliament has the lowest share of women among major democracies. This kit assembles the data from across 6 domains so you can tell a complete gender story without cherry-picking a single statistic.`,
  charts: [
    {
      registryKey: 'employment/gender-gap',
      caption: 'Female vs. male labor force participation rate. Women\'s LFPR dropped to 20% in 2017-18 before recovering to ~37% — still half the male rate.',
    },
    {
      registryKey: 'elections/gender-gap',
      caption: 'Women MPs in the Lok Sabha: still under 15% despite the 2023 Women\'s Reservation Bill (which awaits delimitation before implementation).',
    },
    {
      registryKey: 'education/gender',
      caption: 'Female enrollment parity: India has reached near-parity in primary enrollment, but the gap widens in secondary and higher education.',
    },
    {
      registryKey: 'census/vital-stats',
      caption: 'Sex ratio trends: from 933 per 1000 in 2001 to 943 in 2011. Maternal mortality and fertility rates tell the health side of the story.',
    },
  ],
  suggestedAngles: [
    "The missing workers: why did millions of Indian women leave the workforce between 2004-2018, and are they coming back?",
    "Women's Reservation Bill: a 30-year journey. What would parliament look like with 33% reservation?",
    "Education parity, employment disparity: why Indian women's rising education hasn't translated to jobs.",
    "The care economy gap: unpaid domestic work, childcare, and its economic cost.",
  ],
  dataSources: ['PLFS (MoSPI)', 'ECI', 'UDISE+', 'Census 2011', 'World Bank'],
  lastUpdated: '2025-07',
};
