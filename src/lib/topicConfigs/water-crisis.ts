import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { EnvironmentSummary, CensusSummary, WaterData } from '../data/schema.ts';

const envSummary = (bag: TopicDataBag) => bag['environment/summary'] as EnvironmentSummary | undefined;
const censusSummary = (bag: TopicDataBag) => bag['census/summary'] as CensusSummary | undefined;
const water = (bag: TopicDataBag) => bag['environment/water'] as WaterData | undefined;

export const waterCrisis: TopicDef = {
  id: 'water-crisis',
  title: 'Water Crisis',
  subtitle: 'India has 18% of the world\'s population but only 4% of its freshwater. The numbers are getting worse.',
  accent: '#06B6D4',
  contributingDomains: ['environment', 'census', 'healthcare'],
  requiredData: [
    'environment/summary', 'environment/water',
    'census/summary', 'census/population',
    'healthcare/summary',
  ],
  summaryData: ['environment/summary', 'census/summary'],

  heroStat: {
    value: '4%',
    label: 'Share of Global Freshwater',
    context: 'India has 18% of the world\'s population but only 4% of its freshwater resources',
  },

  takeaways: [
    { value: '4%', label: 'Share of global freshwater', sectionId: 'water-stress' },
    { value: (bag) => { const c = censusSummary(bag); return c ? `${(c.totalPopulation / 1e9).toFixed(2)}B` : '—'; }, label: 'Population dependent on it', sectionId: 'water-stress' },
    { value: '~80%', label: 'Freshwater used by agriculture', sectionId: 'groundwater-depletion' },
    // TODO: PM2.5 is an air quality metric, not water-specific. Consider replacing with waterborne disease deaths or Jal Jeevan Mission coverage when data is available.
    { value: (bag) => { const e = envSummary(bag); return e ? `${e.pm25} µg/m³` : '—'; }, label: 'Air pollution (PM2.5)', sectionId: 'health-link' },
  ],

  narrativeBridge: 'India\'s water crisis is not just about scarcity — it\'s about distribution, contamination, and governance. Some states are mining groundwater faster than it recharges. Rivers are polluted. Agriculture consumes 80% of freshwater. And climate change is making rainfall more erratic.',

  sections: [
    {
      id: 'water-stress',
      sectionNumber: 1,
      title: 'Water Stress Map',
      annotation: 'India is classified as "water-stressed" — per capita availability has dropped from 5,177 cubic meters in 1951 to below 1,500 today. By 2030, demand is projected to outstrip supply in many basins.',
      domains: ['environment', 'census'],
      sources: ['CWC', 'World Bank'],
      charts: [{
        chartType: 'horizontal-bar', chartTitle: 'Groundwater Stage by State (Most Stressed)', unit: '%', accent: '#06B6D4',
        extractData: (bag) => {
          const d = water(bag);
          if (!d?.groundwaterStage?.length) return null;
          const stressed = [...d.groundwaterStage].sort((a, b) => b.stagePct - a.stagePct).slice(0, 12);
          return stressed.map(s => ({ name: s.name, value: s.stagePct }));
        },
      }],
      deepLinks: [{ label: 'Water data', route: '/environment#water', domain: 'environment' }],
    },
    {
      id: 'groundwater-depletion',
      sectionNumber: 2,
      title: 'Groundwater Depletion',
      annotation: 'India is the world\'s largest user of groundwater, extracting more than the US and China combined. Punjab, Haryana, and Rajasthan have stage percentages above 100% — they\'re mining fossil water that won\'t recharge in our lifetimes.',
      domains: ['environment'],
      sources: ['CGWB', 'CWC'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Groundwater Facts',
        extractData: (bag) => {
          const d = water(bag);
          if (!d?.groundwaterStage?.length) return null;
          const critical = d.groundwaterStage.filter(s => s.stagePct > 100).length;
          const overExploited = d.groundwaterStage.filter(s => s.stagePct > 70).length;
          const safe = d.groundwaterStage.filter(s => s.stagePct < 40).length;
          return [
            { label: 'Over-Exploited', value: `${critical} states`, accent: '#EF4444' },
            { label: 'Stressed (>70%)', value: `${overExploited} states`, accent: '#F97316' },
            { label: 'Safe (<40%)', value: `${safe} states`, accent: '#22C55E' },
            { label: 'Total Tracked', value: `${d.groundwaterStage.length}`, accent: '#06B6D4' },
          ];
        },
      }],
      deepLinks: [{ label: 'Groundwater data', route: '/environment#water', domain: 'environment' }],
    },
    {
      id: 'health-link',
      sectionNumber: 3,
      title: 'Water & Health',
      annotation: 'Contaminated water causes waterborne diseases that kill an estimated 400,000 Indians annually. Access to clean drinking water has improved under Jal Jeevan Mission, but sanitation and water quality in rural areas remain challenges.',
      domains: ['healthcare', 'census'],
      sources: ['WHO', 'NFHS-5', 'Census 2011'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Water-Health Connection',
        extractData: (bag) => {
          const c = censusSummary(bag);
          const e = envSummary(bag);
          const h = bag['healthcare/summary'] as { hospitalBedsPer1000: number; outOfPocketPct: number } | undefined;
          if (!c && !e && !h) return null;
          return [
            { label: 'Population', value: c ? `${(c.totalPopulation / 1e9).toFixed(2)}B` : '—', accent: '#8B5CF6' },
            // TODO: PM2.5 is air quality, not water-related. Swap for water-specific stat (e.g. safe drinking water coverage) when available.
            { label: 'PM2.5', value: e ? `${e.pm25} µg/m³` : '—', accent: '#F43F5E' },
            { label: 'Hospital Beds', value: h ? `${h.hospitalBedsPer1000} / 1K` : '—', accent: '#EC4899' },
            { label: 'Out-of-Pocket', value: h ? `${h.outOfPocketPct}%` : '—', accent: '#F59E0B' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Healthcare data', route: '/healthcare#infrastructure', domain: 'healthcare' },
        { label: 'Census demographics', route: '/census#population', domain: 'census' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'environment', sectionId: 'water' },
    { domain: 'census', sectionId: 'population' },
    { domain: 'healthcare', sectionId: 'infrastructure' },
    { domain: 'healthcare', sectionId: 'disease' },
  ],

  ctaLinks: [
    { label: 'Environment', route: '/environment', domain: 'environment', description: 'Water stress, groundwater, and pollution data' },
    { label: 'Healthcare', route: '/healthcare', domain: 'healthcare', description: 'Infrastructure and health outcomes' },
  ],
};
