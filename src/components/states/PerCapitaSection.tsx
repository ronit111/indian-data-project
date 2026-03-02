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
      .filter((s) => s.perCapitaGsdp > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.perCapitaGsdp }));
  }, [data]);

  const nationalAvg = useMemo(() => {
    const valid = data.states.filter((s) => s.perCapitaGsdp > 0);
    return valid.reduce((sum, s) => sum + s.perCapitaGsdp, 0) / valid.length;
  }, [data]);

  const topItems: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.perCapitaGsdp > 0)
      .sort((a, b) => b.perCapitaGsdp - a.perCapitaGsdp)
      .slice(0, 8)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.perCapitaGsdp,
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
          A state's total GDP can be large simply because it has a large population. Per capita GSDP adjusts for population, revealing which states actually produce more per person. Goa and Sikkim outpace much larger states.
        </motion.p>

        <ChartActionsWrapper registryKey="states/percapita" data={data}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <GenericChoropleth
              data={choroData}
              colorScaleType="sequential"
              accentColor="var(--emerald)"
              formatValue={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
              legendLabel="Per capita GSDP"
              isVisible={isVisible}
              nationalAvg={nationalAvg}
            />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Top 8 by per capita GSDP
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

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
