import type { StoryKitDef } from '../multiplierTypes.ts';

export const INFLATION_STORY: StoryKitDef = {
  id: 'inflation-story',
  title: "The Price You Pay: India's Inflation Picture",
  subtitle: "From RBI rate decisions to kitchen budgets — the data chain that connects monetary policy to everyday prices.",
  accent: '#4AEADC',
  narrativeContext: `Inflation in India is a story told across three domains: the RBI sets the repo rate, the Economic Survey tracks CPI trends, and household budgets absorb the impact. This kit connects the dots between monetary policy tools and price outcomes. Use it to explain why the RBI raised or held rates, what that means for EMIs and food prices, and how India's inflation compares globally.`,
  charts: [
    {
      registryKey: 'economy/inflation',
      caption: 'CPI inflation trend with the RBI\'s 2-6% target band. Note how food inflation spikes often push headline CPI above target.',
    },
    {
      registryKey: 'rbi/monetary-policy',
      caption: 'Repo rate decisions over time. Each rate change is a signal — correlate with CPI movements to explain the policy logic.',
    },
    {
      registryKey: 'rbi/inflation-target',
      caption: 'CPI vs. the inflation target: how often has India stayed within the 4±2% band? This chart makes the RBI\'s track record visible.',
    },
    {
      registryKey: 'economy/growth',
      caption: 'GDP growth context: rate hikes slow growth, rate cuts stimulate it. This tension between inflation control and growth is the central story.',
    },
  ],
  suggestedAngles: [
    "The RBI held rates at X% — here's why, and what it means for your home loan EMI.",
    "Food inflation is running at Y% while core is at Z%. What's driving the divergence?",
    "India's inflation targeting framework turns 10: has it worked? A data-driven assessment.",
    "The Rs 100 basket: how the same grocery list costs different amounts across Indian cities.",
  ],
  dataSources: ['MOSPI (CPI)', 'RBI Monetary Policy statements', 'World Bank'],
  lastUpdated: '2025-07',
};
