import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--blue)',
  'Enrollment Indicators': 'var(--blue)',
  'Quality Indicators': 'var(--blue-light)',
  'Spending Indicators': 'var(--blue)',
  'Data Vintage': 'var(--gold)',
  'Limitations': 'var(--saffron)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Education data draws from three tiers of authoritative sources, combining automated World Bank feeds with curated government survey data:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--blue)' }} />
            <span>
              <strong style={{ color: 'var(--blue)' }}>Tier 1 — World Bank Open Data</strong> (national, 2000–2024, automated).{' '}
              <a
                href="https://data.worldbank.org/country/india"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--blue)' }}
              >
                data.worldbank.org
              </a>{' '}
              — 14 education indicators covering enrollment ratios (primary, secondary, tertiary), pupil-teacher ratios, government spending, completion rates, and out-of-school children. Auto-refreshed quarterly via GitHub Actions.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--blue)' }} />
            <span>
              <strong style={{ color: 'var(--blue)' }}>Tier 2 — UDISE+ 2023-24</strong> (state-level, curated).{' '}
              <a
                href="https://udiseplus.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--blue)' }}
              >
                udiseplus.gov.in
              </a>{' '}
              — The Unified District Information System for Education Plus is India's comprehensive school database. Covers 1.47 million schools across all states. Provides state-level enrollment by level, dropout rates, pupil-teacher ratios, and infrastructure metrics (computer access, internet, toilets).
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--blue)' }} />
            <span>
              <strong style={{ color: 'var(--blue)' }}>Tier 2 — ASER 2024</strong> (state-level, curated).{' '}
              <a
                href="https://asercentre.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--blue)' }}
              >
                asercentre.org
              </a>{' '}
              — The Annual Status of Education Report is India's largest citizen-led household survey of children's learning levels. Tests foundational reading and arithmetic skills in rural India. Provides state-level data on reading ability, arithmetic ability, and English reading.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Enrollment Indicators',
    content: (
      <>
        <p>
          Enrollment data combines World Bank national time series with UDISE+ state-level breakdowns:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Vintage</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">GER Primary (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">GER Secondary (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">GER Tertiary (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">State GER (Primary/Secondary)</td><td className="py-2 pr-4 text-xs">UDISE+</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Dropout Rate (Primary/Secondary)</td><td className="py-2 pr-4 text-xs">UDISE+</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2">%</td></tr>
              <tr><td className="py-2 pr-4">Primary Completion Rate</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>GER vs NER:</strong> Gross Enrollment Ratio (GER) counts all enrolled students regardless of age, divided by the official age-group population. This means GER can exceed 100% when over-age or under-age students are enrolled. Net Enrollment Ratio (NER) counts only students of the official age group, and is always ≤ 100%.
        </p>
      </>
    ),
  },
  {
    title: 'Quality Indicators',
    content: (
      <>
        <p>
          Quality data blends ASER learning outcome assessments with UDISE+ infrastructure metrics and World Bank pupil-teacher ratios:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Vintage</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">PTR Primary (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">students/teacher</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">PTR Secondary (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">students/teacher</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">State PTR</td><td className="py-2 pr-4 text-xs">UDISE+</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2">students/teacher</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Can Read Std II Text (Std III)</td><td className="py-2 pr-4 text-xs">ASER 2024</td><td className="py-2 pr-4 text-xs">2024</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Can Do Subtraction (Std III)</td><td className="py-2 pr-4 text-xs">ASER 2024</td><td className="py-2 pr-4 text-xs">2024</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Schools with Computers</td><td className="py-2 pr-4 text-xs">UDISE+</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2">%</td></tr>
              <tr><td className="py-2 pr-4">Schools with Internet</td><td className="py-2 pr-4 text-xs">UDISE+</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          ASER tests children at home, not in schools, which captures out-of-school children too. The test uses curriculum-calibrated tools: Std II reading means the child can read a short paragraph from a Std II textbook fluently.
        </p>
      </>
    ),
  },
  {
    title: 'Spending Indicators',
    content: (
      <>
        <p>
          Education spending data comes from World Bank national time series:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Vintage</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Education Expenditure (% GDP)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">% of GDP</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Education Expenditure (% Govt)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">% of govt spending</td></tr>
              <tr><td className="py-2 pr-4">Out-of-School Children (primary)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2">number</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          The NEP 2020 (National Education Policy) sets a target of 6% of GDP for education spending. India currently spends approximately 4.1%, placing it close to the global average of 4.3% but still below OECD averages of 5-6%. The spending series includes both central and state government expenditure on education.
        </p>
      </>
    ),
  },
  {
    title: 'Data Vintage',
    content: (
      <>
        <p>
          Education data in India comes from multiple sources with different update cycles. Here is the vintage of each source used:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Data Year</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Level</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Refresh Cycle</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">World Bank API</td><td className="py-2 pr-4 text-xs">2000–2023</td><td className="py-2 pr-4 text-xs">National</td><td className="py-2">Quarterly (automated)</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">UDISE+ 2023-24</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Annual (manual)</td></tr>
              <tr><td className="py-2 pr-4">ASER 2024</td><td className="py-2 pr-4 text-xs">2024</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Annual (manual)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          World Bank education data typically has a 1-2 year lag. UDISE+ publishes the report card each September for the previous academic year. ASER publishes results in January following the survey year. Each chart and indicator explicitly notes its data source.
        </p>
      </>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>GER can exceed 100%.</strong> Gross Enrollment Ratio includes over-age and under-age students. A GER of 110% at primary level means there are more enrolled students than the official primary-age population, due to late entries, repeaters, or early enrollees.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>ASER covers rural India only.</strong> The Annual Status of Education Report surveys rural households. Urban learning outcomes are not captured. Since urban schools generally perform better, ASER figures may underestimate national averages. ASER 2023 included an urban module for the first time, but state-level urban data is limited.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>UDISE+ is self-reported by schools.</strong> Schools submit their own data to UDISE+. While cross-checks exist, there are known issues with inflation of enrollment numbers and underreporting of dropout rates, particularly in states where school funding is tied to enrollment counts.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>State boundaries vary across surveys.</strong> Some datasets report Telangana separately (post-2014), while older World Bank data uses combined Andhra Pradesh figures. J&K data may be reported as a single unit or split into J&K and Ladakh depending on the source year.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Spending data is aggregate.</strong> Education expenditure includes all levels (primary through tertiary) and both central and state government spending. It does not break down private household spending on education, which in India is substantial (estimated 2-3% of GDP additionally).
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>World Bank data has gaps.</strong> Not all indicators have continuous annual data. Some series (tertiary enrollment, spending) have intermittent reporting years. Time series charts may show interpolated or discontinuous segments where data is sparse.
            </span>
          </li>
        </ul>
      </>
    ),
  },
];

function MethodologySection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });
  const accent = SECTION_COLORS[section.title] || 'var(--blue)';

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl p-6 md:p-8"
      style={{
        background: 'var(--bg-raised)',
        border: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <SectionNumber number={index + 1} isVisible={isVisible} />
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: accent }}
        />
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {section.title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {section.content}
      </div>
    </motion.section>
  );
}

export default function EducationMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Education — Indian Data Project"
        description="Data sources, indicator definitions, vintage transparency, and limitations for education data. UDISE+ 2023-24, ASER 2024, World Bank."
        path="/education/methodology"
        image="/og-education.png"
      />

      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-4 md:pt-14 md:pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: 'var(--blue)' }}
        >
          Education
        </p>
        <h1
          className="text-composition font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Methodology
        </h1>
        <p
          className="text-base max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          How we source, validate, and present education data across three tiers of government and independent survey sources. Every number traces to an authoritative publication.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-4">
        {SECTIONS.map((section, i) => (
          <MethodologySection key={section.title} section={section} index={i} />
        ))}

        <p
          className="text-xs text-center pt-4"
          style={{ color: 'var(--text-muted)' }}
        >
          Questions about methodology? Check the source links above or open an issue on{' '}
          <a
            href="https://github.com/ronit111/indian-data-project"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover"
            style={{ color: 'var(--blue)' }}
          >
            GitHub
          </a>.
        </p>
      </div>
    </motion.div>
  );
}
