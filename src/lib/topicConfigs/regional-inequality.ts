import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { StatesSummary, GSDPData, EnrollmentData } from '../data/schema.ts';

const statesSummary = (bag: TopicDataBag) => bag['states/summary'] as StatesSummary | undefined;
const gsdp = (bag: TopicDataBag) => bag['states/gsdp'] as GSDPData | undefined;
const enrollment = (bag: TopicDataBag) => bag['education/enrollment'] as EnrollmentData | undefined;

export const regionalInequality: TopicDef = {
  id: 'regional-inequality',
  title: 'Regional Inequality',
  subtitle: 'Goa\'s per capita income is 9x Bihar\'s. What does the data reveal about India\'s geographic divide?',
  accent: '#8B5CF6',
  contributingDomains: ['states', 'budget', 'census', 'education', 'healthcare'],
  requiredData: [
    'states/summary', 'states/gsdp',
    'budget/statewise', 'census/summary', 'census/literacy',
    'education/enrollment', 'healthcare/infrastructure',
  ],
  summaryData: ['states/summary', 'census/summary'],

  heroStat: {
    value: (bag) => {
      const s = statesSummary(bag);
      return s ? `₹${(s.averagePerCapita / 1000).toFixed(0)}K` : '—';
    },
    label: 'Average Per Capita GSDP',
    context: 'The average hides a 9x gap between richest and poorest states',
  },

  takeaways: [
    { value: '36', label: 'States & UTs', sectionId: 'income-divide' },
    { value: (bag) => { const s = statesSummary(bag); return s?.topGsdpState ? `₹${(s.topGsdpValue / 100000).toFixed(1)}L Cr` : '—'; }, label: `Top state GSDP`, sectionId: 'income-divide' },
    { value: (bag) => { const s = statesSummary(bag); return s ? s.growthRange : '—'; }, label: 'GSDP growth range', sectionId: 'income-divide' },
    { value: '9x', label: 'Per capita gap: Goa vs Bihar', sectionId: 'income-divide' },
  ],

  narrativeBridge: 'India is not one economy — it\'s many. A child born in Kerala has a fundamentally different life trajectory than one born in Bihar. Per capita income, education access, healthcare infrastructure, and budget transfers all vary dramatically across states.',

  sections: [
    {
      id: 'income-divide',
      sectionNumber: 1,
      title: 'The Income Divide',
      annotation: 'Per capita GSDP ranges from ₹54,000 in Bihar to nearly ₹5 lakh in Goa. Southern and western states cluster at the top; Bihar, UP, and Jharkhand lag.',
      domains: ['states'],
      sources: ['RBI Handbook'],
      charts: [{
        chartType: 'horizontal-bar', chartTitle: 'Per Capita GSDP by State', unit: '₹', accent: '#8B5CF6',
        extractData: (bag) => {
          const d = gsdp(bag);
          if (!d?.states?.length) return null;
          const sorted = [...d.states].sort((a, b) => b.perCapitaGsdp - a.perCapitaGsdp).slice(0, 15);
          return sorted.map(s => ({ name: s.name, value: s.perCapitaGsdp }));
        },
      }],
      deepLinks: [{ label: 'State finances', route: '/states#gsdp', domain: 'states' }],
    },
    {
      id: 'education-disparity',
      sectionNumber: 2,
      title: 'Education Access',
      annotation: 'Primary enrollment is near-universal everywhere, but secondary education diverges sharply. Kerala and Goa have secondary GER above 100%, while Bihar and Jharkhand remain below 70%.',
      domains: ['education', 'census'],
      sources: ['UDISE+ 2023-24', 'Census 2011'],
      charts: [{
        chartType: 'horizontal-bar', chartTitle: 'Secondary GER by State (Top/Bottom 10)', unit: '%', accent: '#3B82F6',
        extractData: (bag) => {
          const d = enrollment(bag);
          if (!d?.states?.length) return null;
          const sorted = [...d.states].sort((a, b) => b.gerSecondary - a.gerSecondary);
          const top5 = sorted.slice(0, 5);
          const bottom5 = sorted.slice(-5).reverse();
          return [...top5, ...bottom5].map(s => ({ name: s.name, value: s.gerSecondary }));
        },
      }],
      deepLinks: [{ label: 'Education by state', route: '/education#enrollment', domain: 'education' }],
    },
    {
      id: 'transfer-mechanism',
      sectionNumber: 3,
      title: 'Fiscal Transfers',
      annotation: 'The Finance Commission is the primary mechanism for redistribution — poorer states receive more per capita from the central budget. But does the money reach where it\'s needed?',
      domains: ['budget', 'states'],
      sources: ['Union Budget', 'Finance Commission'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'The Redistribution Question',
        extractData: (bag) => {
          const s = statesSummary(bag);
          if (!s) return null;
          return [
            { label: 'States & UTs', value: '36', accent: '#8B5CF6' },
            { label: 'Top State', value: s.topGsdpState, accent: '#4ADE80' },
            { label: 'Avg Per Capita', value: `₹${(s.averagePerCapita / 1000).toFixed(0)}K`, accent: '#FF6B35' },
            { label: 'Growth Range', value: s.growthRange, accent: '#4AEADC' },
          ];
        },
      }],
      deepLinks: [
        { label: 'State allocations', route: '/budget#statewise', domain: 'budget' },
        { label: 'Your state report card', route: '/states/your-state', domain: 'states' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'states', sectionId: 'gsdp' },
    { domain: 'states', sectionId: 'fiscal-health' },
    { domain: 'budget', sectionId: 'statewise' },
    { domain: 'census', sectionId: 'literacy' },
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'healthcare', sectionId: 'infrastructure' },
  ],

  ctaLinks: [
    { label: 'State Finances', route: '/states', domain: 'states', description: 'GSDP, revenue, and fiscal health by state' },
    { label: 'Your State Report', route: '/states/your-state', domain: 'states', description: 'How your state compares across 25 metrics' },
  ],
};
