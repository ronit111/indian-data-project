import { motion } from 'framer-motion';
import { formatIndianNumber } from '../../lib/format.ts';
import type { EMIBreakdown } from '../../lib/emiEngine.ts';

interface EMIBreakdownDisplayProps {
  breakdown: EMIBreakdown;
  loanAmount: number;
}

export function EMIBreakdownDisplay({ breakdown, loanAmount }: EMIBreakdownDisplayProps) {
  const principalPct = (loanAmount / breakdown.totalPayment) * 100;
  const interestPct = 100 - principalPct;

  return (
    <div className="space-y-6">
      {/* Hero EMI */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          Monthly EMI
        </p>
        <p
          className="font-mono font-extrabold"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)' }}
        >
          <span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>₹</span>
          {formatIndianNumber(breakdown.monthlyEMI)}
        </p>
      </div>

      {/* Principal vs Interest bar */}
      <div>
        <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-surface)' }}>
          <motion.div
            className="h-full rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${principalPct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: 'var(--cyan)' }}
          />
          <motion.div
            className="h-full rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${interestPct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ background: 'var(--saffron)', opacity: 0.7 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--cyan)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Principal {principalPct.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--saffron)', opacity: 0.7 }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Interest {interestPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCell label="Total Payment" value={`₹${formatIndianNumber(breakdown.totalPayment)}`} />
        <StatCell label="Total Interest" value={`₹${formatIndianNumber(breakdown.totalInterest)}`} accent />
        <StatCell label="Effective Rate" value={`${breakdown.effectiveRate.toFixed(2)}%`} />
        <StatCell
          label="Interest per ₹1"
          value={`₹${breakdown.interestRatio.toFixed(2)}`}
          subtitle="for every ₹1 you borrow"
          accent
        />
      </div>
    </div>
  );
}

function StatCell({ label, value, subtitle, accent }: { label: string; value: string; subtitle?: string; accent?: boolean }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)' }}
    >
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p
        className="font-mono font-bold text-sm"
        style={{ color: accent ? 'var(--saffron)' : 'var(--text-primary)' }}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      )}
    </div>
  );
}
