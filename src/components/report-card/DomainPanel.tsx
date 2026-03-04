import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DomainPanel as DomainPanelType } from '../../lib/stateReportEngine.ts';
import { MetricRow } from './MetricRow.tsx';

interface DomainPanelProps {
  panel: DomainPanelType;
  defaultOpen?: boolean;
}

export function DomainPanel({ panel, defaultOpen = true }: DomainPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const validMetrics = panel.metrics.filter((m) => m.value != null);
  const topQuartileCount = validMetrics.filter((m) => m.quartile === 1).length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
    >
      {/* Panel header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
        style={{ borderBottom: isOpen ? 'var(--border-subtle)' : 'none' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: panel.accentColor }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {panel.title}
          </span>
          {panel.dataAvailable && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
            >
              {validMetrics.length} metrics
              {topQuartileCount > 0 && ` · ${topQuartileCount} top 25%`}
            </span>
          )}
        </div>
        <svg
          className="w-4 h-4 transition-transform"
          style={{
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5">
              {!panel.dataAvailable ? (
                <p
                  className="text-xs py-4 text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Data not yet available for this state. Some surveys don't cover all states, or data is being updated.
                </p>
              ) : (
                validMetrics.map((metric, i) => (
                  <MetricRow
                    key={metric.def.key}
                    metric={metric}
                    accentColor={panel.accentColor}
                    index={i}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
