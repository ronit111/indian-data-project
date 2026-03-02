import { useMemo } from 'react';

interface BulletChartProps {
  label: string;
  value: number;
  target?: number;
  ranges?: { good: number; satisfactory: number; max: number };
  formatValue?: (v: number) => string;
  accentColor?: string;
  isVisible: boolean;
  width?: number;
  height?: number;
  ariaLabel?: string;
}

/**
 * Compact horizontal bullet chart: bar + target marker + range bands.
 * Inspired by Stephen Few's bullet graph specification.
 */
export function BulletChart({
  label,
  value,
  target,
  ranges,
  formatValue = (v) => v.toFixed(1),
  accentColor = 'var(--saffron)',
  isVisible,
  width = 300,
  height = 32,
  ariaLabel,
}: BulletChartProps) {
  const maxVal = ranges?.max ?? Math.max(value, target ?? value) * 1.2;
  const barH = height * 0.45;
  const rangeH = height * 0.7;
  const midY = height / 2;

  const resolvedAccent = useMemo(() => {
    if (!accentColor.startsWith('var(')) return accentColor;
    const prop = accentColor.slice(4, -1);
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#FF6B35';
  }, [accentColor]);

  const scale = (v: number) => (v / maxVal) * width;

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-caption shrink-0 w-24 text-right truncate"
        title={label}
      >{label}</span>
      <svg width={width} height={height} className="shrink-0" role="img" aria-label={ariaLabel || `Bullet chart: ${label}`}>
        {/* Range bands */}
        {ranges && (
          <>
            <rect
              x={0} y={midY - rangeH / 2}
              width={scale(ranges.max)} height={rangeH}
              rx={2} fill="var(--bg-raised)" opacity={0.5}
            />
            <rect
              x={0} y={midY - rangeH / 2}
              width={scale(ranges.satisfactory)} height={rangeH}
              rx={2} fill="var(--bg-raised)" opacity={0.8}
            />
            <rect
              x={0} y={midY - rangeH / 2}
              width={scale(ranges.good)} height={rangeH}
              rx={2} fill="var(--bg-hover)" opacity={0.6}
            />
          </>
        )}

        {/* Value bar */}
        <rect
          x={0} y={midY - barH / 2}
          width={isVisible ? scale(Math.min(value, maxVal)) : 0}
          height={barH}
          rx={2} fill={resolvedAccent}
          style={{ transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {/* Target marker */}
        {target !== undefined && (
          <line
            x1={scale(target)} y1={midY - rangeH / 2 - 2}
            x2={scale(target)} y2={midY + rangeH / 2 + 2}
            stroke="var(--text-primary)" strokeWidth={2}
            opacity={isVisible ? 0.9 : 0}
            style={{ transition: 'opacity 0.5s ease 0.3s' }}
          />
        )}
      </svg>
      <span
        className="font-mono text-xs shrink-0"
        style={{ color: 'var(--text-primary)', minWidth: '3rem' }}
      >{formatValue(value)}</span>
    </div>
  );
}
