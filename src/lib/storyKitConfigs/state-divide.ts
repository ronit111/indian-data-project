import type { StoryKitDef } from '../multiplierTypes.ts';

export const STATE_DIVIDE: StoryKitDef = {
  id: 'state-divide',
  title: "India's Great State Divide",
  subtitle: "India isn't one economy — it's 28. The gap between the richest and poorest states is wider than the gap between some countries.",
  accent: '#4ADE80',
  narrativeContext: `Maharashtra's GSDP exceeds that of many nations, while Bihar's per-capita income is comparable to sub-Saharan Africa. This kit brings together state-level economic data with demographic and health indicators to paint a complete picture of India's internal inequality. Useful for any story about federalism, Finance Commission allocations, or regional development.`,
  charts: [
    {
      registryKey: 'states/gsdp',
      caption: 'State-wise GSDP: Maharashtra and Tamil Nadu at the top, northeastern states at the bottom. The scale of the gap is the story.',
    },
    {
      registryKey: 'states/percapita',
      caption: 'Per-capita GSDP by state. Goa and Sikkim lead due to small populations — the real comparison is between large states like UP, Bihar vs. TN, Karnataka.',
    },
    {
      registryKey: 'states/fiscal-health',
      caption: 'Fiscal health indicators across states: debt-to-GSDP ratios, revenue deficits. Some states are borrowing to pay salaries.',
    },
    {
      registryKey: 'census/literacy',
      caption: 'Literacy rates by state — the human capital dimension of the divide. Kerala at 94%, Bihar at 62%. Education outcomes track economic outcomes closely.',
    },
    {
      registryKey: 'census/health',
      caption: 'Infant mortality by state: the starkest measure of development inequality. Madhya Pradesh\'s IMR is 4x Kerala\'s.',
    },
  ],
  suggestedAngles: [
    "India's north-south economic divide: why southern states generate more GDP per person and what it means for national politics.",
    "The Finance Commission paradox: states that contribute more in taxes get less in per-capita transfers.",
    "Bihar's development puzzle: why decades of investment haven't closed the gap.",
    "Small state advantage? How Goa, Sikkim, and northeastern states perform on per-capita metrics.",
    "The demographic-economic mismatch: India's most populated states are its poorest.",
  ],
  dataSources: ['RBI Handbook of Statistics on Indian States', 'Census 2011', 'NFHS-5'],
  lastUpdated: '2025-07',
};
