import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCostOfLivingStore } from '../store/costOfLivingStore.ts';
import { loadInflation } from '../lib/dataLoader.ts';
import { calculateCostChange, getAvailableYears } from '../lib/costOfLivingEngine.ts';
import type { CPICategoryEntry } from '../lib/costOfLivingEngine.ts';
import type { InflationData } from '../lib/data/schema.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { ExpenseInput } from '../components/cost-of-living/ExpenseInput.tsx';
import { InflationImpactDisplay } from '../components/cost-of-living/InflationImpactDisplay.tsx';
import { CostShareCard } from '../components/cost-of-living/CostShareCard.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function CostOfLivingPage() {
  const { expenses, comparisonYear, setComparisonYear } = useCostOfLivingStore();
  const [inflation, setInflation] = useState<InflationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInflation('2025-26').then((data) => {
      setInflation(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const availableYears = useMemo(
    () => (inflation ? getAvailableYears(inflation.series) : []),
    [inflation]
  );

  // Default comparison year: pick "2019-20" if available, else the earliest year
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(comparisonYear)) {
      setComparisonYear(availableYears.includes('2019-20') ? '2019-20' : availableYears[0]);
    }
  }, [availableYears, comparisonYear, setComparisonYear]);

  const latestYear = availableYears.length > 0 ? availableYears[availableYears.length - 1] : '2024-25';

  const result = useMemo(() => {
    if (!inflation) return null;
    // Convert schema CPICategoryEntry to engine format (they match)
    const categories: CPICategoryEntry[] | null =
      inflation.cpiByCategory && inflation.cpiByCategory.length > 0
        ? inflation.cpiByCategory
        : null;
    return calculateCostChange(
      expenses,
      categories,
      inflation.series,
      comparisonYear,
      latestYear
    );
  }, [expenses, inflation, comparisonYear, latestYear]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-6 sm:px-8 py-10 md:py-14">
        <SkeletonChart height={200} />
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <SkeletonText lines={8} />
          <SkeletonText lines={6} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Cost of Living Calculator — How Inflation Affects Your Expenses"
        description="See how CPI inflation has changed the real cost of your monthly expenses. Compare your spending power across years."
        path="/economy/calculator"
        image="/og-cost-of-living.png"
      />

      {/* Page header */}
      <motion.div
        className="max-w-5xl mx-auto px-6 sm:px-8 pt-10 md:pt-14"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="text-center mb-10">
          <motion.h1
            className="text-composition font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
            variants={fadeUp}
          >
            Cost of Living Calculator
          </motion.h1>
          <motion.p
            className="text-base max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
            variants={fadeUp}
          >
            Inflation means prices rise over time — the same basket of goods costs more each year. Enter your monthly expenses to see how much more they cost today.
            {inflation && (
              <span className="block text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                CPI data: {availableYears[0]} – {latestYear}
              </span>
            )}
          </motion.p>
        </div>
      </motion.div>

      {/* Comparison year selector */}
      <motion.div
        className="max-w-5xl mx-auto px-6 sm:px-8 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Compare against</span>
          <select
            value={comparisonYear}
            onChange={(e) => setComparisonYear(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm font-mono outline-none"
            style={{
              background: 'var(--bg-surface)',
              border: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            aria-label="Comparison year"
          >
            {availableYears
              .filter((y) => y !== latestYear)
              .map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
          </select>
        </div>
      </motion.div>

      {/* Input panel */}
      <motion.div
        className="max-w-5xl mx-auto px-6 sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-xl p-6 md:p-8 mb-8"
          style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
        >
          <ExpenseInput />
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-xl p-6 md:p-8"
              style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--saffron)' }} />
                Inflation Impact
              </h2>
              <InflationImpactDisplay
                result={result}
                fromYear={comparisonYear}
                toYear={latestYear}
              />
            </div>
          </motion.div>

          <div className="flex justify-center mt-8">
            <CostShareCard result={result} fromYear={comparisonYear} toYear={latestYear} />
          </div>

          <p className="text-xs text-center mt-12" style={{ color: 'var(--text-muted)' }}>
            Source: CPI (Combined) from MOSPI via World Bank + IMF CPI by COICOP division (db.nomics.world).
            Categories use division-specific CPI where available; falls back to headline CPI otherwise.
          </p>
        </div>
      )}
    </motion.div>
  );
}
