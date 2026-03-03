import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--amber)',
  'Unemployment Indicators': 'var(--amber)',
  'Participation Indicators': 'var(--amber-light)',
  'Sectoral Indicators': 'var(--amber)',
  'Data Vintage': 'var(--gold)',
  'Limitations': 'var(--saffron)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Employment data draws from four authoritative sources, each covering different dimensions of India's labour market:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong style={{ color: 'var(--amber)' }}>World Bank Open Data</strong> (national, 2000-2024, automated).{' '}
              <a
                href="https://data.worldbank.org/country/india"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--amber)' }}
              >
                data.worldbank.org
              </a>{' '}
              — 17 indicators covering unemployment (total, youth, gender), labour force participation, employment-to-population ratio, and sectoral employment shares. ILO-modeled estimates. Auto-refreshed quarterly via GitHub Actions.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong style={{ color: 'var(--amber)' }}>MOSPI PLFS API</strong> (national + state-level, automated).{' '}
              <a
                href="https://api.mospi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--amber)' }}
              >
                api.mospi.gov.in
              </a>{' '}
              — PLFS data via eSankhyiki REST API (api.mospi.gov.in/api/plfs/getData). Provides LFPR, WPR, unemployment rate, and self-employment share at national and state levels. Auto-refreshed quarterly via GitHub Actions, with curated data as fallback.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong style={{ color: 'var(--amber)' }}>PLFS Annual Report 2023-24</strong> (state-level, curated fallback).{' '}
              <a
                href="https://mospi.gov.in/publication/plfs-annual-report"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--amber)' }}
              >
                mospi.gov.in
              </a>{' '}
              — Used as fallback when the PLFS API is unavailable. State-level unemployment rates, LFPR, worker population ratios using Usual Status (ps+ss) approach.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong style={{ color: 'var(--amber)' }}>RBI KLEMS Database</strong> (sectoral, 1980-2022, curated).{' '}
              <a
                href="https://rbi.org.in/scripts/KLEMS.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--amber)' }}
              >
                rbi.org.in
              </a>{' '}
              — Long-run sectoral employment shares (agriculture, industry, services) and productivity metrics. Used for structural transformation analysis.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Unemployment Indicators',
    content: (
      <>
        <p>
          Unemployment measurement in India uses two distinct methodologies:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong>ILO-modeled estimates</strong> (World Bank) — Comparable across countries. Based on a statistical model that accounts for survey gaps. Tends to show slightly different numbers than national surveys.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong>Usual Status (ps+ss)</strong> — PLFS annual approach. Classifies a person based on their activity status for the majority of the reference year. The standard national measure.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong>Current Weekly Status (CWS)</strong> — PLFS quarterly approach. Classifies a person based on the reference week. Captures more transient unemployment and seasonal fluctuations.
            </span>
          </li>
        </ul>
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
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Unemployment Rate (total)</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Youth Unemployment (15-24)</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Female Unemployment</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">%</td></tr>
              <tr><td className="py-2 pr-4">State Unemployment Rate</td><td className="py-2 pr-4 text-xs">PLFS 2023-24</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Unemployment rate measures the percentage of the labour force that is seeking but unable to find work. It does not capture underemployment (working fewer hours than desired) or disguised unemployment (low-productivity jobs in agriculture).
        </p>
      </>
    ),
  },
  {
    title: 'Participation Indicators',
    content: (
      <>
        <p>
          Labour force participation measures who is working or actively seeking work, regardless of whether they find it:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong>LFPR (Labour Force Participation Rate)</strong> — Percentage of the working-age population (15+) that is either employed or actively seeking work. India's LFPR is among the lowest globally, primarily due to low female participation.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong>Employment-to-Population Ratio</strong> — Percentage of the working-age population that is employed. Unlike LFPR, this excludes those seeking work. A more direct measure of job creation.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--amber)' }} />
            <span>
              <strong>Gender-disaggregated LFPR</strong> — Male and female participation rates tracked separately. The gap between male (~78%) and female (~37%) LFPR is one of the widest among major economies. Female LFPR has been rising since 2017 after a decades-long decline.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Sectoral Indicators',
    content: (
      <>
        <p>
          Sectoral employment tracks the structural transformation of India's economy:
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
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Agriculture employment</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">% of total</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Industry employment</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">% of total</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Services employment</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">% of total</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Self-employed</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">% of total</td></tr>
              <tr><td className="py-2 pr-4">Vulnerable employment</td><td className="py-2 pr-4 text-xs">World Bank (ILO)</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2">% of total</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          "Self-employed" includes own-account workers and contributing family workers. "Vulnerable employment" (self-employed + contributing family workers) is a proxy for informality — workers without formal contracts, social protection, or workplace benefits.
        </p>
      </>
    ),
  },
  {
    title: 'Data Vintage',
    content: (
      <>
        <p>
          Employment data comes from multiple vintages. The most current source depends on the indicator:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Data Year</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Level</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Coverage</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">World Bank API</td><td className="py-2 pr-4 text-xs">2000-2024</td><td className="py-2 pr-4 text-xs">National</td><td className="py-2">Time series trends</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">PLFS Quarterly</td><td className="py-2 pr-4 text-xs">Oct-Dec 2025</td><td className="py-2 pr-4 text-xs">National</td><td className="py-2">Latest quarterly UR, LFPR</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">PLFS Annual</td><td className="py-2 pr-4 text-xs">2023-24</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">State-level indicators</td></tr>
              <tr><td className="py-2 pr-4">RBI KLEMS</td><td className="py-2 pr-4 text-xs">1980-2022</td><td className="py-2 pr-4 text-xs">Sector</td><td className="py-2">Long-run sectoral trends</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          World Bank data has approximately a 1-year lag. PLFS quarterly bulletins are the most current source for national unemployment and participation rates. State-level data requires the annual PLFS report, which publishes with a longer lag.
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
              <strong>PLFS sample size limits small-state estimates.</strong> The PLFS surveys roughly 100,000 households per quarter. State-level estimates for smaller states and union territories (Mizoram, Sikkim, Lakshadweep) have wide confidence intervals that are not displayed.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>ILO vs national definitions differ.</strong> World Bank uses ILO-modeled estimates that may not match PLFS figures exactly. ILO applies a consistent methodology across countries, while PLFS uses India-specific definitions. For example, ILO total unemployment (~5.4%) differs from PLFS usual status unemployment (~3.2%) due to definitional differences.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Underemployment is invisible.</strong> The unemployment rate only counts people with zero work who are seeking employment. It does not capture underemployment — farmers working 2-3 months a year, gig workers with irregular hours, or workers in jobs far below their skill level. True labour underutilization in India is significantly higher than the headline UR.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Informal sector measurement is imprecise.</strong> Self-employment and vulnerable employment are proxies for informality, not direct measures. A self-employed IT consultant and a roadside vendor are both "self-employed" but face vastly different realities. Precise informal sector data would require enterprise-level surveys.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Female LFPR measurement challenges.</strong> Women's unpaid domestic work, subsistence agriculture, and family enterprise contributions are often undercounted in household surveys. PLFS methodology changes have contributed to the post-2017 rise in female LFPR — part of the increase may reflect improved measurement rather than real labour market entry.
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
  const accent = SECTION_COLORS[section.title] || 'var(--amber)';

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

export default function EmploymentMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Employment & Labour — Indian Data Project"
        description="Data sources, indicator definitions, vintage transparency, and limitations for employment data. PLFS, World Bank, RBI KLEMS."
        path="/employment/methodology"
        image="/og-employment.png"
      />

      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-4 md:pt-14 md:pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: 'var(--amber)' }}
        >
          Employment & Labour
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
          How we source, validate, and present employment data across World Bank, PLFS, and RBI KLEMS. Every number traces to an authoritative publication.
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
            style={{ color: 'var(--amber)' }}
          >
            GitHub
          </a>.
        </p>
      </div>
    </motion.div>
  );
}
