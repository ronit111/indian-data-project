import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { ScatterChart, type ScatterDataPoint } from '../viz/ScatterChart.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { FiscalHealthData } from '../../lib/data/schema.ts';

interface FiscalHealthSectionProps {
  data: FiscalHealthData;
}

export function FiscalHealthSection({ data }: FiscalHealthSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const scatterData: ScatterDataPoint[] = useMemo(() => {
    // Find top 3 most stressed states for annotation
    const sorted = [...data.states]
      .filter((s) => s.debtToGsdp > 0)
      .sort((a, b) => b.debtToGsdp - a.debtToGsdp);
    const topStressed = new Set(sorted.slice(0, 3).map((s) => s.id));

    return data.states
      .filter((s) => s.debtToGsdp > 0 || s.fiscalDeficitPctGsdp !== 0)
      .map((s) => ({
        id: s.id,
        label: s.name,
        x: s.fiscalDeficitPctGsdp,
        y: s.debtToGsdp,
        color: s.fiscalDeficitPctGsdp < 0 ? 'var(--positive)' : 'var(--saffron)',
        annotation: topStressed.has(s.id) || s.fiscalDeficitPctGsdp < 0
          ? s.name
          : undefined,
      }));
  }, [data]);

  return (
    <section ref={ref} id="fiscal-health" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The weight of debt
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Each dot is a state. States to the right borrow more, states higher up carry more debt. The FRBM (Fiscal Responsibility and Budget Management) Act caps state borrowing at 3% of GSDP. Punjab, for instance, carries debt equal to 47% of its annual output. High-debt states spend more on interest payments than on schools or hospitals. Green dots are running a surplus.
        </motion.p>

        <ChartActionsWrapper registryKey="states/fiscal-health" data={data}>
          <ScatterChart
            data={scatterData}
            xLabel="Fiscal Deficit (% of GSDP)"
            yLabel="Debt-to-GSDP (%)"
            xFormat={(v) => `${v.toFixed(1)}%`}
            yFormat={(v) => `${v.toFixed(0)}%`}
            xReferenceLine={{ value: 3, label: 'FRBM 3%', color: 'var(--saffron)' }}
            quadrantLabels={{
              topLeft: 'Low deficit, high debt',
              topRight: 'Stressed',
              bottomLeft: 'Fiscally healthy',
              bottomRight: 'High deficit, low debt',
            }}
            isVisible={isVisible}
          />
        </ChartActionsWrapper>

        <RelatedTopics sectionId="fiscal-health" domain="states" />

        <p className="source-attribution">
          Source: {data.source} ({data.year})
        </p>
      </div>
    </section>
  );
}
