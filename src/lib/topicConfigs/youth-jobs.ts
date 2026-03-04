import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type { EmploymentSummary, UnemploymentData, SectoralData } from '../data/schema.ts';

const empSummary = (bag: TopicDataBag) => bag['employment/summary'] as EmploymentSummary | undefined;
const unemployment = (bag: TopicDataBag) => bag['employment/unemployment'] as UnemploymentData | undefined;
const sectoral = (bag: TopicDataBag) => bag['employment/sectoral'] as SectoralData | undefined;

export const youthJobs: TopicDef = {
  id: 'youth-jobs',
  title: 'Youth & Jobs',
  subtitle: 'India\'s demographic dividend is a ticking clock — 65% of the population is under 35. Are there enough jobs?',
  accent: '#F59E0B',
  contributingDomains: ['employment', 'education', 'census', 'economy'],
  requiredData: [
    'employment/summary', 'employment/unemployment', 'employment/sectoral',
    'education/summary', 'census/summary', 'economy/summary',
  ],
  summaryData: ['employment/summary', 'education/summary', 'census/summary'],

  heroStat: {
    value: (bag) => {
      const e = empSummary(bag);
      return e ? `${e.youthUnemployment}%` : '—';
    },
    label: 'Youth Unemployment Rate',
    context: 'Among 15-29 year olds — India\'s largest age cohort',
  },

  takeaways: [
    { value: (bag) => { const e = empSummary(bag); return e ? `${e.youthUnemployment}%` : '—'; }, label: 'Youth unemployment', sectionId: 'youth-challenge' },
    { value: (bag) => { const e = empSummary(bag); return e ? `${e.lfpr}%` : '—'; }, label: 'Overall LFPR', sectionId: 'participation' },
    { value: (bag) => { const e = empSummary(bag); return e ? `${e.selfEmployedPct}%` : '—'; }, label: 'Self-employed', sectionId: 'quality-of-work' },
    { value: (bag) => { const e = empSummary(bag); return e ? `${(e.workforceTotal).toFixed(0)} Cr` : '—'; }, label: 'Total workforce', sectionId: 'participation' },
  ],

  narrativeBridge: 'India adds 12 million working-age people every year. The "demographic dividend" is only a dividend if these young people find productive employment. Otherwise it becomes a demographic burden — educated, ambitious, and frustrated.',

  sections: [
    {
      id: 'youth-challenge',
      sectionNumber: 1,
      title: 'The Youth Challenge',
      annotation: 'Youth (15-29) unemployment is consistently 2-3x the national average. The more educated you are, the higher your unemployment rate — a painful paradox reflecting the skills-jobs mismatch.',
      domains: ['employment'],
      sources: ['PLFS (MoSPI)', 'World Bank'],
      charts: [{
        chartType: 'line', chartTitle: 'Unemployment: National vs Youth', unit: '%', accent: '#F59E0B',
        extractData: (bag) => {
          const d = unemployment(bag);
          if (!d) return null;
          const series = [];
          if (d.totalTimeSeries?.length >= 3) series.push({ name: 'National', color: '#F59E0B', data: d.totalTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) });
          if (d.youthTimeSeries?.length >= 3) series.push({ name: 'Youth (15-29)', color: '#F43F5E', data: d.youthTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) });
          return series.length > 0 ? series : null;
        },
      }],
      deepLinks: [{ label: 'Unemployment data', route: '/employment#unemployment', domain: 'employment' }],
    },
    {
      id: 'participation',
      sectionNumber: 2,
      title: 'Who\'s Working?',
      annotation: 'India\'s LFPR has improved to ~56%, but this masks a massive gender gap — male LFPR is ~78%, female is ~35%. Many who are "employed" are in agriculture or unpaid family work.',
      domains: ['employment', 'census'],
      sources: ['PLFS (MoSPI)'],
      charts: [{
        chartType: 'stat-row', chartTitle: 'Labour Force Snapshot',
        extractData: (bag) => {
          const e = empSummary(bag);
          if (!e) return null;
          return [
            { label: 'LFPR', value: `${e.lfpr}%`, accent: '#F59E0B' },
            { label: 'Female LFPR', value: `${e.femaleLfpr}%`, accent: '#F43F5E' },
            { label: 'Unemployment', value: `${e.unemploymentRate}%`, accent: '#EF4444' },
            { label: 'Self-Employed', value: `${e.selfEmployedPct}%`, accent: '#8B5CF6' },
          ];
        },
      }],
      deepLinks: [{ label: 'Participation data', route: '/employment#participation', domain: 'employment' }],
    },
    {
      id: 'quality-of-work',
      sectionNumber: 3,
      title: 'Quality of Work',
      annotation: 'Over half the workforce is self-employed, mostly in agriculture. Manufacturing\'s share has stagnated around 12%. The "good jobs" challenge is structural, not cyclical.',
      domains: ['employment', 'economy'],
      sources: ['PLFS', 'RBI KLEMS'],
      charts: [{
        chartType: 'area', chartTitle: 'Sectoral Employment Shifts', unit: '% of workforce', accent: '#3B82F6',
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
  ],

  crossLinks: [
    { domain: 'employment', sectionId: 'unemployment' },
    { domain: 'employment', sectionId: 'participation' },
    { domain: 'employment', sectionId: 'sectoral' },
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'census', sectionId: 'demographics' },
  ],

  ctaLinks: [
    { label: 'Employment', route: '/employment', domain: 'employment', description: 'Unemployment, LFPR, and sectoral shifts' },
    { label: 'Education', route: '/education', domain: 'education', description: 'Enrollment, quality, and the skills pipeline' },
  ],
};
