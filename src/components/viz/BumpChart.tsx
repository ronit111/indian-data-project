import { useMemo, useState, useRef, useEffect } from 'react';
import { scalePoint, scaleLinear } from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import { Tooltip, TooltipTitle, TooltipRow, useTooltip } from '../ui/Tooltip.tsx';

export interface BumpSeries {
  id: string;
  name: string;
  color: string;
  ranks: { period: string; rank: number }[];
}

interface BumpChartProps {
  series: BumpSeries[];
  isVisible: boolean;
  periodLabel?: string;
  ariaLabel?: string;
}

const MARGIN = { top: 20, right: 120, bottom: 40, left: 40 };

export function BumpChart({
  series,
  isVisible,
  periodLabel = 'Period',
  ariaLabel,
}: BumpChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const height = 360;
  const tooltip = useTooltip<{ name: string; period: string; rank: number }>();
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

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const periods = useMemo(() => {
    const set = new Set<string>();
    series.forEach((s) => s.ranks.forEach((r) => set.add(r.period)));
    return Array.from(set).sort();
  }, [series]);

  const maxRank = useMemo(() => {
    let max = 0;
    series.forEach((s) => s.ranks.forEach((r) => { if (r.rank > max) max = r.rank; }));
    return max;
  }, [series]);

  const xScale = useMemo(
    () => scalePoint<string>().domain(periods).range([0, innerW]).padding(0.1),
    [periods, innerW]
  );

  const yScale = useMemo(
    () => scaleLinear().domain([1, maxRank]).range([0, innerH]),
    [maxRank, innerH]
  );

  const lineGen = useMemo(
    () => line<{ period: string; rank: number }>()
      .x((d) => xScale(d.period) ?? 0)
      .y((d) => yScale(d.rank))
      .curve(curveMonotoneX),
    [xScale, yScale]
  );

  return (
    <div ref={containerRef} className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
        role="img"
        aria-label={ariaLabel || `Bump chart: ${series.map(s => s.name).join(', ')}`}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Horizontal grid */}
          {Array.from({ length: maxRank }, (_, i) => i + 1).map((rank) => (
            <line
              key={`g-${rank}`}
              x1={0} y1={yScale(rank)} x2={innerW} y2={yScale(rank)}
              stroke="var(--bg-raised)" strokeWidth={0.5}
            />
          ))}

          {/* Lines */}
          {series.map((s, idx) => {
            const d = lineGen(s.ranks);
            if (!d) return null;
            const isHovered = hoveredId === s.id;
            const pathLength = 2000;

            return (
              <path
                key={s.id}
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={isHovered ? 3 : 2}
                opacity={isVisible ? (hoveredId && !isHovered ? 0.15 : 0.85) : 0}
                strokeDasharray={pathLength}
                strokeDashoffset={isVisible ? 0 : pathLength}
                style={{
                  transition: `stroke-dashoffset 1.2s ease ${idx * 0.1}s, opacity 0.5s ease ${idx * 0.1}s, stroke-width 0.15s ease`,
                }}
              />
            );
          })}

          {/* Endpoint dots + labels */}
          {series.map((s) => {
            const last = s.ranks[s.ranks.length - 1];
            if (!last) return null;
            const cx = xScale(last.period) ?? 0;
            const cy = yScale(last.rank);
            const isHovered = hoveredId === s.id;

            return (
              <g
                key={`dot-${s.id}`}
                onMouseEnter={(e) => {
                  setHoveredId(s.id);
                  tooltip.show({ name: s.name, period: last.period, rank: last.rank }, e);
                }}
                onMouseMove={tooltip.move}
                onMouseLeave={() => {
                  setHoveredId(null);
                  tooltip.hide();
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx} cy={cy} r={isHovered ? 5 : 3.5}
                  fill={s.color}
                  opacity={isVisible ? 1 : 0}
                  style={{ transition: 'opacity 0.5s ease, r 0.15s ease' }}
                />
                <text
                  x={cx + 8} y={cy + 3}
                  fill={s.color}
                  opacity={isVisible ? (hoveredId && !isHovered ? 0.2 : 0.9) : 0}
                  style={{ fontSize: '0.6rem', transition: 'opacity 0.3s ease' }}
                >{s.name}</text>
              </g>
            );
          })}

          {/* X axis */}
          <g transform={`translate(0,${innerH + 8})`}>
            {periods.map((p) => (
              <text
                key={`xp-${p}`}
                x={xScale(p) ?? 0} y={10}
                textAnchor="middle" fill="var(--text-muted)"
              >{p}</text>
            ))}
            <text
              x={innerW / 2} y={30}
              textAnchor="middle" fill="var(--text-secondary)"
              style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-body)' }}
            >{periodLabel}</text>
          </g>

          {/* Y axis — rank labels */}
          <g>
            {Array.from({ length: maxRank }, (_, i) => i + 1).map((rank) => (
              <text
                key={`yr-${rank}`}
                x={-8} y={yScale(rank) + 3}
                textAnchor="end" fill="var(--text-muted)"
              >#{rank}</text>
            ))}
          </g>
        </g>
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.name}</TooltipTitle>
              <TooltipRow label={periodLabel} value={tooltip.data.period} />
              <TooltipRow label="Rank" value={`#${tooltip.data.rank}`} />
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
