/**
 * Renders a chart component based on chartType from registry entry.
 * Lazy imports chart components to keep embed bundle small.
 * Always passes isVisible={true} (no scroll animations in embeds).
 */
import { lazy, Suspense } from 'react';
import type { ChartType } from '../../lib/chartRegistry.ts';
import { formatPercent, formatIndianNumber } from '../../lib/format.ts';

const LineChart = lazy(() => import('../viz/LineChart.tsx').then((m) => ({ default: m.LineChart })));
const AreaChart = lazy(() => import('../viz/AreaChart.tsx').then((m) => ({ default: m.AreaChart })));
const HorizontalBarChart = lazy(() => import('../viz/HorizontalBarChart.tsx').then((m) => ({ default: m.HorizontalBarChart })));
const TreemapChart = lazy(() => import('../viz/TreemapChart.tsx').then((m) => ({ default: m.TreemapChart })));
const SankeyDiagram = lazy(() => import('../viz/SankeyDiagram.tsx').then((m) => ({ default: m.SankeyDiagram })));
const WaffleChart = lazy(() => import('../viz/WaffleChart.tsx').then((m) => ({ default: m.WaffleChart })));
const ChoroplethMap = lazy(() => import('../viz/ChoroplethMap.tsx').then((m) => ({ default: m.ChoroplethMap })));

interface ChartRendererProps {
  chartType: ChartType;
  data: unknown;
  domain: string;
  sectionId: string;
}

/**
 * Note: This is a best-effort renderer. For complex sections that combine
 * multiple charts or custom layouts, the embed may only show the primary chart.
 * Full fidelity requires section-specific embed handling (future enhancement).
 */
export function ChartRenderer({ chartType, data, domain, sectionId }: ChartRendererProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading chart...
        </div>
      }
    >
      <ChartSwitch chartType={chartType} data={data} domain={domain} sectionId={sectionId} />
    </Suspense>
  );
}

function ChartSwitch({ chartType, data, domain, sectionId }: ChartRendererProps) {
  const d = data as Record<string, unknown>;

  switch (chartType) {
    case 'line':
      return renderLineChart(d, domain, sectionId);
    case 'area':
      return renderAreaChart(d, domain, sectionId);
    case 'horizontal-bar':
      return renderBarChart(d, domain, sectionId);
    case 'treemap':
      return <TreemapChart root={(d as { root: never }).root} isVisible={true} />;
    case 'sankey':
      return <SankeyDiagram data={d as never} isVisible={true} />;
    case 'waffle':
      return <WaffleChart categories={(d as { categories: never[] }).categories} isVisible={true} />;
    case 'choropleth':
      return <ChoroplethMap states={(d as { states: never[] }).states} isVisible={true} />;
    default:
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          This chart type is not available for embedding yet.
        </div>
      );
  }
}

// ─── Type-specific render helpers ─────────────────────────────────────

function renderLineChart(data: Record<string, unknown>, domain: string, sectionId: string) {
  // Build series from known data shapes
  const series = buildLineSeries(data, domain, sectionId);
  if (!series.length) {
    return <div style={{ color: 'var(--text-muted)', padding: 20 }}>No data available</div>;
  }
  return <LineChart series={series} isVisible={true} />;
}

function renderAreaChart(data: Record<string, unknown>, domain: string, sectionId: string) {
  const series = buildAreaSeries(data, domain, sectionId);
  if (!series.length) {
    return <div style={{ color: 'var(--text-muted)', padding: 20 }}>No data available</div>;
  }
  return <AreaChart series={series} isVisible={true} />;
}

function renderBarChart(data: Record<string, unknown>, domain: string, sectionId: string) {
  const { arrayKey, valueKey, labelKey } = getBarFieldMapping(domain, sectionId);

  // Find the data array (states, stateRates, stateRatios, groundwaterStage, etc.)
  const arr = (data as Record<string, unknown>)[arrayKey] as Record<string, unknown>[] | undefined;
  if (arr && arr.length > 0) {
    const items = arr
      .filter((s) => typeof s[valueKey] === 'number' && Number.isFinite(s[valueKey] as number))
      .sort((a, b) => Math.abs(b[valueKey] as number) - Math.abs(a[valueKey] as number))
      .slice(0, 15)
      .map((s) => ({
        id: String(s.id || s[labelKey] || ''),
        label: String(s[labelKey] || s.name || ''),
        value: s[valueKey] as number,
      }));
    if (items.length > 0) {
      const { formatValue, unit } = getBarFormatting(domain, sectionId);
      return <HorizontalBarChart items={items} isVisible={true} formatValue={formatValue} unit={unit} />;
    }
  }
  return <div style={{ color: 'var(--text-muted)', padding: 20 }}>No data available</div>;
}

/** Map domain/sectionId to the correct array name, value field, and label field */
function getBarFieldMapping(domain: string, sectionId: string): { arrayKey: string; valueKey: string; labelKey: string } {
  const defaults = { labelKey: 'name' };
  switch (domain) {
    case 'states':
      switch (sectionId) {
        case 'gsdp': return { arrayKey: 'states', valueKey: 'gsdp', ...defaults };
        case 'growth': return { arrayKey: 'states', valueKey: 'growthRate', ...defaults };
        case 'percapita': return { arrayKey: 'states', valueKey: 'perCapitaGsdp', ...defaults };
        case 'revenue': return { arrayKey: 'states', valueKey: 'selfSufficiencyRatio', ...defaults };
        case 'fiscal-health': return { arrayKey: 'states', valueKey: 'fiscalDeficitPctGsdp', ...defaults };
      }
      break;
    case 'crime':
      switch (sectionId) {
        case 'overview': return { arrayKey: 'stateRates', valueKey: 'rate', ...defaults };
        case 'crimes-against-women': return { arrayKey: 'stateRates', valueKey: 'rate', ...defaults };
        case 'police': return { arrayKey: 'stateRatios', valueKey: 'actual', ...defaults };
      }
      break;
    case 'healthcare':
      if (sectionId === 'infrastructure') return { arrayKey: 'stateInfrastructure', valueKey: 'doctorsPer10K', ...defaults };
      break;
    case 'environment':
      if (sectionId === 'water') return { arrayKey: 'groundwaterStage', valueKey: 'stagePct', ...defaults };
      break;
    case 'education':
      if (sectionId === 'quality') return { arrayKey: 'stateInfrastructure', valueKey: 'ptr', ...defaults };
      break;
    case 'census':
      if (sectionId === 'literacy') return { arrayKey: 'states', valueKey: 'overallRate', ...defaults };
      break;
    case 'elections':
      if (sectionId === 'money-muscle') return { arrayKey: 'topWealthiest', valueKey: 'assetsCrore', ...defaults };
      break;
  }
  return { arrayKey: 'states', valueKey: 'value', ...defaults };
}

/** Format values and unit labels for bar chart embeds */
function getBarFormatting(domain: string, sectionId: string): { formatValue: (v: number) => string; unit: string } {
  // Rs Crore values
  if (domain === 'states' && (sectionId === 'gsdp' || sectionId === 'percapita')) {
    return { formatValue: (v) => `₹${(v / 100000).toFixed(1)}L Cr`, unit: '' };
  }
  if (domain === 'elections' && sectionId === 'money-muscle') {
    return { formatValue: (v) => `₹${v.toFixed(0)} Cr`, unit: '' };
  }
  // Percentages
  if (domain === 'states' && (sectionId === 'growth' || sectionId === 'revenue' || sectionId === 'fiscal-health')) {
    return { formatValue: (v) => formatPercent(v), unit: '' };
  }
  if (domain === 'crime' || domain === 'census') {
    return { formatValue: (v) => v >= 100 ? formatIndianNumber(v) : v.toFixed(1), unit: '' };
  }
  if (domain === 'environment' && sectionId === 'water') {
    return { formatValue: (v) => formatPercent(v), unit: '' };
  }
  if (domain === 'healthcare') {
    return { formatValue: (v) => v.toFixed(1), unit: '' };
  }
  if (domain === 'education') {
    return { formatValue: (v) => v >= 10 ? Math.round(v).toString() : v.toFixed(1), unit: '' };
  }
  // Default: no unit suffix, plain number
  return { formatValue: (v) => v >= 1000 ? formatIndianNumber(v) : v.toFixed(1), unit: '' };
}

// ─── Series builders ──────────────────────────────────────────────────

interface TimePoint {
  year: string;
  value: number;
}

interface SeriesShape {
  id: string;
  name: string;
  color: string;
  data: TimePoint[];
  dashed?: boolean;
}

function buildLineSeries(data: Record<string, unknown>, domain: string, sectionId: string): SeriesShape[] {
  const colors = ['var(--cyan)', 'var(--saffron)', 'var(--gold)', '#a78bfa', 'var(--emerald)'];
  const series: SeriesShape[] = [];

  // Known data shapes by domain/section
  if (domain === 'crime' && sectionId === 'overview') {
    const d = data as { nationalTrend: { year: string; ipc: number; sll: number }[] };
    if (d.nationalTrend?.length >= 3) {
      series.push({ id: 'ipc', name: 'IPC Crimes', color: '#DC2626', data: d.nationalTrend.map((t) => ({ year: t.year, value: t.ipc })) });
      series.push({ id: 'sll', name: 'SLL Crimes', color: '#EF4444', data: d.nationalTrend.map((t) => ({ year: t.year, value: t.sll })) });
    }
  } else if (domain === 'crime' && sectionId === 'cybercrime') {
    const d = data as { ncrbTrend: { year: string; cases: number }[] };
    if (d.ncrbTrend?.length >= 3) {
      series.push({ id: 'firs', name: 'Cybercrime FIRs', color: '#DC2626', data: d.ncrbTrend.map((t) => ({ year: t.year, value: t.cases })) });
    }
  } else if (domain === 'economy' && sectionId === 'growth') {
    const d = data as { series: TimePoint[] };
    if (d.series?.length) {
      series.push({ id: 'gdp', name: 'Real GDP Growth', color: colors[0], data: d.series });
    }
  } else if (domain === 'economy' && sectionId === 'inflation') {
    const d = data as { series: { period: string; cpiHeadline: number }[] };
    if (d.series?.length) {
      series.push({
        id: 'cpi',
        name: 'CPI Headline',
        color: colors[1],
        data: d.series.map((p) => ({ year: p.period, value: p.cpiHeadline })),
      });
    }
  } else {
    // Generic: look for time series fields
    for (const [key, val] of Object.entries(data)) {
      if (key.endsWith('TimeSeries') && Array.isArray(val) && val.length >= 3) {
        const name = key.replace('TimeSeries', '').replace(/([A-Z])/g, ' $1').trim();
        series.push({
          id: key,
          name,
          color: colors[series.length % colors.length],
          data: val as TimePoint[],
        });
      }
    }
    // Also check nested 'series' field
    if ('series' in data && Array.isArray(data.series) && data.series.length > 0) {
      const pts = data.series as TimePoint[];
      if (pts[0]?.year && pts[0]?.value !== undefined) {
        series.push({ id: 'primary', name: 'Value', color: colors[0], data: pts });
      }
    }
  }

  return series;
}

function buildAreaSeries(data: Record<string, unknown>, domain: string, sectionId: string): SeriesShape[] {
  const colors = ['var(--cyan)', 'var(--saffron)', 'var(--gold)'];
  const series: SeriesShape[] = [];

  if (domain === 'crime' && sectionId === 'road-accidents') {
    const d = data as { nationalTrend: { year: string; killed: number; injured: number }[] };
    if (d.nationalTrend?.length >= 3) {
      series.push({ id: 'killed', name: 'Killed', color: '#DC2626', data: d.nationalTrend.map((t) => ({ year: t.year, value: t.killed })) });
      series.push({ id: 'injured', name: 'Injured', color: '#EF4444', data: d.nationalTrend.map((t) => ({ year: t.year, value: t.injured })) });
    }
  } else if (domain === 'economy' && sectionId === 'sectors') {
    const d = data as { sectors: { id: string; name: string; currentGrowth: number; gvaShare: number }[] };
    // Sectors data isn't time-series based for area chart in embed; fall back to line-style
    if (d.sectors?.length) {
      return [];
    }
  }

  // Generic: look for time series fields
  for (const [key, val] of Object.entries(data)) {
    if (key.endsWith('TimeSeries') && Array.isArray(val) && val.length >= 3) {
      const name = key.replace('TimeSeries', '').replace(/([A-Z])/g, ' $1').trim();
      series.push({
        id: key,
        name,
        color: colors[series.length % colors.length],
        data: val as TimePoint[],
      });
    }
  }

  return series;
}
