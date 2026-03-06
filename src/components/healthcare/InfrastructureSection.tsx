import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { InfrastructureData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface InfrastructureSectionProps {
  data: InfrastructureData;
}

export function InfrastructureSection({ data }: InfrastructureSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const timeSeriesSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.hospitalBedsTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'beds',
        name: 'Hospital Beds',
        color: 'var(--rose)',
        data: data.hospitalBedsTimeSeries,
      });
    }
    if (data.physiciansTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'physicians',
        name: 'Physicians',
        color: 'var(--rose-light)',
        data: data.physiciansTimeSeries,
      });
    }
    if (data.nursesTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'nurses',
        name: 'Nurses',
        color: 'var(--saffron)',
        data: data.nursesTimeSeries,
      });
    }
    return series;
  }, [data]);

  const stateBarItems: BarItem[] = useMemo(() => {
    return [...data.stateInfrastructure]
      .filter((s) => s.bedsPerLakh > 0)
      .sort((a, b) => b.bedsPerLakh - a.bedsPerLakh)
      .slice(0, 15)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.bedsPerLakh,
        color: 'var(--rose)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="infrastructure" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The infrastructure deficit
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India has about 1.6 hospital beds per 1,000 people (public and private combined, as of 2021). The WHO recommends 3.5 — we are less than halfway there.
        </motion.p>

        {timeSeriesSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Health workforce &amp; infrastructure (per 1,000 people)
            </p>
            <ChartActionsWrapper registryKey="healthcare/infrastructure" data={data}>
              <LineChart
              series={timeSeriesSeries}
              isVisible={isVisible}
              formatValue={(v) => v.toFixed(2)}
              unit="per 1,000"
            />
            </ChartActionsWrapper>
          </div>
        )}

        {stateBarItems.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Hospital beds per lakh population (top 15 states)
            </p>
            <ChartActionsWrapper registryKey="healthcare/infrastructure" data={data}>
              <HorizontalBarChart
              items={stateBarItems}
              isVisible={isVisible}
              formatValue={(v) => v.toFixed(0)}
              unit="per lakh"
              labelWidth={140}
              barHeight={24}
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="infrastructure" domain="healthcare" />
        <CrossDomainLink domain="healthcare" sectionId="infrastructure" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
