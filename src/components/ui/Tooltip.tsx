import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  visible: boolean;
  x: number;
  y: number;
}

/**
 * Cursor-following tooltip shared by all visualizations.
 * Renders at fixed viewport position with backdrop blur.
 * Uses heuristic offsets based on known maxWidth (280px) to avoid
 * viewport overflow without DOM measurement.
 */
export function Tooltip({ content, visible, x, y }: TooltipProps) {
  // Heuristic edge detection: tooltip maxWidth is 280 + 12px padding = ~292px
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxW = Math.min(292, vw - 24); // Clamp on narrow viewports
  const estH = 80;
  const rawOffsetX = x + maxW + 24 > vw ? -maxW - 12 : 12;
  // Prevent tooltip from going off the left edge
  const offsetX = x + rawOffsetX < 0 ? -x + 8 : rawOffsetX;
  const offsetY = y - estH - 12 < 0 ? 12 : -estH - 12;

  return (
    <AnimatePresence>
      {visible && content && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12, ease: [0.25, 1, 0.5, 1] }}
          className="pointer-events-none fixed z-50"
          style={{
            left: x + offsetX,
            top: y + offsetY,
          }}
        >
          <div
            className="rounded-lg px-3 py-2 shadow-2xl"
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: 'var(--border-subtle)',
              maxWidth: 280,
            }}
          >
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Tooltip content helpers for consistent formatting across visualizations.
 */
export function TooltipTitle({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{children}</p>;
}

export function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 mt-0.5">
      <span className="text-caption">{label}</span>
      <span className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}

export function TooltipHint({ children }: { children: ReactNode }) {
  return <p className="text-caption mt-1 italic">{children}</p>;
}
