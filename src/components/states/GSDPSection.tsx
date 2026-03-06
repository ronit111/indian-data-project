import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { GSDPData } from '../../lib/data/schema.ts';

interface GSDPSectionProps {
  data: GSDPData;
}

export function GSDPSection({ data }: GSDPSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.states
      .filter((s) => s.gsdp > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.gsdp }));
  }, [data]);

  const topItems: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.gsdp > 0)
      .sort((a, b) => b.gsdp - a.gsdp)
      .slice(0, 8)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: Math.round(s.gsdp),
        color: 'var(--emerald)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="gsdp" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The economic engines
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          GSDP (Gross State Domestic Product) is the total value of everything a state produces in a year. Maharashtra alone contributes more than most nations' entire economies. The bottom 10 states combined don't match it. This is not a gentle gradient — it is a cliff. Same country, different reality.
        </motion.p>

        <ChartActionsWrapper registryKey="states/gsdp" data={data}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <GenericChoropleth
              data={choroData}
              colorScaleType="sequential"
              accentColor="var(--emerald)"
              formatValue={(v) => `₹${(v / 100000).toFixed(1)}L Cr`}
              legendLabel="GSDP"
              isVisible={isVisible}
            />
            <div>
              <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Top 8 by GSDP
              </p>
              <HorizontalBarChart
                items={topItems}
                isVisible={isVisible}
                formatValue={(v) => `₹${(v / 100000).toFixed(2)}L Cr`}
                unit=""
                labelWidth={120}
                barHeight={22}
              />
            </div>
          </div>
        </ChartActionsWrapper>

        <RelatedTopics sectionId="gsdp" domain="states" />
        <CrossDomainLink domain="states" sectionId="gsdp" />

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
