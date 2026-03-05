import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--emerald)',
  'GSDP Indicators': 'var(--emerald)',
  'Revenue Indicators': 'var(--cyan)',
  'Fiscal Health Indicators': 'var(--emerald)',
  'Data Freshness': 'var(--cyan)',
  'Limitations': 'var(--saffron)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          State finances data is compiled from two primary authoritative sources:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--emerald)' }} />
            <span>
              <a
                href="https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--emerald)' }}
              >
                RBI Handbook of Statistics on Indian States
              </a>{' '}
              — The definitive compilation of state-level economic data published annually by the Reserve Bank. Covers GSDP (current and constant prices), per capita income, and growth rates. Tables 19, 21, and 22 are the primary sources for GSDP data.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--emerald)' }} />
            <span>
              <a
                href="https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=State%20Finances%20:%20A%20Study%20of%20Budgets"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--emerald)' }}
              >
                RBI State Finances: A Study of Budgets
              </a>{' '}
              — Annual analysis of state government finances. Provides revenue composition (own tax, central transfers), fiscal deficit, and outstanding debt data. Annex II.1 and Statement 20 are the key tables for fiscal indicators.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--emerald)' }} />
            <span>
              <a
                href="https://fincomindia.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--emerald)' }}
              >
                Finance Commission of India
              </a>{' '}
              — Supplementary data on tax devolution formulas, grants, and inter-governmental fiscal transfers. The 15th Finance Commission report is the current reference.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'GSDP Indicators',
    content: (
      <>
        <p>
          Gross State Domestic Product data is sourced from the RBI Handbook, with the base year 2011-12 for constant price calculations:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source Table</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Per Capita NSDP (Current Prices)</td><td className="py-2 pr-4 font-mono text-xs">Table 19</td><td className="py-2">Rs/person</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">GSDP (Current Prices)</td><td className="py-2 pr-4 font-mono text-xs">Table 21</td><td className="py-2">Rs crore</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">GSDP (Constant 2011-12 Prices)</td><td className="py-2 pr-4 font-mono text-xs">Table 22</td><td className="py-2">Rs crore</td></tr>
              <tr><td className="py-2 pr-4">GSDP Growth Rate</td><td className="py-2 pr-4 font-mono text-xs">Derived</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: 'Revenue Indicators',
    content: (
      <>
        <p>
          Revenue composition data shows the balance between a state's own resources and dependence on Central transfers:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Definition</th>
                <th className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Own Tax Revenue</td><td className="py-2 pr-4 text-xs">State GST share, excise, stamp duty, vehicle tax</td><td className="py-2">Rs crore</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Central Transfers</td><td className="py-2 pr-4 text-xs">Tax devolution + grants-in-aid from Centre</td><td className="py-2">Rs crore</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Total Revenue</td><td className="py-2 pr-4 text-xs">Own revenue + Central transfers + non-tax revenue</td><td className="py-2">Rs crore</td></tr>
              <tr><td className="py-2 pr-4">Self-Sufficiency Ratio</td><td className="py-2 pr-4 text-xs">Own tax revenue ÷ total revenue × 100</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: 'Fiscal Health Indicators',
    content: (
      <>
        <p>
          Fiscal sustainability metrics assess a state's borrowing discipline:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--emerald)' }} />
            <span>
              <strong>Fiscal Deficit (% of GSDP)</strong> — The gap between total expenditure and total revenue (excluding borrowings). The FRBM Act targets below 3% for states. Negative values indicate a surplus.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--emerald)' }} />
            <span>
              <strong>Debt-to-GSDP Ratio</strong> — Total outstanding liabilities as a share of GSDP. The N.K. Singh committee recommended states target 20% by 2024-25. Higher ratios mean more revenue diverted to interest payments.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Data Freshness',
    content: (
      <>
        <p>
          State-level data has a longer lag than national indicators:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <strong>RBI Handbook</strong> — Published annually (typically March-April). GSDP, per capita NSDP, and fiscal deficit data are now auto-extracted from the Handbook XLSX tables via an automated scraper, with curated data as fallback. There is a 1-2 year lag because state GDP estimates require compilation from all 36 states/UTs.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <strong>State Finances report</strong> — Published annually with budget data for the current year and actuals for 1-2 years prior. Revenue and fiscal data align to the same FY 2022-23 vintage.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--cyan)' }} />
            <span>
              <strong>Pipeline</strong> — The pipeline automatically downloads RBI Handbook XLSX files, parses state-level tables (GSDP, per capita, fiscal deficit), and generates JSON outputs. Curated data (revenue, debt/GSDP) supplements the automated extraction. The GitHub Actions workflow runs semi-annually after expected publication dates.
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
            State-level data typically lags national data by 1-2 years. Some smaller UTs (Andaman & Nicobar, Chandigarh, Lakshadweep, Ladakh) may have incomplete data.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            Five small UTs (Andaman & Nicobar, Chandigarh, Dadra & Nagar Haveli and Daman & Diu, Ladakh, Lakshadweep) have zero or incomplete entries due to unavailability of separate economic accounts.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            Growth rates are year-on-year at constant (2011-12) prices. Multi-year compound growth rates would give a different picture for states with volatile annual growth.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            <strong>Data vintage:</strong> All state-level economic data is FY 2022-23 vintage from the RBI Handbook. The directory path says "2025-26" but reflects the latest available data year, not projections.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            <strong>Per capita values are NSDP, not GSDP.</strong> RBI Table 19 reports Net State Domestic Product per capita. NSDP = GSDP minus depreciation of capital assets. The derived population figures (GSDP / per-capita-NSDP) are approximate and inflate true population by ~14%.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
          <span>
            This platform is not affiliated with or endorsed by the Reserve Bank of India, Government of India, or any state government. All data interpretation is the author's own.
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

export default function StatesMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — State Finances — Indian Data Project"
        description="Data sources, methodology, indicator definitions, and known limitations for the state finances data on Indian Data Project."
        path="/states/methodology"
        image="/og-states.png"
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
          How we source, process, and present state finances data. Every number traces to an authoritative RBI publication.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-6">
        {SECTIONS.map((section, i) => (
          <MethodologyCard key={section.title} section={section} index={i} />
        ))}

        <p className="text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          Data from RBI Handbook of Statistics on Indian States, RBI State Finances report
        </p>
      </div>
    </motion.div>
  );
}
