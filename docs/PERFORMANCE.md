# Performance budget & monitoring

This site has a numeric performance budget enforced in two places that share the
same thresholds:

| Metric | Budget (good) | Where |
|---|---|---|
| Largest Contentful Paint (LCP) | ≤ 2500 ms | field + lab |
| Interaction to Next Paint (INP) | ≤ 200 ms | field (lab proxy: TBT ≤ 200 ms) |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | field + lab |
| First Contentful Paint (FCP) | ≤ 1800 ms | field + lab |
| Time to First Byte (TTFB) | ≤ 800 ms | field |
| Time to Interactive (lab) | ≤ 3800 ms | lab |

These are the official Core Web Vitals "good" boundaries. The single source of
truth is [`src/lib/perf/budget.ts`](../src/lib/perf/budget.ts); the Lighthouse
budget ([`lighthouse-budget.json`](../lighthouse-budget.json)) mirrors them.

## Field measurement (real users) — privacy-preserving

`src/lib/perf/webVitals.ts` measures Core Web Vitals in the browser via the
[`web-vitals`](https://github.com/GoogleChrome/web-vitals) library. It is
**measure-only and sends nothing to any third party**:

- In dev it logs a rated summary to the console (`[web-vitals] ✓ LCP = 1820ms (good)`).
- In any environment it buffers the latest reading per metric on
  `window.__WEB_VITALS__` so it can be inspected from the console or by an
  end-to-end check.
- There is no analytics endpoint and no external beacon.

To start collecting field data later, pass a first-party reporter — it is opt-in
and off by default:

```ts
initWebVitals((reading) => {
  navigator.sendBeacon('/your-own-endpoint', JSON.stringify(reading)); // first-party only
});
```

## Lab measurement (CI / local) — Lighthouse

`lighthouserc.json` runs Lighthouse against the prerendered `dist/` output for a
representative set of pages (home, a domain landing, an explore page, a topic
page) and asserts against the budget. Assertions are **`warn` level** so the
budget surfaces regressions without hard-failing a build until the team chooses
to tighten any to `error`.

```bash
npm run perf:lighthouse   # builds, then runs Lighthouse CI against dist/
```

(Lighthouse CI is invoked via `npx @lhci/cli` — no committed dependency. The
`.lighthouseci/` output directory is gitignored.)
