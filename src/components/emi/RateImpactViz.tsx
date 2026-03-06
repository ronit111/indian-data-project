import { motion } from 'framer-motion';
import { formatIndianNumber } from '../../lib/format.ts';
import type { RateChangeImpact } from '../../lib/emiEngine.ts';

interface RateImpactVizProps {
  impact: RateChangeImpact;
}

export function RateImpactViz({ impact }: RateImpactVizProps) {
  const { scenarios, currentScenarioIndex } = impact;

  // Find max absolute monthly diff for scaling
  const maxAbsDiff = Math.max(...scenarios.map((s) => Math.abs(s.monthlyDiff)), 1);

  return (
    <div className="space-y-3">
      {scenarios.map((scenario, i) => {
        const isCurrent = i === currentScenarioIndex;
        const barWidth = isCurrent ? 0 : Math.abs(scenario.monthlyDiff / maxAbsDiff) * 100;
        const isNegative = scenario.monthlyDiff < 0;

        return (
          <div
            key={scenario.label}
            className="rounded-lg p-3 transition-colors"
            style={{
              background: isCurrent ? 'var(--bg-hover)' : 'var(--bg-surface)',
              border: isCurrent ? '1px solid var(--gold)' : 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: isCurrent ? 'var(--gold)' : 'var(--bg-raised)',
                    color: isCurrent ? 'var(--bg-void)' : 'var(--text-secondary)',
                  }}
                >
                  {scenario.label}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {scenario.rate.toFixed(2)}%
                </span>
              </div>
              <span
                className="text-sm font-mono font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                ₹{formatIndianNumber(scenario.monthlyEMI)}
              </span>
            </div>

            {!isCurrent && (
              <div className="flex items-center gap-2">
                {/* Diverging bar */}
                <div className="flex-1 h-2 rounded-full relative" style={{ background: 'var(--bg-void)' }}>
                  <motion.div
                    className="absolute h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(barWidth, 100)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: isNegative ? 'var(--cyan)' : 'var(--saffron)',
                      [isNegative ? 'right' : 'left']: '50%',
                      maxWidth: '50%',
                    }}
                  />
                  {/* Center line */}
                  <div
                    className="absolute top-0 bottom-0 w-px left-1/2"
                    style={{ background: 'var(--text-muted)', opacity: 0.3 }}
                  />
                </div>
                {/* Diff labels */}
                <span
                  className="text-xs font-mono whitespace-nowrap"
                  style={{ color: isNegative ? 'var(--cyan)' : 'var(--saffron)' }}
                >
                  {isNegative ? '' : '+'}{formatIndianNumber(scenario.monthlyDiff)}/mo
                </span>
              </div>
            )}

            {!isCurrent && (
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Total {isNegative ? 'savings' : 'extra cost'}: ₹{formatIndianNumber(Math.abs(scenario.totalDiff))} over full tenure
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
