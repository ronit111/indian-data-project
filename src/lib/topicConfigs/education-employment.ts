import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type {
  EducationSummary,
  EmploymentSummary,
  EnrollmentData,
  UnemploymentData,
  SpendingData,
} from '../data/schema.ts';

const eduSummary = (bag: TopicDataBag) => bag['education/summary'] as EducationSummary | undefined;
const empSummary = (bag: TopicDataBag) => bag['employment/summary'] as EmploymentSummary | undefined;
const enrollment = (bag: TopicDataBag) => bag['education/enrollment'] as EnrollmentData | undefined;
const unemployment = (bag: TopicDataBag) => bag['employment/unemployment'] as UnemploymentData | undefined;
const spending = (bag: TopicDataBag) => bag['education/spending'] as SpendingData | undefined;

export const educationEmployment: TopicDef = {
  id: 'education-employment',
  title: 'Education → Employment Pipeline',
  subtitle: 'India produces millions of graduates each year — but are they getting jobs?',
  accent: '#3B82F6',
  contributingDomains: ['education', 'employment', 'census', 'budget'],
  requiredData: [
    'education/summary', 'education/enrollment', 'education/spending',
    'employment/summary', 'employment/unemployment',
    'census/summary', 'budget/summary',
  ],
  summaryData: ['education/summary', 'employment/summary', 'census/summary'],

  heroStat: {
    value: (bag) => {
      const e = empSummary(bag);
      return e ? `${e.youthUnemployment}%` : '—';
    },
    label: 'Youth Unemployment Rate',
    context: 'Among 15-29 year olds — the cohort most recently out of education',
  },

  takeaways: [
    { value: (bag) => { const e = eduSummary(bag); return e ? `${(e.totalStudents / 1e6).toFixed(0)}M` : '—'; }, label: 'Students enrolled', sectionId: 'enrollment-scale' },
    { value: (bag) => { const e = empSummary(bag); return e ? `${e.youthUnemployment}%` : '—'; }, label: 'Youth unemployment', sectionId: 'jobs-gap' },
    { value: (bag) => { const e = eduSummary(bag); return e ? `${e.educationSpendGDP}%` : '—'; }, label: 'Education spend (% GDP)', sectionId: 'investment' },
    { value: (bag) => { const e = empSummary(bag); return e ? `${e.selfEmployedPct}%` : '—'; }, label: 'Self-employed workers', sectionId: 'jobs-gap' },
  ],

  narrativeBridge: 'India has near-universal primary enrollment and rapidly growing higher education. Yet youth unemployment remains high, and most new workers end up self-employed or in the informal sector. The pipeline from classroom to career has leaks at every stage.',

  sections: [
    {
      id: 'enrollment-scale',
      sectionNumber: 1,
      title: 'The Enrollment Story',
      annotation: 'India enrolls 248 million students — more than most countries\' total population. Primary enrollment is near universal, but secondary and higher education still lose millions to dropouts.',
      domains: ['education'],
      sources: ['UDISE+ 2023-24', 'World Bank'],
      charts: [{
        chartType: 'line', chartTitle: 'Gross Enrollment Ratio — Secondary', unit: '%', accent: '#3B82F6',
        extractData: (bag) => {
          const d = enrollment(bag);
          if (!d?.secondaryTimeSeries?.length || d.secondaryTimeSeries.length < 3) return null;
          return [{ name: 'Secondary GER', color: '#3B82F6', data: d.secondaryTimeSeries.map(p => ({ label: p.year, value: p.value })) }];
        },
      }],
      deepLinks: [{ label: 'Explore education data', route: '/education#enrollment', domain: 'education' }],
    },
    {
      id: 'jobs-gap',
      sectionNumber: 2,
      title: 'The Jobs Gap',
      annotation: 'Youth unemployment is persistently higher than the national average. A degree doesn\'t guarantee a job — especially when most employment growth is in agriculture and self-employment.',
      domains: ['employment'],
      sources: ['PLFS (MoSPI)', 'World Bank'],
      charts: [{
        chartType: 'line', chartTitle: 'Unemployment Rate', unit: '%', accent: '#F59E0B',
        extractData: (bag) => {
          const d = unemployment(bag);
          if (!d) return null;
          const series = [];
          if (d.totalTimeSeries?.length >= 3) series.push({ name: 'National', color: '#F59E0B', data: d.totalTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) });
          if (d.youthTimeSeries?.length >= 3) series.push({ name: 'Youth (15-29)', color: '#F43F5E', data: d.youthTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) });
          return series.length > 0 ? series : null;
        },
      }],
      deepLinks: [{ label: 'Explore employment data', route: '/employment#unemployment', domain: 'employment' }],
    },
    {
      id: 'investment',
      sectionNumber: 3,
      title: 'The Investment Question',
      annotation: 'India spends ~4.1% of GDP on education. The NEP 2020 targets 6%. The gap isn\'t just about money — it\'s about whether spending improves learning outcomes and employability.',
      domains: ['education', 'budget'],
      sources: ['UDISE+', 'Union Budget'],
      charts: [{
        chartType: 'line', chartTitle: 'Education Spending (% of GDP)', unit: '%', accent: '#8B5CF6',
        extractData: (bag) => {
          const d = spending(bag);
          if (!d?.spendGDPTimeSeries?.length || d.spendGDPTimeSeries.length < 3) return null;
          return [{ name: 'Govt Education Spend', color: '#8B5CF6', data: d.spendGDPTimeSeries.map((p: { year: string; value: number }) => ({ label: p.year, value: p.value })) }];
        },
      }],
      deepLinks: [
        { label: 'Education spending data', route: '/education#spending', domain: 'education' },
        { label: 'Budget allocation', route: '/budget#spending', domain: 'budget' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'education', sectionId: 'spending' },
    { domain: 'employment', sectionId: 'unemployment' },
    { domain: 'employment', sectionId: 'sectoral' },
    { domain: 'census', sectionId: 'literacy' },
  ],

  ctaLinks: [
    { label: 'Education', route: '/education', domain: 'education', description: 'Enrollment, quality, and spending data' },
    { label: 'Employment', route: '/employment', domain: 'employment', description: 'Unemployment, LFPR, and sectoral shifts' },
  ],
};
