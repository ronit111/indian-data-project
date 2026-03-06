import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { SectoralData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface InformalitySectionProps {
  data: SectoralData;
}

export function InformalitySection({ data }: InformalitySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const barItems: BarItem[] = useMemo(() => {
    if (!data.currentSectors || data.currentSectors.length === 0) return [];
    return [...data.currentSectors]
      .filter((s) => s.employmentShare > 0)
      .sort((a, b) => b.employmentShare - a.employmentShare)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.employmentShare,
        color: 'var(--amber)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="informality" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          No contract, no safety net
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          58% of Indian workers are self-employed. "Self-employed" sounds like entrepreneurship. In India, it mostly means subsistence — a farmer tilling a 2-acre plot, a street vendor, an unpaid family worker. About 8 of every 10 workers overall are informal: no written contract, no provident fund, no ESI health cover, no paid leave. The unemployment rate of 3-4% looks low only because most Indians cannot afford to be unemployed. They work — but often for very little.
        </motion.p>

        {barItems.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Employment by Sector (% share)
            </p>
            <ChartActionsWrapper registryKey="employment/informality" data={data}>
              <HorizontalBarChart
              items={barItems}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
              labelWidth={140}
              barHeight={28}
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
