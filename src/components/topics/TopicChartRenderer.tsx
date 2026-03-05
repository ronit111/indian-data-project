/**
 * Dispatches TopicChartDef → existing chart components.
 * Transforms extractData output to match chart component props.
 * Handles the 'stat-row' pseudo-chart type for key metrics display.
 */

import { motion } from 'framer-motion';
import type { TopicChartDef, TopicDataBag } from '../../lib/topicConfig.ts';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { LineChart } from '../viz/LineChart.tsx';
import { AreaChart } from '../viz/AreaChart.tsx';
import { HorizontalBarChart } from '../viz/HorizontalBarChart.tsx';

interface TopicChartRendererProps {
  chart: TopicChartDef;
  bag: TopicDataBag;
}

// ─── Stat Row (pseudo-chart for key metrics) ────────────────────────

function StatRow({ data }: { data: Array<{ label: string; value: string; accent?: string }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {data.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg px-4 py-3"
          style={{ background: 'var(--bg-raised)' }}
        >
          <span
            className="block font-mono text-lg md:text-xl font-bold"
            style={{ color: item.accent ?? 'var(--text-primary)' }}
          >
            {item.value}
          </span>
          <span className="block text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Transform helpers ──────────────────────────────────────────────
// extractData outputs { label, value } arrays; chart components need
// { year, value } (Line/Area) or { id, label, value } (Bar).

interface RawSeriesItem {
  name: string;
  color: string;
  data: Array<{ label: string; value: number }>;
  dashed?: boolean;
}

function toLineSeries(raw: RawSeriesItem[]) {
  return raw.map((s, i) => ({
    id: s.name.toLowerCase().replace(/\s+/g, '-') || `series-${i}`,
    name: s.name,
    color: s.color,
    dashed: s.dashed,
    data: s.data.map((p) => ({ year: p.label, value: p.value })),
  }));
}

function toBarItems(raw: Array<{ name: string; value: number }>) {
  return raw.map((item, i) => ({
    id: item.name.toLowerCase().replace(/\s+/g, '-') || `bar-${i}`,
    label: item.name,
    value: item.value,
  }));
}

// ─── Main Renderer ──────────────────────────────────────────────────

export function TopicChartRenderer({ chart, bag }: TopicChartRendererProps) {
  const [ref, isVisible] = useScrollTrigger<HTMLDivElement>({ threshold: 0.2 });
  const data = chart.extractData(bag);

  if (!data) {
    return (
      <div className="rounded-lg px-4 py-8 text-center" style={{ background: 'var(--bg-raised)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Data not available for this visualization
        </p>
      </div>
    );
  }

  // Stat row (special pseudo-chart — no scroll trigger needed)
  if (chart.chartType === 'stat-row') {
    return <StatRow data={data as Array<{ label: string; value: string; accent?: string }>} />;
  }

  return (
    <div ref={ref}>
      {chart.chartTitle && (
        <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
          {chart.chartTitle}
        </p>
      )}

      {/* Line chart */}
      {chart.chartType === 'line' && (
        <div className="w-full">
          <LineChart
            series={toLineSeries(data as RawSeriesItem[])}
            isVisible={isVisible}
            unit={chart.unit}
          />
        </div>
      )}

      {/* Area chart */}
      {chart.chartType === 'area' && (
        <div className="w-full">
          <AreaChart
            series={toLineSeries(data as RawSeriesItem[]).map((s) => ({
              ...s,
              data: s.data.map((p) => ({ year: p.year, value: p.value })),
            }))}
            isVisible={isVisible}
            unit={chart.unit}
          />
        </div>
      )}

      {/* Horizontal bar chart */}
      {chart.chartType === 'horizontal-bar' && (
        <div className="w-full">
          <HorizontalBarChart
            items={toBarItems(data as Array<{ name: string; value: number }>)}
            isVisible={isVisible}
            unit={chart.unit ?? ''}
          />
        </div>
      )}

      {/* Fallback */}
      {!['line', 'area', 'horizontal-bar'].includes(chart.chartType) && (
        <div className="rounded-lg px-4 py-8 text-center" style={{ background: 'var(--bg-raised)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Chart type "{chart.chartType}" not yet supported in topics
          </p>
        </div>
      )}
    </div>
  );
}
