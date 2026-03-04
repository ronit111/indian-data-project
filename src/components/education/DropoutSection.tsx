import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { EnrollmentData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';

interface DropoutSectionProps {
  data: EnrollmentData;
}

export function DropoutSection({ data }: DropoutSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const levelComparisonBars: BarItem[] = useMemo(() => {
    const statesWithData = data.states.filter(
      (s) => s.dropoutPrimary > 0 || s.dropoutSecondary > 0
    );
    if (statesWithData.length === 0) return [];

    const avgPrimary =
      statesWithData.reduce((sum, s) => sum + s.dropoutPrimary, 0) / statesWithData.length;
    const avgSecondary =
      statesWithData.reduce((sum, s) => sum + s.dropoutSecondary, 0) / statesWithData.length;

    return [
      { id: 'primary-avg', label: 'Primary (avg)', value: avgPrimary, color: 'var(--blue-light)' },
      { id: 'secondary-avg', label: 'Secondary (avg)', value: avgSecondary, color: 'var(--blue)' },
    ];
  }, [data]);

  const stateDropoutBars: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.dropoutSecondary > 0)
      .sort((a, b) => b.dropoutSecondary - a.dropoutSecondary)
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.dropoutSecondary,
        color: 'var(--blue)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="dropout" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The dropout cliff
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Getting children into classrooms was the easy part. Keeping them there is the challenge. Dropout rates spike dramatically from primary to secondary school.
        </motion.p>

        {levelComparisonBars.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Average Dropout Rate by Level (%)
            </p>
            <ChartActionsWrapper registryKey="education/dropout" data={data}>
              <HorizontalBarChart
              items={levelComparisonBars}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
              labelWidth={140}
              barHeight={28}
            />
            </ChartActionsWrapper>
          </div>
        )}

        {stateDropoutBars.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Secondary Dropout Rate by State (%)
            </p>
            <ChartActionsWrapper registryKey="education/dropout" data={data}>
              <HorizontalBarChart
              items={stateDropoutBars}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
              labelWidth={140}
              barHeight={24}
            />
            </ChartActionsWrapper>
          </div>
        )}

        <CrossDomainLink domain="education" sectionId="dropout" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
