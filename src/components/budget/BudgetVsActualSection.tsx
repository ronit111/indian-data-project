import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { scaleLinear } from 'd3-scale';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { Tooltip, TooltipTitle, TooltipRow } from '../ui/Tooltip.tsx';
import { useTooltip } from '../../hooks/useTooltip.ts';
import type { BudgetVsActualData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface BudgetVsActualSectionProps {
  data: BudgetVsActualData;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Color thresholds for deviation
const COLOR_OVERSPEND = 'var(--saffron)';  // overspent
const COLOR_UNDERSPEND = 'var(--cyan)';    // underspent
const COLOR_ONTRACK = '#22c55e';           // within ±5%

interface DeviationItem {
  id: string;
  name: string;
  deviation: number;      // % deviation from BE
  be: number;
  actual: number;
  color: string;
}

export function BudgetVsActualSection({ data }: BudgetVsActualSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Available years that have actuals
  const yearsWithActuals = useMemo(() => {
    const years = new Set<string>();
    for (const m of data.ministries) {
      for (const h of m.history) {
        if (h.actual !== null) years.add(h.year);
      }
    }
    return Array.from(years).sort().reverse();
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(yearsWithActuals[0] || '2023-24');

  // Compute deviations for selected year
  const deviations: DeviationItem[] = useMemo(() => {
    return data.ministries
      .map((m) => {
        const yearData = m.history.find((h) => h.year === selectedYear);
        if (!yearData || yearData.actual === null) return null;
        const deviation = ((yearData.actual - yearData.be) / yearData.be) * 100;
        const absDeviation = Math.abs(deviation);
        const color = absDeviation <= 5 ? COLOR_ONTRACK : deviation > 0 ? COLOR_OVERSPEND : COLOR_UNDERSPEND;
        return {
          id: m.id,
          name: m.name.replace('Ministry of ', '').replace('Dept. of ', ''),
          deviation: Math.round(deviation * 10) / 10,
          be: yearData.be,
          actual: yearData.actual,
          color,
        };
      })
      .filter((d): d is DeviationItem => d !== null)
      .sort((a, b) => b.deviation - a.deviation);
  }, [data, selectedYear]);

  // Stats for narrative
  const overspenders = deviations.filter((d) => d.deviation > 5).length;
  const underspenders = deviations.filter((d) => d.deviation < -5).length;
  const biggestOverspend = deviations[0];
  const biggestUnderspend = deviations[deviations.length - 1];

  return (
    <section ref={ref} id="budget-vs-actual" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            className="font-extrabold"
          >
            <span style={{ color: 'var(--text-primary)' }}>{'Promises vs '}</span>
            <span className="gradient-text-cyan">reality</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="text-composition mt-3"
          >
            How well does the government spend what it plans?
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.25 }}
          className="text-annotation mb-6 max-w-2xl"
        >
          {`In FY ${selectedYear}, ${overspenders} ${overspenders === 1 ? 'ministry' : 'ministries'} overspent their budget estimate`}
          {underspenders > 0 && ` while ${underspenders} underspent`}
          {biggestUnderspend && biggestUnderspend.deviation < -5
            ? `. ${biggestUnderspend.name} saw the largest gap at ${biggestUnderspend.deviation}%.`
            : '.'}
        </motion.p>

        {/* Year selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>Fiscal Year:</span>
          <div className="flex gap-2 flex-wrap">
            {yearsWithActuals.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className="px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer"
                style={{
                  background: yr === selectedYear ? 'var(--cyan)' : 'var(--bg-raised)',
                  color: yr === selectedYear ? 'var(--bg-void)' : 'var(--text-muted)',
                  border: yr === selectedYear ? 'none' : 'var(--border-subtle)',
                }}
              >
                {yr}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Deviation chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.35 }}
        >
          <p className="text-caption uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Actual vs Budget Estimate — % deviation
          </p>
          <ChartActionsWrapper registryKey="budget/budget-vs-actual" data={data}>
            <DeviationChart items={deviations} isVisible={isVisible} />
          </ChartActionsWrapper>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 mb-6">
          <LegendDot color={COLOR_OVERSPEND} label="Overspent (>5%)" />
          <LegendDot color={COLOR_ONTRACK} label="On track (±5%)" />
          <LegendDot color={COLOR_UNDERSPEND} label="Underspent (>5%)" />
        </div>

        {/* Key insight callout */}
        {biggestOverspend && biggestUnderspend && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
          >
            <InsightCard
              label="Highest overspend"
              ministry={biggestOverspend.name}
              value={`+${biggestOverspend.deviation}%`}
              color={COLOR_OVERSPEND}
            />
            <InsightCard
              label="Largest underspend"
              ministry={biggestUnderspend.name}
              value={`${biggestUnderspend.deviation}%`}
              color={COLOR_UNDERSPEND}
            />
          </motion.div>
        )}

        <p className="source-attribution">
          Source: Expenditure Budget Vol-1, Statement 3A (various years), indiabudget.gov.in
        </p>
      </div>
    </section>
  );
}


// ─── Deviation Chart (inline SVG) ──────────────────────────────────
function DeviationChart({ items, isVisible }: { items: DeviationItem[]; isVisible: boolean }) {
  const tooltip = useTooltip<DeviationItem>();
  const LABEL_W = 180;
  const CHART_W = 420;
  const BAR_H = 32;
  const GAP = 4;
  const totalH = items.length * (BAR_H + GAP);
  const svgW = LABEL_W + CHART_W + 80;

  const maxAbs = useMemo(() => {
    const max = Math.max(...items.map((d) => Math.abs(d.deviation)));
    return Math.max(max, 10); // minimum 10% range
  }, [items]);

  const xScale = useMemo(
    () => scaleLinear().domain([-maxAbs, maxAbs]).range([0, CHART_W]),
    [maxAbs],
  );

  const zeroX = xScale(0);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${totalH + 16}`}
        className="w-full"
        style={{ minWidth: 500 }}
      >
        {/* Zero line */}
        <line
          x1={LABEL_W + zeroX}
          x2={LABEL_W + zeroX}
          y1={0}
          y2={totalH}
          stroke="var(--text-muted)"
          strokeWidth={1}
          opacity={isVisible ? 0.4 : 0}
          style={{ transition: 'opacity 0.5s ease' }}
        />

        {items.map((item, i) => {
          const y = i * (BAR_H + GAP);
          const barX = item.deviation >= 0 ? LABEL_W + zeroX : LABEL_W + xScale(item.deviation);
          const barW = Math.abs(xScale(item.deviation) - zeroX);
          const delay = 0.4 + i * 0.05;

          return (
            <g key={item.id}>
              {/* Ministry label */}
              <text
                x={LABEL_W - 8}
                y={y + BAR_H / 2}
                dy="0.35em"
                textAnchor="end"
                fontSize={11}
                fontFamily="var(--font-body)"
                fill="var(--text-secondary)"
                opacity={isVisible ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${delay}s` }}
              >
                {item.name}
              </text>

              {/* Bar */}
              <motion.rect
                x={barX}
                y={y + 2}
                height={BAR_H - 4}
                rx={3}
                fill={item.color}
                initial={{ width: 0 }}
                animate={isVisible ? { width: barW } : { width: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay }}
                onMouseEnter={(e) => tooltip.show(item, e as unknown as React.MouseEvent)}
                onMouseMove={tooltip.move as unknown as React.MouseEventHandler<SVGRectElement>}
                onMouseLeave={tooltip.hide}
                style={{ cursor: 'crosshair' }}
              />

              {/* Value label — inside bar when negative bar is wide enough to prevent label/name overlap */}
              {(() => {
                const insideBar = item.deviation < 0 && barW > 60;
                return (
                  <motion.text
                    x={insideBar ? barX + barW - 6 : item.deviation >= 0 ? barX + barW + 6 : barX - 6}
                    y={y + BAR_H / 2}
                    dy="0.35em"
                    textAnchor={insideBar ? 'end' : item.deviation >= 0 ? 'start' : 'end'}
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                    fontWeight={600}
                    fill={insideBar ? 'var(--bg-void)' : item.color}
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: delay + 0.3 }}
                  >
                    {item.deviation > 0 ? `+${item.deviation}%` : `${item.deviation}%`}
                  </motion.text>
                );
              })()}
            </g>
          );
        })}
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.name}</TooltipTitle>
              <TooltipRow label="Budget Estimate" value={`₹${(tooltip.data.be / 1000).toFixed(0)}K Cr`} />
              <TooltipRow label="Actual" value={`₹${(tooltip.data.actual / 1000).toFixed(0)}K Cr`} />
              <TooltipRow label="Deviation" value={`${tooltip.data.deviation > 0 ? '+' : ''}${tooltip.data.deviation}%`} />
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


// ─── Helpers ────────────────────────────────────────────────────────

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
      <span className="text-caption">{label}</span>
    </div>
  );
}

function InsightCard({
  label,
  ministry,
  value,
  color,
}: {
  label: string;
  ministry: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: 'var(--bg-raised)',
        border: 'var(--border-subtle)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p className="text-caption uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono font-bold text-lg" style={{ color }}>{value}</p>
      <p className="text-caption mt-1">{ministry}</p>
    </div>
  );
}
