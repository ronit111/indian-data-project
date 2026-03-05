import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { BudgetSummary, EconomySummary, EmploymentSummary, EnvironmentSummary, SectoralData } from '../data/schema.ts';

const budgetSummary = (bag: TopicDataBag) => bag['budget/summary'] as BudgetSummary | undefined;
const ecoSummary = (bag: TopicDataBag) => bag['economy/summary'] as EconomySummary | undefined;
const empSummary = (bag: TopicDataBag) => bag['employment/summary'] as EmploymentSummary | undefined;
const envSummary = (bag: TopicDataBag) => bag['environment/summary'] as EnvironmentSummary | undefined;
const sectoral = (bag: TopicDataBag) => bag['employment/sectoral'] as SectoralData | undefined;

export const agricultureFood: TopicDef = {
  id: 'agriculture-food',
  title: 'Agriculture & Food Security',
  subtitle: '43% of India\'s workforce is in agriculture, but it produces only 16% of GDP. Can India feed itself sustainably?',
  accent: '#22C55E',
  contributingDomains: ['budget', 'economy', 'employment', 'environment'],
  requiredData: [
    'budget/summary', 'economy/summary', 'economy/sectors',
    'employment/summary', 'employment/sectoral',
    'environment/summary',
  ],
  summaryData: ['economy/summary', 'employment/summary', 'environment/summary'],

  heroStat: {
    value: (bag) => {
      const e = empSummary(bag);
      return e ? `${e.selfEmployedPct}%` : '—';
    },
    label: 'Self-Employed (mostly agriculture)',
    context: 'Most agricultural workers are self-employed or casual labourers',
  },

  takeaways: [
    { value: '~43%', label: 'Workforce in agriculture', sectionId: 'agri-paradox' },
    { value: '~16%', label: 'Agriculture share of GDP', sectionId: 'agri-paradox' },
    { value: (bag) => { const e = ecoSummary(bag); return e ? `${e.cpiInflation}%` : '—'; }, label: 'CPI inflation (food-driven)', sectionId: 'food-prices' },
    { value: (bag) => { const e = envSummary(bag); return e ? `${e.forestPct}%` : '—'; }, label: 'Forest cover', sectionId: 'sustainability' },
  ],

  narrativeBridge: 'Agriculture is India\'s employment backbone but its productivity laggard. The sector supports 43% of the workforce but contributes just 16% of GDP — a productivity gap that keeps rural incomes low. Meanwhile, food prices drive inflation spikes, and water stress threatens future harvests.',

  sections: [
    {
      id: 'agri-paradox',
      sectionNumber: 1,
      title: 'The Productivity Paradox',
      annotation: 'Agriculture employs the most people but produces the least value per worker. As industry and services grow, the structural shift should pull workers out of agriculture — but that requires jobs in other sectors.',
      domains: ['employment', 'economy'],
      sources: ['PLFS', 'RBI KLEMS', 'NSO'],
      charts: [{
        chartType: 'area', chartTitle: 'Sectoral Employment Shares', unit: '% of workforce', accent: '#22C55E',
        extractData: (bag) => {
          const d = sectoral(bag);
          if (!d) return null;
          const MIN_POINTS = 3;
          const series = [];
          if (d.agricultureTimeSeries?.length >= MIN_POINTS) series.push({ name: 'Agriculture', color: '#22C55E', data: d.agricultureTimeSeries.map(p => ({ label: p.year, value: p.value })) });
          if (d.industryTimeSeries?.length >= MIN_POINTS) series.push({ name: 'Industry', color: '#F59E0B', data: d.industryTimeSeries.map(p => ({ label: p.year, value: p.value })) });
          if (d.servicesTimeSeries?.length >= MIN_POINTS) series.push({ name: 'Services', color: '#3B82F6', data: d.servicesTimeSeries.map(p => ({ label: p.year, value: p.value })) });
          return series.length > 0 ? series : null;
        },
      }],
      deepLinks: [{ label: 'Sectoral data', route: '/employment#sectoral', domain: 'employment' }],
    },
    {
      id: 'food-prices',
      sectionNumber: 2,
      title: 'Food Prices & Inflation',
      annotation: 'Food accounts for ~46% of India\'s CPI basket. Vegetable and pulse price spikes can push headline inflation above the RBI\'s 6% upper limit — forcing rate hikes that cool the entire economy.',
      domains: ['economy', 'rbi'],
      sources: ['MOSPI (CPI)', 'RBI'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'The Food-Inflation Link',
        extractData: (bag) => {
          const e = ecoSummary(bag);
          const b = budgetSummary(bag);
          if (!e && !b) return null;
          return [
            { label: 'CPI Inflation', value: e ? `${e.cpiInflation}%` : '—', accent: '#FFC857' },
            { label: 'GDP Growth', value: e ? `${e.realGDPGrowth}%` : '—', accent: '#4AEADC' },
            { label: 'Fiscal Deficit', value: b ? `${b.fiscalDeficitPercentGDP}%` : '—', accent: '#FF6B35' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Inflation data', route: '/economy#inflation', domain: 'economy' },
        { label: 'Budget food subsidy', route: '/budget#spending', domain: 'budget' },
      ],
    },
    {
      id: 'sustainability',
      sectionNumber: 3,
      title: 'Sustainability Pressures',
      annotation: 'Agriculture accounts for ~80% of India\'s freshwater use. Groundwater depletion, soil degradation, and climate variability threaten long-term food security. The transition to sustainable farming is urgent but underinvested.',
      domains: ['environment'],
      sources: ['CWC/CGWB', 'ISFR 2023'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Environmental Pressures',
        extractData: (bag) => {
          const e = envSummary(bag);
          if (!e) return null;
          return [
            { label: 'Forest Cover', value: `${e.forestPct}%`, accent: '#22C55E' },
            { label: 'CO₂ / Capita', value: `${e.co2PerCapita} t`, accent: '#14B8A6' },
            { label: 'PM2.5', value: `${e.pm25} µg/m³`, accent: '#F43F5E' },
            { label: 'Renewables', value: `${e.renewablesPct}%`, accent: '#06B6D4' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Water stress data', route: '/environment#water', domain: 'environment' },
        { label: 'Forest cover data', route: '/environment#forest', domain: 'environment' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'employment', sectionId: 'sectoral' },
    { domain: 'economy', sectionId: 'inflation' },
    { domain: 'economy', sectionId: 'sectors' },
    { domain: 'budget', sectionId: 'spending' },
    { domain: 'environment', sectionId: 'water' },
  ],

  ctaLinks: [
    { label: 'Employment', route: '/employment', domain: 'employment', description: 'Sectoral employment shifts and informality' },
    { label: 'Environment', route: '/environment', domain: 'environment', description: 'Water, forest cover, and sustainability' },
  ],
};
