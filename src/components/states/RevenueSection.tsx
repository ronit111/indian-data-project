import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { RevenueData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';

interface RevenueSectionProps {
  data: RevenueData;
}

export function RevenueSection({ data }: RevenueSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const items: BarItem[] = useMemo(() => {
    return data.states
      .filter((s) => s.totalRevenue > 0)
      .sort((a, b) => b.selfSufficiencyRatio - a.selfSufficiencyRatio)
      .slice(0, 20)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.ownTaxRevenue,
        secondaryValue: s.centralTransfers,
        color: 'var(--emerald)',
        secondaryColor: 'var(--cyan)',
        annotation: `${s.selfSufficiencyRatio}% self-sufficient`,
      }));
  }, [data]);

  return (
    <section ref={ref} id="revenue" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Who pays their own way?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Some states raise most of their revenue from their own taxes. Others depend heavily on the Centre for transfers. This ratio shapes a state's fiscal independence.
        </motion.p>

        <ChartActionsWrapper registryKey="states/revenue" data={data}>
          <HorizontalBarChart
          items={items}
          isVisible={isVisible}
          showSecondary
          primaryLabel="Own Tax Revenue"
          secondaryLabel="Central Transfers"
          formatValue={(v) => `₹${Math.round(v).toLocaleString('en-IN')} Cr`}
          unit=""
          labelWidth={140}
          barHeight={24}
        />
        </ChartActionsWrapper>

        <CrossDomainLink domain="states" sectionId="revenue" />

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
