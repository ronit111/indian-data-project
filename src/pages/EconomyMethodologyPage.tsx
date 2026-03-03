import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--cyan)',
  'GDP Methodology': 'var(--cyan)',
  'Inflation (CPI)': 'var(--saffron)',
  'Fiscal Year Mapping': 'var(--gold)',
  'Open Data Licenses': 'var(--cyan)',
  'Limitations': 'var(--gold)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Economic Survey data is compiled from multiple authoritative sources. The pipeline
          cross-references data points across sources for accuracy:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <a
                href="https://api.worldbank.org/v2/country/ind/indicator/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                World Bank Open Data API
              </a>{' '}
              — GDP growth, inflation, trade indicators, sectoral value added (no authentication required, JSON format)
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <a
                href="https://www.indiabudget.gov.in/economicsurvey/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                Economic Survey of India 2025-26
              </a>{' '}
              — Statistical Appendix tables for current year estimates, fiscal data, sectoral breakdowns
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <a
                href="https://data.rbi.org.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                RBI DBIE (Database on Indian Economy)
              </a>{' '}
              — Balance of Payments, forex reserves, CPI monthly data
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <a
                href="https://api.mospi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                MOSPI eSankhyiki API
              </a>{' '}
              — NAS GDP/GVA (api.mospi.gov.in/api/nas), WPI wholesale prices, CPI by category. Auto-refreshed quarterly via GitHub Actions
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'GDP Methodology',
    content: (
      <>
        <p>
          GDP growth rates use real GDP at constant prices (base year 2011-12). MOSPI NAS API provides
          GDP/GVA at both current and constant prices, with World Bank as fallback. Calendar year data
          (e.g. CY 2024) is mapped to India's fiscal year (April-March) as FY 2024-25.
        </p>
        <div
          className="mt-4 rounded-lg px-5 py-4"
          style={{ background: 'var(--bg-surface)', borderLeft: '3px solid var(--cyan)' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--cyan)' }}>Note</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            The 2025-26 GDP growth figure (6.4%) is an advance estimate from the Economic Survey.
            This will be revised when actual data becomes available. Previous year figures may also be
            revised by NSO.
          </p>
        </div>
      </>
    ),
  },
  {
    title: 'Inflation (CPI)',
    content: (
      <>
        <p>
          CPI inflation uses the Consumer Price Index (Combined) with base year 2012=100, published
          by NSO. Three series are shown:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>Headline CPI</strong> — the all-items index, the RBI's primary target metric</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span><strong>Food CPI</strong> — food and beverages component, the most volatile</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span><strong>Core CPI</strong> — excludes food and fuel, indicates underlying price pressures</span>
          </li>
        </ul>
        <p className="mt-4">
          The RBI's flexible inflation target is 4% +/- 2%, i.e. the 2-6% band shown in the chart.
        </p>
      </>
    ),
  },
  {
    title: 'Fiscal Year Mapping',
    content: (
      <p>
        India's fiscal year runs April to March. All year labels use the "2024-25" format denoting
        April 2024 to March 2025. When converting from calendar year sources (World Bank), CY 2024
        maps to FY 2024-25. Fiscal deficit data comes directly from the Budget documents and
        Statistical Appendix, so no conversion is needed.
      </p>
    ),
  },
  {
    title: 'Open Data Licenses',
    content: (
      <>
        <p>Data comes from the following open data licenses:</p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              World Bank data under{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                Creative Commons Attribution 4.0 (CC-BY 4.0)
              </a>
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              Government of India data under{' '}
              <a
                href="https://data.gov.in/government-open-data-license-india"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                Government Open Data License - India (GODL)
              </a>
            </span>
          </li>
        </ul>
        <p className="mt-4">
          This project is not affiliated with or endorsed by the Government of India, World Bank, or
          RBI.
        </p>
      </>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            World Bank data typically lags 1-2 years. The most recent fiscal year data often comes
            from advance estimates, not final actuals.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            GDP revisions can be significant. India has revised GDP figures multiple times in recent
            years, sometimes by over 1 percentage point.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            Food CPI and Core CPI breakdowns are only available for FY2024-25 and FY2025-26
            (from the Economic Survey). Earlier years show headline CPI only, sourced from
            the World Bank. Full historical food/core series requires RBI DBIE integration.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            Forex reserves and CAD figures for the latest year are provisional and subject to
            revision by the RBI.
          </span>
        </li>
      </ul>
    ),
  },
];

function MethodologyCard({ section, index }: { section: (typeof SECTIONS)[number]; index: number }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });
  const dotColor = SECTION_COLORS[section.title] || 'var(--text-muted)';
  const isLimitations = section.title === 'Limitations';

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
        borderLeft: isLimitations ? '3px solid var(--gold)' : undefined,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <SectionNumber number={index + 1} isVisible={isVisible} />
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {section.title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {section.content}
      </div>
    </motion.section>
  );
}

export default function EconomyMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Economic Survey — Indian Data Project"
        description="Data sources, methodology, and known limitations for the Economic Survey data on Indian Data Project."
        path="/economy/methodology"
        image="/og-economy.png"
      />

      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-8 md:pt-14 md:pb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          className="text-composition font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Methodology
        </h1>
        <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
          How we source, process, and present the Economic Survey data.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-6">
        {SECTIONS.map((section, i) => (
          <MethodologyCard key={section.title} section={section} index={i} />
        ))}

        <p className="text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          Data from Economic Survey 2025-26, World Bank, RBI, MoSPI
        </p>
      </div>
    </motion.div>
  );
}
