import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { ElectionsSummary, TurnoutData, BudgetSummary } from '../data/schema.ts';

const elecSummary = (bag: TopicDataBag) => bag['elections/summary'] as ElectionsSummary | undefined;
const turnout = (bag: TopicDataBag) => bag['elections/turnout'] as TurnoutData | undefined;
const budgetSummary = (bag: TopicDataBag) => bag['budget/summary'] as BudgetSummary | undefined;

export const democraticHealth: TopicDef = {
  id: 'democratic-health',
  title: "India's Democratic Health",
  subtitle: 'Turnout has risen for 70 years. But nearly half of elected MPs face criminal charges, and parliament routinely underspends health and education budgets.',
  accent: '#818CF8',
  contributingDomains: ['elections', 'census', 'education', 'crime', 'budget'],
  requiredData: [
    'elections/summary', 'elections/turnout', 'elections/candidates',
    'census/summary', 'education/summary',
    'budget/summary', 'budget/budget-vs-actual',
  ],
  summaryData: ['elections/summary', 'census/summary', 'budget/summary'],

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

  narrativeBridge: 'India\'s elections are the world\'s largest logistical exercise. Turnout has climbed from 48% in 1957 to 66% in 2024. But democratic health is not just about showing up — it is about who gets elected, what they do with power, and whether the parliament they form spends public money where citizens need it most.',

  sections: [
    {
      id: 'participation-arc',
      sectionNumber: 1,
      title: 'The Participation Arc',
      annotation: 'Voter turnout has steadily increased over 7 decades, from 48% in 1957 to a peak of 67.4% in 2019. The 2024 election saw 65.8% turnout across 96.88 crore electors.',
      domains: ['elections'],
      sources: ['Election Commission of India'],
      charts: [{
        chartType: 'area', chartTitle: 'Lok Sabha Turnout (1957-2024)', unit: '%', accent: '#818CF8',
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
      annotation: 'Nearly half of elected MPs in 2024 face criminal charges. The average MP\'s declared assets are ₹46 crore. Women hold only 13.6% of seats, despite the 33% reservation bill. Literacy and education of the electorate haven\'t kept pace with democratic ambition.',
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
    {
      id: 'accountability-gap',
      sectionNumber: 3,
      title: 'The Accountability Gap',
      annotation: 'Democracy produces a parliament — but parliament then controls the budget. The accountability loop closes (or breaks) when we ask: does the elected body spend public money where citizens need it? Budget-vs-actual data shows whether health, education, and social spending reaches its targets.',
      domains: ['budget', 'elections'],
      sources: ['Union Budget', 'Controller General of Accounts'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Parliament & the Public Purse',
        extractData: (bag) => {
          const b = budgetSummary(bag);
          const e = elecSummary(bag);
          if (!b && !e) return null;
          return [
            { label: 'MPs with Criminal Cases', value: e ? `${e.criminalPct}%` : '—', accent: '#EF4444' },
            { label: 'Women MPs', value: e ? `${e.womenMPsPct2024}%` : '—', accent: '#F43F5E' },
            { label: 'Govt Spending / Citizen / Day', value: b ? `₹${Math.round(b.perCapitaDailyExpenditure)}` : '—', accent: '#818CF8' },
            { label: 'Fiscal Deficit % GDP', value: b ? `${b.fiscalDeficitPercentGDP}%` : '—', accent: '#FF6B35' },
          ];
        },
      }],
      deepLinks: [
        { label: 'Budget vs actual', route: '/budget#budget-vs-actual', domain: 'budget' },
        { label: 'Parliament composition', route: '/elections#candidates', domain: 'elections' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'elections', sectionId: 'turnout' },
    { domain: 'elections', sectionId: 'candidates' },
    { domain: 'elections', sectionId: 'representation' },
    { domain: 'census', sectionId: 'literacy' },
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'budget', sectionId: 'expenditure' },
    { domain: 'budget', sectionId: 'budget-vs-actual' },
  ],

  ctaLinks: [
    { label: 'Elections', route: '/elections', domain: 'elections', description: 'Turnout, party landscape, candidates, and representation' },
    { label: 'Union Budget', route: '/budget', domain: 'budget', description: 'Where parliament sends public money' },
    { label: 'Census', route: '/census', domain: 'census', description: 'Literacy, education, and demographics' },
  ],
};
