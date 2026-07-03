/**
 * Performance budget — the single numeric source of truth for this site's
 * Core Web Vitals targets and rating thresholds.
 *
 * Thresholds are the official web-vitals "good / needs-improvement / poor"
 * boundaries (https://web.dev/articles/vitals). `target` is the budget we
 * commit to (the upper bound of "good"); a metric over `target` is a
 * regression worth investigating. The Lighthouse assertions in
 * `lighthouse-budget.json` / `lighthouserc.json` mirror these numbers so the
 * lab (Lighthouse) and field (web-vitals) budgets stay in sync.
 */

export type MetricName = 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
export type Rating = 'good' | 'needs-improvement' | 'poor';

interface Threshold {
  /** Upper bound of "good" — this is the committed budget. */
  good: number;
  /** Above this is "poor"; between good and poor is "needs-improvement". */
  poor: number;
  /** Display unit. CLS is unitless; the rest are milliseconds. */
  unit: 'ms' | '';
  label: string;
}

export const PERF_BUDGET: Record<MetricName, Threshold> = {
  LCP: { good: 2500, poor: 4000, unit: 'ms', label: 'Largest Contentful Paint' },
  INP: { good: 200, poor: 500, unit: 'ms', label: 'Interaction to Next Paint' },
  CLS: { good: 0.1, poor: 0.25, unit: '', label: 'Cumulative Layout Shift' },
  FCP: { good: 1800, poor: 3000, unit: 'ms', label: 'First Contentful Paint' },
  TTFB: { good: 800, poor: 1800, unit: 'ms', label: 'Time to First Byte' },
};

/** Rate a metric value against the budget. */
export function rate(name: MetricName, value: number): Rating {
  const t = PERF_BUDGET[name];
  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs-improvement';
  return 'poor';
}

/** True if the metric is within (at or under) its committed budget. */
export function withinBudget(name: MetricName, value: number): boolean {
  return value <= PERF_BUDGET[name].good;
}
