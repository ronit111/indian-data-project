import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useElectionsStore } from '../store/electionsStore.ts';
import { useUrlState } from '../hooks/useUrlState.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { HorizontalBarChart, type BarItem } from '../components/viz/HorizontalBarChart.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';
import { loadElectionsIndicators } from '../lib/dataLoader.ts';
import type { ElectionsIndicatorsData } from '../lib/data/schema.ts';
import { useState, useEffect } from 'react';

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
  return Math.round(value).toLocaleString('en-IN');
}

export default function ElectionsExplorePage() {
  const year = useElectionsStore((s) => s.selectedYear);
  const selectedIndicatorId = useElectionsStore((s) => s.selectedIndicatorId);
  const setIndicatorId = useElectionsStore((s) => s.setSelectedIndicatorId);

  const [indicators, setIndicators] = useState<ElectionsIndicatorsData | null>(null);
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
  });

  useEffect(() => {
    let cancelled = false;
    loadElectionsIndicators(year)
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

  const activeIndicator = useMemo(() => {
    if (!indicators) return null;
    if (selectedIndicatorId) {
      return indicators.indicators.find((ind) => ind.id === selectedIndicatorId) || null;
    }
    return indicators.indicators[0] || null;
  }, [indicators, selectedIndicatorId]);

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
        color: s.value > 70 ? 'var(--indigo)' : s.value > 60 ? 'var(--indigo-light)' : 'var(--text-muted)',
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
        title="Explore Elections Data — Indian Data Project"
        description="Browse state-wise voter turnout and election indicators across all Indian states."
        path="/elections/explore"
        image="/og-elections.png"
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
          Elections Indicator Explorer
        </motion.h1>
        <motion.p
          className="text-base max-w-2xl mb-6"
          style={{ color: 'var(--text-secondary)' }}
          variants={fadeUp}
        >
          Compare state-wise election data. Currently featuring 2024 Lok Sabha voter turnout. More indicators will be added as state assembly and panchayat data is sourced.
        </motion.p>
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
              style={{ background: 'var(--indigo)', color: '#fff', border: 'none' }}
            >
              Retry
            </button>
          </div>
        )}

        {indicators && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <div className="space-y-1">
                {indicators.indicators.map((ind) => {
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
