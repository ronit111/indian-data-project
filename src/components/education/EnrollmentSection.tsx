import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { EnrollmentData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface EnrollmentSectionProps {
  data: EnrollmentData;
}

export function EnrollmentSection({ data }: EnrollmentSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const enrollmentSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.primaryTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'primary-ger',
        name: 'Primary GER',
        color: 'var(--blue)',
        data: data.primaryTimeSeries,
      });
    }
    if (data.secondaryTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'secondary-ger',
        name: 'Secondary GER',
        color: 'var(--blue-light)',
        data: data.secondaryTimeSeries,
      });
    }
    if (data.tertiaryTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'tertiary-ger',
        name: 'Tertiary GER',
        color: 'var(--cyan)',
        data: data.tertiaryTimeSeries,
      });
    }
    return series.filter((s) => s.data.length > 0);
  }, [data]);

  return (
    <section ref={ref} id="enrollment" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The enrollment triumph
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India has achieved near-universal primary enrollment with a GER above 93%. The real revolution is in secondary and tertiary education, where enrollment has tripled in two decades.
        </motion.p>

        {enrollmentSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Gross Enrollment Ratio by Level (%)
            </p>
            <ChartActionsWrapper registryKey="education/enrollment" data={data}>
              <LineChart
              series={enrollmentSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit="%"
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="enrollment" domain="education" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
