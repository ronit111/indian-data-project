import { useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3-hierarchy';
import { AnimatePresence, motion } from 'framer-motion';
import type { TreemapNode } from '../../lib/data/schema.ts';
import { formatRsCrore, formatPercent } from '../../lib/format.ts';
import { Tooltip, TooltipTitle, TooltipRow, TooltipHint, useTooltip } from '../ui/Tooltip.tsx';

interface TreemapChartProps {
  root: TreemapNode;
  width?: number;
  height?: number;
  isVisible: boolean;
  ariaLabel?: string;
}

/**
 * Deterministic color map: warm saffron tints for domestic spending,
 * cool teal for transfers/interest. Children inherit parent tint.
 */
const NODE_COLORS: Record<string, string> = {
  'transfers-to-states': '#3BA5A0',
  'interest-payments': '#4AAAA5',
  'defence': '#FF6B35',
  'road-transport': '#FF8C5A',
  'railways': '#FF9E70',
  'subsidies': '#E0813C',
  'home-affairs': '#FFB088',
  'rural-development': '#C75E28',
  'agriculture': '#D47040',
  'education': '#E8844A',
  'health': '#F09555',
  'pensions': '#5BBFB5',
};

const DEFAULT_COLOR = '#FF8C5A';

function getNodeColor(id: string, parentId?: string): string {
  return NODE_COLORS[id] || NODE_COLORS[parentId || ''] || DEFAULT_COLOR;
}

export function TreemapChart({ root, width = 960, height = 600, isVisible, ariaLabel }: TreemapChartProps) {
  const [drillPath, setDrillPath] = useState<TreemapNode[]>([]);
  const activeRoot = drillPath.length > 0 ? drillPath[drillPath.length - 1] : root;
  const tooltip = useTooltip<{ name: string; value: number; pct?: number; hasChildren: boolean }>();

  const layout = useMemo(() => {
    const hierarchy = d3
      .hierarchy(activeRoot)
      .sum((d) => (d.children ? 0 : d.value || 0))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap<TreemapNode>()
      .size([width, height])
      .paddingInner(2)
      .paddingOuter(3)
      .round(true)(hierarchy);

    // Show one level at a time — direct children, not all leaves
    return hierarchy.children || [];
  }, [activeRoot, width, height]);

  const handleClick = useCallback(
    (node: TreemapNode) => {
      // Only drill into nodes that themselves have children
      if (!node.children || node.children.length === 0) return;
      setDrillPath((prev) => [...prev, node]);
    },
    []
  );

  const handleBreadcrumb = useCallback((index: number) => {
    setDrillPath((prev) => prev.slice(0, index));
  }, []);

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      {drillPath.length > 0 && (
        <div className="flex items-center gap-1 mb-3 text-sm">
          <button
            onClick={() => handleBreadcrumb(0)}
            className="text-caption hover:text-[var(--text-secondary)] transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            All Spending
          </button>
          {drillPath.map((node, i) => (
            <span key={node.id} className="flex items-center gap-1">
              <span className="text-caption">&rsaquo;</span>
              <button
                onClick={() => handleBreadcrumb(i + 1)}
                className="text-caption hover:text-[var(--text-secondary)] transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {node.name}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: `${width}/${height}` }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" role="img" aria-label={ariaLabel || `Treemap: ${root.name}`}>
          <AnimatePresence mode="wait">
            {layout.map((child, i) => {
              const x0 = (child as unknown as { x0: number }).x0;
              const y0 = (child as unknown as { y0: number }).y0;
              const x1 = (child as unknown as { x1: number }).x1;
              const y1 = (child as unknown as { y1: number }).y1;
              const w = x1 - x0;
              const h = y1 - y0;
              const color = getNodeColor(
                child.data.id,
                drillPath.length > 0 ? activeRoot.id : undefined
              );
              const showLabel = w > 60 && h > 28;
              const showValue = w > 80 && h > 48;
              const hasChildren = !!(child.data.children && child.data.children.length > 0);
              const maxChars = Math.floor(w / 7.5);

              return (
                <motion.g
                  key={child.data.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: `${x0 + w / 2}px ${y0 + h / 2}px` }}
                >
                  <rect
                    className="treemap-rect"
                    x={x0}
                    y={y0}
                    width={w}
                    height={h}
                    fill={color}
                    rx={3}
                    tabIndex={hasChildren ? 0 : undefined}
                    role={hasChildren ? 'button' : undefined}
                    aria-label={`${child.data.name}: ${formatRsCrore(child.value || 0)}${hasChildren ? ' — press Enter to drill down' : ''}`}
                    onClick={() => handleClick(child.data)}
                    onKeyDown={(e) => {
                      if (hasChildren && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleClick(child.data);
                      }
                    }}
                    onMouseEnter={(e) =>
                      tooltip.show(
                        {
                          name: child.data.name,
                          value: child.value || 0,
                          pct: child.data.percentOfTotal,
                          hasChildren,
                        },
                        e
                      )
                    }
                    onMouseMove={tooltip.move}
                    onMouseLeave={tooltip.hide}
                    style={{ cursor: hasChildren ? 'pointer' : 'default', outline: 'none' }}
                    onFocus={(e) => {
                      if (hasChildren) (e.target as SVGRectElement).setAttribute('stroke', 'var(--text-primary)');
                    }}
                    onBlur={(e) => {
                      (e.target as SVGRectElement).removeAttribute('stroke');
                    }}
                  />
                  {showLabel && (
                    <text
                      x={x0 + 6}
                      y={y0 + 18}
                      fill="white"
                      fontSize={w > 120 ? 12 : 10}
                      fontWeight={600}
                      fontFamily="var(--font-body)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {child.data.name.length > maxChars
                        ? child.data.name.slice(0, maxChars) + '...'
                        : child.data.name}
                    </text>
                  )}
                  {showValue && (
                    <text
                      x={x0 + 6}
                      y={y0 + 34}
                      fill="rgba(255,255,255,0.7)"
                      fontSize={10}
                      fontFamily="var(--font-mono)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {child.data.percentOfTotal
                        ? formatPercent(child.data.percentOfTotal)
                        : formatRsCrore(child.value || 0)}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </div>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.name}</TooltipTitle>
              {tooltip.data.pct && (
                <TooltipRow label="Share" value={formatPercent(tooltip.data.pct)} />
              )}
              <TooltipRow label="Amount" value={formatRsCrore(tooltip.data.value)} />
              {tooltip.data.hasChildren && (
                <TooltipHint>Click to drill down</TooltipHint>
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
