import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { SectorsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface SectorsSectionProps {
  sectors: SectorsData;
}

export function SectorsSection({ sectors }: SectorsSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const items: BarItem[] = useMemo(() =>
    sectors.sectors.map((s) => ({
      id: s.id,
      label: s.name,
      value: s.currentGrowth,
      secondaryValue: s.fiveYearAvg,
      color: 'var(--cyan)',
      secondaryColor: 'var(--text-muted)',
      annotation: s.id === 'construction' || s.id === 'manufacturing'
        ? `${s.gvaShare}% of GDP (within Industry)`
        : `${s.gvaShare}% of GDP`,
    })),
  [sectors]);

  return (
    <section ref={ref} id="sectors" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Sector scorecard
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Services dominate at roughly half of GDP — strength in IT and financial services, but a vulnerability too: services employ fewer people per unit of GDP than manufacturing. Construction leads growth this year; manufacturing is gaining. The structural shift to a factory economy — the kind that created mass employment in China and Korea — hasn't happened yet.
        </motion.p>

        <ChartActionsWrapper registryKey="economy/sectors" data={sectors}>
          <HorizontalBarChart
          items={items}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="%"
          showSecondary
          primaryLabel="Current Growth"
          secondaryLabel="5-Year Average"
          labelWidth={150}
        />
        </ChartActionsWrapper>

        <RelatedTopics sectionId="sectors" domain="economy" />
        <CrossDomainLink domain="economy" sectionId="sectors" />


        <p className="source-attribution">
          Source: {sectors.source}
        </p>
      </div>
    </section>
  );
}
