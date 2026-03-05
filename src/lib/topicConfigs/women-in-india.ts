import type { TopicDef, TopicDataBag } from '../topicConfig.ts';
import type {
  ElectionsSummary,
  EmploymentSummary,
  CensusSummary,
  RepresentationData,
  ParticipationData,
  EnrollmentData,
  LiteracyData,
  WomenSafetyData,
} from '../data/schema.ts';

// ─── Typed accessors ────────────────────────────────────────────────

const electionsSummary = (bag: TopicDataBag) =>
  bag['elections/summary'] as ElectionsSummary | undefined;

const employmentSummary = (bag: TopicDataBag) =>
  bag['employment/summary'] as EmploymentSummary | undefined;

const censusSummary = (bag: TopicDataBag) =>
  bag['census/summary'] as CensusSummary | undefined;

const representation = (bag: TopicDataBag) =>
  bag['elections/representation'] as RepresentationData | undefined;

const participation = (bag: TopicDataBag) =>
  bag['employment/participation'] as ParticipationData | undefined;

const enrollment = (bag: TopicDataBag) =>
  bag['education/enrollment'] as EnrollmentData | undefined;

const literacy = (bag: TopicDataBag) =>
  bag['census/literacy'] as LiteracyData | undefined;

const womenSafety = (bag: TopicDataBag) =>
  bag['crime/women-safety'] as WomenSafetyData | undefined;

// ─── Config ─────────────────────────────────────────────────────────

export const womenInIndia: TopicDef = {
  id: 'women-in-india',
  title: 'Women in India',
  subtitle:
    'From parliament to payrolls, classrooms to clinics — how is India doing on gender equity?',
  accent: '#F43F5E',
  contributingDomains: ['elections', 'employment', 'education', 'census', 'healthcare', 'crime'],
  requiredData: [
    'elections/summary',
    'elections/representation',
    'employment/summary',
    'employment/participation',
    'education/enrollment',
    'census/summary',
    'census/literacy',
    'census/health',
    'crime/women-safety',
  ],
  summaryData: [
    'elections/summary',
    'employment/summary',
    'census/summary',
  ],

  heroStat: {
    value: (bag) => {
      const e = electionsSummary(bag);
      return e ? `${e.womenMPsPct2024}%` : '—';
    },
    label: 'Women in Lok Sabha 2024',
    context: 'The highest-ever share of women MPs, yet far from the 33% reservation target',
  },

  takeaways: [
    {
      value: (bag) => {
        const e = electionsSummary(bag);
        return e ? `${e.womenMPs2024}` : '—';
      },
      label: 'Women MPs elected in 2024',
      sectionId: 'political-voice',
    },
    {
      value: (bag) => {
        const e = employmentSummary(bag);
        return e ? `${e.femaleLfpr}%` : '—';
      },
      label: 'Female Labour Force Participation',
      sectionId: 'economic-participation',
    },
    {
      value: (bag) => {
        const c = censusSummary(bag);
        return c ? `${c.sexRatio}` : '—';
      },
      label: 'Sex ratio (females per 1000 males)',
      sectionId: 'health-survival',
    },
    {
      value: (bag) => {
        const l = literacy(bag);
        if (!l?.femaleTimeSeries?.length) return '—';
        const latest = l.femaleTimeSeries[l.femaleTimeSeries.length - 1];
        return `${latest.value.toFixed(1)}%`;
      },
      label: 'Female literacy rate',
      sectionId: 'education-gap',
    },
  ],

  narrativeBridge:
    'India passed the Women\'s Reservation Bill in 2023, promising 33% seats in Parliament. But representation is just one dimension. This topic traces women\'s progress across five domains — political power, economic participation, education, health, and demographics — to ask: how far has India actually come?',

  sections: [
    // ── Section 1: Political voice ────────────────────────────────
    {
      id: 'political-voice',
      sectionNumber: 1,
      title: 'Political Voice',
      annotation:
        'Women\'s representation in Lok Sabha has crawled from 4.4% in 1952 to 13.6% in 2024. At this pace, parity is over a century away — unless the 33% reservation changes the math.',
      domains: ['elections'],
      sources: ['Election Commission of India', 'Lok Sabha Secretariat'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'Women MPs in Lok Sabha (1952-2024)',
          unit: '%',
          accent: '#F43F5E',
          extractData: (bag) => {
            const d = representation(bag);
            if (!d?.trend?.length) return null;
            return [
              {
                name: 'Women MPs',
                color: '#F43F5E',
                data: d.trend.map((p) => ({
                  label: String(p.year),
                  value: p.pct,
                })),
              },
            ];
          },
        },
      ],
      deepLinks: [
        { label: 'Explore elections data', route: '/elections#representation', domain: 'elections' },
      ],
    },

    // ── Section 2: Economic participation ─────────────────────────
    {
      id: 'economic-participation',
      sectionNumber: 2,
      title: 'Economic Participation',
      annotation:
        'India\'s female LFPR hovered around 20-25% for years — one of the lowest globally. Recent PLFS data shows a recovery to ~35%, but the gap with men (~78%) remains stark. More women are working, but mostly in agriculture and self-employment.',
      domains: ['employment'],
      sources: ['PLFS (MoSPI)', 'World Bank'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'Labour Force Participation: Male vs Female',
          unit: '%',
          accent: '#F59E0B',
          extractData: (bag) => {
            const d = participation(bag);
            if (!d) return null;
            const MIN_POINTS = 3;
            const series = [
              {
                name: 'Male LFPR',
                color: '#60A5FA',
                data: (d.lfprMaleTimeSeries ?? []).map((p) => ({
                  label: p.year,
                  value: p.value,
                })),
              },
              {
                name: 'Female LFPR',
                color: '#F43F5E',
                data: (d.lfprFemaleTimeSeries ?? []).map((p) => ({
                  label: p.year,
                  value: p.value,
                })),
              },
            ];
            return series.filter((s) => s.data.length >= MIN_POINTS);
          },
        },
      ],
      deepLinks: [
        { label: 'Explore employment data', route: '/employment#participation', domain: 'employment' },
      ],
    },

    // ── Section 3: Education + Health ─────────────────────────────
    {
      id: 'education-gap',
      sectionNumber: 3,
      title: 'Education & Health',
      annotation:
        'The literacy gender gap has shrunk from 25 percentage points in 1991 to ~14 percentage points today, and girls now outnumber boys in secondary enrollment in many states. But maternal mortality (103 per lakh) and child marriage rates remind us that progress is uneven.',
      domains: ['education', 'census', 'healthcare'],
      sources: ['Census of India', 'UDISE+', 'NFHS-5', 'World Bank'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'Literacy Rate: Male vs Female',
          unit: '%',
          accent: '#3B82F6',
          extractData: (bag) => {
            const d = literacy(bag);
            if (!d) return null;
            const MIN_POINTS = 3;
            const series = [
              {
                name: 'Male Literacy',
                color: '#60A5FA',
                data: (d.maleTimeSeries ?? []).map((p) => ({
                  label: p.year,
                  value: p.value,
                })),
              },
              {
                name: 'Female Literacy',
                color: '#F43F5E',
                data: (d.femaleTimeSeries ?? []).map((p) => ({
                  label: p.year,
                  value: p.value,
                })),
              },
            ];
            return series.filter((s) => s.data.length >= MIN_POINTS);
          },
        },
        {
          chartType: 'line',
          chartTitle: 'Girls in Secondary Education (GER)',
          unit: '%',
          accent: '#8B5CF6',
          extractData: (bag) => {
            const d = enrollment(bag);
            if (!d?.femaleSecondary?.length || d.femaleSecondary.length < 3) return null;
            return [
              {
                name: 'Female Secondary GER',
                color: '#F43F5E',
                data: d.femaleSecondary.map((p) => ({
                  label: p.year,
                  value: p.value,
                })),
              },
              ...(d.maleSecondary && d.maleSecondary.length >= 3
                ? [
                    {
                      name: 'Male Secondary GER',
                      color: '#60A5FA',
                      data: d.maleSecondary.map((p) => ({
                        label: p.year,
                        value: p.value,
                      })),
                    },
                  ]
                : []),
            ];
          },
        },
      ],
      deepLinks: [
        { label: 'Explore education data', route: '/education#enrollment', domain: 'education' },
        { label: 'Explore health data', route: '/census#health', domain: 'census' },
      ],
    },

    // ── Section 4: Safety & Violence ────────────────────────────────
    {
      id: 'safety-violence',
      sectionNumber: 4,
      title: 'Safety & Violence',
      annotation:
        '4.45 lakh crimes against women were registered in 2022 — cruelty by husband, kidnapping, and assault lead the categories. The reported number is widely believed to be a fraction of the actual incidence due to stigma and institutional barriers to filing complaints.',
      domains: ['crime'],
      sources: ['NCRB "Crime in India" 2022'],
      charts: [
        {
          chartType: 'line',
          chartTitle: 'Crimes Against Women: National Trend',
          unit: 'cases',
          accent: '#DC2626',
          extractData: (bag) => {
            const d = womenSafety(bag);
            if (!d?.nationalTrend?.length || d.nationalTrend.length < 3) return null;
            return [
              {
                name: 'Total Cases',
                color: '#DC2626',
                data: d.nationalTrend.map((p) => ({
                  label: p.year,
                  value: p.total,
                })),
              },
            ];
          },
        },
        {
          chartType: 'horizontal-bar',
          chartTitle: 'Crime Types Against Women (2022)',
          unit: '%',
          accent: '#DC2626',
          extractData: (bag) => {
            const d = womenSafety(bag);
            if (!d?.crimeTypes?.length) return null;
            return d.crimeTypes
              .sort((a, b) => b.pct - a.pct)
              .map((t) => ({
                name: t.name,
                value: t.pct,
              }));
          },
        },
      ],
      deepLinks: [
        { label: 'Explore crime data', route: '/crime#women-safety', domain: 'crime' },
      ],
    },
  ],

  crossLinks: [
    { domain: 'elections', sectionId: 'representation' },
    { domain: 'employment', sectionId: 'participation' },
    { domain: 'education', sectionId: 'enrollment' },
    { domain: 'census', sectionId: 'literacy' },
    { domain: 'census', sectionId: 'health' },
    { domain: 'healthcare', sectionId: 'disease' },
    { domain: 'crime', sectionId: 'women-safety' },
  ],

  ctaLinks: [
    {
      label: 'Elections',
      route: '/elections',
      domain: 'elections',
      description: 'Women\'s representation trend from 1952 to 2024',
    },
    {
      label: 'Employment',
      route: '/employment',
      domain: 'employment',
      description: 'Female LFPR recovery and sectoral breakdown',
    },
    {
      label: 'Education',
      route: '/education',
      domain: 'education',
      description: 'Gender enrollment and dropout data',
    },
    {
      label: 'Crime & Safety',
      route: '/crime',
      domain: 'crime',
      description: 'Crimes against women — 4.45 lakh cases in 2022',
    },
  ],
};
