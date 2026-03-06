import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { TreemapChart } from '../viz/TreemapChart.tsx';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { TreemapData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface ExpenditureSectionProps {
  treemap: TreemapData;
}

export function ExpenditureSection({ treemap }: ExpenditureSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} id="expenditure" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          {'Where the money goes'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {'Nearly half of every rupee goes to state transfers and interest payments. The rest funds defence, infrastructure, welfare, and more.'}
        </motion.p>

        {/* Full-width treemap — no ChartContainer */}
        <ChartActionsWrapper registryKey="budget/expenditure" data={treemap}>
          <TreemapChart root={treemap.root} isVisible={isVisible} />
        </ChartActionsWrapper>

        <p className="source-attribution">
          {'Source: Union Budget 2025-26, Expenditure Budget'}
        </p>
      </div>
    </section>
  );
}
