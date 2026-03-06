import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { InflationData } from '../../lib/data/schema.ts';

interface InflationSectionProps {
  inflation: InflationData;
}

export function InflationSection({ inflation }: InflationSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const MIN_POINTS = 3;

  const series: LineSeries[] = useMemo(() => {
    const foodData = inflation.series
      .filter((d) => d.cpiFood !== null)
      .map((d) => ({ year: d.period, value: d.cpiFood! }));

    const coreData = inflation.series
      .filter((d) => d.cpiCore !== null)
      .map((d) => ({ year: d.period, value: d.cpiCore! }));

    const all: LineSeries[] = [
      {
        id: 'cpi-headline',
        name: 'Overall CPI',
        color: 'var(--saffron)',
        data: inflation.series.map((d) => ({ year: d.period, value: d.cpiHeadline })),
      },
    ];

    if (foodData.length >= MIN_POINTS) {
      all.push({ id: 'cpi-food', name: 'Food CPI', color: 'var(--gold)', data: foodData });
    }
    if (coreData.length >= MIN_POINTS) {
      all.push({ id: 'cpi-core', name: 'Core (excl. food & fuel)', color: 'var(--cyan)', data: coreData, dashed: true });
    }

    return all;
  }, [inflation]);

  const hasBreakdown = series.length > 1;

  return (
    <section ref={ref} id="inflation" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Taming inflation
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {hasBreakdown
            ? 'The RBI targets CPI (Consumer Price Index) inflation between 2-6%. Food prices remain the most volatile component, while core inflation (excluding food and fuel) has been steadily declining.'
            : 'The RBI targets CPI (Consumer Price Index) inflation between 2-6%. After peaking at 6.7% in 2022-23, headline inflation has returned to 4.0% in 2025-26 — right at the target midpoint.'}
        </motion.p>

        <ChartActionsWrapper registryKey="economy/inflation" data={inflation}>
          <LineChart
            series={series}
            band={{
              lower: inflation.targetBand.lower,
              upper: inflation.targetBand.upper,
              color: '#4AEADC',
              label: 'RBI target (2-6%)',
            }}
            isVisible={isVisible}
            formatValue={(v) => v.toFixed(1)}
            unit="%"
          />
        </ChartActionsWrapper>

        <RelatedTopics sectionId="inflation" domain="economy" />
        <CrossDomainLink domain="economy" sectionId="inflation" />


        <p className="source-attribution">
          Source: {inflation.source}
        </p>
      </div>
    </section>
  );
}
