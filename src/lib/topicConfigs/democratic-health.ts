import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { ElectionsSummary, TurnoutData } from '../data/schema.ts';

const elecSummary = (bag: TopicDataBag) => bag['elections/summary'] as ElectionsSummary | undefined;
const turnout = (bag: TopicDataBag) => bag['elections/turnout'] as TurnoutData | undefined;

export const democraticHealth: TopicDef = {
  id: 'democratic-health',
  title: "India's Democratic Health",
  subtitle: 'The world\'s largest democracy elected 543 MPs in 2024. How healthy is the process?',
  accent: '#818CF8',
  contributingDomains: ['elections', 'census', 'education'],
  requiredData: [
    'elections/summary', 'elections/turnout', 'elections/candidates',
    'census/summary', 'education/summary',
  ],
  summaryData: ['elections/summary', 'census/summary'],

  heroStat: {
    value: (bag) => {
      const e = elecSummary(bag);
      return e ? `${e.turnout2024}%` : '—';
    },
    label: 'Voter Turnout 2024',
    context: '96.88 crore electors were eligible to vote in the 2024 Lok Sabha elections',
  },

  takeaways: [
    { value: (bag) => { const e = elecSummary(bag); return e ? `${e.turnout2024}%` : '—'; }, label: 'Turnout 2024', sectionId: 'participation-arc' },
    { value: (bag) => { const e = elecSummary(bag); return e ? `${e.criminalPct}%` : '—'; }, label: 'MPs with criminal cases', sectionId: 'quality-representation' },
    { value: (bag) => { const e = elecSummary(bag); return e ? `${e.womenMPsPct2024}%` : '—'; }, label: 'Women MPs', sectionId: 'quality-representation' },
    { value: (bag) => { const e = elecSummary(bag); return e ? `₹${e.avgAssetsCrore} Cr` : '—'; }, label: 'Avg MP assets', sectionId: 'quality-representation' },
  ],

  narrativeBridge: 'India\'s elections are the world\'s largest logistical exercise. Turnout has climbed from 46% in 1952 to 66% in 2024. But democratic health isn\'t just about showing up — it\'s about who gets elected, how much money flows through campaigns, and whether every citizen\'s vote carries equal weight.',

  sections: [
    {
      id: 'participation-arc',
      sectionNumber: 1,
      title: 'The Participation Arc',
      annotation: 'Voter turnout has steadily increased over 7 decades, from 46% in 1952 to a peak of 67% in 2014. The 2024 election saw 65.8% turnout across 96.88 crore electors.',
      domains: ['elections'],
      sources: ['Election Commission of India'],
      charts: [{
        chartType: 'area', chartTitle: 'Lok Sabha Turnout (1952-2024)', unit: '%', accent: '#818CF8',
        extractData: (bag) => {
          const d = turnout(bag);
          if (!d?.nationalTrend?.length || d.nationalTrend.length < 3) return null;
          return [{ name: 'Turnout', color: '#818CF8', data: d.nationalTrend.map((p) => ({ label: p.year, value: p.turnout })) }];
        },
      }],
      deepLinks: [{ label: 'Turnout data', route: '/elections#turnout', domain: 'elections' }],
    },
    {
      id: 'quality-representation',
      sectionNumber: 2,
      title: 'Quality of Representation',
      annotation: 'Nearly half of elected MPs in 2024 face criminal charges. The average MP\'s declared assets are ₹70+ crore. Women hold only 13.6% of seats, despite the 33% reservation bill. Literacy and education of the electorate haven\'t kept pace with democratic ambition.',
      domains: ['elections', 'census'],
      sources: ['ADR / MyNeta', 'ECI', 'Census 2011'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Lok Sabha 2024 Profile',
        extractData: (bag) => {
          const e = elecSummary(bag);
          if (!e) return null;
          return [
            { label: 'Criminal Cases', value: `${e.criminalPct}%`, accent: '#EF4444' },
            { label: 'Serious Criminal', value: `${e.seriousCriminalPct}%`, accent: '#F97316' },
            { label: 'Women MPs', value: `${e.womenMPsPct2024}%`, accent: '#F43F5E' },
            { label: 'Avg Assets', value: `₹${e.avgAssetsCrore} Cr`, accent: '#FFC857' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Candidates data', route: '/elections#candidates', domain: 'elections' },
        { label: 'Women representation', route: '/elections#representation', domain: 'elections' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'elections', sectionId: 'turnout' },
    { domain: 'elections', sectionId: 'candidates' },
    { domain: 'elections', sectionId: 'representation' },
    { domain: 'census', sectionId: 'literacy' },
    { domain: 'education', sectionId: 'enrollment' },
  ],

  ctaLinks: [
    { label: 'Elections', route: '/elections', domain: 'elections', description: 'Turnout, party landscape, candidates, and representation' },
    { label: 'Census', route: '/census', domain: 'census', description: 'Literacy, education, and demographics' },
  ],
};
