import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { AreaChart, type AreaSeries } from '../viz/AreaChart.tsx';
import type { ResultsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface PartyLandscapeSectionProps {
  data: ResultsData;
}

export function PartyLandscapeSection({ data }: PartyLandscapeSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Build stacked area series for seat evolution
  // Order: INC at bottom (starts large), BJP, then others on top
  const seatSeries: AreaSeries[] = useMemo(() => {
    if (data.seatEvolution.length === 0) return [];

    // Render order: bottom to top — INC first (dominant early), then BJP, then others
    const order = ['INC', 'BJP', 'Left', 'JD', 'BSP', 'SP', 'Regional', 'Others'];

    return order
      .map((id) => {
        const series = data.seatEvolution.find((s) => s.id === id);
        if (!series) return null;
        return {
          id: series.id,
          name: series.name,
          color: series.color,
          data: series.data.map((d) => ({
            year: d.year,
            value: d.seats,
          })),
        };
      })
      .filter((s): s is AreaSeries => s !== null);
  }, [data]);

  return (
    <section ref={ref} id="party-landscape" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          How India's political map changed
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Congress dominated for 30 years, winning 75% of seats in 1957. The system fractured after 1977 — coalitions ruled for 25 years. Then BJP's 2014 wave restored single-party dominance.
          In 2024, the INDIA alliance pushed BJP below majority for the first time in a decade.
        </motion.p>

        {seatSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Lok Sabha seat share by party, 1957–2024
            </p>
            <ChartActionsWrapper registryKey="elections/party-landscape" data={data}>
              <AreaChart
                series={seatSeries}
                isVisible={isVisible}
                formatValue={(v) => `${v}`}
                unit=" seats"
              />
            </ChartActionsWrapper>
          </div>
        )}

        {/* Era callouts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          {[
            { era: '1957–1984', label: 'Congress Era', detail: 'Single-party dominance. INC averaged 325 seats across 7 elections.', color: '#00BFFF' },
            { era: '1989–2009', label: 'Coalition Era', detail: 'No single party crossed 240 seats. Regional parties held the balance.', color: '#14B8A6' },
            { era: '2014–2024', label: 'BJP Era', detail: 'BJP crossed 240 in 3 consecutive elections. 2024: first check.', color: '#FF6B35' },
          ].map((e) => (
            <div
              key={e.era}
              className="p-4 rounded-lg"
              style={{
                background: 'var(--bg-raised)',
                borderLeft: `3px solid ${e.color}`,
              }}
            >
              <p className="text-xs font-mono" style={{ color: e.color }}>{e.era}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{e.label}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{e.detail}</p>
            </div>
          ))}
        </motion.div>

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
