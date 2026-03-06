import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

/** Dot color per section — consistent color language */
const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--saffron)',
  'Tax Calculator': 'var(--saffron)',
  'Number Formatting': 'var(--cyan)',
  'Per-Capita Calculations': 'var(--cyan)',
  'Open Data License': 'var(--cyan)',
  'Limitations': 'var(--gold)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          All budget figures are sourced from the Union Budget 2025-26 documents published by the
          Ministry of Finance. The primary data pipeline pulls from:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <a
                href="https://openbudgetsindia.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                Open Budgets India
              </a>{' '}
              — structured budget data
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              Union Budget documents (Expenditure Budget Vol. 1 & 2, Receipt Budget, Finance Bill)
              from{' '}
              <a
                href="https://www.indiabudget.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                indiabudget.gov.in
              </a>
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>Population estimates from Census projections and RBI reports</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <a
                href="https://www.indiabudget.gov.in/budget_archive/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--cyan)' }}
              >
                Budget at a Glance
              </a>{' '}
              (FY 2005-06 to 2025-26) — historical trends in expenditure, receipts, and deficits
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              Expenditure Budget statements (Demand for Grants) — ministry-level Budget Estimates,
              Revised Estimates, and Actuals for Budget vs Actual tracking
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Tax Calculator',
    content: (
      <>
        <p>
          The tax computation follows the Income Tax Act slab rates for AY 2026-27 (FY 2025-26).
          Both Old and New regime rates are implemented with:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>Standard deduction (₹75,000 new / ₹50,000 old)</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>Section 87A rebate</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>Surcharge slabs for high incomes</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>4% Health and Education Cess</span>
          </li>
        </ul>
        <div
          className="mt-5 rounded-lg px-5 py-4"
          style={{ background: 'var(--bg-surface)', borderLeft: '3px solid var(--gold)' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--gold)' }}>Note</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            The calculator does not account for HRA, 80C, 80D, or other specific deductions
            under the Old Regime. It uses gross income and standard deduction only.
          </p>
        </div>
      </>
    ),
  },
  {
    title: 'Number Formatting',
    content: (
      <p>
        All numbers use the Indian numbering system (lakhs and crores), formatted as per
        convention: 50,65,345 (not 5,021,536). Large amounts are displayed in "lakh crore" where
        appropriate.
      </p>
    ),
  },
  {
    title: 'Per-Capita Calculations',
    content: (
      <p>
        Per-capita figures use an estimated population of 145 crore (1.45 billion) for 2025-26.
        This is an approximation based on Census projections and may differ from the actual figure
        when the next Census is conducted.
      </p>
    ),
  },
  {
    title: 'Open Data License',
    content: (
      <p>
        Budget data is released by the Government of India under the{' '}
        <a
          href="https://data.gov.in/government-open-data-license-india"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium link-hover"
          style={{ color: 'var(--cyan)' }}
        >
          Government Open Data License - India (GODL)
        </a>
        . This project uses that data for public-interest visualization. The project is not
        affiliated with or endorsed by the Government of India.
      </p>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <ul className="space-y-3">
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            Current-year figures are Budget Estimates. Revised Estimates and Actuals are shown
            for prior years in the Budget vs Actual section (latest actuals: FY 2023-24).
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            Ministry-level aggregation simplifies the actual 100+ demand-for-grants structure.
          </span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
          <span>
            State transfer figures are approximations. Actual Finance Commission devolution
            follows a complex formula.
          </span>
        </li>
      </ul>
    ),
  },
];

function MethodologyCard({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
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

export default function MethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Indian Data Project"
        description="Data sources, tax calculation methodology, number formatting, per-capita estimates, and limitations of the Indian Data Project. Data under GODL license."
        path="/budget/methodology"
        image="/og-budget.png"
      />

      {/* Page header — Pattern A */}
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
          Data sources, calculation methodology, and known limitations.
        </p>
      </motion.div>

      {/* Content cards — scroll-triggered */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-6">
        {SECTIONS.map((section, i) => (
          <MethodologyCard key={section.title} section={section} index={i} />
        ))}

        <p className="text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>
          Source: Union Budget 2025-26, Ministry of Finance, Government of India
        </p>
      </div>
    </motion.div>
  );
}
