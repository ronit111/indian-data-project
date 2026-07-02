import type { StoryKitDef } from '../multiplierTypes.ts';

export const CRIME_SAFETY: StoryKitDef = {
  id: 'crime-safety',
  title: "Crime & Safety: India's Justice Gap",
  subtitle: "From FIR to conviction — 62 lakh crimes, 54% conviction rate, and a police force 18% understaffed.",
  accent: '#DC2626',
  narrativeContext: `India recorded 62.4 lakh cognizable crimes in 2023 — one every 5 seconds. But the real story isn't the crime rate — it's what happens after. Only 72.7% of cases get a chargesheet. Of those that reach trial, just 54.0% end in conviction. Average trial duration: 3.5 years. Meanwhile, roads kill 474 people daily — more than all violent crime combined — and cybercrime has tripled in 5 years with barely 3% of complaints becoming FIRs. This kit gives journalists the data foundation to tell the justice gap story.`,
  charts: [
    {
      registryKey: 'crime/overview',
      caption: 'Total cognizable crimes trend 2014-2023 split by IPC and SLL. Crime rate: 448 per lakh population. The rise partly reflects better registration, not just more crime.',
    },
    {
      registryKey: 'crime/crimes-against-women',
      caption: '4.48 lakh crimes against women in 2023. Cruelty by husband (29.8%) and kidnapping (19.8%) dominate. Wide state variation — high-reporting states aren\'t necessarily less safe.',
    },
    {
      registryKey: 'crime/road-accidents',
      caption: '1.73 lakh road deaths in 2023. Overspeeding causes 68% of accidents. India has 1% of world vehicles but 11% of road crash deaths.',
    },
    {
      registryKey: 'crime/justice',
      caption: 'The justice funnel: 54.1L FIRs → 31.4L chargesheeted → 7.1L convicted. Only 21 judges per million citizens (global average: 50).',
    },
    {
      registryKey: 'crime/police',
      caption: 'India has 155 police per lakh — 30% below the UN recommended 222. Women make up only 12.3% of the force.',
    },
  ],
  suggestedAngles: [
    "The 3.5-year wait: how India's pendency crisis means justice delayed is justice denied — profile a specific state's court backlog.",
    "Kerala paradox: the state with the highest crime rate also has the highest HDI. Better policing means more FIRs, not more crime.",
    "Roads vs violence: road accidents kill more Indians than murder, kidnapping, and robbery combined. Why isn't this treated as a public safety crisis?",
    "The cybercrime reporting gap: 22.68 lakh complaints on I4C portal but only 86,420 FIRs filed. Where do the other 97% of cases go?",
    "Women in policing: at 12.3%, India's female police representation is among the lowest globally. Does it affect reporting of crimes against women?",
  ],
  dataSources: ['NCRB "Crime in India" 2023', 'MoRTH Road Accidents in India 2023', 'BPRD Data on Police Organisations (as on 01.01.2023)', 'I4C Cybercrime Portal', 'World Bank'],
  lastUpdated: '2025-07',
};
