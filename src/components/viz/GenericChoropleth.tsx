import { useMemo, useState, useEffect } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { scaleSequential, scaleDiverging, scaleOrdinal } from 'd3-scale';
import { interpolateRgb } from 'd3-interpolate';
import * as topojson from 'topojson-client';
import { TOPO_NAME_TO_STATE_CODE } from '../../lib/stateMapping.ts';
import { Tooltip, TooltipTitle, TooltipRow, useTooltip } from '../ui/Tooltip.tsx';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Feature, Geometry } from 'geojson';

export interface ChoroplethDataPoint {
  id: string;
  name: string;
  value: number;
  category?: string;
}

interface GenericChoroplethProps {
  data: ChoroplethDataPoint[];
  colorScaleType: 'sequential' | 'diverging' | 'categorical';
  accentColor?: string;
  divergingLow?: string;
  divergingHigh?: string;
  colorMap?: Record<string, string>;
  formatValue: (v: number) => string;
  legendLabel?: string;
  isVisible: boolean;
  nationalAvg?: number;
  invertScale?: boolean;
}

interface StateProperties {
  st_nm: string;
  st_code: string;
}

type TopoData = Topology<{ states: GeometryCollection<StateProperties> }>;

let cachedTopo: TopoData | null = null;
let topoPromise: Promise<TopoData> | null = null;

function loadTopo(): Promise<TopoData> {
  if (cachedTopo) return Promise.resolve(cachedTopo);
  if (topoPromise) return topoPromise;
  topoPromise = fetch('/data/geo/india-states.topo.json')
    .then((r) => r.json())
    .then((data: TopoData) => {
      cachedTopo = data;
      return data;
    });
  return topoPromise;
}

export function GenericChoropleth({
  data,
  colorScaleType,
  accentColor = 'var(--saffron)',
  divergingLow = '#4AEADC',
  divergingHigh = '#FF6B35',
  colorMap,
  formatValue,
  legendLabel,
  isVisible,
  nationalAvg,
  invertScale = false,
}: GenericChoroplethProps) {
  const [topoData, setTopoData] = useState<TopoData | null>(cachedTopo);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const tooltip = useTooltip<ChoroplethDataPoint & { topoName: string }>();

  useEffect(() => {
    if (cachedTopo) {
      setTopoData(cachedTopo);
      return;
    }
    loadTopo().then(setTopoData);
  }, []);

  const dataMap = useMemo(
    () => new Map(data.map((d) => [d.id, d])),
    [data]
  );

  const { features, pathGenerator } = useMemo(() => {
    if (!topoData) return { features: [] as Feature<Geometry, StateProperties>[], pathGenerator: null };
    const geoJSON = topojson.feature(topoData, topoData.objects.states) as FeatureCollection<Geometry, StateProperties>;
    const width = 600;
    const height = 700;
    const proj = geoMercator().fitSize([width, height], geoJSON);
    const path = geoPath(proj);
    return { features: geoJSON.features, pathGenerator: path };
  }, [topoData]);

  const values = useMemo(() => data.map((d) => d.value), [data]);
  const minVal = useMemo(() => Math.min(...values), [values]);
  const maxVal = useMemo(() => Math.max(...values), [values]);

  // Resolve CSS custom property to actual color
  const resolvedAccent = useMemo(() => {
    if (!accentColor.startsWith('var(')) return accentColor;
    const prop = accentColor.slice(4, -1);
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#FF6B35';
  }, [accentColor]);

  const resolvedDivLow = useMemo(() => {
    if (!divergingLow.startsWith('var(')) return divergingLow;
    const prop = divergingLow.slice(4, -1);
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#4AEADC';
  }, [divergingLow]);

  const resolvedDivHigh = useMemo(() => {
    if (!divergingHigh.startsWith('var(')) return divergingHigh;
    const prop = divergingHigh.slice(4, -1);
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#FF6B35';
  }, [divergingHigh]);

  const getColor = useMemo(() => {
    if (colorScaleType === 'categorical' && colorMap) {
      const scale = scaleOrdinal<string, string>()
        .domain(Object.keys(colorMap))
        .range(Object.values(colorMap));
      return (_value: number, category?: string) => category ? scale(category) : '#1a2230';
    }

    if (colorScaleType === 'diverging') {
      const mid = (minVal + maxVal) / 2;
      const scale = scaleDiverging<string>()
        .domain([minVal, mid, maxVal])
        .interpolator((t: number) => {
          if (t <= 0.5) return interpolateRgb(resolvedDivLow, '#1a2230')(t * 2);
          return interpolateRgb('#1a2230', resolvedDivHigh)((t - 0.5) * 2);
        });
      return (value: number) => scale(value);
    }

    // Sequential
    const lowColor = '#1a2230';
    const highColor = resolvedAccent;
    const scale = scaleSequential<string>()
      .domain(invertScale ? [maxVal, minVal] : [minVal, maxVal])
      .interpolator(interpolateRgb(lowColor, highColor));
    return (value: number) => scale(value);
  }, [colorScaleType, colorMap, minVal, maxVal, resolvedAccent, resolvedDivLow, resolvedDivHigh, invertScale]);

  function getStateData(stName: string): ChoroplethDataPoint | undefined {
    const stateCode = TOPO_NAME_TO_STATE_CODE[stName];
    if (!stateCode) return undefined;
    return dataMap.get(stateCode);
  }

  if (!topoData || !pathGenerator) {
    return (
      <div className="w-full aspect-[4/5] md:aspect-[6/7] flex items-center justify-center">
        <div className="skeleton w-full h-full rounded-lg" />
      </div>
    );
  }

  const sortedFeatures = [...features].sort((a, b) => {
    const centA = pathGenerator.centroid(a);
    const centB = pathGenerator.centroid(b);
    return (centA[1] || 0) - (centB[1] || 0);
  });

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ aspectRatio: '6/7' }}>
        <svg viewBox="0 0 600 700" className="absolute inset-0 w-full h-full">
          {sortedFeatures.map((feature, i) => {
            const stName = feature.properties.st_nm;
            const d = pathGenerator(feature) || '';
            const stateData = getStateData(stName);
            const fill = stateData
              ? getColor(stateData.value, stateData.category)
              : 'var(--bg-raised)';
            const hasData = !!stateData;
            const isHovered = hoveredState === stName;

            return (
              <path
                key={stName}
                d={d}
                fill={fill}
                stroke={isHovered ? 'white' : 'var(--bg-void)'}
                strokeWidth={isHovered ? 1.5 : 0.5}
                opacity={isVisible ? (hasData ? (hoveredState && !isHovered ? 0.5 : 1) : 0.4) : 0}
                style={{
                  transition: `opacity 0.5s ease ${i * 0.03}s, stroke 0.15s ease, stroke-width 0.15s ease, filter 0.2s ease`,
                  cursor: hasData ? 'pointer' : 'default',
                  filter: isHovered
                    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.2)) brightness(1.1)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  setHoveredState(stName);
                  if (stateData) {
                    tooltip.show({ ...stateData, topoName: stName }, e);
                  }
                }}
                onMouseMove={tooltip.move}
                onMouseLeave={() => {
                  setHoveredState(null);
                  tooltip.hide();
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      {colorScaleType === 'categorical' && colorMap ? (
        <div className="flex flex-wrap items-center gap-3 mt-4 justify-center">
          {Object.entries(colorMap).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="text-caption">{cat}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-4 justify-center">
          <span className="text-caption">
            {colorScaleType === 'diverging'
              ? formatValue(minVal)
              : formatValue(invertScale ? maxVal : minVal)}
          </span>
          <div className="relative h-2 rounded-full flex-1 max-w-48">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: colorScaleType === 'diverging'
                  ? `linear-gradient(to right, ${resolvedDivLow}, #1a2230, ${resolvedDivHigh})`
                  : `linear-gradient(to right, #1a2230, ${resolvedAccent})`,
              }}
            />
            {nationalAvg !== undefined && (
              <div
                className="absolute top-0 h-full w-0.5"
                style={{
                  left: `${((nationalAvg - minVal) / (maxVal - minVal)) * 100}%`,
                  background: 'var(--text-primary)',
                }}
                title={`National avg: ${formatValue(nationalAvg)}`}
              >
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-caption whitespace-nowrap"
                  style={{ fontSize: '0.625rem' }}
                >
                  avg
                </div>
              </div>
            )}
          </div>
          <span className="text-caption">
            {colorScaleType === 'diverging'
              ? formatValue(maxVal)
              : formatValue(invertScale ? minVal : maxVal)}
          </span>
          {legendLabel && <span className="text-caption ml-1">({legendLabel})</span>}
        </div>
      )}

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.topoName || tooltip.data.name}</TooltipTitle>
              <TooltipRow label={legendLabel || 'Value'} value={formatValue(tooltip.data.value)} />
              {tooltip.data.category && (
                <TooltipRow label="Category" value={tooltip.data.category} />
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
