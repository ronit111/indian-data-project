import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { formatLakhCrore } from '../../lib/format.ts';
import type { BudgetSummary } from '../../lib/data/schema.ts';

interface DeficitSectionProps {
  summary: BudgetSummary;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function DeficitSection({ summary }: DeficitSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Computed from real data — never hardcoded
  const paisaEarned = Math.round(
    (summary.totalReceipts / summary.totalExpenditure) * 100
  );
  const paisaBorrowed = 100 - paisaEarned;
  const earnedPct = paisaEarned;
  const borrowedPct = paisaBorrowed;

  return (
    <section ref={ref} id="deficit" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        {/* Hero number — the deficit paise, physically large */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
            className="font-extrabold"
          >
            <span className="gradient-text-cyan">{`${paisaBorrowed} paise`}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="text-composition mt-2"
          >
            {'of every rupee is borrowed'}
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.25 }}
          className="text-annotation mb-10 max-w-xl"
        >
          {`The fiscal deficit \u2014 the gap between what the government earns and what it spends \u2014 stands at ${summary.fiscalDeficitPercentGDP}% of GDP. For every rupee spent, ${paisaEarned} paise comes from taxes and other earned revenue. The remaining ${paisaBorrowed} paise is debt: the government's bet that today's borrowing pays for tomorrow's growth.`}
        </motion.p>

        {/* Rupee bar visualization */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="max-w-4xl"
        >
          <ChartActionsWrapper registryKey="budget/deficit" data={summary}>
          <svg
            viewBox="0 0 1000 100"
            className="w-full"
            role="img"
            aria-label={`Rupee breakdown: ${paisaEarned} paise earned, ${paisaBorrowed} paise borrowed`}
          >
            {/* Earned portion */}
            <motion.rect
              x={0}
              y={10}
              height={80}
              rx={6}
              ry={6}
              fill="var(--saffron)"
              initial={{ width: 0 }}
              animate={isVisible ? { width: earnedPct * 10 } : {}}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.5 }}
            />

            {/* Borrowed portion — dashed outline to signify "owed" */}
            <motion.rect
              x={earnedPct * 10}
              y={10}
              height={80}
              rx={6}
              ry={6}
              fill="rgba(74, 234, 220, 0.12)"
              stroke="var(--cyan)"
              strokeWidth={2}
              strokeDasharray="8 4"
              initial={{ width: 0, opacity: 0 }}
              animate={isVisible ? { width: borrowedPct * 10, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1.1 }}
            />

            {/* Labels */}
            <motion.text
              x={earnedPct * 5}
              y={58}
              textAnchor="middle"
              fill="white"
              fontSize={18}
              fontWeight={700}
              fontFamily="var(--font-mono)"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 1.3 }}
            >
              {`${paisaEarned}p earned`}
            </motion.text>

            <motion.text
              x={earnedPct * 10 + borrowedPct * 5}
              y={58}
              textAnchor="middle"
              fill="var(--cyan)"
              fontSize={16}
              fontWeight={600}
              fontFamily="var(--font-mono)"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
            >
              {`${paisaBorrowed}p borrowed`}
            </motion.text>
          </svg>
          </ChartActionsWrapper>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <StatCard
              label={'Total Receipts'}
              value={formatLakhCrore(summary.totalReceipts)}
              color="var(--saffron)"
              delay={0.4}
              isVisible={isVisible}
            />
            <StatCard
              label={'Fiscal Deficit'}
              value={formatLakhCrore(summary.fiscalDeficit)}
              color="var(--cyan)"
              delay={0.5}
              isVisible={isVisible}
            />
            <StatCard
              label={'% of GDP'}
              value={`${summary.fiscalDeficitPercentGDP}%`}
              color="var(--gold)"
              delay={0.6}
              isVisible={isVisible}
            />
          </div>
        </motion.div>

        <RelatedTopics sectionId="flow" domain="budget" />


        <p className="source-attribution">
          {'Source: Union Budget 2025-26, Budget at a Glance'}
        </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  color,
  delay,
  isVisible,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay }}
      className="rounded-lg p-5"
      style={{
        background: 'var(--bg-raised)',
        border: 'var(--border-subtle)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p className="text-caption uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono font-bold text-lg" style={{ color }}>{value}</p>
    </motion.div>
  );
}
