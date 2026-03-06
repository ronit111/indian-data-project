import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { AreaChart, type AreaSeries, type OverlayLine } from '../viz/AreaChart.tsx';
import type { ExternalData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface ExternalSectionProps {
  external: ExternalData;
}

export function ExternalSection({ external }: ExternalSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const areaSeries: AreaSeries[] = useMemo(() => [
    {
      id: 'exports',
      name: 'Exports (% GDP)',
      color: 'var(--cyan)',
      data: external.series.map((d) => ({ year: d.year, value: d.exports })),
    },
    {
      id: 'imports',
      name: 'Imports (% GDP)',
      color: 'var(--saffron)',
      data: external.series.map((d) => ({ year: d.year, value: d.imports })),
    },
  ], [external]);

  const overlay: OverlayLine = useMemo(() => ({
    id: 'cad',
    name: 'Current Account Deficit',
    color: 'var(--gold)',
    data: external.series.map((d) => ({ year: d.year, value: d.cadPctGDP })),
    unit: '% GDP',
  }), [external]);

  return (
    <section ref={ref} id="external" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          India and the world
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's trade deficit is structural, not cyclical: we import oil, electronics, and gold; we export IT services and some manufacturing. The Current Account Deficit (CAD) is the gap between what India earns from the world and what it pays. Remittances from Indians working abroad are the single biggest cushion. Forex reserves are the war chest that keeps a global oil shock from immediately spiking your petrol price.
        </motion.p>

        <ChartActionsWrapper registryKey="economy/external" data={external}>
          <AreaChart
          series={areaSeries}
          overlay={overlay}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="% GDP"
        />
        </ChartActionsWrapper>

        {/* Forex reserves callout */}
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
            Forex reserves: ${external.series[external.series.length - 1]?.forexReserves ?? '—'} billion ({external.series[external.series.length - 1]?.year})
          </span>
        </motion.div>

        <p className="source-attribution">
          Source: {external.source}
        </p>
      </div>
    </section>
  );
}
