import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MinistryExpenditure, ExpenditureData } from '../../lib/data/schema.ts';
import { formatRsCrore, formatPercent, formatPerCapita } from '../../lib/format.ts';
import { YoYBadge } from '../ui/Badge.tsx';

interface DataTableProps {
  data: ExpenditureData;
}

type SortKey = 'name' | 'budgetEstimate' | 'percentOfTotal' | 'yoyChange' | 'perCapita';
type SortDir = 'asc' | 'desc';

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('budgetEstimate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey, sortDir]
  );

  const sorted = useMemo(() => {
    const arr = [...data.ministries];
    arr.sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break;
        case 'budgetEstimate': av = a.budgetEstimate; bv = b.budgetEstimate; break;
        case 'percentOfTotal': av = a.percentOfTotal; bv = b.percentOfTotal; break;
        case 'yoyChange': av = a.yoyChange ?? 0; bv = b.yoyChange ?? 0; break;
        case 'perCapita': av = a.perCapita; bv = b.perCapita; break;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return arr;
  }, [data.ministries, sortKey, sortDir]);

  const exportCSV = useCallback(() => {
    const headers = ['Expenditure Head', 'Budget Estimate (Rs Cr)', '% of Total', 'YoY Change %', 'Per Capita (Rs)'];
    const rows = sorted.map((m) => [
      m.name, m.budgetEstimate, m.percentOfTotal, m.yoyChange ?? 'N/A', m.perCapita,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${data.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, data.year]);

  const ministryCount = sorted.filter((m) => m.name.startsWith('Ministry')).length;
  const categoryCount = sorted.length - ministryCount;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-caption">{ministryCount} ministries · {categoryCount} other expenditure heads</p>
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 hover:scale-[1.02] hover:border-[var(--saffron)]"
          style={{
            background: 'var(--bg-raised)',
            color: 'var(--text-secondary)',
            border: 'var(--border-subtle)',
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-lg" style={{ border: 'var(--border-subtle)', overflowX: 'clip' }}>
        <table className="w-full">
          <thead className="sticky top-16 z-10" style={{ background: 'var(--bg-raised)' }}>
            <tr>
              {([['Expenditure Head', 'name'], ['Budget (Rs Cr)', 'budgetEstimate'], ['% Total', 'percentOfTotal'], ['YoY', 'yoyChange'], ['Per Capita', 'perCapita']] as const).map(([label, field]) => (
                <th
                  scope="col"
                  key={field}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  aria-sort={sortKey === field ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(field)}
                    className="flex items-center gap-1 cursor-pointer select-none bg-transparent border-none p-0 text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: sortKey === field ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                  >
                    {label}
                    {sortKey === field && (
                      <span style={{ color: 'var(--saffron)' }}>
                        {sortDir === 'asc' ? '\u2191' : '\u2193'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((ministry) => (
              <MinistryRow
                key={ministry.id}
                ministry={ministry}
                total={data.total}
                expanded={expandedId === ministry.id}
                onToggle={() => setExpandedId(expandedId === ministry.id ? null : ministry.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((ministry) => (
          <MinistryCard
            key={ministry.id}
            ministry={ministry}
            total={data.total}
            expanded={expandedId === ministry.id}
            onToggle={() => setExpandedId(expandedId === ministry.id ? null : ministry.id)}
          />
        ))}
      </div>
    </div>
  );
}

/** Non-ministry expenditure heads (obligations, not discretionary ministry spending) */
const NON_MINISTRY_IDS = new Set([
  'interest-payments',
  'transfers-to-states',
  'subsidies',
  'other-expenditure',
]);

function MinistryRow({
  ministry,
  total,
  expanded,
  onToggle,
}: {
  ministry: MinistryExpenditure;
  total: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasSchemes = ministry.schemes.length > 0;
  const barWidth = (ministry.budgetEstimate / total) * 100;
  const isObligation = NON_MINISTRY_IDS.has(ministry.id);

  return (
    <>
      <tr
        className="cursor-pointer transition-all duration-150 hover:bg-[var(--bg-raised)]"
        style={{
          borderBottom: 'var(--border-divider)',
          borderLeft: expanded ? '2px solid var(--saffron)' : '2px solid transparent',
        }}
        onClick={hasSchemes ? onToggle : undefined}
        onKeyDown={hasSchemes ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } } : undefined}
        tabIndex={hasSchemes ? 0 : undefined}
        role={hasSchemes ? 'button' : undefined}
        aria-expanded={hasSchemes ? expanded : undefined}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {hasSchemes && (
              <span
                className="text-xs transition-transform"
                style={{
                  color: 'var(--text-muted)',
                  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                &#9654;
              </span>
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ministry.name}</p>
                {isObligation && (
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ color: 'var(--cyan)', background: 'var(--cyan-dim)' }}
                  >
                    Obligation
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5 max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {ministry.humanContext}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 font-mono text-sm">{formatRsCrore(ministry.budgetEstimate)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 max-w-48 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(barWidth * 4, 100)}%`, background: 'var(--cyan)' }}
              />
            </div>
            <span className="font-mono text-sm">{formatPercent(ministry.percentOfTotal)}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <YoYBadge value={ministry.yoyChange ?? 0} />
        </td>
        <td className="px-4 py-3 font-mono text-sm">{formatPerCapita(ministry.perCapita)}</td>
      </tr>

      <AnimatePresence>
        {expanded && hasSchemes && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <td colSpan={5} style={{ background: 'var(--bg-raised)' }} className="px-4 py-3">
              <div className="pl-8 space-y-2">
                <p className="text-caption uppercase tracking-wider mb-2">Major Schemes</p>
                {ministry.schemes.map((scheme) => (
                  <div key={scheme.id} className="flex items-center justify-between text-sm py-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{scheme.name}</span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                      {formatRsCrore(scheme.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function MinistryCard({
  ministry,
  total,
  expanded,
  onToggle,
}: {
  ministry: MinistryExpenditure;
  total: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasSchemes = ministry.schemes.length > 0;
  const barWidth = (ministry.budgetEstimate / total) * 100;
  const isObligation = NON_MINISTRY_IDS.has(ministry.id);

  return (
    <div
      className="rounded-lg p-4 cursor-pointer"
      style={{
        background: 'var(--bg-raised)',
        border: expanded ? '1px solid var(--cyan)' : 'var(--border-subtle)',
      }}
      onClick={hasSchemes ? onToggle : undefined}
      onKeyDown={hasSchemes ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } } : undefined}
      tabIndex={hasSchemes ? 0 : undefined}
      role={hasSchemes ? 'button' : undefined}
      aria-expanded={hasSchemes ? expanded : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{ministry.name}</p>
            {isObligation && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                style={{ color: 'var(--cyan)', background: 'var(--cyan-dim)' }}
              >
                Obligation
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ministry.humanContext}</p>
        </div>
        <YoYBadge value={ministry.yoyChange ?? 0} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="font-mono text-sm font-bold">{formatRsCrore(ministry.budgetEstimate)}</span>
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {formatPercent(ministry.percentOfTotal)} &middot; {formatPerCapita(ministry.perCapita)}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(barWidth * 4, 100)}%`, background: 'var(--cyan)' }} />
      </div>

      <AnimatePresence>
        {expanded && hasSchemes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 pt-3"
            style={{ borderTop: 'var(--border-divider)' }}
          >
            <p className="text-caption uppercase tracking-wider mb-2">Major Schemes</p>
            {ministry.schemes.map((scheme) => (
              <div key={scheme.id} className="flex justify-between text-sm py-1">
                <span style={{ color: 'var(--text-secondary)' }}>{scheme.name}</span>
                <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                  {formatRsCrore(scheme.amount)}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
