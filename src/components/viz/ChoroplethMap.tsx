import { useMemo, useState, useEffect } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { interpolateRgb } from 'd3-interpolate';
import * as topojson from 'topojson-client';
import type { StateTransfer } from '../../lib/data/schema.ts';
import { formatRsCrore, formatIndianNumber } from '../../lib/format.ts';
import { TOPO_NAME_TO_BUDGET_CODE, NE_STATES, STATES_WITHOUT_BUDGET_DATA } from '../../lib/stateMapping.ts';
import { Tooltip, TooltipTitle, TooltipRow } from '../ui/Tooltip.tsx';
import { useTooltip } from '../../hooks/useTooltip.ts';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Feature, Geometry } from 'geojson';

interface ChoroplethMapProps {
  states: StateTransfer[];
  isVisible: boolean;
  ariaLabel?: string;
}

interface StateProperties {
  st_nm: string;
  st_code: string;
}

type TopoData = Topology<{ states: GeometryCollection<StateProperties> }>;

export function ChoroplethMap({ states, isVisible, ariaLabel }: ChoroplethMapProps) {
  const [topoData, setTopoData] = useState<TopoData | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const tooltip = useTooltip<StateTransfer & { topoName: string }>();

  // Load TopoJSON
  useEffect(() => {
    fetch('/data/geo/india-states.topo.json')
      .then((r) => r.json())
      .then((data: TopoData) => setTopoData(data))
      .catch(() => {
        // Fallback: try alternate path
        fetch('/data/geo/india-states.topojson')
          .then((r) => r.json())
          .then((data: TopoData) => setTopoData(data));
      });
  }, []);

  // Build state data lookup
  const stateMap = useMemo(
    () => new Map(states.map((s) => [s.id, s])),
    [states]
  );

  // NE combined data
  const neData = stateMap.get('NE');

  // Convert TopoJSON to GeoJSON features
  const { features, pathGenerator } = useMemo(() => {
    if (!topoData) return { features: [] as Feature<Geometry, StateProperties>[], pathGenerator: null };

    const geoJSON = topojson.feature(topoData, topoData.objects.states) as FeatureCollection<Geometry, StateProperties>;
    const width = 600;
    const height = 700;

    const proj = geoMercator().fitSize([width, height], geoJSON);
    const path = geoPath(proj);

    return { features: geoJSON.features, pathGenerator: path };
  }, [topoData]);

  // Color scale: diverging saffron → neutral → cyan
  const colorScale = useMemo(() => {
    const perCapitas = states.map((s) => s.perCapita);
    const min = Math.min(...perCapitas);
    const max = Math.max(...perCapitas);
    const mid = (min + max) / 2;

    return (value: number) => {
      if (value <= mid) {
        const t = (value - min) / (mid - min || 1);
        return interpolateRgb('#4AEADC', '#1a2230')(1 - t);
      } else {
        const t = (value - mid) / (max - mid || 1);
        return interpolateRgb('#1a2230', '#FF6B35')(t);
      }
    };
  }, [states]);

  // Lookup budget data for a TopoJSON state
  function getStateData(stName: string): StateTransfer | undefined {
    const budgetCode = TOPO_NAME_TO_BUDGET_CODE[stName];
    if (budgetCode) return stateMap.get(budgetCode);
    if (NE_STATES.includes(stName) && neData) return neData;
    return undefined;
  }

  if (!topoData || !pathGenerator) {
    return (
      <div className="w-full aspect-[6/7] flex items-center justify-center">
        <div className="skeleton w-full h-full rounded-lg" />
      </div>
    );
  }

  // Sort features by latitude (north to south) for stagger animation
  const sortedFeatures = [...features].sort((a, b) => {
    const centA = pathGenerator.centroid(a);
    const centB = pathGenerator.centroid(b);
    return (centA[1] || 0) - (centB[1] || 0);
  });

  const perCapitas = states.map((s) => s.perCapita);
  const minPC = Math.min(...perCapitas);
  const maxPC = Math.max(...perCapitas);

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ aspectRatio: '6/7' }}>
        <svg viewBox="0 0 600 700" className="absolute inset-0 w-full h-full" role="img" aria-label={ariaLabel || 'Choropleth map of India'}>
          {sortedFeatures.map((feature, i) => {
            const stName = feature.properties.st_nm;
            const d = pathGenerator(feature) || '';
            const stateData = getStateData(stName);
            const isNE = NE_STATES.includes(stName);
            const noData = STATES_WITHOUT_BUDGET_DATA.includes(stName);
            const fill = stateData
              ? colorScale(stateData.perCapita)
              : noData
                ? '#151c28'
                : '#1a2230';
            const isHovered = hoveredState === stName;

            return (
              <path
                key={stName}
                d={d}
                fill={fill}
                stroke={isHovered ? 'white' : 'var(--bg-void)'}
                strokeWidth={isHovered ? 1.5 : 0.5}
                opacity={isVisible ? (hoveredState && !isHovered ? 0.5 : 1) : 0}
                style={{
                  transition: `opacity 0.5s ease ${i * 0.03}s, stroke 0.15s ease, stroke-width 0.15s ease, filter 0.2s ease`,
                  cursor: stateData ? 'pointer' : 'default',
                  filter: isHovered
                    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.2)) brightness(1.1)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  setHoveredState(stName);
                  if (stateData) {
                    tooltip.show({ ...stateData, topoName: isNE ? `${stName} (NE Combined)` : stName }, e);
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

      {/* Continuous gradient legend */}
      <div className="flex items-center gap-2 mt-4 justify-center">
        <span className="text-caption">₹{formatIndianNumber(minPC)}</span>
        <div
          className="h-2 rounded-full flex-1 max-w-48"
          style={{
            background: `linear-gradient(to right, #4AEADC, #1a2230, #FF6B35)`,
          }}
        />
        <span className="text-caption">₹{formatIndianNumber(maxPC)}</span>
        <span className="text-caption ml-1">(per capita)</span>
      </div>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.topoName || tooltip.data.name}</TooltipTitle>
              <TooltipRow label="Transfer" value={formatRsCrore(tooltip.data.transfer)} />
              <TooltipRow label="Per capita" value={`₹${formatIndianNumber(tooltip.data.perCapita)}`} />
              <TooltipRow label="Share" value={`${tooltip.data.percentOfTotal}%`} />
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
