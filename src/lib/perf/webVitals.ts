/**
 * Web Vitals instrumentation — privacy-preserving by default.
 *
 * Measures the Core Web Vitals (LCP, INP, CLS) plus FCP and TTFB in the field,
 * rates each against the committed budget (./budget), and:
 *   - logs a rated summary to the console in dev,
 *   - buffers the latest reading per metric on `window.__WEB_VITALS__` so it
 *     can be inspected in any environment (and by an e2e/perf check),
 *   - sends NOTHING to any third party. There is no analytics endpoint and no
 *     external beacon. To collect field data later, pass an `onReport` callback
 *     (e.g. a first-party `navigator.sendBeacon` to your own endpoint) — it is
 *     opt-in and off by default.
 *
 * web-vitals reports each metric possibly multiple times (e.g. CLS/INP update
 * as the session evolves); we keep the latest value per metric.
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { rate, type MetricName } from './budget';

export interface VitalReading {
  name: MetricName;
  value: number;
  rating: ReturnType<typeof rate>;
  /** web-vitals' own rating, for cross-checking. */
  navigatorRating: Metric['rating'];
  delta: number;
  id: string;
}

declare global {
  interface Window {
    __WEB_VITALS__?: Partial<Record<MetricName, VitalReading>>;
  }
}

const isDev = import.meta.env.DEV;

function makeHandler(onReport?: (r: VitalReading) => void) {
  return (metric: Metric) => {
    const name = metric.name as MetricName;
    const reading: VitalReading = {
      name,
      value: Math.round((name === 'CLS' ? metric.value * 1000 : metric.value)) / (name === 'CLS' ? 1000 : 1),
      rating: rate(name, metric.value),
      navigatorRating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    };

    if (typeof window !== 'undefined') {
      window.__WEB_VITALS__ = window.__WEB_VITALS__ ?? {};
      window.__WEB_VITALS__[name] = reading;
    }

    if (isDev) {
      const icon = reading.rating === 'good' ? '✓' : reading.rating === 'needs-improvement' ? '⚠' : '✗';
      // eslint-disable-next-line no-console
      console.debug(`[web-vitals] ${icon} ${name} = ${reading.value}${name === 'CLS' ? '' : 'ms'} (${reading.rating})`);
    }

    // Opt-in, first-party only. No-op by default.
    onReport?.(reading);
  };
}

let started = false;

/**
 * Start measuring Core Web Vitals. Idempotent (safe to call once at startup).
 * @param onReport optional first-party reporter; omitted = measure-only, no network.
 */
export function initWebVitals(onReport?: (r: VitalReading) => void): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  const handle = makeHandler(onReport);
  onLCP(handle);
  onINP(handle);
  onCLS(handle);
  onFCP(handle);
  onTTFB(handle);
}
