import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { PopulationData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface PopulationSectionProps {
  data: PopulationData;
}

export function PopulationSection({ data }: PopulationSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const popSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.nationalTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'population',
        name: 'Population',
        color: 'var(--violet)',
        data: data.nationalTimeSeries.map((p) => ({
          year: p.year,
          value: p.value / 1_000_000_000, // convert to billions
        })),
      });
    }
    return series;
  }, [data]);

  const growthSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.growthTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'growth',
        name: 'Population Growth',
        color: 'var(--violet-light)',
        data: data.growthTimeSeries,
      });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="population" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          1.45 billion and counting
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India overtook China as the world's most populous country in 2023. But the growth rate has been falling steadily — from 1.9% in 2000 to under 0.9% by 2022, before ticking up slightly.
        </motion.p>

        {popSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Total Population (billions)
            </p>
            <ChartActionsWrapper registryKey="census/population" data={data}>
              <LineChart
              series={popSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(2)}B`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        {growthSeries.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Annual Growth Rate (%)
            </p>
            <ChartActionsWrapper registryKey="census/population" data={data}>
              <LineChart
              series={growthSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(2)}%`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="population" domain="census" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
