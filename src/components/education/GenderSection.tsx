import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { EnrollmentData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface GenderSectionProps {
  data: EnrollmentData;
}

export function GenderSection({ data }: GenderSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const genderSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.femaleSecondary.length >= MIN_POINTS) {
      series.push({
        id: 'female-secondary',
        name: 'Female',
        color: 'var(--blue)',
        data: data.femaleSecondary,
      });
    }
    if (data.maleSecondary.length >= MIN_POINTS) {
      series.push({
        id: 'male-secondary',
        name: 'Male',
        color: 'var(--blue-light)',
        data: data.maleSecondary,
      });
    }
    return series.filter((s) => s.data.length > 0);
  }, [data]);

  return (
    <section ref={ref} id="gender" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The gender convergence
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Girls have nearly caught up with boys in secondary enrollment. In some states, more girls now attend secondary school than boys.
        </motion.p>

        {genderSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Secondary GER by Gender (%)
            </p>
            <ChartActionsWrapper registryKey="education/gender" data={data}>
              <LineChart
              series={genderSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
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
