import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { UnemploymentData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface YouthUnemploymentSectionProps {
  data: UnemploymentData;
}

export function YouthUnemploymentSection({ data }: YouthUnemploymentSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const unemploymentSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.totalTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'overall-ur',
        name: 'Overall UR',
        color: 'var(--amber)',
        data: data.totalTimeSeries,
      });
    }
    if (data.youthTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'youth-ur',
        name: 'Youth UR (15-24)',
        color: 'var(--saffron)',
        data: data.youthTimeSeries,
      });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="youth" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Youth unemployment
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Youth unemployment is over 2 times the overall rate. India produces millions of graduates
          each year, but the economy doesn't create enough quality jobs to absorb them.
        </motion.p>

        {unemploymentSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Unemployment Rate (%)
            </p>
            <ChartActionsWrapper registryKey="employment/youth" data={data}>
              <LineChart
              series={unemploymentSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="unemployment" domain="employment" />
        <CrossDomainLink domain="employment" sectionId="youth" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
