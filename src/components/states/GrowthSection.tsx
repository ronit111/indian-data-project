import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { DotStrip, type DotStripDataPoint } from '../viz/DotStrip.tsx';
import type { GSDPData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface GrowthSectionProps {
  data: GSDPData;
}

export function GrowthSection({ data }: GrowthSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const dots: DotStripDataPoint[] = useMemo(() => {
    return data.states
      .filter((s) => s.growthRate > 0)
      .sort((a, b) => b.growthRate - a.growthRate)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.growthRate,
      }));
  }, [data]);

  // National median
  const median = useMemo(() => {
    const sorted = dots.map((d) => d.value).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }, [dots]);

  // Highlight top 5 and bottom 5
  const highlights = useMemo(() => {
    const top5 = dots.slice(0, 5).map((d) => d.id);
    const bot5 = dots.slice(-5).map((d) => d.id);
    return [...top5, ...bot5];
  }, [dots]);

  return (
    <section ref={ref} id="growth" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Who's catching up?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Each dot is a state. If the laggards were growing fastest, they'd close the gap — that would be convergence. If they're stuck near or below the median, the gap widens. The critical question: are Bihar, UP, and Jharkhand — home to 40 crore people — above or below the line?
        </motion.p>

        <ChartActionsWrapper registryKey="states/growth" data={data}>
          <DotStrip
            data={dots}
            formatValue={(v) => `${v.toFixed(1)}%`}
            valueLabel="Growth Rate"
            accentColor="var(--emerald)"
            referenceLine={{ value: median, label: `Median ${median.toFixed(1)}%`, color: 'var(--emerald)' }}
            highlightIds={highlights}
            isVisible={isVisible}
          />
        </ChartActionsWrapper>

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
