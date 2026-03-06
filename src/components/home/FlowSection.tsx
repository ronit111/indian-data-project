import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SankeyDiagram } from '../viz/SankeyDiagram.tsx';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { SankeyData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface FlowSectionProps {
  sankey: SankeyData;
}

export function FlowSection({ sankey }: FlowSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} id="flow" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={7} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          {'Follow the money'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {'Revenue sources flow through the Central Government to spending heads. Wider bands mean larger amounts.'}
        </motion.p>

        <ChartActionsWrapper registryKey="budget/flow" data={sankey}>
          <SankeyDiagram data={sankey} isVisible={isVisible} />
        </ChartActionsWrapper>

        <p className="source-attribution">
          {'Source: Union Budget 2025-26, Budget at a Glance'}
        </p>
      </div>
    </section>
  );
}
