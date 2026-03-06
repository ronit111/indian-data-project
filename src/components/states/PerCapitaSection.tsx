import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { GSDPData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface PerCapitaSectionProps {
  data: GSDPData;
}

export function PerCapitaSection({ data }: PerCapitaSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.states
      .filter((s) => s.perCapitaNsdp > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.perCapitaNsdp }));
  }, [data]);

  const nationalAvg = useMemo(() => {
    // Weighted average: sum(GSDP) / sum(population) * 100 (GSDP in crore, population in lakhs)
    const valid = data.states.filter((s) => s.perCapitaNsdp > 0 && s.population > 0);
    const totalGsdp = valid.reduce((sum, s) => sum + s.gsdp, 0);
    const totalPop = valid.reduce((sum, s) => sum + s.population, 0);
    return totalPop > 0 ? (totalGsdp * 100) / totalPop : 0;
  }, [data]);

  const topItems: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.perCapitaNsdp > 0)
      .sort((a, b) => b.perCapitaNsdp - a.perCapitaNsdp)
      .slice(0, 8)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.perCapitaNsdp,
        color: 'var(--emerald)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="percapita" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The real standard of living
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          This is the punchline. When you divide by population, the hierarchy reshuffles — Delhi and Telangana leap ahead, while Uttar Pradesh, a political powerhouse, sits near the bottom. The Goa-Bihar gap is 8-9x. A worker in Goa produces in one month what a worker in Bihar produces in eight. Same country, different reality. The Constitution promises equality of opportunity. The data shows that the single biggest determinant of your economic life is which state you were born in.
        </motion.p>

        <ChartActionsWrapper registryKey="states/percapita" data={data}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <GenericChoropleth
              data={choroData}
              colorScaleType="sequential"
              accentColor="var(--emerald)"
              formatValue={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
              legendLabel="Per capita NSDP"
              isVisible={isVisible}
              nationalAvg={nationalAvg}
            />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Top 8 by per capita NSDP
              </p>
              <HorizontalBarChart
                items={topItems}
                isVisible={isVisible}
                formatValue={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
                unit=""
                labelWidth={120}
                barHeight={22}
              />
            </div>
          </div>
        </ChartActionsWrapper>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="text-annotation mt-10 max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          The mosaic is beautiful in theory. For the 22 crore people in Bihar — India's most populous laggard — it is the daily texture of constraint. Links to the Fiscal Federalism and Regional Inequality topics explore how redistribution works, and where it falls short.
        </motion.p>

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
