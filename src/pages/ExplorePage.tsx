import { motion } from 'framer-motion';
import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { DataTable } from '../components/explore/DataTable.tsx';
import { SkeletonText } from '../components/ui/Skeleton.tsx';
import { formatLakhCrore } from '../lib/format.ts';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function ExplorePage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const selectedIndicatorId = useBudgetStore((s) => s.selectedMinistryId);
  const setIndicatorId = useBudgetStore((s) => s.setSelectedMinistryId);
  const { expenditure, loading, error } = useBudgetData(year);

  // Sync URL params ↔ store for deep linking
  useUrlState({
    indicator: { get: () => selectedIndicatorId, set: setIndicatorId },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Budget Data Explorer — Ministry-wise Spending | Indian Data Project"
        description="Explore India's Union Budget 2025-26 ministry by ministry. Sortable data table with scheme-level detail for all government expenditure. Export to CSV."
        path="/budget/explore"
        image="/og-budget.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'India Union Budget Expenditure Data 2025-26',
          description: 'Ministry-wise expenditure data from India Union Budget 2025-26, including sub-scheme breakdowns.',
          url: 'https://indiandataproject.org/explore',
          license: 'https://data.gov.in/government-open-data-license-india',
          creator: { '@type': 'Organization', name: 'Ministry of Finance, Government of India' },
          temporalCoverage: '2025/2026',
          distribution: {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: 'https://indiandataproject.org/data/budget/2025-26/expenditure.json',
          },
        }}
      />

      {/* Page header — Pattern A */}
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-6 md:pt-14 md:pb-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          className="text-composition font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
          variants={fadeUp}
        >
          Data Explorer
        </motion.h1>
        <motion.p
          className="text-base max-w-2xl"
          style={{ color: 'var(--text-secondary)' }}
          variants={fadeUp}
        >
          Every ministry, every major scheme. Click headers to sort. Expand rows. Export to CSV.
        </motion.p>
      </motion.div>

      {/* Summary bar — Pattern C */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {expenditure && (
          <motion.div
            className="flex flex-wrap gap-6 mb-8"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="rounded-lg px-5 py-4"
              style={{ background: 'var(--bg-raised)', borderLeft: '3px solid var(--saffron)' }}
              variants={fadeUp}
            >
              <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Total</span>
              <span className="font-mono text-2xl font-bold" style={{ color: 'var(--saffron)' }}>
                {formatLakhCrore(expenditure.total)}
              </span>
            </motion.div>
            <motion.div
              className="rounded-lg px-5 py-4"
              style={{ background: 'var(--bg-raised)', borderLeft: '3px solid var(--cyan)' }}
              variants={fadeUp}
            >
              <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Expenditure Heads</span>
              <span className="font-mono text-2xl font-bold" style={{ color: 'var(--cyan)' }}>
                {expenditure.ministries.length}
              </span>
            </motion.div>
            <motion.div
              className="rounded-lg px-5 py-4"
              style={{ background: 'var(--bg-raised)', borderLeft: '3px solid var(--gold)' }}
              variants={fadeUp}
            >
              <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Year</span>
              <span className="font-mono text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {expenditure.year}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Table content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        {loading && <SkeletonText lines={8} className="mt-4" />}

        {error && (
          <div
            className="py-12 px-8 text-center rounded-xl max-w-md mx-auto"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--saffron-dim)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-base font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Failed to load data
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
              style={{ background: 'var(--saffron)', color: 'white', border: 'none' }}
            >
              Try Again
            </button>
          </div>
        )}

        {expenditure && <DataTable data={expenditure} />}
        {expenditure && expenditure.ministries.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No indicators available for this category yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
