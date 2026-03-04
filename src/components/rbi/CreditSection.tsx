import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart } from '../viz/LineChart.tsx';
import type { CreditData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface CreditSectionProps {
  data: CreditData;
}

export function CreditSection({ data }: CreditSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} id="credit" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Where bank lending goes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          This tracks total bank loans to businesses and families — home loans, business credit, personal loans. At over 50% of GDP, India's lending has deepened significantly, meaning more people and businesses have access to formal credit than a decade ago.
        </motion.p>

        <ChartActionsWrapper registryKey="rbi/credit" data={data}>
          <LineChart
          series={[
            {
              id: 'private-credit',
              name: 'Private Sector Credit (% GDP)',
              color: 'var(--cyan)',
              data: data.privateCreditPctGDP.series,
            },
          ].filter((s) => s.data.length > 0)}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(1)}
          unit="% GDP"
        />
        </ChartActionsWrapper>

        <p className="source-attribution">
          Source: {data.privateCreditPctGDP.source}
        </p>
      </div>
    </section>
  );
}
