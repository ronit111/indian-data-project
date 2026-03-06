import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { DiseaseData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface ImmunizationSectionProps {
  data: DiseaseData;
}

export function ImmunizationSection({ data }: ImmunizationSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const immunizationSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.dptTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'dpt',
        name: 'DPT',
        color: 'var(--rose)',
        data: data.dptTimeSeries,
      });
    }
    if (data.measlesTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'measles',
        name: 'Measles',
        color: 'var(--rose-light)',
        data: data.measlesTimeSeries,
      });
    }
    return series;
  }, [data]);

  const stateBarItems: BarItem[] = useMemo(() => {
    return [...data.stateImmunization]
      .filter((s) => s.fullImmunization > 0)
      .sort((a, b) => b.fullImmunization - a.fullImmunization)
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.fullImmunization,
        color: 'var(--rose)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="immunization" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The immunization push
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          DPT (Diphtheria, Pertussis, Tetanus) and measles vaccination coverage now exceed 90% nationally. But state-level variation remains wide — some states lag by 20 percentage points.
        </motion.p>

        {immunizationSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              National immunization coverage (%)
            </p>
            <ChartActionsWrapper registryKey="healthcare/immunization" data={data}>
              <LineChart
              series={immunizationSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        {stateBarItems.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Full immunization by state (% of children 12-23 months)
            </p>
            <ChartActionsWrapper registryKey="healthcare/immunization" data={data}>
              <HorizontalBarChart
              items={stateBarItems}
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
