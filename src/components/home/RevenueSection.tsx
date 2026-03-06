import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { WaffleChart, WaffleLegend } from '../viz/WaffleChart.tsx';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { ReceiptsData } from '../../lib/data/schema.ts';
import { formatLakhCrore } from '../../lib/format.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface RevenueSectionProps {
  receipts: ReceiptsData;
}

export function RevenueSection({ receipts }: RevenueSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  // "Per rupee spent" = borrowings / total receipts (which equals total expenditure).
  // This matches DeficitSection's framing and the waffle chart's visual proportions.
  const borrowingAmt = receipts.categories.find((c) => c.id === 'borrowings')?.amount || 0;
  const borrowingPaise = receipts.total > 0 ? Math.round((borrowingAmt / receipts.total) * 100) : 0;

  return (
    <section ref={ref} id="revenue" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Annotation panel */}
          <div className="md:sticky md:top-24">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-composition mb-4"
            >
              {'Where the money comes from'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-annotation mb-3"
            >
              {'Total receipts:'} <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatLakhCrore(receipts.total)}
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="text-annotation mb-6"
            >
              {`Each square = 1%. For every rupee spent, ${borrowingPaise} paise is borrowed.`}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <WaffleLegend
                categories={receipts.categories}
                hoveredCat={hoveredCat}
                onHover={setHoveredCat}
              />
            </motion.div>

            <p className="source-attribution mt-8">
              {'Source: Union Budget 2025-26, Receipt Budget'}
            </p>
          </div>

          {/* Waffle chart — fills the right side */}
          <ChartActionsWrapper registryKey="budget/revenue" data={receipts}>
            <WaffleChart
            categories={receipts.categories}
            isVisible={isVisible}
            highlightCategory={hoveredCat}
          />
          </ChartActionsWrapper>
        </div>
      </div>
    </section>
  );
}
