import { useMemo, useState, useRef, useEffect } from 'react';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  type SankeyGraph,
  type SankeyNode as D3SankeyNode,
  type SankeyLink as D3SankeyLink,
} from 'd3-sankey';
import type { SankeyData } from '../../lib/data/schema.ts';
import { formatRsCrore } from '../../lib/format.ts';
import { Tooltip, TooltipTitle, TooltipRow } from '../ui/Tooltip.tsx';
import { useTooltip } from '../../hooks/useTooltip.ts';

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
  isVisible: boolean;
  ariaLabel?: string;
}

interface NodeExtra {
  id: string;
  name: string;
  group: string;
}

type SNode = D3SankeyNode<NodeExtra, object>;
type SLink = D3SankeyLink<NodeExtra, object>;

const GROUP_COLORS: Record<string, string> = {
  revenue: '#3B82F6',
  center: '#FF6B35',
  expenditure: '#4AEADC',
};

/** Truncate long node names to prevent SVG overflow */
function truncateLabel(name: string, maxLen = 22): string {
  return name.length > maxLen ? name.slice(0, maxLen - 1).trimEnd() + '…' : name;
}

export function SankeyDiagram({ data, width = 900, height = 600, isVisible, ariaLabel }: SankeyDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pathLengths, setPathLengths] = useState<Map<number, number>>(new Map());
  const pathRefs = useRef<Map<number, SVGPathElement>>(new Map());
  const tooltip = useTooltip<{ name: string; value: number; type: 'node' | 'link'; from?: string; to?: string }>();

  const graph = useMemo(() => {
    const nodeIds = new Set(data.nodes.map((n) => n.id));
    const nodes: NodeExtra[] = data.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      group: n.group,
    }));
    const links = data.links
      .filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target))
      .map((l) => ({ source: l.source, target: l.target, value: l.value }));

    const layout = d3Sankey<NodeExtra, object>()
      .nodeId((d: SNode) => (d as unknown as NodeExtra).id)
      .nodeWidth(14)
      .nodePadding(22)
      .extent([
        [160, 20],
        [width - 220, height - 20],
      ]);

    return layout({ nodes, links } as SankeyGraph<NodeExtra, object>);
  }, [data, width, height]);

  const pathGen = sankeyLinkHorizontal();

  useEffect(() => {
    const lengths = new Map<number, number>();
    // Only measure refs for current links; prune stale entries from previous layouts
    for (let i = 0; i < graph.links.length; i++) {
      const el = pathRefs.current.get(i);
      if (el) lengths.set(i, el.getTotalLength());
    }
    for (const key of pathRefs.current.keys()) {
      if (key >= graph.links.length) pathRefs.current.delete(key);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement requires setState in effect
    setPathLengths(lengths);
  }, [graph]);

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return graph.links.some((l) => {
      const src = (l.source as SNode) as unknown as NodeExtra;
      const tgt = (l.target as SNode) as unknown as NodeExtra;
      return (
        (src.id === hoveredNode && tgt.id === nodeId) ||
        (tgt.id === hoveredNode && src.id === nodeId)
      );
    });
  };

  const isLinkConnected = (link: SLink) => {
    if (!hoveredNode) return true;
    const src = (link.source as SNode) as unknown as NodeExtra;
    const tgt = (link.target as SNode) as unknown as NodeExtra;
    return src.id === hoveredNode || tgt.id === hoveredNode;
  };

  /** Unique gradient IDs for link gradients */
  const gradientId = (i: number) => `sankey-grad-${i}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 420 }} role="img" aria-label={ariaLabel || 'Sankey flow diagram'}>
        <defs>
          {graph.links.map((link, i) => {
            const srcColor =
              GROUP_COLORS[((link.source as SNode) as unknown as NodeExtra).group] || '#6B7280';
            const tgtColor =
              GROUP_COLORS[((link.target as SNode) as unknown as NodeExtra).group] || '#6B7280';
            return (
              <linearGradient key={i} id={gradientId(i)} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={srcColor} />
                <stop offset="100%" stopColor={tgtColor} />
              </linearGradient>
            );
          })}
        </defs>

        {/* Links with gradients */}
        {graph.links.map((link, i) => {
          const pathD = pathGen(link as never) || '';
          const pLen = pathLengths.get(i) || 1000;
          const connected = isLinkConnected(link);
          const src = (link.source as SNode) as unknown as NodeExtra;
          const tgt = (link.target as SNode) as unknown as NodeExtra;
          const isRevenue = src.group === 'revenue';
          const waveDelay = isRevenue ? i * 0.04 : 0.8 + i * 0.04;

          return (
            <path
              key={i}
              ref={(el) => {
                if (el) pathRefs.current.set(i, el);
              }}
              d={pathD}
              fill="none"
              stroke={`url(#${gradientId(i)})`}
              strokeWidth={Math.max(1, (link as unknown as { width?: number }).width || 1)}
              strokeOpacity={connected ? (hoveredNode ? 0.65 : 0.45) : 0.06}
              style={
                isVisible
                  ? {
                      strokeDasharray: pLen,
                      strokeDashoffset: 0,
                      transition: `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${waveDelay}s, stroke-opacity 0.3s ease`,
                    }
                  : {
                      strokeDasharray: pLen,
                      strokeDashoffset: pLen,
                    }
              }
              onMouseEnter={(e) =>
                tooltip.show({ name: `${src.name} → ${tgt.name}`, value: link.value || 0, type: 'link', from: src.name, to: tgt.name }, e)
              }
              onMouseMove={tooltip.move}
              onMouseLeave={tooltip.hide}
            />
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node, nodeIdx) => {
          const n = node as SNode;
          const extra = n as unknown as NodeExtra;
          const x0 = (n as unknown as { x0: number }).x0 || 0;
          const x1 = (n as unknown as { x1: number }).x1 || 0;
          const y0 = (n as unknown as { y0: number }).y0 || 0;
          const y1 = (n as unknown as { y1: number }).y1 || 0;
          const nodeHeight = y1 - y0;
          const connected = isConnected(extra.id);
          const nodeValue = (n as unknown as { value?: number }).value || 0;
          // Slide direction: revenue from left, expenditure from right, center from below
          const slideX = extra.group === 'revenue' ? -20 : extra.group === 'expenditure' ? 20 : 0;
          const slideY = extra.group === 'center' ? 15 : 0;
          const nodeDelay = extra.group === 'revenue' ? nodeIdx * 0.04 : extra.group === 'center' ? 0.5 : 0.7 + nodeIdx * 0.04;

          return (
            <g
              key={extra.id}
              onMouseEnter={(e) => {
                setHoveredNode(extra.id);
                tooltip.show({ name: extra.name, value: nodeValue, type: 'node' }, e);
              }}
              onMouseMove={tooltip.move}
              onMouseLeave={() => {
                setHoveredNode(null);
                tooltip.hide();
              }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x0}
                y={y0}
                width={x1 - x0}
                height={y1 - y0}
                fill={GROUP_COLORS[extra.group] || '#6B7280'}
                rx={2}
                opacity={isVisible ? (connected ? 1 : 0.15) : 0}
                style={{
                  transition: `opacity 0.3s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${nodeDelay}s`,
                  transform: isVisible ? 'translate(0, 0)' : `translate(${slideX}px, ${slideY}px)`,
                }}
              />
              {/* Node label */}
              <text
                x={extra.group === 'revenue' ? x0 - 6 : x1 + 6}
                y={(y0 + y1) / 2 - 4}
                dy="0.35em"
                textAnchor={extra.group === 'revenue' ? 'end' : 'start'}
                fill={connected ? 'var(--text-secondary)' : 'var(--text-muted)'}
                fontSize={12}
                fontWeight={600}
                fontFamily="var(--font-body)"
                opacity={isVisible ? 1 : 0}
                style={{ transition: 'opacity 0.6s ease, fill 0.3s ease' }}
              >
                {truncateLabel(extra.name)}
              </text>
              {/* Value below label */}
              {nodeValue > 0 && nodeHeight >= 20 && (
                <text
                  x={extra.group === 'revenue' ? x0 - 6 : x1 + 6}
                  y={(y0 + y1) / 2 + 10}
                  dy="0.35em"
                  textAnchor={extra.group === 'revenue' ? 'end' : 'start'}
                  fill="var(--text-muted)"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  opacity={isVisible ? (connected ? 0.8 : 0.3) : 0}
                  style={{ transition: 'opacity 0.6s ease' }}
                >
                  {formatRsCrore(nodeValue)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>
                {tooltip.data.type === 'link' ? `${tooltip.data.from} → ${tooltip.data.to}` : tooltip.data.name}
              </TooltipTitle>
              <TooltipRow label="Amount" value={formatRsCrore(tooltip.data.value)} />
              {tooltip.data.value > 0 && (
                <TooltipRow
                  label="Share"
                  value={`${((tooltip.data.value / (data.nodes.find(n => n.id === 'central-govt')?.value || 1)) * 100).toFixed(1)}%`}
                />
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
