import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { UnemploymentData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface RuralUrbanSectionProps {
  data: UnemploymentData;
}

export function RuralUrbanSection({ data }: RuralUrbanSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const barItems: BarItem[] = useMemo(() => {
    if (!data.stateUnemployment || data.stateUnemployment.length === 0) return [];
    return [...data.stateUnemployment]
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.value,
        color: 'var(--amber)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="rural-urban" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Rural vs Urban
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Unemployment varies enormously across states — from about 1% in Gujarat and Madhya Pradesh to over 8% in Goa and 7% in Kerala. Lower headline rates in rural states often mask massive underemployment in agriculture.
        </motion.p>

        {barItems.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              State Unemployment Rate (%, highest 15)
            </p>
            <ChartActionsWrapper registryKey="employment/rural-urban" data={data}>
              <HorizontalBarChart
              items={barItems}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
              labelWidth={140}
              barHeight={24}
            />
            </ChartActionsWrapper>
          </div>
        )}

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
