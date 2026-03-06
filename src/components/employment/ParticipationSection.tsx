import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { ParticipationData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface ParticipationSectionProps {
  data: ParticipationData;
}

export function ParticipationSection({ data }: ParticipationSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const lfprSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.lfprTotalTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'lfpr-total',
        name: 'Total LFPR',
        color: 'var(--amber)',
        data: data.lfprTotalTimeSeries,
      });
    }
    if (data.lfprMaleTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'lfpr-male',
        name: 'Male',
        color: 'var(--amber-light)',
        data: data.lfprMaleTimeSeries,
      });
    }
    if (data.lfprFemaleTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'lfpr-female',
        name: 'Female',
        color: 'var(--saffron)',
        data: data.lfprFemaleTimeSeries,
      });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="participation" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The participation puzzle
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's labour force participation rate is 55.8% — one of the lowest among major
          economies. For every 10 working-age Indians, only 5-6 are in the labour force.
        </motion.p>

        {lfprSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Labour Force Participation Rate (%)
            </p>
            <ChartActionsWrapper registryKey="employment/participation" data={data}>
              <LineChart
              series={lfprSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="participation" domain="employment" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
