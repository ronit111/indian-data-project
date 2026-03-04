import { motion } from 'framer-motion';
import { formatIndianNumber } from '../../lib/format.ts';
import type { MetricResult } from '../../lib/stateReportEngine.ts';

interface MetricRowProps {
  metric: MetricResult;
  accentColor: string;
  index: number;
}

function formatMetricValue(value: number, unit: string): string {
  if (unit === 'Rs' && value >= 100000) return `Rs ${formatIndianNumber(value)}`;
  if (unit === 'Rs Cr' && value >= 100) return `Rs ${formatIndianNumber(Math.round(value))} Cr`;
  if (unit === '%' || unit === '% GSDP' || unit === 'pp') return `${value.toFixed(1)}${unit}`;
  if (unit === '/sq km') return `${formatIndianNumber(Math.round(value))}/sq km`;
  if (unit === 'per lakh' || unit === 'per 10K' || unit === 'per 1000') return `${value.toFixed(1)} ${unit}`;
  if (value >= 1000000) return formatIndianNumber(Math.round(value));
  if (Number.isInteger(value)) return formatIndianNumber(value);
  return value.toFixed(1);
}

const QUARTILE_COLORS: Record<number, string> = {
  1: '#10B981', // green — top 25%
  2: '#FFC857', // gold — 25-50%
  3: '#F59E0B', // amber — 50-75%
  4: '#EF4444', // red — bottom 25%
};

const QUARTILE_LABELS: Record<number, string> = {
  1: 'Top 25%',
  2: 'Above Avg',
  3: 'Below Avg',
  4: 'Bottom 25%',
};

export function MetricRow({ metric, index }: MetricRowProps) {
  const { def, value, nationalAvg, rank, totalStates, quartile } = metric;

  if (value == null) return null;

  const quartileColor = QUARTILE_COLORS[quartile] ?? '#6B7280';

  return (
    <motion.div
      className="py-3"
      style={{ borderBottom: 'var(--border-subtle)' }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Label + rank */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {def.label}
            </span>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: quartileColor + '20',
                color: quartileColor,
              }}
            >
              #{rank}/{totalStates}
            </span>
          </div>
          {nationalAvg != null && (
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              National avg: {formatMetricValue(nationalAvg, def.unit)}
            </p>
          )}
        </div>

        {/* Value */}
        <div className="text-right">
          <span
            className="text-sm font-mono font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatMetricValue(value, def.unit)}
          </span>
          <p
            className="text-[10px]"
            style={{ color: quartileColor }}
          >
            {QUARTILE_LABELS[quartile]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
