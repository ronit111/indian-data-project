import { useEffect } from 'react';
import { useSpring, useTransform, motion } from 'framer-motion';
import { useEMICalculatorStore, LOAN_RANGES } from '../../store/emiCalculatorStore.ts';
import { SegmentedControl } from '../ui/SegmentedControl.tsx';
import { formatIndianNumber } from '../../lib/format.ts';
import type { LoanType } from '../../lib/emiEngine.ts';

const LOAN_OPTIONS: { value: LoanType; label: string }[] = [
  { value: 'home', label: 'Home Loan' },
  { value: 'car', label: 'Car Loan' },
  { value: 'personal', label: 'Personal' },
];

function formatAmountShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${formatIndianNumber(amount)}`;
}

interface EMIInputPanelProps {
  effectiveRate: number;
  repoRate: number;
  spread: number;
}

export function EMIInputPanel({ effectiveRate, repoRate, spread }: EMIInputPanelProps) {
  const { loanType, loanAmount, tenureYears, customRate, setLoanType, setLoanAmount, setTenureYears, setCustomRate } = useEMICalculatorStore();
  const range = LOAN_RANGES[loanType];
  const amountPct = ((loanAmount - range.minAmount) / (range.maxAmount - range.minAmount)) * 100;

  const springAmount = useSpring(loanAmount, { stiffness: 120, damping: 20 });
  const displayAmount = useTransform(springAmount, (v) => formatAmountShort(Math.round(v)));
  useEffect(() => { springAmount.set(loanAmount); }, [loanAmount, springAmount]);

  return (
    <div className="space-y-6">
      {/* Loan type selector */}
      <div className="flex justify-center">
        <SegmentedControl options={LOAN_OPTIONS} value={loanType} onChange={setLoanType} />
      </div>

      {/* Hero amount display */}
      <div className="text-center py-2">
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Loan Amount</p>
        <p className="font-mono font-extrabold leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
          <motion.span>{displayAmount}</motion.span>
        </p>
      </div>

      {/* Amount slider */}
      <div className="px-1">
        <input
          type="range"
          min={range.minAmount}
          max={range.maxAmount}
          step={loanType === 'personal' ? 10000 : 100000}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="income-slider"
          style={{ '--fill-pct': `${amountPct}%` } as React.CSSProperties}
          aria-label="Loan amount"
        />
        <div className="flex justify-between text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>{formatAmountShort(range.minAmount)}</span>
          <span>{formatAmountShort(range.maxAmount)}</span>
        </div>
      </div>

      {/* Tenure slider */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tenure</span>
          <span className="font-mono font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {tenureYears} {tenureYears === 1 ? 'year' : 'years'}
          </span>
        </div>
        <input
          type="range"
          min={range.minTenure}
          max={range.maxTenure}
          step={1}
          value={tenureYears}
          onChange={(e) => setTenureYears(Number(e.target.value))}
          className="income-slider"
          style={{ '--fill-pct': `${((tenureYears - range.minTenure) / (range.maxTenure - range.minTenure)) * 100}%` } as React.CSSProperties}
          aria-label="Loan tenure in years"
        />
      </div>

      {/* Rate display */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Interest Rate</span>
          <span className="font-mono font-bold" style={{ color: 'var(--gold)' }}>
            {(customRate ?? effectiveRate).toFixed(2)}%
          </span>
        </div>
        {!customRate && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Repo {repoRate}% + Spread {spread.toFixed(2)}%
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={customRate !== null}
              onChange={(e) => setCustomRate(e.target.checked ? effectiveRate : null)}
              className="mr-1.5"
            />
            Custom rate
          </label>
          {customRate !== null && (
            <input
              type="number"
              min={1}
              max={30}
              step={0.05}
              value={customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded text-xs font-mono outline-none"
              style={{ background: 'var(--bg-void)', border: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              aria-label="Custom interest rate"
            />
          )}
        </div>
      </div>
    </div>
  );
}
