import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart } from '../viz/LineChart.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { GDPGrowthData } from '../../lib/data/schema.ts';

interface GrowthSectionProps {
  gdp: GDPGrowthData;
}

export function GrowthSection({ gdp }: GrowthSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} id="growth" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The growth story
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Real GDP growth (adjusted for inflation) tells you how much more the economy produced — more goods, more services, more jobs. India grew at 7%+. But per-capita GDP grew slower because of population growth, and most gains concentrated in services. From the 8% pre-pandemic peak through the -5.8% COVID collapse to the recovery, here is the headline number — and what it leaves unsaid.
        </motion.p>

        <ChartActionsWrapper registryKey="economy/growth" data={gdp}>
          <LineChart
            series={[
              {
                id: 'gdp-growth',
                name: 'Real GDP Growth',
                color: 'var(--cyan)',
                data: gdp.series,
              },
            ]}
            referenceLine={0}
            isVisible={isVisible}
            formatValue={(v) => v.toFixed(1)}
            unit="%"
          />
        </ChartActionsWrapper>

        <RelatedTopics sectionId="growth" domain="economy" />


        <p className="source-attribution">
          Source: {gdp.source}
        </p>
      </div>
    </section>
  );
}
