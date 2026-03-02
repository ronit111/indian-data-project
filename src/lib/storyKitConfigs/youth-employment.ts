import type { StoryKitDef } from '../multiplierTypes.ts';

export const YOUTH_EMPLOYMENT: StoryKitDef = {
  id: 'youth-employment',
  title: "The Jobs Question: Youth & Employment",
  subtitle: "India adds 12 million young people to the working-age population every year. Is the economy creating enough jobs — and the right kind?",
  accent: '#F59E0B',
  narrativeContext: `Employment is arguably India's most politically charged data topic. The PLFS data shows a complex picture: headline unemployment has dropped, but much of the employment is informal, self-employed, or disguised underemployment. Youth unemployment remains 3x the adult rate. This kit gives you the data to write a nuanced employment story — not just the headline rate.`,
  charts: [
    {
      registryKey: 'employment/participation',
      caption: 'Overall LFPR and employment-to-population ratio. The recent rise in LFPR is good news, but check whether it\'s driven by choice or necessity.',
    },
    {
      registryKey: 'employment/youth',
      caption: 'Youth unemployment (15-24) vs. adult unemployment. The youth rate is 3x higher — a structural mismatch between education output and job availability.',
    },
    {
      registryKey: 'employment/structural',
      caption: 'Sectoral employment shifts: agriculture still employs 42% of workers but contributes only 17% of GDP. The services transition is incomplete.',
    },
    {
      registryKey: 'employment/informality',
      caption: 'Informal employment share: over 80% of Indian workers are in the informal sector. "Employment" without social security or job stability.',
    },
    {
      registryKey: 'education/spending',
      caption: 'Education spending as % of GDP: are we investing enough to close the skills gap? India spends less than the global average.',
    },
  ],
  suggestedAngles: [
    "Beyond the headline rate: what India's unemployment number doesn't tell you about job quality.",
    "The informal economy trap: 80%+ of workers without contracts, insurance, or pensions.",
    "Engineering graduates driving Ubers: the education-employment mismatch in numbers.",
    "Rural employment guarantee (MGNREGA) demand as an economic distress indicator.",
    "Which states are creating the most — and fewest — formal sector jobs?",
  ],
  dataSources: ['PLFS (MoSPI)', 'RBI KLEMS', 'World Bank', 'UDISE+'],
  lastUpdated: '2025-07',
};
