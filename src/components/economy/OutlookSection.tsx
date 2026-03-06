import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { EconomySummary } from '../../lib/data/schema.ts';

interface OutlookSectionProps {
  summary: EconomySummary;
}

export function OutlookSection({ summary }: OutlookSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.15 });

  const cards = [
    {
      label: 'GDP Growth Projection',
      value: summary.projectedGrowthLow === summary.projectedGrowthHigh
        ? `${summary.projectedGrowthLow}%`
        : `${summary.projectedGrowthLow}–${summary.projectedGrowthHigh}%`,
      note: 'FY 2025-26 Economic Survey projection',
      color: 'var(--cyan)',
    },
    {
      label: 'CPI Inflation',
      value: `${summary.cpiInflation}%`,
      note: 'Annual average',
      color: 'var(--saffron)',
    },
    {
      label: 'Fiscal Deficit',
      value: `${summary.fiscalDeficitPercentGDP}%`,
      note: '% of GDP',
      color: 'var(--gold)',
    },
    {
      label: 'Current Account',
      value: `${Math.abs(summary.currentAccountDeficitPercentGDP)}%`,
      note: `CA ${summary.currentAccountDeficitPercentGDP < 0 ? 'deficit' : 'surplus'} (% of GDP)`,
      color: 'var(--cyan)',
    },
  ];

  return (
    <section ref={ref} id="outlook" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The road ahead
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-10 max-w-xl"
        >
          Growth is projected to stay fast by global standards. But the question isn't whether India grows. It's whether growth reaches the 60% of Indians in rural areas, the 45% still in agriculture, and the young people entering the workforce at 1.2 crore a year. These are the four numbers that set the challenge.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              className="rounded-xl p-5"
              style={{
                background: 'var(--bg-raised)',
                border: 'var(--border-subtle)',
              }}
            >
              <p className="text-caption mb-3">{card.label}</p>
              <p
                className="text-stat mb-1"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
              <p className="text-caption">{card.note}</p>
            </motion.div>
          ))}
        </div>

        <p className="source-attribution">
          Source: {summary.source}
        </p>
      </div>
    </section>
  );
}
