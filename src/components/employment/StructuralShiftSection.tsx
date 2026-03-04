import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { SectoralData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface StructuralShiftSectionProps {
  data: SectoralData;
}

export function StructuralShiftSection({ data }: StructuralShiftSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const sectorSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.agricultureTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'agriculture',
        name: 'Agriculture',
        color: 'var(--amber)',
        data: data.agricultureTimeSeries,
      });
    }
    if (data.industryTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'industry',
        name: 'Industry',
        color: 'var(--amber-light)',
        data: data.industryTimeSeries,
      });
    }
    if (data.servicesTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'services',
        name: 'Services',
        color: 'var(--cyan)',
        data: data.servicesTimeSeries,
      });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="structural" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The structural shift
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Agriculture employed 60% of Indians in 2000. Today it's under 45%. Services have surged
          past 30%. India is in the middle of a once-in-a-century economic transformation.
        </motion.p>

        {sectorSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Employment by Sector (% of total)
            </p>
            <ChartActionsWrapper registryKey="employment/structural" data={data}>
              <LineChart
              series={sectorSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit="%"
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="sectoral" domain="employment" />
        <CrossDomainLink domain="employment" sectionId="structural" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
