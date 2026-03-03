import { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  formatValue?: (v: number) => string;
  isVisible: boolean;
  accentColor?: string;
  ariaLabel?: string;
  height?: number;
}

function defaultFormat(v: number): string {
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return v.toLocaleString('en-IN');
}

export function FunnelChart({
  stages,
  formatValue = defaultFormat,
  isVisible,
  accentColor = 'var(--crimson)',
  ariaLabel = 'Funnel chart',
  height: propHeight,
}: FunnelChartProps) {
  const maxValue = useMemo(() => Math.max(...stages.map((s) => s.value)), [stages]);

  const stageHeight = 52;
  const gap = 6;
  const paddingX = 16;
  const paddingY = 12;
  const totalHeight = propHeight ?? stages.length * (stageHeight + gap) - gap + paddingY * 2;
  const width = 600;
  const barArea = width - paddingX * 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight}`}
      className="w-full"
      style={{ maxHeight: totalHeight }}
      role="img"
      aria-label={ariaLabel}
    >
      {stages.map((stage, i) => {
        const barW = maxValue > 0 ? (stage.value / maxValue) * barArea : 0;
        const x = (width - barW) / 2;
        const y = paddingY + i * (stageHeight + gap);
        const prevValue = i > 0 ? stages[i - 1].value : null;
        const dropPct = prevValue && prevValue > 0
          ? ((prevValue - stage.value) / prevValue * 100).toFixed(0)
          : null;
        const fillColor = stage.color ?? accentColor;

        return (
          <g key={stage.label}>
            {/* Bar */}
            <motion.rect
              x={x}
              y={y}
              height={stageHeight}
              rx={4}
              fill={fillColor}
              fillOpacity={0.85 - i * 0.08}
              initial={{ width: 0 }}
              animate={isVisible ? { width: barW } : { width: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Label */}
            <motion.text
              x={width / 2}
              y={y + stageHeight / 2 - 6}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="12"
              fontFamily="var(--font-body)"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 + 0.3 }}
            >
              {stage.label}
            </motion.text>
            {/* Value */}
            <motion.text
              x={width / 2}
              y={y + stageHeight / 2 + 12}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="11"
              fontFamily="var(--font-mono)"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 + 0.35 }}
            >
              {formatValue(stage.value)}
            </motion.text>
            {/* Drop percentage connector */}
            {dropPct && (
              <motion.text
                x={width - paddingX - 4}
                y={y - gap / 2 + 2}
                textAnchor="end"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-mono)"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 0.7 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.12 + 0.4 }}
              >
                -{dropPct}%
              </motion.text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
