import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { StatesSummary, GSDPData, EnrollmentData, CensusSummary, HealthcareSummary } from '../data/schema.ts';

const statesSummary = (bag: TopicDataBag) => bag['states/summary'] as StatesSummary | undefined;
const gsdp = (bag: TopicDataBag) => bag['states/gsdp'] as GSDPData | undefined;
const enrollment = (bag: TopicDataBag) => bag['education/enrollment'] as EnrollmentData | undefined;
const censusSummary = (bag: TopicDataBag) => bag['census/summary'] as CensusSummary | undefined;

export const regionalInequality: TopicDef = {
  id: 'regional-inequality',
  title: 'Regional Inequality',
  subtitle: 'Delhi\'s per capita income is 7x Bihar\'s — and within each state, the city-village gap adds another layer to the divide.',
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
    { value: (bag) => { const s = statesSummary(bag); return s ? `${s.statesWithData}` : '—'; }, label: 'States with data', sectionId: 'income-divide' },
    { value: (bag) => { const s = statesSummary(bag); return s?.topGsdpState ? `₹${(s.topGsdpValue / 100000).toFixed(1)}L Cr` : '—'; }, label: `Top state GSDP`, sectionId: 'income-divide' },
    { value: (bag) => { const s = statesSummary(bag); return s ? s.growthRange : '—'; }, label: 'GSDP growth range', sectionId: 'income-divide' },
    { value: '7x', label: 'Per capita gap: Delhi vs Bihar', sectionId: 'income-divide' },
  ],

  narrativeBridge: 'India is not one economy — it is many. A child born in Kerala has a fundamentally different life trajectory than one born in Bihar. Per capita income, education access, healthcare infrastructure, and the city-village divide within each state all compound to make "India\'s average" a fiction that obscures more than it reveals.',

  sections: [
    {
      id: 'income-divide',
      sectionNumber: 1,
      title: 'The Income Divide',
      annotation: 'Per capita NSDP ranges from ₹69,000 in Bihar to nearly ₹5 lakh in Delhi. Southern and western states cluster at the top; Bihar, UP, and Jharkhand lag.',
      domains: ['states'],
      sources: ['RBI Handbook'],
      charts: [{
        chartType: 'horizontal-bar', chartTitle: 'Per Capita GSDP by State', unit: '₹', accent: '#8B5CF6',
        extractData: (bag) => {
          const d = gsdp(bag);
          if (!d?.states?.length) return null;
          const sorted = [...d.states].sort((a, b) => b.perCapitaNsdp - a.perCapitaNsdp).slice(0, 15);
          return sorted.map(s => ({ name: s.name, value: s.perCapitaNsdp }));
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
      id: 'urban-rural-access',
      sectionNumber: 3,
      title: 'Within States: The City-Village Gap',
      annotation: 'The state-level divide is only half the story. Within each state, urban areas have roughly 3x more hospital beds per capita than rural areas. A citizen in rural Bihar faces a double disadvantage — the poorest state, and the rural side of it. Urbanisation is not solving this gap; it is shifting its location.',
      domains: ['census', 'healthcare'],
      sources: ['NHP 2022', 'Census 2011'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Urban vs Rural Snapshot',
        extractData: (bag) => {
          const c = censusSummary(bag);
          const h = bag['healthcare/summary'] as HealthcareSummary | undefined;
          if (!c && !h) return null;
          return [
            { label: 'Urban Share', value: c ? `${c.urbanizationRate}%` : '—', accent: '#6366F1' },
            { label: 'Rural Share', value: c ? `${(100 - c.urbanizationRate).toFixed(1)}%` : '—', accent: '#8B5CF6' },
            { label: 'Hospital Beds / 1,000', value: h ? `${h.hospitalBedsPer1000}` : '—', accent: '#F43F5E' },
            { label: 'Literacy Rate', value: c ? `${c.literacyRate}%` : '—', accent: '#4ADE80' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Healthcare infrastructure', route: '/healthcare#infrastructure', domain: 'healthcare' },
        { label: 'Census data', route: '/census#population', domain: 'census' },
      ],
    },
    {
      id: 'transfer-mechanism',
      sectionNumber: 4,
      title: 'Fiscal Transfers',
      annotation: 'The Finance Commission is the primary mechanism for redistribution — poorer states receive more per capita from the central budget. But the mechanism is slow and formulaic. Money flows, but the administrative capacity to spend it well does not automatically follow.',
      domains: ['budget', 'states'],
      sources: ['Union Budget', 'Finance Commission'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'The Redistribution Question',
        extractData: (bag) => {
          const s = statesSummary(bag);
          if (!s) return null;
          return [
            { label: 'States with Data', value: `${s.statesWithData}`, accent: '#8B5CF6' },
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
    { domain: 'census', sectionId: 'population' },
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'healthcare', sectionId: 'infrastructure' },
  ],

  ctaLinks: [
    { label: 'State Finances', route: '/states', domain: 'states', description: 'GSDP, revenue, and fiscal health by state' },
    { label: 'Your State Report', route: '/states/your-state', domain: 'states', description: 'How your state compares across 25 metrics' },
  ],
};
