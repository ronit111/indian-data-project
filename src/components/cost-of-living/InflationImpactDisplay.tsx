import { motion } from 'framer-motion';
import { formatIndianNumber } from '../../lib/format.ts';
import type { CostOfLivingResult } from '../../lib/costOfLivingEngine.ts';

interface InflationImpactDisplayProps {
  result: CostOfLivingResult;
  fromYear: string;
  toYear: string;
}

export function InflationImpactDisplay({
  result,
  fromYear,
  toYear,
}: InflationImpactDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Hero comparison */}
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Then vs Now
        </p>
        <p
          className="text-sm mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          Your{' '}
          <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            ₹{formatIndianNumber(result.currentTotal)}
          </span>
          /month today
        </p>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          would have cost only{' '}
          <span className="font-mono font-bold" style={{ color: 'var(--cyan)' }}>
            ₹{formatIndianNumber(result.adjustedTotal)}
          </span>
          {' '}in {fromYear}
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBlock
          label="Cumulative Inflation"
          value={`${result.cumulativeInflation.toFixed(1)}%`}
          subtitle={`${fromYear} → ${toYear}`}
        />
        <StatBlock
          label="Annual Rate"
          value={`${result.annualizedRate.toFixed(1)}%`}
          subtitle="geometric mean"
          accent
        />
        <StatBlock
          label="Purchasing Power Lost"
          value={`₹${formatIndianNumber(result.purchasingPowerLoss)}`}
          subtitle="per month"
        />
      </div>

      {/* Category breakdown */}
      <div>
        <h3
          className="text-xs uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          By Category
        </h3>
        <div className="space-y-2">
          {result.byCategory.map((cat) => {
            const maxInflation = Math.max(
              ...result.byCategory.map((c) => Math.abs(c.categoryInflation)),
              1
            );
            const barWidth = Math.abs(cat.categoryInflation / maxInflation) * 100;

            return (
              <div
                key={cat.id}
                className="rounded-lg p-3"
                style={{
                  background: 'var(--bg-surface)',
                  border: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
                    {cat.usedFallback && (
                      <span
                        className="text-[10px] ml-1"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        (headline CPI)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-mono"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ₹{formatIndianNumber(cat.adjustedAmount)} → Rs{' '}
                      {formatIndianNumber(cat.currentAmount)}
                    </span>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{
                        color:
                          cat.categoryInflation > 0
                            ? 'var(--saffron)'
                            : 'var(--cyan)',
                      }}
                    >
                      {cat.categoryInflation > 0 ? '+' : ''}
                      {cat.categoryInflation.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--bg-void)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(barWidth, 100)}%` }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      background:
                        cat.categoryInflation > 0
                          ? 'var(--saffron)'
                          : 'var(--cyan)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string;
  value: string;
  subtitle: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{
        background: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
      }}
    >
      <p
        className="text-[10px] uppercase tracking-wider mb-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </p>
      <p
        className="font-mono font-bold text-sm"
        style={{
          color: accent ? 'var(--saffron)' : 'var(--text-primary)',
        }}
      >
        {value}
      </p>
      <p
        className="text-[10px] mt-0.5"
        style={{ color: 'var(--text-muted)' }}
      >
        {subtitle}
      </p>
    </div>
  );
}
