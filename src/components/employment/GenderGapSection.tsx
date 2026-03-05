import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { ParticipationData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';

interface GenderGapSectionProps {
  data: ParticipationData;
}

export function GenderGapSection({ data }: GenderGapSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const barItems: BarItem[] = useMemo(() => {
    if (!data.stateLfpr || data.stateLfpr.length === 0) return [];
    return [...data.stateLfpr]
      .filter((s) => s.value > 0)
      .sort((a, b) => a.value - b.value)
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.value,
        color: 'var(--amber)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="gender-gap" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The gender gap
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Male LFPR is about 78%. Female LFPR is around 35%. The gap is among the widest in the
          world, though it has been narrowing since 2017.
        </motion.p>

        {barItems.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              State-Level Female LFPR (%, lowest 15)
            </p>
            <ChartActionsWrapper registryKey="employment/gender-gap" data={data}>
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

        <CrossDomainLink domain="employment" sectionId="gender-gap" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
