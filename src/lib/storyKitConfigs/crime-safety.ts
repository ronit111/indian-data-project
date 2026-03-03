import type { StoryKitDef } from '../multiplierTypes.ts';

export const CRIME_SAFETY: StoryKitDef = {
  id: 'crime-safety',
  title: "Crime & Safety: India's Justice Gap",
  subtitle: "From FIR to conviction — 58 lakh crimes, 39% conviction rate, and a police force 18% understaffed.",
  accent: '#DC2626',
  narrativeContext: `India recorded 58.2 lakh cognizable crimes in 2022 — one every 5 seconds. But the real story isn't the crime rate — it's what happens after. Only 74.6% of cases get a chargesheet. Of those that reach trial, just 39.1% end in conviction. Average trial duration: 3.5 years. Meanwhile, roads kill 461 people daily — more than all violent crime combined — and cybercrime has tripled in 5 years with barely 3% of complaints becoming FIRs. This kit gives journalists the data foundation to tell the justice gap story.`,
  charts: [
    {
      registryKey: 'crime/overview',
      caption: 'Total cognizable crimes trend 2014-2022 split by IPC and SLL. Crime rate: 422 per lakh population. The rise partly reflects better registration, not just more crime.',
    },
    {
      registryKey: 'crime/crimes-against-women',
      caption: '4.45 lakh crimes against women in 2022. Cruelty by husband (31.4%) and kidnapping (19.2%) dominate. Wide state variation — high-reporting states aren\'t necessarily less safe.',
    },
    {
      registryKey: 'crime/road-accidents',
      caption: '1.68 lakh road deaths in 2022. Overspeeding causes 69.3% of fatalities. India has 1% of world vehicles but 11% of road crash deaths.',
    },
    {
      registryKey: 'crime/justice',
      caption: 'The justice funnel: 54.1L FIRs → 31.4L chargesheeted → 7.1L convicted. Only 21 judges per million citizens (global average: 50).',
    },
    {
      registryKey: 'crime/police',
      caption: 'India has 151 police per lakh — 32% below the UN recommended 222. Women make up only 11.7% of the force.',
    },
  ],
  suggestedAngles: [
    "The 3.5-year wait: how India's pendency crisis means justice delayed is justice denied — profile a specific state's court backlog.",
    "Kerala paradox: the state with the highest crime rate also has the highest HDI. Better policing means more FIRs, not more crime.",
    "Roads vs violence: road accidents kill more Indians than murder, kidnapping, and robbery combined. Why isn't this treated as a public safety crisis?",
    "The cybercrime reporting gap: 22.68 lakh complaints on I4C portal but only 65,893 FIRs filed. Where do the other 97% of cases go?",
    "Women in policing: at 11.7%, India's female police representation is among the lowest globally. Does it affect reporting of crimes against women?",
  ],
  dataSources: ['NCRB "Crime in India" 2022', 'MoRTH Road Accidents Report', 'BPRD Data on Police', 'I4C Cybercrime Portal', 'World Bank'],
  lastUpdated: '2025-07',
};
