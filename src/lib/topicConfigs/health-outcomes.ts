import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { HealthcareSummary, HealthData, HealthSpendingData } from '../data/schema.ts';

const hcSummary = (bag: TopicDataBag) => bag['healthcare/summary'] as HealthcareSummary | undefined;
const healthData = (bag: TopicDataBag) => bag['census/health'] as HealthData | undefined;
const hcSpending = (bag: TopicDataBag) => bag['healthcare/spending'] as HealthSpendingData | undefined;

export const healthOutcomes: TopicDef = {
  id: 'health-outcomes',
  title: 'Health Outcomes',
  subtitle: 'Hospital beds, infant survival, immunization — is India getting healthier?',
  accent: '#EC4899',
  contributingDomains: ['healthcare', 'census', 'budget', 'states'],
  requiredData: [
    'healthcare/summary', 'healthcare/infrastructure', 'healthcare/spending',
    'census/summary', 'census/health', 'budget/summary', 'states/summary',
  ],
  summaryData: ['healthcare/summary', 'census/summary'],

  heroStat: {
    value: (bag) => {
      const h = hcSummary(bag);
      return h ? `${h.hospitalBedsPer1000}` : '—';
    },
    label: 'Hospital beds per 1,000 people',
    context: 'WHO recommends 3 beds per 1,000. India has a long way to go.',
  },

  takeaways: [
    { value: (bag) => { const h = hcSummary(bag); return h ? `${h.hospitalBedsPer1000}` : '—'; }, label: 'Beds per 1,000', sectionId: 'infrastructure-gap' },
    { value: (bag) => { const h = hcSummary(bag); return h ? `${h.dptImmunization}%` : '—'; }, label: 'DPT immunization', sectionId: 'child-health' },
    { value: (bag) => { const h = hcSummary(bag); return h ? `${h.healthExpGDP}%` : '—'; }, label: 'Health spending (% GDP)', sectionId: 'spending-gap' },
    { value: (bag) => { const h = hcSummary(bag); return h ? `${h.outOfPocketPct}%` : '—'; }, label: 'Out-of-pocket spending', sectionId: 'spending-gap' },
  ],

  narrativeBridge: 'India\'s health system serves 1.4 billion people with fewer resources per capita than most peer nations. Progress is real — infant mortality has halved in 20 years, immunization coverage exceeds 90% — but the infrastructure deficit and out-of-pocket burden remain acute.',

  sections: [
    {
      id: 'child-health',
      sectionNumber: 1,
      title: 'Child Survival',
      annotation: 'India\'s infant mortality rate has dropped from 66 per 1,000 live births in 2000 to about 25 today. Immunization coverage now exceeds 90% nationally, though state-level variation is wide.',
      domains: ['healthcare', 'census'],
      sources: ['SRS 2022', 'NFHS-5', 'World Bank'],
      charts: [{
        chartType: 'line', chartTitle: 'Infant Mortality Rate (per 1,000 live births)', unit: 'per 1,000', accent: '#EC4899',
        extractData: (bag) => {
          const d = healthData(bag);
          if (!d?.imrNational?.length || d.imrNational.length < 3) return null;
          return [{ name: 'IMR', color: '#EC4899', data: d.imrNational.map(p => ({ label: p.year, value: p.value })) }];
        },
      }],
      deepLinks: [{ label: 'Full health story', route: '/census#health', domain: 'census' }],
    },
    {
      id: 'infrastructure-gap',
      sectionNumber: 2,
      title: 'Infrastructure Gap',
      annotation: 'With 1.6 beds (mostly private) and 0.7 doctors per 1,000 people, India\'s health infrastructure falls short of WHO norms. Rural areas fare worse — driving millions to seek private care they can barely afford.',
      domains: ['healthcare'],
      sources: ['NHP 2022 (CBHI)'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Infrastructure Snapshot',
        extractData: (bag) => {
          const h = hcSummary(bag);
          if (!h) return null;
          return [
            { label: 'Beds / 1,000', value: `${h.hospitalBedsPer1000}`, accent: '#EC4899' },
            { label: 'Physicians / 1,000', value: `${h.physiciansPer1000}`, accent: '#F43F5E' },
            { label: 'Health Spend (% GDP)', value: `${h.healthExpGDP}%`, accent: '#8B5CF6' },
            { label: 'Out-of-Pocket', value: `${h.outOfPocketPct}%`, accent: '#F59E0B' },
          ];
        },
      }],
      deepLinks: [{ label: 'Healthcare infrastructure', route: '/healthcare#infrastructure', domain: 'healthcare' }],
    },
    {
      id: 'spending-gap',
      sectionNumber: 3,
      title: 'Who Pays?',
      annotation: 'About 45% of all health spending in India comes out of patients\' pockets. Total health expenditure is ~3.3% of GDP, below the global average of ~6%. Ayushman Bharat has expanded coverage, but the financing gap persists.',
      domains: ['healthcare', 'budget'],
      sources: ['NHP 2022', 'World Bank'],
      charts: [{
        chartType: 'line', chartTitle: 'Health Expenditure (% of GDP)', unit: '%', accent: '#8B5CF6',
        extractData: (bag) => {
          const d = hcSpending(bag);
          if (!d?.govtHealthExpTimeSeries?.length || d.govtHealthExpTimeSeries.length < 3) return null;
          return [{ name: 'Govt Health Exp', color: '#8B5CF6', data: d.govtHealthExpTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) }];
        },
      }],
      deepLinks: [
        { label: 'Healthcare spending', route: '/healthcare#spending', domain: 'healthcare' },
        { label: 'Budget allocation', route: '/budget#spending', domain: 'budget' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'healthcare', sectionId: 'infrastructure' },
    { domain: 'healthcare', sectionId: 'spending' },
    { domain: 'healthcare', sectionId: 'disease' },
    { domain: 'census', sectionId: 'health' },
    { domain: 'budget', sectionId: 'spending' },
  ],

  ctaLinks: [
    { label: 'Healthcare', route: '/healthcare', domain: 'healthcare', description: 'Infrastructure, spending, and disease burden' },
    { label: 'Census Health', route: '/census', domain: 'census', description: 'IMR, MMR, and life expectancy trends' },
  ],
};
