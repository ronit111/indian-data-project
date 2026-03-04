import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCrimeStore } from '../store/crimeStore.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { HorizontalBarChart, type BarItem } from '../components/viz/HorizontalBarChart.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';
import { loadCrimeIndicators } from '../lib/dataLoader.ts';
import type { CrimeIndicatorsData } from '../lib/data/schema.ts';
import { useState, useEffect } from 'react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'overall', label: 'Overall Crime' },
  { id: 'women-safety', label: 'Women Safety' },
  { id: 'road-safety', label: 'Road Safety' },
  { id: 'infrastructure', label: 'Police' },
];

function formatIndicatorValue(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === 'per lakh') return `${value.toFixed(1)}`;
  return Math.round(value).toLocaleString('en-IN');
}

export default function CrimeExplorerPage() {
  const year = useCrimeStore((s) => s.selectedYear);
  const selectedIndicatorId = useCrimeStore((s) => s.selectedIndicatorId);
  const setIndicatorId = useCrimeStore((s) => s.setSelectedIndicatorId);
  const selectedCategory = useCrimeStore((s) => s.selectedCategory);
  const setCategory = useCrimeStore((s) => s.setSelectedCategory);

  const [indicators, setIndicators] = useState<CrimeIndicatorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset loading state when year changes (setState during render pattern)
  const [prevYear, setPrevYear] = useState(year);
  if (prevYear !== year) {
    setPrevYear(year);
    setLoading(true);
    setError(null);
  }

  useUrlState({
    indicator: { get: () => selectedIndicatorId, set: setIndicatorId },
    category: { get: () => selectedCategory === 'all' ? null : selectedCategory, set: (v) => setCategory(v ?? 'all') },
  });

  useEffect(() => {
    let cancelled = false;
    loadCrimeIndicators(year)
      .then((data) => {
        if (!cancelled) {
          setIndicators(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err));
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [year]);

  const filteredIndicators = useMemo(() => {
    if (!indicators) return [];
    if (selectedCategory === 'all') return indicators.indicators;
    return indicators.indicators.filter((ind) => ind.category === selectedCategory);
  }, [indicators, selectedCategory]);

  const activeIndicator = useMemo(() => {
    if (!filteredIndicators.length) return null;
    if (selectedIndicatorId) {
      return filteredIndicators.find((ind) => ind.id === selectedIndicatorId) || filteredIndicators[0];
    }
    return filteredIndicators[0];
  }, [filteredIndicators, selectedIndicatorId]);

  const barItems: BarItem[] = useMemo(() => {
    if (!activeIndicator) return [];
    return activeIndicator.states
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 35)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.value,
        color: s.value > (activeIndicator.unit === '%' ? 25 : 400) ? 'var(--crimson)' : 'var(--crimson-light)',
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
        title="Explore Crime Data — Indian Data Project"
        description="Browse state-wise crime indicators: crime rates, crimes against women, road fatalities, police ratios, and vacancy rates."
        path="/crime/explore"
        image="/og-crime.png"
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
          Crime Indicator Explorer
        </motion.h1>
        <motion.p
          className="text-base max-w-2xl mb-6"
          style={{ color: 'var(--text-secondary)' }}
          variants={fadeUp}
        >
          Compare state-wise crime, safety, and policing data from NCRB, MoRTH, and BPRD. All data for 2022.
        </motion.p>

        {/* Category pills */}
        <motion.div className="flex flex-wrap gap-2 mb-6" variants={fadeUp}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setIndicatorId(null); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: selectedCategory === cat.id ? 'var(--crimson-dim)' : 'var(--bg-raised)',
                color: selectedCategory === cat.id ? 'var(--crimson-light)' : 'var(--text-secondary)',
                border: selectedCategory === cat.id ? '1px solid rgba(220,38,38,0.3)' : 'var(--border-subtle)',
              }}
            >
              {cat.label}
            </button>
          ))}
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
              style={{ background: 'var(--crimson)', color: '#fff', border: 'none' }}
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
                        <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          Top: {topState.name} ({formatIndicatorValue(topState.value, ind.unit)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {activeIndicator && (
                <>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h2
                      className="text-lg font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {activeIndicator.name}
                    </h2>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {activeIndicator.unit}
                    </span>
                  </div>
                  <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                    Source: {activeIndicator.source}
                  </p>
                  <HorizontalBarChart
                    items={barItems}
                    isVisible={true}
                    formatValue={(v) => formatIndicatorValue(v, activeIndicator.unit)}
                    unit=""
                    labelWidth={180}
                    barHeight={22}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
