import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { AreaChart, type AreaSeries } from '../viz/AreaChart.tsx';
import type { ForexData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface ForexSectionProps {
  data: ForexData;
}

export function ForexSection({ data }: ForexSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const areaSeries: AreaSeries[] = useMemo(() => [
    {
      id: 'reserves',
      name: 'Forex Reserves',
      color: 'var(--gold)',
      data: data.reservesUSD.series,
    },
  ], [data]);

  const latestReserves = data.reservesUSD.series.length > 0
    ? data.reservesUSD.series[data.reservesUSD.series.length - 1].value.toFixed(0)
    : '—';

  return (
    <section ref={ref} id="forex" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The reserves buffer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Forex reserves are India's emergency savings in foreign currency. They keep the rupee stable, ensure we can pay for oil and essential imports, and prevent currency crises that would make petrol, electronics, and imported goods more expensive overnight. The reserves include foreign currency assets, gold, and IMF holdings.
        </motion.p>

        <ChartActionsWrapper registryKey="rbi/forex" data={data}>
          <AreaChart
          series={areaSeries}
          isVisible={isVisible}
          formatValue={(v) => `$${v.toFixed(0)}`}
          unit="US$ billion"
        />
        </ChartActionsWrapper>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            background: 'var(--bg-raised)',
            border: 'var(--border-subtle)',
          }}
        >
          <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            ${latestReserves} billion in reserves
          </span>
        </motion.div>

        <p className="source-attribution">
          Source: {data.reservesUSD.source}
        </p>
      </div>
    </section>
  );
}
