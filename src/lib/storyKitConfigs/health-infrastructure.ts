import type { StoryKitDef } from '../multiplierTypes.ts';

export const HEALTH_INFRASTRUCTURE: StoryKitDef = {
  id: 'health-infrastructure',
  title: "India's Health Infrastructure",
  subtitle: "COVID exposed the gaps. Three years later, how does India's health system measure up — in beds, doctors, spending, and immunization?",
  accent: '#F43F5E',
  narrativeContext: `India has 0.5 hospital beds per 1,000 people against a WHO recommendation of 3. Out-of-pocket spending pushes 55 million people into poverty every year. Yet immunization coverage has risen to near-90%, and doctor density is slowly improving. This kit assembles the infrastructure, spending, and outcome data you need for any health system story.`,
  charts: [
    {
      registryKey: 'healthcare/infrastructure',
      caption: 'Hospital beds and physicians per 1,000 population. India is far below WHO benchmarks — and the distribution is wildly uneven across states.',
    },
    {
      registryKey: 'healthcare/spending',
      caption: 'Health spending as % of GDP: government share has risen but remains under 2%. Total health spend including private is ~3.3%.',
    },
    {
      registryKey: 'healthcare/oop',
      caption: 'Out-of-pocket expenditure: the hidden tax on illness. Indians pay ~48% of health costs from their own pockets — one of the highest rates globally.',
    },
    {
      registryKey: 'healthcare/immunization',
      caption: 'Immunization coverage by state: from near-universal in Kerala/Tamil Nadu to concerning gaps in UP, Bihar. DPT3 is the standard benchmark.',
    },
    {
      registryKey: 'healthcare/disease',
      caption: 'TB incidence and HIV prevalence trends: India carries the world\'s largest TB burden. Tracking these tells you if public health interventions are working.',
    },
  ],
  suggestedAngles: [
    "The doctor deficit: India has 1 doctor per 1,000 people, but they're concentrated in cities. What does healthcare look like in rural India?",
    "Ayushman Bharat's promise vs. reality: has the world's largest health insurance scheme reduced out-of-pocket spending?",
    "The immunization success story: how India went from 62% to 90% DPT3 coverage in a decade.",
    "Medical debt and poverty: how a single hospitalization can push an Indian family below the poverty line.",
    "State-level health inequality: why being born in Kerala vs. Madhya Pradesh determines your life expectancy.",
  ],
  dataSources: ['NHP (CBHI)', 'NFHS-5', 'World Bank', 'WHO'],
  lastUpdated: '2025-07',
};
