import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { EnvironmentSummary, EnergyData, ForestData } from '../data/schema.ts';

const envSummary = (bag: TopicDataBag) => bag['environment/summary'] as EnvironmentSummary | undefined;
const energy = (bag: TopicDataBag) => bag['environment/energy'] as EnergyData | undefined;
const forest = (bag: TopicDataBag) => bag['environment/forest'] as ForestData | undefined;

export const climateEnergy: TopicDef = {
  id: 'climate-energy',
  title: 'Climate & Energy Transition',
  subtitle: 'India is the 3rd largest emitter but has the lowest per capita footprint among major economies. Can growth and green coexist?',
  accent: '#14B8A6',
  contributingDomains: ['environment', 'economy', 'budget'],
  requiredData: [
    'environment/summary', 'environment/energy', 'environment/forest',
    'economy/summary', 'budget/summary',
  ],
  summaryData: ['environment/summary', 'economy/summary'],

  heroStat: {
    value: (bag) => {
      const e = envSummary(bag);
      return e ? `${e.renewablesPct}%` : '—';
    },
    label: 'Renewable Energy Share',
    context: 'Share of installed electricity capacity from renewables (solar, wind, hydro)',
  },

  takeaways: [
    { value: (bag) => { const e = envSummary(bag); return e ? `${e.renewablesPct}%` : '—'; }, label: 'Renewable share', sectionId: 'energy-mix' },
    { value: (bag) => { const e = envSummary(bag); return e ? `${e.co2PerCapita} t` : '—'; }, label: 'CO₂ per capita', sectionId: 'carbon-footprint' },
    { value: (bag) => { const e = envSummary(bag); return e ? `${e.forestPct}%` : '—'; }, label: 'Forest cover', sectionId: 'green-cover' },
    { value: (bag) => { const e = envSummary(bag); return e ? `${e.coalPct}%` : '—'; }, label: 'Coal dependence', sectionId: 'energy-mix' },
  ],

  narrativeBridge: 'India committed to net-zero by 2070 and 500 GW non-fossil capacity by 2030. Solar capacity has grown 30x in a decade, but coal still generates over 70% of electricity. The transition is real but the timeline is tight.',

  sections: [
    {
      id: 'energy-mix',
      sectionNumber: 1,
      title: 'The Energy Mix',
      annotation: 'Renewables (including hydro) now exceed 43% of installed capacity. But capacity ≠ generation — coal plants run at higher utilization, so coal still dominates actual electricity output.',
      domains: ['environment'],
      sources: ['CEA', 'World Bank'],
      charts: [{
        chartType: 'area', chartTitle: 'Renewable Energy Capacity Growth', unit: '% of total', accent: '#14B8A6',
        extractData: (bag) => {
          const d = energy(bag);
          if (!d?.renewablesPctTimeSeries?.length || d.renewablesPctTimeSeries.length < 3) return null;
          return [{ name: 'Renewable Share', color: '#14B8A6', data: d.renewablesPctTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) }];
        },
      }],
      deepLinks: [{ label: 'Energy transition data', route: '/environment#energy', domain: 'environment' }],
    },
    {
      id: 'carbon-footprint',
      sectionNumber: 2,
      title: 'Carbon Footprint',
      annotation: 'India\'s per capita emissions (~1.9 tonnes) are a fraction of the US (14t) or China (8t). But total emissions are rising with industrialization — making the per capita argument harder to sustain over time.',
      domains: ['environment', 'economy'],
      sources: ['World Bank', 'Climate Watch'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Emissions Snapshot',
        extractData: (bag) => {
          const e = envSummary(bag);
          if (!e) return null;
          return [
            { label: 'CO₂ Per Capita', value: `${e.co2PerCapita} t`, accent: '#14B8A6' },
            { label: 'Total GHG', value: `${e.ghgTotal} Mt`, accent: '#F59E0B' },
            { label: 'PM2.5', value: `${e.pm25} µg/m³`, accent: '#F43F5E' },
            { label: 'Forest Cover', value: `${e.forestPct}%`, accent: '#22C55E' },
          ];
        },
      }],
      deepLinks: [{ label: 'Carbon footprint data', route: '/environment#carbon', domain: 'environment' }],
    },
    {
      id: 'green-cover',
      sectionNumber: 3,
      title: 'Forest & Green Cover',
      annotation: 'India\'s forest cover is ~25% of geographic area — the target is 33%. Northeast states lead with 70%+ cover, while western and central India lag below 15%.',
      domains: ['environment'],
      sources: ['ISFR 2023 (FSI)'],
      charts: [{
        chartType: 'horizontal-bar', chartTitle: 'Forest Cover by State (Top 10)', unit: '% area', accent: '#22C55E',
        extractData: (bag) => {
          const d = forest(bag);
          if (!d?.stateForestCover?.length) return null;
          const sorted = [...d.stateForestCover].sort((a, b) => b.pctGeographicArea - a.pctGeographicArea).slice(0, 10);
          return sorted.map(s => ({ name: s.name, value: s.pctGeographicArea }));
        },
      }],
      deepLinks: [{ label: 'Forest cover data', route: '/environment#forest', domain: 'environment' }],
    },
  ],

  crossLinks: [
    { domain: 'environment', sectionId: 'energy' },
    { domain: 'environment', sectionId: 'carbon' },
    { domain: 'environment', sectionId: 'forest' },
    { domain: 'economy', sectionId: 'growth' },
    { domain: 'budget', sectionId: 'spending' },
  ],

  ctaLinks: [
    { label: 'Environment', route: '/environment', domain: 'environment', description: 'Air quality, forest cover, energy, water' },
    { label: 'Economic Survey', route: '/economy', domain: 'economy', description: 'Growth, inflation, and the macro picture' },
  ],
};
