import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { FiscalData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface FiscalSectionProps {
  fiscal: FiscalData;
}

export function FiscalSection({ fiscal }: FiscalSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const items: BarItem[] = useMemo(() =>
    fiscal.series.map((d) => ({
      id: d.year,
      label: d.year,
      value: d.fiscalDeficitPctGDP,
      secondaryValue: d.revenueDeficitPctGDP,
      color: 'var(--saffron)',
      secondaryColor: 'var(--gold)',
    })),
  [fiscal]);

  return (
    <section ref={ref} id="fiscal" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The fiscal picture
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Fiscal consolidation has been steady since the COVID-era peak of 9.2%.
          The FRBM Act sets a long-term target of 3% of GDP. The government is on track but not there yet.
        </motion.p>

        <ChartActionsWrapper registryKey="economy/fiscal" data={fiscal}>
          <HorizontalBarChart
          items={items}
          target={{
            value: fiscal.targetFiscalDeficit,
            label: `FRBM target (${fiscal.targetFiscalDeficit}%)`,
            color: 'var(--cyan)',
          }}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="% GDP"
          showSecondary
          primaryLabel="Fiscal Deficit"
          secondaryLabel="Revenue Deficit"
        />
        </ChartActionsWrapper>

        <RelatedTopics sectionId="fiscal" domain="economy" />
        <CrossDomainLink domain="economy" sectionId="fiscal" />


        <p className="source-attribution">
          Source: {fiscal.source}
        </p>
      </div>
    </section>
  );
}
