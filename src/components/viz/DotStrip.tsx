import { useMemo, useState, useRef, useEffect } from 'react';
import { scaleLinear } from 'd3-scale';
import { Tooltip, TooltipTitle, TooltipRow } from '../ui/Tooltip.tsx';
import { useTooltip } from '../../hooks/useTooltip.ts';

export interface DotStripDataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
}

interface DotStripReferenceLine {
  value: number;
  label: string;
  color: string;
}

interface DotStripProps {
  data: DotStripDataPoint[];
  formatValue: (v: number) => string;
  valueLabel?: string;
  accentColor?: string;
  referenceLine?: DotStripReferenceLine;
  highlightIds?: string[];
  isVisible: boolean;
  ariaLabel?: string;
}

const MARGIN = { top: 10, right: 20, bottom: 30, left: 20 };
const DOT_R = 5;
const STRIP_H = 80;

// Deterministic jitter from string hash
function hashJitter(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return ((hash % 20) - 10); // -10 to +10 px
}

export function DotStrip({
  data,
  formatValue,
  valueLabel = 'Value',
  accentColor = 'var(--saffron)',
  referenceLine,
  highlightIds = [],
  isVisible,
  ariaLabel,
}: DotStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const tooltip = useTooltip<DotStripDataPoint>();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const resolvedAccent = useMemo(() => {
    if (!accentColor.startsWith('var(')) return accentColor;
    const prop = accentColor.slice(4, -1);
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#FF6B35';
  }, [accentColor]);

  const innerW = width - MARGIN.left - MARGIN.right;
  const midY = STRIP_H / 2;

  const xScale = useMemo(() => {
    const vals = data.map((d) => d.value);
    const pad = (Math.max(...vals) - Math.min(...vals)) * 0.05 || 1;
    return scaleLinear()
      .domain([Math.min(...vals) - pad, Math.max(...vals) + pad])
      .range([0, innerW])
      .nice();
  }, [data, innerW]);

  const highlightSet = useMemo(() => new Set(highlightIds), [highlightIds]);
  const ticks = xScale.ticks(6);

  return (
    <div ref={containerRef} className="w-full">
      <svg
        viewBox={`0 0 ${width} ${STRIP_H + MARGIN.top + MARGIN.bottom}`}
        className="w-full"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
        role="img"
        aria-label={ariaLabel || `Dot strip: ${valueLabel}`}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Axis line */}
          <line
            x1={0} y1={midY} x2={innerW} y2={midY}
            stroke="var(--bg-raised)" strokeWidth={1}
          />

          {/* Reference line */}
          {referenceLine && (
            <g>
              <line
                x1={xScale(referenceLine.value)} y1={4}
                x2={xScale(referenceLine.value)} y2={STRIP_H - 4}
                stroke={referenceLine.color} strokeWidth={1.5} strokeDasharray="4,3"
              />
              <text
                x={xScale(referenceLine.value)} y={0}
                textAnchor="middle" fill={referenceLine.color}
                style={{ fontSize: '0.5625rem' }}
              >{referenceLine.label}</text>
            </g>
          )}

          {/* Dots */}
          {data.map((d, i) => {
            const cx = xScale(d.value);
            const jy = hashJitter(d.id);
            const cy = midY + jy;
            const isHighlight = highlightSet.has(d.id);
            const isHovered = hoveredId === d.id;
            const fill = d.color || (isHighlight ? resolvedAccent : `${resolvedAccent}99`);

            return (
              <circle
                key={d.id}
                cx={cx} cy={cy}
                r={isHovered ? DOT_R + 2 : (isHighlight ? DOT_R + 1 : DOT_R)}
                fill={fill}
                opacity={isVisible ? (hoveredId && !isHovered ? 0.25 : isHighlight ? 1 : 0.7) : 0}
                style={{
                  transition: `opacity 0.5s ease ${i * 0.02}s, r 0.15s ease`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  setHoveredId(d.id);
                  tooltip.show(d, e);
                }}
                onMouseMove={tooltip.move}
                onMouseLeave={() => {
                  setHoveredId(null);
                  tooltip.hide();
                }}
              />
            );
          })}

          {/* X axis ticks */}
          <g transform={`translate(0,${STRIP_H})`}>
            {ticks.map((t) => (
              <text
                key={`t-${t}`}
                x={xScale(t)} y={14}
                textAnchor="middle" fill="var(--text-muted)"
              >{formatValue(t)}</text>
            ))}
          </g>
        </g>
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.label}</TooltipTitle>
              <TooltipRow label={valueLabel} value={formatValue(tooltip.data.value)} />
            </>
          )
        }
        visible={tooltip.visible}
        x={tooltip.position.x}
        y={tooltip.position.y}
      />
    </div>
  );
}
