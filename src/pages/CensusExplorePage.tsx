import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCensusStore } from '../store/censusStore.ts';
import { useCensusData } from '../hooks/useCensusData.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.tsx';
import { HorizontalBarChart, type BarItem } from '../components/viz/HorizontalBarChart.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'population', label: 'Population' },
  { value: 'demographics', label: 'Demographics' },
  { value: 'literacy', label: 'Literacy' },
  { value: 'health', label: 'Health' },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]['value'];

const INDICATOR_COLORS: Record<string, string> = {
  population: 'var(--violet)',
  density: 'var(--violet-light)',
  urban_percent: 'var(--violet)',
  decadal_growth: 'var(--violet-light)',
  sex_ratio: 'var(--violet)',
  literacy_total: 'var(--violet)',
  literacy_male: 'var(--violet)',
  literacy_female: 'var(--violet-light)',
  gender_gap: 'var(--saffron)',
  imr_srs: 'var(--saffron)',
  tfr_nfhs: 'var(--violet)',
  stunting: 'var(--saffron)',
  full_immunization: 'var(--violet)',
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function formatIndicatorValue(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === 'per 1000') return `${value.toFixed(0)}`;
  if (unit === 'per sq km') return `${Math.round(value).toLocaleString('en-IN')}`;
  if (unit === 'females per 1000 males') return `${Math.round(value)}`;
  if (unit === 'children per woman') return `${value.toFixed(1)}`;
  if (unit === 'pp') return `${value.toFixed(1)}pp`;
  return Math.round(value).toLocaleString('en-IN');
}

export default function CensusExplorePage() {
  const year = useCensusStore((s) => s.selectedYear);
  const selectedCategory = useCensusStore((s) => s.selectedCategory);
  const setCategory = useCensusStore((s) => s.setSelectedCategory);
  const selectedIndicatorId = useCensusStore((s) => s.selectedIndicatorId);
  const setIndicatorId = useCensusStore((s) => s.setSelectedIndicatorId);
  const { indicators, loading, error } = useCensusData(year);

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

  const barItems: BarItem[] = useMemo(() => {
    if (!activeIndicator) return [];
    return activeIndicator.states
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 25)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.value,
        color: INDICATOR_COLORS[activeIndicator.id] || 'var(--violet)',
      }));
  }, [activeIndicator]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Explore Census Indicators — Indian Data Project"
        description="Browse and compare state-wise population, demographics, literacy, and health indicators across all Indian states and union territories."
        path="/census/explore"
        image="/og-census.png"
      />

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
          Census Indicator Explorer
        </motion.h1>
        <motion.p
          className="text-base max-w-2xl mb-6"
          style={{ color: 'var(--text-secondary)' }}
          variants={fadeUp}
        >
          Select a category and indicator to compare states. Data from Census 2011, NFHS-5 (2019-21), SRS 2023, and World Bank.
        </motion.p>

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
              style={{ background: 'var(--violet)', color: '#fff', border: 'none' }}
            >
              Retry
            </button>
          </div>
        )}

        {indicators && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <div className="space-y-1">
                {filteredIndicators.map((ind) => {
                  const isActive = activeIndicator?.id === ind.id;
                  const topState = [...ind.states].sort((a, b) => b.value - a.value)[0];
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
                      {topState && (
                        <span
                          className="block font-mono text-xs mt-0.5"
                          style={{ color: INDICATOR_COLORS[ind.id] || 'var(--violet)' }}
                        >
                          Top: {topState.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

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
                      {activeIndicator.states.filter((s) => s.value > 0).length} states &middot; Unit: {activeIndicator.unit}
                    </p>
                  </div>

                  <HorizontalBarChart
                    items={barItems}
                    isVisible={true}
                    formatValue={(v) => formatIndicatorValue(v, activeIndicator.unit)}
                    unit=""
                    labelWidth={140}
                    barHeight={24}
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
