import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { CensusSummary, HealthcareSummary, PopulationData } from '../data/schema.ts';

const censusSummary = (bag: TopicDataBag) => bag['census/summary'] as CensusSummary | undefined;
const population = (bag: TopicDataBag) => bag['census/population'] as PopulationData | undefined;

export const urbanRural: TopicDef = {
  id: 'urban-rural',
  title: 'Urban vs Rural Divide',
  subtitle: 'Two-thirds of India lives in villages. How different are outcomes for urban and rural citizens?',
  accent: '#6366F1',
  contributingDomains: ['census', 'employment', 'healthcare', 'environment', 'education'],
  requiredData: [
    'census/summary', 'census/population', 'census/literacy',
    'employment/summary', 'healthcare/summary', 'education/summary',
  ],
  summaryData: ['census/summary', 'employment/summary'],

  heroStat: {
    value: (bag) => {
      const c = censusSummary(bag);
      return c ? `${c.urbanizationRate}%` : '—';
    },
    label: 'Urban Population Share',
    context: 'India is urbanizing fast, but still predominantly rural',
  },

  takeaways: [
    { value: (bag) => { const c = censusSummary(bag); return c ? `${c.urbanizationRate}%` : '—'; }, label: 'Urban population', sectionId: 'urbanization-wave' },
    { value: (bag) => { const c = censusSummary(bag); return c ? `${(100 - c.urbanizationRate).toFixed(1)}%` : '—'; }, label: 'Rural population', sectionId: 'urbanization-wave' },
    { value: (bag) => { const c = censusSummary(bag); return c ? `${c.literacyRate}%` : '—'; }, label: 'National literacy', sectionId: 'access-gap' },
    { value: (bag) => { const h = bag['healthcare/summary'] as HealthcareSummary | undefined; return h ? `${h.hospitalBedsPer1000}` : '—'; }, label: 'Hospital beds / 1,000', sectionId: 'access-gap' },
  ],

  narrativeBridge: 'India\'s rural-urban divide touches everything: healthcare access, education quality, employment type, even air quality. As urbanization accelerates, the divide shifts but doesn\'t vanish — urban slums can have worse outcomes than prosperous villages.',

  sections: [
    {
      id: 'urbanization-wave',
      sectionNumber: 1,
      title: 'The Urbanization Wave',
      annotation: 'India\'s urban share has grown from 28% in 2001 to ~35% today. By 2050, projections suggest half the population will live in cities. The speed of this transition strains infrastructure.',
      domains: ['census'],
      sources: ['Census of India', 'World Bank'],
      charts: [{
        chartType: 'line', chartTitle: 'Population Growth Rate (%)', unit: '%', accent: '#6366F1',
        extractData: (bag) => {
          const d = population(bag);
          if (!d?.growthTimeSeries?.length || d.growthTimeSeries.length < 3) return null;
          return [{ name: 'Population Growth', color: '#6366F1', data: d.growthTimeSeries.map(p => ({ label: p.year, value: p.value })) }];
        },
      }],
      deepLinks: [{ label: 'Population data', route: '/census#population', domain: 'census' }],
    },
    {
      id: 'access-gap',
      sectionNumber: 2,
      title: 'The Access Gap',
      annotation: 'Urban areas have ~3x more hospital beds per capita, higher literacy rates, and better school quality. But rural India still houses 65% of the population — small improvements there move national averages more than urban gains.',
      domains: ['healthcare', 'education', 'census'],
      sources: ['NHP 2022', 'UDISE+', 'Census 2011'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Urban vs Rural Snapshot',
        extractData: (bag) => {
          const c = censusSummary(bag);
          const h = bag['healthcare/summary'] as HealthcareSummary | undefined;
          if (!c && !h) return null;
          return [
            { label: 'Urban Share', value: c ? `${c.urbanizationRate}%` : '—', accent: '#6366F1' },
            { label: 'Literacy Rate', value: c ? `${c.literacyRate}%` : '—', accent: '#3B82F6' },
            { label: 'Beds / 1,000', value: h ? `${h.hospitalBedsPer1000}` : '—', accent: '#EC4899' },
            { label: 'Sex Ratio', value: c ? `${c.sexRatio}` : '—', accent: '#F59E0B' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Healthcare infrastructure', route: '/healthcare#infrastructure', domain: 'healthcare' },
        { label: 'Census literacy', route: '/census#literacy', domain: 'census' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'census', sectionId: 'population' },
    { domain: 'census', sectionId: 'literacy' },
    { domain: 'employment', sectionId: 'participation' },
    { domain: 'healthcare', sectionId: 'infrastructure' },
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'environment', sectionId: 'air-quality' },
  ],

  ctaLinks: [
    { label: 'Census', route: '/census', domain: 'census', description: 'Population, urbanization, literacy, health' },
    { label: 'Healthcare', route: '/healthcare', domain: 'healthcare', description: 'Infrastructure and access by state' },
  ],
};
