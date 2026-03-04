import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { BudgetSummary, ExpenditureData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface PerCapitaSectionProps {
  summary: BudgetSummary;
  expenditure: ExpenditureData;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Semantic color grouping: warm for sovereign, cool for welfare/development
const MINISTRY_COLORS: Record<string, string> = {
  'interest-payments': '#FF6B35',
  'transfers-to-states': '#4AEADC',
  defence: '#ff8c5a',
  subsidies: '#5BBFB5',
  'road-transport': '#ffad80',
  railways: '#7CF5E9',
  'home-affairs': '#FFC857',
  'rural-development': '#34d399',
  agriculture: '#5BBFB5',
  education: '#FFC857',
  health: '#4AEADC',
  'other-expenditure': '#5c6a7e',
};

function getColor(id: string, index: number): string {
  if (MINISTRY_COLORS[id]) return MINISTRY_COLORS[id];
  // Fallback: alternate warm/cool
  const fallback = ['#ff8c5a', '#5BBFB5', '#FFC857', '#7CF5E9', '#ffad80', '#34d399'];
  return fallback[index % fallback.length];
}

function shortenName(name: string): string {
  return name
    .replace(/^Ministry of /, '')
    .replace(/^Subsidies \(.*\)$/, 'Subsidies')
    .replace(/ & .*/, '');
}

export function PerCapitaSection({ summary, expenditure }: PerCapitaSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  const top8 = useMemo(() => {
    return [...expenditure.ministries]
      .sort((a, b) => b.budgetEstimate - a.budgetEstimate)
      .slice(0, 8);
  }, [expenditure.ministries]);

  // Compute daily per-capita for each ministry
  const dailyBreakdown = useMemo(() => {
    const totalBudget = expenditure.total;
    return top8.map((m, i) => ({
      id: m.id,
      name: shortenName(m.name),
      fullName: m.name,
      dailyPerCapita: (m.perCapita / 365),
      share: m.budgetEstimate / totalBudget,
      color: getColor(m.id, i),
    }));
  }, [top8, expenditure.total]);

  // Bar segments: cumulative x positions
  const barWidth = 1000;
  const segments = useMemo(() => {
    return dailyBreakdown.reduce<Array<(typeof dailyBreakdown)[number] & { x: number; width: number }>>(
      (acc, m) => {
        const prevEnd = acc.length > 0 ? acc[acc.length - 1].x + acc[acc.length - 1].width : 0;
        const width = m.share * barWidth;
        return [...acc, { ...m, x: prevEnd, width }];
      },
      []
    );
  }, [dailyBreakdown]);

  return (
    <section ref={ref} id="percapita" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={8} className="mb-6 block" isVisible={isVisible} />

        {/* Hero treatment — the daily amount, large and personal */}
        <div className="mb-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
            className="font-extrabold"
          >
            <span className="gradient-text-saffron font-mono">
              Rs {summary.perCapitaDailyExpenditure.toFixed(2)}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.12 }}
            className="text-composition mt-2"
          >
            {'on you, every day'}
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
          className="text-annotation mb-10 max-w-xl"
        >
          {`The government spends Rs ${summary.perCapitaExpenditure.toLocaleString('en-IN')} per citizen per year. Here's how a single day breaks down across the top spending areas.`}
        </motion.p>

        {/* Horizontal segmented bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="max-w-4xl"
        >
          <ChartActionsWrapper registryKey="budget/percapita" data={expenditure}>
            <svg
            viewBox="0 0 1000 56"
            className="w-full rounded-lg overflow-visible"
            role="img"
            aria-label="Daily per-capita spending breakdown by ministry"
          >
            {segments.map((seg, i) => (
              <motion.rect
                key={seg.id}
                x={seg.x}
                y={0}
                height={56}
                rx={i === 0 ? 6 : 0}
                ry={i === 0 ? 6 : 0}
                fill={seg.color}
                initial={{ width: 0 }}
                animate={isVisible ? { width: seg.width } : {}}
                transition={{
                  duration: 0.6,
                  ease: EASE_OUT_EXPO,
                  delay: 0.5 + i * 0.06,
                }}
              />
            ))}
          </svg>
          </ChartActionsWrapper>

          {/* Legend grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mt-8">
            {dailyBreakdown.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.7 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-3 h-3 rounded-sm mt-1 shrink-0"
                  style={{ background: m.color }}
                />
                <div className="min-w-0">
                  <p
                    className="text-xs leading-tight truncate"
                    style={{ color: 'var(--text-secondary)' }}
                    title={m.fullName}
                  >
                    {m.name}
                  </p>
                  <p className="font-mono text-sm font-bold" style={{ color: m.color }}>
                    Rs {m.dailyPerCapita.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="source-attribution">
          {'Source: Union Budget 2025-26, Expenditure Budget. Population estimate: 145 crore.'}
        </p>
      </div>
    </section>
  );
}
