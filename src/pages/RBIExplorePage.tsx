import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRBIStore } from '../store/rbiStore.ts';
import { useRBIData } from '../hooks/useRBIData.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.tsx';
import { LineChart } from '../components/viz/LineChart.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'monetary', label: 'Monetary' },
  { value: 'liquidity', label: 'Liquidity' },
  { value: 'credit', label: 'Credit' },
  { value: 'external', label: 'External' },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]['value'];

const INDICATOR_COLORS: Record<string, string> = {
  repo_rate: 'var(--gold)',
  crr: 'var(--cyan)',
  inflation_cpi: 'var(--saffron)',
  lending_rate: 'var(--gold)',
  deposit_rate: 'var(--cyan)',
  broad_money_growth: 'var(--gold)',
  broad_money_pct_gdp: 'var(--cyan)',
  domestic_credit_pct_gdp: 'var(--gold)',
  private_credit_pct_gdp: 'var(--cyan)',
  reserves_usd: 'var(--gold)',
  exchange_rate: 'var(--saffron)',
  bank_branches: 'var(--cyan)',
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function RBIExplorePage() {
  const year = useRBIStore((s) => s.selectedYear);
  const selectedCategory = useRBIStore((s) => s.selectedCategory);
  const setCategory = useRBIStore((s) => s.setSelectedCategory);
  const selectedIndicatorId = useRBIStore((s) => s.selectedIndicatorId);
  const setIndicatorId = useRBIStore((s) => s.setSelectedIndicatorId);
  const { indicators, loading, error } = useRBIData(year);

  // Sync URL params ↔ store for deep linking
  useUrlState({
    category: { get: () => selectedCategory, set: setCategory },
    indicator: { get: () => selectedIndicatorId, set: setIndicatorId },
  });

  const filteredIndicators = useMemo(() => {
    if (!indicators) return [];
    if (selectedCategory === 'all') return indicators.indicators;
    return indicators.indicators.filter((ind) => ind.category === selectedCategory);
  }, [indicators, selectedCategory]);

  const activeIndicator = useMemo(() => {
    if (!indicators) return null;
    if (selectedIndicatorId) {
      return indicators.indicators.find((ind) => ind.id === selectedIndicatorId) || null;
    }
    return filteredIndicators[0] || null;
  }, [indicators, selectedIndicatorId, filteredIndicators]);

  const formatUnit = (unit: string) => {
    if (unit === '%' || unit === 'percent') return '%';
    if (unit === '% of GDP') return '% GDP';
    if (unit === 'INR per USD') return 'INR/USD';
    if (unit === 'US$ billion') return 'US$B';
    return unit;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Explore RBI Indicators — Indian Data Project"
        description="Browse and compare RBI monetary policy, liquidity, credit, and forex indicators across a decade of data."
        path="/rbi/explore"
        image="/og-rbi.png"
      />

      {/* Page header */}
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
          RBI Indicator Explorer
        </motion.h1>
        <motion.p
          className="text-base max-w-2xl mb-6"
          style={{ color: 'var(--text-secondary)' }}
          variants={fadeUp}
        >
          Select a category and indicator to see its full time series. Data from RBI Monetary Policy Statements and World Bank.
        </motion.p>

        {/* Category tabs */}
        <motion.div variants={fadeUp}>
          <SegmentedControl
            options={[...CATEGORIES]}
            value={selectedCategory as CategoryValue}
            onChange={(v) => {
              setCategory(v);
              setIndicatorId(null);
            }}
          />
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        {loading && (
          <div className="space-y-6">
            <SkeletonText lines={3} />
            <SkeletonChart height={360} />
          </div>
        )}

        {error && (
          <div
            className="py-12 px-8 text-center rounded-xl max-w-md mx-auto"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <p className="text-base font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Failed to load data
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: 'var(--gold)', color: '#06080f', border: 'none' }}
            >
              Retry
            </button>
          </div>
        )}

        {indicators && (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Indicator list */}
            <div className="md:w-64 flex-shrink-0">
              <div className="space-y-1">
                {filteredIndicators.map((ind) => {
                  const isActive = activeIndicator?.id === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => setIndicatorId(ind.id)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors"
                      style={{
                        background: isActive ? 'var(--bg-raised)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        border: isActive ? 'var(--border-subtle)' : '1px solid transparent',
                      }}
                    >
                      <span className="font-medium">{ind.name}</span>
                      {ind.series.length > 0 && (
                        <span
                          className="block font-mono text-xs mt-0.5"
                          style={{ color: INDICATOR_COLORS[ind.id] || 'var(--gold)' }}
                        >
                          Latest: {ind.series[ind.series.length - 1].value.toLocaleString()}{formatUnit(ind.unit)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chart area */}
            <div className="flex-1 min-w-0">
              {activeIndicator && (
                <motion.div
                  key={activeIndicator.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {activeIndicator.name}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {activeIndicator.series.length} data points &middot; Unit: {activeIndicator.unit}
                    </p>
                  </div>

                  <LineChart
                    series={[
                      {
                        id: activeIndicator.id,
                        name: activeIndicator.name,
                        color: INDICATOR_COLORS[activeIndicator.id] || 'var(--gold)',
                        data: activeIndicator.series,
                      },
                    ]}
                    isVisible={true}
                    formatValue={(v) =>
                      activeIndicator.unit === 'US$ billion'
                        ? `$${v.toFixed(0)}B`
                        : v.toFixed(1)
                    }
                    unit={formatUnit(activeIndicator.unit)}
                  />

                  <p className="source-attribution mt-4">
                    Source: {activeIndicator.source}
                  </p>
                </motion.div>
              )}
              {!activeIndicator && filteredIndicators.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-16">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No indicators available for this category yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
