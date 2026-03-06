import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { QualityData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface TeacherSectionProps {
  data: QualityData;
}

export function TeacherSection({ data }: TeacherSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const ptrSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.ptrPrimaryTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'ptr-primary',
        name: 'Primary PTR',
        color: 'var(--blue)',
        data: data.ptrPrimaryTimeSeries,
      });
    }
    if (data.ptrSecondaryTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'ptr-secondary',
        name: 'Secondary PTR',
        color: 'var(--blue-light)',
        data: data.ptrSecondaryTimeSeries,
      });
    }
    return series.filter((s) => s.data.length > 0);
  }, [data]);

  const statePtrBars: BarItem[] = useMemo(() => {
    return data.stateInfrastructure
      .filter((s) => s.ptr > 0)
      .sort((a, b) => b.ptr - a.ptr)
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.ptr,
        color: 'var(--blue)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="teacher" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The teacher challenge
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India has 25 students per primary teacher on average — better than the global average. But the gap between states is enormous: the Pupil-Teacher Ratio (PTR) ranges from 8 in Sikkim to 35 in Jharkhand.
        </motion.p>

        {ptrSeries.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Pupil-Teacher Ratio Over Time
            </p>
            <ChartActionsWrapper registryKey="education/teacher" data={data}>
              <LineChart
              series={ptrSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(0)}`}
              unit="students/teacher"
            />
            </ChartActionsWrapper>
          </div>
        )}

        {statePtrBars.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Pupil-Teacher Ratio by State
            </p>
            <ChartActionsWrapper registryKey="education/teacher" data={data}>
              <HorizontalBarChart
              items={statePtrBars}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(0)}`}
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
