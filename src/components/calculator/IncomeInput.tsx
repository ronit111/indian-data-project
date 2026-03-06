import { useEffect } from 'react';
import { useSpring, useTransform, motion, AnimatePresence } from 'framer-motion';
import { useCalculatorStore } from '../../store/calculatorStore.ts';
import { SegmentedControl } from '../ui/SegmentedControl.tsx';
import { formatLPA, formatIndianNumber } from '../../lib/format.ts';

const PRESETS = [500000, 1000000, 2500000, 5000000, 10000000, 50000000];

const REGIME_OPTIONS: { value: 'new' | 'old'; label: string }[] = [
  { value: 'new', label: 'New Regime' },
  { value: 'old', label: 'Old Regime' },
];

export function IncomeInput() {
  const { income, regime, oldRegimeDeductions, setIncome, setRegime, setOldRegimeDeductions } = useCalculatorStore();
  const pct = (income / 100000000) * 100;

  // Smooth spring animation for the displayed income number
  const springIncome = useSpring(income, { stiffness: 120, damping: 20 });
  const displayIncome = useTransform(springIncome, (v) => formatIndianNumber(Math.round(v)));

  useEffect(() => {
    springIncome.set(income);
  }, [income, springIncome]);

  const handleDeductionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setOldRegimeDeductions(raw === '' ? 0 : parseInt(raw, 10));
  };

  return (
    <div className="space-y-8">
      {/* Hero income display */}
      <div className="text-center py-4">
        <p className="text-caption uppercase tracking-wider mb-3">Your Annual Income</p>
        <p
          className="font-mono font-extrabold leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text-primary)' }}
        >
          <span className="text-annotation" style={{ fontSize: '0.45em', verticalAlign: 'baseline' }}>
            Rs{' '}
          </span>
          <motion.span>{displayIncome}</motion.span>
        </p>
        <p className="text-annotation mt-2">{formatLPA(income)}</p>
      </div>

      {/* Custom slider */}
      <div className="px-1">
        <input
          type="range"
          min={0}
          max={100000000}
          step={50000}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="income-slider"
          style={
            {
              '--fill-pct': `${pct}%`,
            } as React.CSSProperties
          }
          aria-label="Annual income"
        />
        <div className="flex justify-between text-caption font-mono mt-2">
          <span>₹0</span>
          <span>₹10 Cr</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setIncome(preset)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
            style={{
              background: income === preset ? 'var(--bg-hover)' : 'var(--bg-raised)',
              color: income === preset ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: income === preset ? '1px solid var(--cyan)' : 'var(--border-subtle)',
            }}
          >
            {formatLPA(preset)}
          </button>
        ))}
      </div>

      {/* Regime selector */}
      <div className="flex justify-center">
        <SegmentedControl options={REGIME_OPTIONS} value={regime} onChange={setRegime} />
      </div>

      {/* Old Regime: total deductions input */}
      <AnimatePresence>
        {regime === 'old' && (
          <motion.div
            key="deductions-input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-lg p-4 flex items-center gap-4"
              style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)' }}
            >
              <div className="flex-1">
                <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Total Deductions
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Rs
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={oldRegimeDeductions === 0 ? '' : formatIndianNumber(oldRegimeDeductions)}
                    onChange={handleDeductionsChange}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg font-mono text-sm outline-none transition-colors"
                    style={{
                      background: 'var(--bg-void)',
                      color: 'var(--text-primary)',
                      border: 'var(--border-subtle)',
                    }}
                    aria-label="Total deductions under Old Regime"
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Add up your 80C + 80D + HRA + 24(b) + other deductions
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
