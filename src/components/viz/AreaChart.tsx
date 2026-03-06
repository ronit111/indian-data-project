import { useMemo, useRef, useEffect, useState } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { area as d3Area, line as d3Line, curveMonotoneX } from 'd3-shape';
import { Tooltip, TooltipTitle, TooltipRow } from '../ui/Tooltip.tsx';
import { useTooltip } from '../../hooks/useTooltip.ts';

// ─── Types ───────────────────────────────────────────────────────────
export interface AreaSeries {
  id: string;
  name: string;
  color: string;
  data: { year: string; value: number }[];
}

export interface OverlayLine {
  id: string;
  name: string;
  color: string;
  data: { year: string; value: number }[];
  unit?: string;
}

interface AreaChartProps {
  series: AreaSeries[];
  /** Optional overlay line on secondary Y-axis (e.g. CAD %) */
  overlay?: OverlayLine;
  width?: number;
  height?: number;
  isVisible: boolean;
  formatValue?: (v: number) => string;
  unit?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

// ─── Constants ───────────────────────────────────────────────────────
const MARGIN = { top: 20, right: 52, bottom: 40, left: 48 };

export function AreaChart({
  series,
  overlay,
  width = 700,
  height = 360,
  isVisible,
  formatValue = (v) => `${v}`,
  unit = '%',
  ariaLabel,
}: AreaChartProps) {
  const overlayPathRef = useRef<SVGPathElement | null>(null);
  const [overlayLen, setOverlayLen] = useState(0);
  const tooltip = useTooltip<{
    year: string;
    areas: { name: string; value: number; color: string }[];
    overlayValue?: { name: string; value: number; color: string; unit?: string };
  }>();

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  // Collect years
  const years = useMemo(() => {
    const set = new Set<string>();
    for (const s of series) for (const d of s.data) set.add(d.year);
    if (overlay) for (const d of overlay.data) set.add(d.year);
    return Array.from(set).sort();
  }, [series, overlay]);

  // Primary Y scale (for area series)
  const xScale = useMemo(
    () => scalePoint<string>().domain(years).range([0, innerW]).padding(0.1),
    [years, innerW],
  );

  const yScale = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const s of series) {
      for (const d of s.data) {
        if (d.value < min) min = d.value;
        if (d.value > max) max = d.value;
      }
    }
    const pad = (max - min) * 0.15;
    // Only extend domain below zero when data contains negative values
    const domainMin = min >= 0 ? 0 : min - pad;
    return scaleLinear()
      .domain([domainMin, max + pad])
      .range([innerH, 0])
      .nice();
  }, [series, innerH]);

  // Secondary Y scale (overlay line)
  const y2Scale = useMemo(() => {
    if (!overlay) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const d of overlay.data) {
      if (d.value < min) min = d.value;
      if (d.value > max) max = d.value;
    }
    const pad = (max - min) * 0.2;
    return scaleLinear()
      .domain([min - pad, max + pad])
      .range([innerH, 0])
      .nice();
  }, [overlay, innerH]);

  // Area generators
  const areaGen = useMemo(
    () =>
      d3Area<{ year: string; value: number }>()
        .x((d) => xScale(d.year) ?? 0)
        .y0(yScale(0))
        .y1((d) => yScale(d.value))
        .curve(curveMonotoneX),
    [xScale, yScale],
  );

  const lineGen = useMemo(
    () =>
      d3Line<{ year: string; value: number }>()
        .x((d) => xScale(d.year) ?? 0)
        .y((d) => yScale(d.value))
        .curve(curveMonotoneX),
    [xScale, yScale],
  );

  // Overlay line generator (secondary axis)
  const overlayLineGen = useMemo(() => {
    if (!y2Scale) return null;
    return d3Line<{ year: string; value: number }>()
      .x((d) => xScale(d.year) ?? 0)
      .y((d) => y2Scale(d.value))
      .curve(curveMonotoneX);
  }, [xScale, y2Scale]);

  // Measure overlay path length
  useEffect(() => {
    if (overlayPathRef.current) {
      setOverlayLen(overlayPathRef.current.getTotalLength());
    }
  }, [overlay, width, height]);

  const yTicks = yScale.ticks(5);
  const y2Ticks = y2Scale?.ticks(4) || [];

  // Year lookup for tooltip
  const yearLookup = useMemo(() => {
    const map = new Map<string, {
      areas: { name: string; value: number; color: string }[];
      overlayValue?: { name: string; value: number; color: string; unit?: string };
    }>();
    for (const yr of years) {
      const areas: { name: string; value: number; color: string }[] = [];
      for (const s of series) {
        const pt = s.data.find((d) => d.year === yr);
        if (pt) areas.push({ name: s.name, value: pt.value, color: s.color });
      }
      let overlayValue: { name: string; value: number; color: string; unit?: string } | undefined;
      if (overlay) {
        const pt = overlay.data.find((d) => d.year === yr);
        if (pt) overlayValue = { name: overlay.name, value: pt.value, color: overlay.color, unit: overlay.unit };
      }
      map.set(yr, { areas, overlayValue });
    }
    return map;
  }, [years, series, overlay]);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 300 }} role="img" aria-label={ariaLabel || `Area chart: ${series.map(s => s.name).join(', ')}`}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.id} id={`area-grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.08} />
            </linearGradient>
          ))}
        </defs>

        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Gridlines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={innerW}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="var(--text-muted)"
              strokeWidth={0.5}
              opacity={isVisible ? 0.15 : 0}
              style={{ transition: 'opacity 0.5s ease' }}
            />
          ))}

          {/* Y-axis labels (primary) */}
          {yTicks.map((tick) => (
            <text
              key={tick}
              x={-8}
              y={yScale(tick)}
              dy="0.35em"
              textAnchor="end"
              fontSize={11}
              fontFamily="var(--font-mono)"
              fill="var(--text-muted)"
              opacity={isVisible ? 1 : 0}
              style={{ transition: 'opacity 0.5s ease' }}
            >
              {formatValue(tick)}
            </text>
          ))}

          {/* Y-axis labels (secondary, right side) */}
          {y2Scale && y2Ticks.map((tick) => (
            <text
              key={`y2-${tick}`}
              x={innerW + 8}
              y={y2Scale(tick)}
              dy="0.35em"
              textAnchor="start"
              fontSize={10}
              fontFamily="var(--font-mono)"
              fill={overlay?.color || 'var(--text-muted)'}
              opacity={isVisible ? 0.7 : 0}
              style={{ transition: 'opacity 0.5s ease 0.3s' }}
            >
              {formatValue(tick)}
            </text>
          ))}

          {/* X-axis labels */}
          {years.map((yr, i) => {
            const x = xScale(yr) ?? 0;
            const show = years.length <= 8 || i % 2 === 0 || i === years.length - 1;
            return show ? (
              <text
                key={yr}
                x={x}
                y={innerH + 24}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="var(--text-muted)"
                opacity={isVisible ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${0.05 * i}s` }}
              >
                {yr.length > 5 ? yr.slice(2) : yr}
              </text>
            ) : null;
          })}

          {/* Areas */}
          {series.map((s, si) => {
            const areaD = areaGen(s.data) || '';
            const lineD = lineGen(s.data) || '';
            const delay = si * 0.2;

            return (
              <g key={s.id}>
                <path
                  d={areaD}
                  fill={`url(#area-grad-${s.id})`}
                  opacity={isVisible ? 1 : 0}
                  style={{ transition: `opacity 0.8s ease ${delay}s` }}
                />
                <path
                  d={lineD}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={isVisible ? 1 : 0}
                  style={{ transition: `opacity 0.8s ease ${delay}s` }}
                />
              </g>
            );
          })}

          {/* Overlay line (secondary axis) */}
          {overlay && overlayLineGen && (
            <path
              ref={overlayPathRef}
              d={overlayLineGen(overlay.data) || ''}
              fill="none"
              stroke={overlay.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={overlayLen || 1000}
              strokeDashoffset={isVisible ? 0 : (overlayLen || 1000)}
              style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s` }}
            />
          )}

          {/* Overlay data points */}
          {overlay && y2Scale && overlay.data.map((d, di) => (
            <circle
              key={`overlay-${d.year}`}
              cx={xScale(d.year) ?? 0}
              cy={y2Scale(d.value)}
              r={3}
              fill={overlay.color}
              opacity={isVisible ? 1 : 0}
              style={{ transition: `opacity 0.3s ease ${1 + di * 0.03}s` }}
            />
          ))}

          {/* Invisible hover rects */}
          {years.map((yr) => {
            const x = xScale(yr) ?? 0;
            const step = xScale.step();
            const data = yearLookup.get(yr);
            return (
              <rect
                key={`hover-${yr}`}
                x={x - step / 2}
                y={0}
                width={step}
                height={innerH}
                fill="transparent"
                onMouseEnter={(e) =>
                  tooltip.show({
                    year: yr,
                    areas: data?.areas || [],
                    overlayValue: data?.overlayValue,
                  }, e)
                }
                onMouseMove={tooltip.move}
                onMouseLeave={tooltip.hide}
                style={{ cursor: 'crosshair' }}
              />
            );
          })}

          {/* Hover vertical line */}
          {tooltip.visible && tooltip.data && (
            <line
              x1={xScale(tooltip.data.year) ?? 0}
              x2={xScale(tooltip.data.year) ?? 0}
              y1={0}
              y2={innerH}
              stroke="var(--text-muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.5}
              pointerEvents="none"
            />
          )}
        </g>
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.year}</TooltipTitle>
              {tooltip.data.areas.map((v) => (
                <TooltipRow key={v.name} label={v.name} value={`${formatValue(v.value)} ${unit}`} />
              ))}
              {tooltip.data.overlayValue && (
                <TooltipRow
                  label={tooltip.data.overlayValue.name}
                  value={`${formatValue(tooltip.data.overlayValue.value)} ${tooltip.data.overlayValue.unit || unit}`}
                />
              )}
            </>
          )
        }
        visible={tooltip.visible}
        x={tooltip.position.x}
        y={tooltip.position.y}
      />

      {/* Legend — hide for single-series without overlay */}
      {(series.length > 1 || overlay) && (
        <div className="flex flex-wrap gap-4 mt-3 px-2">
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-2 rounded-sm" style={{ background: s.color, opacity: 0.7 }} />
              <span className="text-caption">{s.name}</span>
            </div>
          ))}
          {overlay && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded-full" style={{ background: overlay.color }} />
              <span className="text-caption">{overlay.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
