import { useMemo, useState, useRef, useEffect } from 'react';
import { scaleLinear } from 'd3-scale';
import { Tooltip, TooltipTitle, TooltipRow, useTooltip } from '../ui/Tooltip.tsx';

export interface ScatterDataPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  size?: number;
  color?: string;
  annotation?: string;
}

interface ReferenceLine {
  value: number;
  label: string;
  color: string;
}

interface ScatterChartProps {
  data: ScatterDataPoint[];
  xLabel: string;
  yLabel: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  accentColor?: string;
  xReferenceLine?: ReferenceLine;
  yReferenceLine?: ReferenceLine;
  quadrantLabels?: { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string };
  isVisible: boolean;
  ariaLabel?: string;
}

const MARGIN = { top: 20, right: 30, bottom: 50, left: 60 };

export function ScatterChart({
  data,
  xLabel,
  yLabel,
  xFormat = (v) => v.toFixed(1),
  yFormat = (v) => v.toFixed(1),
  accentColor = 'var(--saffron)',
  xReferenceLine,
  yReferenceLine,
  quadrantLabels,
  isVisible,
  ariaLabel,
}: ScatterChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const height = 400;
  const tooltip = useTooltip<ScatterDataPoint>();
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
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    const xs = data.map((d) => d.x);
    const pad = (Math.max(...xs) - Math.min(...xs)) * 0.1 || 1;
    return scaleLinear()
      .domain([Math.min(...xs) - pad, Math.max(...xs) + pad])
      .range([0, innerW])
      .nice();
  }, [data, innerW]);

  const yScale = useMemo(() => {
    const ys = data.map((d) => d.y);
    const pad = (Math.max(...ys) - Math.min(...ys)) * 0.1 || 1;
    return scaleLinear()
      .domain([Math.min(...ys) - pad, Math.max(...ys) + pad])
      .range([innerH, 0])
      .nice();
  }, [data, innerH]);

  const xTicks = xScale.ticks(6);
  const yTicks = yScale.ticks(6);

  // Only show labels for outlier points on md+ to avoid collision
  const showLabels = width >= 600;

  return (
    <div ref={containerRef} className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem' }}
        role="img"
        aria-label={ariaLabel || `Scatter chart: ${xLabel} vs ${yLabel}`}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Grid lines */}
          {yTicks.map((t) => (
            <line
              key={`yg-${t}`}
              x1={0} y1={yScale(t)} x2={innerW} y2={yScale(t)}
              stroke="var(--bg-raised)" strokeWidth={0.5}
            />
          ))}
          {xTicks.map((t) => (
            <line
              key={`xg-${t}`}
              x1={xScale(t)} y1={0} x2={xScale(t)} y2={innerH}
              stroke="var(--bg-raised)" strokeWidth={0.5}
            />
          ))}

          {/* Quadrant labels */}
          {quadrantLabels && xReferenceLine && yReferenceLine && (
            <>
              {quadrantLabels.topLeft && (
                <text
                  x={xScale(xReferenceLine.value) / 2}
                  y={yScale(yReferenceLine.value) / 2}
                  textAnchor="middle" fill="var(--text-muted)" opacity={0.4}
                  style={{ fontSize: '0.6rem' }}
                >{quadrantLabels.topLeft}</text>
              )}
              {quadrantLabels.topRight && (
                <text
                  x={xScale(xReferenceLine.value) + (innerW - xScale(xReferenceLine.value)) / 2}
                  y={yScale(yReferenceLine.value) / 2}
                  textAnchor="middle" fill="var(--text-muted)" opacity={0.4}
                  style={{ fontSize: '0.6rem' }}
                >{quadrantLabels.topRight}</text>
              )}
              {quadrantLabels.bottomLeft && (
                <text
                  x={xScale(xReferenceLine.value) / 2}
                  y={yScale(yReferenceLine.value) + (innerH - yScale(yReferenceLine.value)) / 2}
                  textAnchor="middle" fill="var(--text-muted)" opacity={0.4}
                  style={{ fontSize: '0.6rem' }}
                >{quadrantLabels.bottomLeft}</text>
              )}
              {quadrantLabels.bottomRight && (
                <text
                  x={xScale(xReferenceLine.value) + (innerW - xScale(xReferenceLine.value)) / 2}
                  y={yScale(yReferenceLine.value) + (innerH - yScale(yReferenceLine.value)) / 2}
                  textAnchor="middle" fill="var(--text-muted)" opacity={0.4}
                  style={{ fontSize: '0.6rem' }}
                >{quadrantLabels.bottomRight}</text>
              )}
            </>
          )}

          {/* Reference lines */}
          {xReferenceLine && (
            <g>
              <line
                x1={xScale(xReferenceLine.value)} y1={0}
                x2={xScale(xReferenceLine.value)} y2={innerH}
                stroke={xReferenceLine.color} strokeWidth={1} strokeDasharray="4,3" opacity={0.7}
              />
              <text
                x={xScale(xReferenceLine.value) + 4} y={12}
                fill={xReferenceLine.color} style={{ fontSize: '0.6rem' }}
              >{xReferenceLine.label}</text>
            </g>
          )}
          {yReferenceLine && (
            <g>
              <line
                x1={0} y1={yScale(yReferenceLine.value)}
                x2={innerW} y2={yScale(yReferenceLine.value)}
                stroke={yReferenceLine.color} strokeWidth={1} strokeDasharray="4,3" opacity={0.7}
              />
              <text
                x={innerW - 4} y={yScale(yReferenceLine.value) - 4}
                textAnchor="end" fill={yReferenceLine.color} style={{ fontSize: '0.6rem' }}
              >{yReferenceLine.label}</text>
            </g>
          )}

          {/* Data points */}
          {data.map((d, i) => {
            const cx = xScale(d.x);
            const cy = yScale(d.y);
            const r = d.size || 6;
            const fill = d.color || resolvedAccent;
            const isHovered = hoveredId === d.id;

            return (
              <g key={d.id}>
                <circle
                  cx={cx} cy={cy}
                  r={isHovered ? r + 2 : r}
                  fill={fill}
                  opacity={isVisible ? (hoveredId && !isHovered ? 0.3 : 0.85) : 0}
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
                {/* Label for annotated or outlier points */}
                {showLabels && d.annotation && (
                  <text
                    x={cx + r + 4} y={cy + 3}
                    fill="var(--text-secondary)"
                    opacity={isVisible ? 0.8 : 0}
                    style={{ fontSize: '0.6rem', transition: `opacity 0.5s ease ${i * 0.02}s` }}
                  >{d.label}</text>
                )}
              </g>
            );
          })}

          {/* X axis */}
          <g transform={`translate(0,${innerH})`}>
            <line x1={0} y1={0} x2={innerW} y2={0} stroke="var(--text-muted)" strokeWidth={0.5} />
            {xTicks.map((t) => (
              <text
                key={`xt-${t}`}
                x={xScale(t)} y={20}
                textAnchor="middle" fill="var(--text-muted)"
              >{xFormat(t)}</text>
            ))}
            <text
              x={innerW / 2} y={40}
              textAnchor="middle" fill="var(--text-secondary)"
              style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-body)' }}
            >{xLabel}</text>
          </g>

          {/* Y axis */}
          <g>
            <line x1={0} y1={0} x2={0} y2={innerH} stroke="var(--text-muted)" strokeWidth={0.5} />
            {yTicks.map((t) => (
              <text
                key={`yt-${t}`}
                x={-8} y={yScale(t) + 3}
                textAnchor="end" fill="var(--text-muted)"
              >{yFormat(t)}</text>
            ))}
            <text
              x={-MARGIN.left + 12} y={innerH / 2}
              textAnchor="middle" fill="var(--text-secondary)"
              transform={`rotate(-90, ${-MARGIN.left + 12}, ${innerH / 2})`}
              style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-body)' }}
            >{yLabel}</text>
          </g>
        </g>
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.label}</TooltipTitle>
              <TooltipRow label={xLabel} value={xFormat(tooltip.data.x)} />
              <TooltipRow label={yLabel} value={yFormat(tooltip.data.y)} />
              {tooltip.data.annotation && (
                <TooltipRow label="Note" value={tooltip.data.annotation} />
              )}
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
