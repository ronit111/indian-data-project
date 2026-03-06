import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--gold)',
  'Monetary Policy Indicators': 'var(--gold)',
  'Financial Indicators': 'var(--cyan)',
  'Fiscal Year Mapping': 'var(--gold)',
  'Data Freshness': 'var(--cyan)',
  'Limitations': 'var(--saffron)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          RBI data is compiled from two primary sources, with curated policy data from official RBI
          publications:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <a
                href="https://data.rbi.org.in/DBIE/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--gold)' }}
              >
                RBI DBIE (Database on Indian Economy)
              </a>{' '}
              — The RBI's official statistical portal. Planned for future integration for the most current
              monthly/weekly data.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <a
                href="https://api.worldbank.org/v2/country/ind/indicator/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--gold)' }}
              >
                World Bank Open Data API
              </a>{' '}
              — Historical time series for money supply, credit, forex reserves, exchange rate,
              inflation, and interest rates (no authentication required, JSON format)
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <a
                href="https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--gold)' }}
              >
                RBI Monetary Policy Statements
              </a>{' '}
              — Repo rate decisions, CRR/SLR changes, and stance announcements from MPC press releases.
              Hand-verified against published statements.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Monetary Policy Indicators',
    content: (
      <>
        <p>
          The following monetary policy indicators are curated from official RBI press releases:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <strong>Repo Rate</strong> — The rate at which RBI lends to commercial banks. Updated
              after each MPC meeting (~6 per year). All 25 decisions from 2014 onward are included.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <strong>CRR (Cash Reserve Ratio)</strong> — Fraction of deposits banks must hold with
              RBI. Currently 3.00%.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <strong>SLR (Statutory Liquidity Ratio)</strong> — Fraction of deposits banks must hold
              in liquid assets (government securities). Currently 18.00%.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>
              <strong>Stance</strong> — The MPC's forward guidance: Accommodative (bias toward cuts),
              Neutral (no bias), Withdrawal of Accommodation (bias toward hikes), or Tightening.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Financial Indicators',
    content: (
      <>
        <p>
          The following indicators come from the World Bank Open Data API using specific indicator
          codes:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>WB Code</th>
                <th scope="col" className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Broad Money Growth</td><td className="py-2 pr-4 font-mono text-xs">FM.LBL.BMNY.ZG</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Broad Money (% GDP)</td><td className="py-2 pr-4 font-mono text-xs">FM.LBL.BMNY.GD.ZS</td><td className="py-2">% of GDP</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Private Credit (% GDP)</td><td className="py-2 pr-4 font-mono text-xs">FD.AST.PRVT.GD.ZS</td><td className="py-2">% of GDP</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Forex Reserves</td><td className="py-2 pr-4 font-mono text-xs">FI.RES.TOTL.CD</td><td className="py-2">US$ billion</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Exchange Rate</td><td className="py-2 pr-4 font-mono text-xs">PA.NUS.FCRF</td><td className="py-2">INR per USD</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">CPI Inflation</td><td className="py-2 pr-4 font-mono text-xs">FP.CPI.TOTL.ZG</td><td className="py-2">%</td></tr>
              <tr><td className="py-2 pr-4">Lending Interest Rate</td><td className="py-2 pr-4 font-mono text-xs">FR.INR.LEND</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: 'Fiscal Year Mapping',
    content: (
      <p>
        India's fiscal year runs April to March. All year labels use the "2024-25" format denoting
        April 2024 to March 2025. When converting from calendar year sources (World Bank), CY 2024
        maps to FY 2024-25. Repo rate decisions are shown by their exact date; when plotted on a
        fiscal year axis, they are grouped by the fiscal year they fall within.
      </p>
    ),
  },
  {
    title: 'Data Freshness',
    content: (
      <>
        <p>
          Different data sources have different update frequencies:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <strong>Repo rate decisions</strong> — Updated manually after each MPC meeting (~6 per
              year). Every value cross-referenced against the published MPC statement PDF.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <strong>World Bank indicators</strong> — Annual data with a 1-2 year lag. Updated when
              the pipeline is re-run. Time series typically cover 2014 to 2-3 years prior.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <strong>RBI Handbook Tables</strong> — Interest rate structure (Table 62) and forex reserves (Table 147) are automatically extracted from the Handbook XLSX files. The pipeline scrapes the RBI publications page for current download URLs and parses the Excel data.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            World Bank data typically lags 1-2 years. The most recent data points are often
            provisional and subject to revision.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            Some World Bank indicators (domestic credit by financial sector, deposit rate) may return
            no data for India. These produce empty charts in the explorer.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            Forex reserves are shown in US$ billion. Day-to-day reserve movements (from RBI weekly
            bulletins) are not captured; only annual averages from the World Bank are shown.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            This platform is not affiliated with or endorsed by the Reserve Bank of India, Government
            of India, or World Bank. All data interpretation is the author's own.
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
        borderLeft: isLimitations ? '3px solid var(--saffron)' : undefined,
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

export default function RBIMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — RBI Data — Indian Data Project"
        description="Data sources, methodology, indicator definitions, and known limitations for the RBI data on Indian Data Project."
        path="/rbi/methodology"
        image="/og-rbi.png"
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
          How we source, process, and present the RBI data. Every number traces to an authoritative source.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-6">
        {SECTIONS.map((section, i) => (
          <MethodologyCard key={section.title} section={section} index={i} />
        ))}

        <p className="text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          Data from RBI Monetary Policy Statements, World Bank Open Data
        </p>
      </div>
    </motion.div>
  );
}
