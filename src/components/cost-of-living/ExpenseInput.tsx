import { useCostOfLivingStore } from '../../store/costOfLivingStore.ts';
import { EXPENSE_PRESETS } from '../../lib/costOfLivingEngine.ts';
import { formatIndianNumber } from '../../lib/format.ts';

const CATEGORY_ICONS: Record<string, string> = {
  housing: '🏠',
  food: '🍚',
  transport: '🚌',
  education: '📚',
  healthcare: '💊',
  utilities: '💡',
  other: '📦',
};

export function ExpenseInput() {
  const { expenses, activePreset, setExpenseAmount, applyPreset } =
    useCostOfLivingStore();

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Preset buttons */}
      <div className="flex items-center gap-3 justify-center flex-wrap">
        {Object.entries(EXPENSE_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: activePreset === key ? 'var(--cyan)' : 'var(--bg-surface)',
              color: activePreset === key ? 'var(--bg-void)' : 'var(--text-secondary)',
              border: activePreset === key ? 'none' : 'var(--border-subtle)',
            }}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => {}}
          className="px-4 py-2 rounded-lg text-xs font-medium"
          style={{
            background: activePreset === null ? 'var(--cyan)' : 'var(--bg-surface)',
            color: activePreset === null ? 'var(--bg-void)' : 'var(--text-secondary)',
            border: activePreset === null ? 'none' : 'var(--border-subtle)',
          }}
        >
          Custom
        </button>
      </div>

      {/* Total display */}
      <div className="text-center py-2">
        <p
          className="text-xs uppercase tracking-wider mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Monthly Expenses
        </p>
        <p
          className="font-mono font-extrabold"
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: 'var(--text-primary)',
          }}
        >
          <span
            className="text-sm font-normal"
            style={{ color: 'var(--text-secondary)' }}
          >
            Rs{' '}
          </span>
          {formatIndianNumber(total)}
        </p>
      </div>

      {/* Category sliders */}
      <div className="space-y-4">
        {expenses.map((exp) => {
          const pct = total > 0 ? (exp.amount / total) * 100 : 0;
          return (
            <div key={exp.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{CATEGORY_ICONS[exp.id] ?? '📦'}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {exp.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {pct.toFixed(0)}%
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={200000}
                    step={500}
                    value={exp.amount}
                    onChange={(e) =>
                      setExpenseAmount(exp.id, Math.max(0, Number(e.target.value)))
                    }
                    className="w-24 px-2 py-1 rounded text-xs font-mono text-right outline-none"
                    style={{
                      background: 'var(--bg-void)',
                      border: 'var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                    aria-label={`${exp.label} monthly amount`}
                  />
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={exp.id === 'housing' ? 100000 : 50000}
                step={500}
                value={exp.amount}
                onChange={(e) =>
                  setExpenseAmount(exp.id, Number(e.target.value))
                }
                className="income-slider"
                style={
                  {
                    '--fill-pct': `${(exp.amount / (exp.id === 'housing' ? 100000 : 50000)) * 100}%`,
                  } as React.CSSProperties
                }
                aria-label={`${exp.label} slider`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
