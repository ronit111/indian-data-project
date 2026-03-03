# Indian Data Project — Claude Instructions

## Project Overview
Open data platform for Indian citizens. V1 of the broader **India Truth Engine** vision — a platform that cross-references Indian government data against primary sources (RBI, World Bank, IMF, NSO, budget documents) and presents evidence in clear, shareable formats. Budget is the starting dataset, not the whole product.

**Stack**: React 19 + TypeScript + Vite 7 + Tailwind v4. Zustand (state), Framer Motion (animation), D3 (visualizations: treemap, sankey, waffle), Canvas API (share cards + SVG→PNG chart export). Deployed on Vercel via GitHub push to `main`.

## Site Architecture — Hub + Data Domains
- **`/` (Hub)**: Visual portal showcasing all data domains. Not a dashboard — a curated data story showcase.
- **`/budget` (Budget Domain)**: Union Budget 2025-26 scrollytelling. Sub-routes: `/budget/explore`, `/budget/calculator`, `/budget/methodology`, `/budget/glossary`.
- **`/economy` (Economy Domain)**: Economic Survey 2025-26 scrollytelling. Sub-routes: `/economy/explore`, `/economy/calculator`, `/economy/methodology`, `/economy/glossary`.
- **`/rbi` (RBI Domain)**: RBI monetary policy and financial data. Sub-routes: `/rbi/explore`, `/rbi/calculator`, `/rbi/methodology`, `/rbi/glossary`.
- **`/states` (State Finances Domain)**: State-level GSDP, revenue, fiscal health. Sub-routes: `/states/explore`, `/states/your-state`, `/states/methodology`, `/states/glossary`.
- **`/census` (Census & Demographics Domain)**: Population, literacy, health, age structure, urbanization. Sub-routes: `/census/explore`, `/census/methodology`, `/census/glossary`.
- **`/education` (Education Domain)**: Enrollment, quality, dropout, learning outcomes, spending. Sub-routes: `/education/explore`, `/education/methodology`, `/education/glossary`.
- **`/employment` (Employment Domain)**: LFPR, unemployment, sectoral shifts, informality. Sub-routes: `/employment/explore`, `/employment/methodology`, `/employment/glossary`.
- **`/healthcare` (Healthcare Domain)**: Infrastructure, spending, immunization, disease burden. Sub-routes: `/healthcare/explore`, `/healthcare/methodology`, `/healthcare/glossary`.
- **`/environment` (Environment Domain)**: Air quality, forest cover, energy transition, carbon footprint, water stress. Sub-routes: `/environment/explore`, `/environment/methodology`, `/environment/glossary`.
- **`/elections` (Elections Domain)**: Lok Sabha elections 1962-2024 — turnout, party landscape, candidates, representation. Sub-routes: `/elections/explore`, `/elections/methodology`, `/elections/glossary`.
- **`/crime` (Crime & Safety Domain)**: NCRB crime data — IPC crimes, crimes against women, road accidents, cybercrime, police infrastructure, conviction rates. Sub-routes: `/crime/explore`, `/crime/methodology`, `/crime/glossary`. Source: NCRB "Crime in India" 2022 + MoRTH + BPRD + World Bank. Accent: Crimson (#DC2626).
- **`/topics` (Cross-Domain Topics)**: 12 curated topics composing data across multiple domains. Sub-route: `/topics/:topicId`. Config-driven via `TopicDef` with `extractData` functions.
- **`/open-data` (Open Data API)**: Documentation for all 80 JSON endpoints. Code examples (curl/Python/JS), filterable data browser, "Try it" live preview.
- **`/for-journalists` (Journalist Toolkit)**: Landing + sub-routes: `/for-journalists/gallery` (92-chart filterable gallery), `/for-journalists/story-kits` (6 curated kits), `/for-journalists/embed-builder` (interactive iframe customizer). Header shows 4 sub-tabs.
- **`/for-teachers` (Teacher Toolkit)**: Landing + sub-route: `/for-teachers/lesson-plans` (7 NCERT-mapped plans, Class 10-12). Classroom mode toggle (larger fonts via `.classroom-mode` CSS class + `?classroom=true` URL param). Header shows 2 sub-tabs.
- **`/contribute` (Contributor Guide)**: Static page with data usage, issue reporting, code contribution, dataset contribution guidelines.
- **`/embed/{domain}/{section}` (Embed Routes)**: Standalone responsive chart pages for iframe embedding. Renders outside PageShell (no header/footer/nav). ~92 sections available across all 10 domains + topics. Lazy-loaded chart components via `ChartRenderer`.
- **Future domains** each get their own top-level route with self-contained sub-pages.
- Header is **context-aware**: hub title + search on `/`, domain title + sub-nav tabs inside a domain, section titles + sub-tabs for multiplier pages (journalists, teachers).
- **Back links** (header chevron + footer link) point to `/#stories`. New domains should follow this convention.
- Old routes (`/explore`, `/calculator`, `/methodology`) redirect to `/budget/*` equivalents.

## Chart Sharing Infrastructure (Phase 7)
- **Central Chart Registry** (`src/lib/chartRegistry.ts`): Map keyed by `"{domain}/{sectionId}"`. Each entry has title, source, accent color, data files, chartType, `toTabular()` for CSV, `heroStat()` for WhatsApp cards. Registry files in `src/lib/registry/{domain}.ts`.
- **ChartActionsWrapper** (`src/components/share/ChartActionsWrapper.tsx`): Wraps every chart across all 10 domains. Desktop: hover overlay with 4 action buttons. Mobile: persistent share button → `ShareBottomSheet`. Uses `pointer-events: none` on overlay to preserve chart tooltips/drill-down.
- **SVG→PNG capture** (`src/lib/svgCapture.ts`): Clones SVG, resolves CSS custom properties, forces opacity:1, serializes to Canvas, composites dark background + accent bar + title + chart + source watermark. No external dependencies.
- **WhatsApp share cards** (`src/lib/shareCard.ts`): 1200×630 Canvas with hero stat, domain accent, deep link URL. Tries Web Share API, falls back to download.
- **URL state** (`src/hooks/useUrlState.ts`): Bidirectional Zustand↔URLSearchParams sync. URL wins on mount (deep linking), store wins after. All 10 explorer pages wired. All scrollytelling sections have `id` attributes for `#hash` anchors.

## Personalization Engine (Phase 8)
- **Personalization store** (`src/store/personalizationStore.ts`): Global Zustand store with `persist` middleware (localStorage). Holds `selectedStateId` (uppercase vehicle code), `selectedStateName`, `householdSize`. All calculators and the banner read from this store.
- **State ID standard**: All pipelines use uppercase vehicle registration (RTO) codes (MH, UP, KA). Three differ from ISO 3166-2: Odisha=OD, Chhattisgarh=CG, Telangana=TS. Mapping in `src/lib/stateMapping.ts`.
- **EMI engine** (`src/lib/emiEngine.ts`): Pure functions — `calculateEMI()`, `calculateRateImpact()`, `getEffectiveRate()`. Standard formula with edge cases (zero principal, zero rate). Rate impact generates 5 scenarios at ±50/25/0 bps.
- **Cost-of-living engine** (`src/lib/costOfLivingEngine.ts`): CPI-based deflation using cumulative multiplier. Category-specific COICOP CPI where available (Food 01, Housing 04, Health 06, Transport 07, Education 10), headline CPI fallback. Gap detection in `cumulativeMultiplier` prevents incorrect computation for non-consecutive years.
- **State report engine** (`src/lib/stateReportEngine.ts`): Cross-domain aggregation from 17 JSON files. `buildReportCard()` returns 12 domain panels with ~28 metrics, ranks, quartiles. `Promise.allSettled` for partial data loading.
- **CPI by category**: `inflation.json` includes `cpiByCategory` array with 5 COICOP divisions. Three-tier sourcing: IMF/DBnomics baseline (2014-19), MOSPI eSankhyiki API live data (2019+, `api.mospi.gov.in/api/cpi/getCPIIndex`, no auth), curated fallback if API unreachable.
- **Personalization banner** (`src/components/personalization/PersonalizationBanner.tsx`): 40px bar below header on scrollytelling pages. Shows state + domain-specific stat. Dismissable via localStorage.

## Deliberate Decisions
- **i18n removed**: Infrastructure exists (i18n.ts, LanguageSwitcher, LanguageProvider, Hindi locale files) but is not wired. Browser auto-translate preferred over dev overhead. Don't re-wire without explicit ask.
- **No decorative chrome**: Data IS the design. No card wrappers around visualizations, no unnecessary UI furniture.
- **Hub loads only `summary.json`**. Do NOT use `useBudgetData` (loads 7 files) on the hub page.
- **All derived values computed at runtime** from source data, never hardcoded (e.g., "31 paise borrowed per rupee").

## Data Integrity — Non-Negotiable
- **NEVER create mock, fake, placeholder, or hardcoded data.** Every number must trace to an authoritative source (indiabudget.gov.in, Open Budgets India, RBI, World Bank, etc.).
- If data doesn't exist for a planned feature, the feature waits. No exceptions.

## Automated Data Pipelines
Twelve GitHub Actions workflows keep data fresh without manual intervention:
- **Budget** (`data-pipeline.yml`): Daily cron + Budget Day polling (Feb 1). Source: CKAN API.
- **Economy** (`economy-pipeline.yml`): Quarterly (Feb, Mar, Jun, Dec) aligned to NSO/Survey/WB release cycles. Source: MOSPI eSankhyiki NAS/WPI APIs (primary) + World Bank API (fallback) + MOSPI CPI API + curated Economic Survey figures.
- **RBI** (`rbi-pipeline.yml`): Bi-monthly (10th of Feb/Apr/Jun/Aug/Oct/Dec) aligned to MPC meeting schedule. Source: RBI Handbook XLSX Tables 43/62/147 (primary) + World Bank API (fallback) + curated MPC decisions.
- **States** (`states-pipeline.yml`): Semi-annual (Jan 15, Jul 15) aligned to RBI Handbook publication (~Aug-Sep). Source: RBI Handbook on Indian States XLSX Tables 19/21/22/164 (primary) + curated data (fallback). Creates GitHub reminder issues in July for upcoming Handbook releases.
- **Census** (`census-pipeline.yml`): Quarterly (15th of Jan/Apr/Jul/Oct). Source: World Bank API + curated Census 2011/NPC 2026/NFHS-5/SRS 2022. Curated data (NFHS-5, SRS, Census 2011) is static until new surveys publish.
- **Education** (`education-pipeline.yml`): Quarterly (15th of Jan/Apr/Jul/Oct). Source: World Bank API + curated UDISE+ 2023-24 + ASER 2024.
- **Employment** (`employment-pipeline.yml`): Quarterly (1st of Mar/Jun/Sep/Dec) aligned to PLFS release schedule. Source: MOSPI eSankhyiki PLFS API (primary) + World Bank API (fallback) + curated PLFS state data + RBI KLEMS.
- **Healthcare** (`healthcare-pipeline.yml`): Quarterly (15th of Feb/May/Aug/Nov). Source: World Bank API + curated NHP 2022 + NFHS-5 immunization.
- **Environment** (`environment-pipeline.yml`): Quarterly (15th of Jan/Apr/Jul/Oct). Source: World Bank API + MOSPI Energy API + curated CPCB AQI + ISFR 2023 + CEA capacity + CWC/CGWB water.
- **Elections** (`elections-pipeline.yml`): Semi-annual (Jan 15, Jul 15). Source: purely curated data from ECI, TCPD, ADR, Lok Sabha Secretariat. No API calls — election data is event-driven.
- **Crime** (`crime-pipeline.yml`): Semi-annual (Jan 15, Jul 15). Source: purely curated NCRB "Crime in India" 2022 + MoRTH + BPRD + World Bank. No API calls.
- **Freshness Monitor** (`data-freshness-monitor.yml`): Monthly check. Auto-creates GitHub issues for stale data, MPC decision reminders, Survey/Budget prep reminders. Covers all 11 domains.

**Shared pipeline infrastructure**:
- **World Bank client** (`pipeline/src/common/world_bank.py`): Shared by 7 pipelines. Retry with exponential backoff, HTTPError handling, configurable precision. Domain-specific files in `pipeline/src/{domain}/sources/world_bank.py` are thin wrappers.
- **MOSPI eSankhyiki client** (`pipeline/src/common/mospi_client.py`): Shared paginated fetcher with retry logic for all 7 MOSPI endpoints (CPI, NAS GDP/GVA, PLFS, WPI, IIP, Energy, ASI). No authentication required.
- **RBI Handbook scraper** (`pipeline/src/common/rbi_handbook.py`): Session-based XLSX downloader for both RBI Handbooks (Indian Economy + Indian States). Scrapes publication pages for current download URLs (contain unpredictable hashes), downloads specific table XLSX files, parses with `openpyxl`. Anti-bot bypass via browser-like headers + session cookies.
- See `pipeline/PIPELINE_DATA_SOURCES.md` for the full catalog of 30+ curated data constants.

**Curated data** (MPC decisions in `monetary_policy.py`, fiscal deficit series in `fiscal.py`, Economic Survey headline numbers in `main.py`, NFHS-5/SRS health data in `curated.py`) requires human updates when government publications drop. Most curated data now serves as **fallback** — automated sources (MOSPI APIs, RBI Handbook XLSX) are tried first. The freshness monitor creates reminder issues for manual updates.

## Design Identity
- Dark theme: void (#06080f) / raised (#0e1420) / surface (#131b27)
- Accents: saffron (#FF6B35), cyan (#4AEADC), gold (#FFC857), teal (#14B8A6), indigo (#6366F1)
- Typography: Inter (body), JetBrains Mono (data)
- IIB-inspired minimal, data-forward. Creative latitude encouraged — see BRAND.md.

## QA Protocol — MANDATORY after UI Changes

**"Build passing" is NOT a product check.** After any visual/interaction change:

1. **Browser verify** (use `mcp__claude-in-chrome__*`): open page, navigate to changed section, interact, screenshot
2. **Viz checklist**: Treemap drill-down + breadcrumb, Sankey label overlap, Waffle grouping, Calculator regime toggle + share card
3. **Full sanity** = build passes + grep for stale imports + browser inspection + interaction test + screenshot evidence

Never report a fix as complete based only on build + grep.

## Pre-Final: Code-Level QA Audit (Codex)
Before the citizen-perspective review, run a comprehensive automated code audit using Codex CLI (`codex exec --full-auto`). This catches structural issues that are invisible during browser QA:
1. **Schema alignment**: Verify every Pydantic validation schema in `pipeline/src/*/validate/schemas.py` matches its TypeScript counterpart in `src/lib/data/schema.ts`. Mismatches cause silent data loss.
2. **State ID consistency**: All state IDs across all 14 JSON files must use uppercase vehicle registration (RTO) codes. Grep for lowercase IDs or ISO codes (`or`, `ct`, `tg`).
3. **Route registration**: Cross-check `App.tsx` routes, `prerender.mjs` ROUTES, `sitemap.xml` URLs, `Header.tsx` tabs, and `MobileNav.tsx` tabs are all in sync.
4. **Import integrity**: Check for broken imports, circular dependencies, and stale references (components that reference deleted files or renamed exports).
5. **Calculation engine correctness**: Audit `emiEngine.ts`, `costOfLivingEngine.ts`, `stateReportEngine.ts` for edge cases (zero values, missing data, division by zero).
6. **Pipeline validation**: Run all 9 pipelines locally and verify JSON output passes Pydantic validation. Cross-check 3-5 key figures per domain against authoritative sources.
7. **Security**: Check user-facing inputs (sliders, selects, text fields) for XSS, injection, or OWASP top 10 vulnerabilities.

This is a one-time audit run by Codex, not a per-change check. It sits between feature completion and the citizen-perspective review.

## Final QA — Citizen Perspective (when project scope is complete)
When all planned data domains are built and the project is considered "done," run a comprehensive QA pass from the perspective of an average Indian citizen visiting the portal for the first time. Evaluate:
1. **Clarity**: Is every section, label, and number understandable without domain expertise? Would a non-economist understand what "fiscal deficit" or "repo rate" means in context?
2. **Narrative flow**: Does each data story flow smoothly from section to section? Are there gaps where the reader might lose the thread or wonder "so what?"
3. **Data accuracy**: Spot-check key numbers against current authoritative sources. Flag anything that looks stale or inconsistent across domains.
4. **Analogies and comparisons**: Are the analogies practical and relatable? Do comparisons (e.g., per-capita breakdowns, paise-per-rupee) help understanding without creating confusion or prompting more questions?
5. **Completeness**: Are there obvious questions a citizen would have that the portal doesn't answer? Identify gaps worth filling.

This is not a per-change QA. It is a holistic product review to be run once, after all domains are live.

## New Domain Checklist

Every new data domain (State Finances, Census, etc.) must follow this end-to-end checklist. This was learned the hard way during Budget, Economy, and RBI buildout.

### 1. Pipeline & Data
- [ ] Pipeline fetches from authoritative source (government API, World Bank, etc.)
- [ ] Pydantic validation schemas match TypeScript interfaces exactly
- [ ] All JSON files pass validation — run pipeline and verify output
- [ ] Cross-check every key figure against primary source documents (not just API output)
- [ ] World Bank data has ~1 year lag — supplement with curated government source data for the latest year
- [ ] If a series returns empty from the API, mark the field as `Optional` in schema and handle gracefully in UI (filter out empty series, don't show phantom legend entries)
- [ ] GitHub Actions workflow added with cron schedule aligned to data release cadence

### 2. TypeScript Scaffolding
- [ ] Interfaces in `src/lib/data/schema.ts`
- [ ] Loader functions in `src/lib/dataLoader.ts`
- [ ] Zustand store in `src/store/`
- [ ] Data hook in `src/hooks/`

### 3. Routing & Navigation
- [ ] Routes in `App.tsx` (story, explore, methodology)
- [ ] Header: `isDomainSection` detection, title, tabs
- [ ] MobileNav: domain tabs array + icon
- [ ] Footer: domain-specific attribution with source links
- [ ] Back chevron → `/#stories`, footer back link → `/#stories`

### 4. Hub Integration
- [ ] Domain card in `HubPage.tsx` with mini-visualization and stat pills
- [ ] Hub loads only `summary.json` for the domain — never the full dataset
- [ ] Remove domain from "Coming Soon" list
- [ ] Mini-viz must be browser-verified (hub card rendering bugs are invisible to TypeScript)

### 5. Scrollytelling Page
- [ ] Each section: `useScrollTrigger` → `SectionNumber` → title/annotation → viz → source attribution
- [ ] Narrative bridges between sections with storytelling connectors
- [ ] CTA section at bottom with Explore + Methodology glow cards

### 6. Chart Quality (the things that bite you)
- [ ] **X-axis consistency**: When overlaying multiple series, ALL must use the same label format (e.g., all fiscal years "2014-15", never mix calendar years with fiscal years)
- [ ] **Dual-scale avoidance**: Never put metrics of vastly different scales on the same y-axis (e.g., 10% growth + 80% GDP share). Split into separate charts with labeled sub-headings.
- [ ] **Empty series**: Filter with `.filter(s => s.data.length > 0)` before passing to chart components. Otherwise phantom entries appear in legends.
- [ ] **Sparse data**: If a series has < 3 data points, it renders as a disconnected segment. Either hide it or source more data.
- [ ] **Tick density**: LineChart caps at ~8 x-axis labels. For datasets with 30+ points, the thinning is automatic, but verify the selected labels tell a coherent story.
- [ ] **Framer Motion**: Never set animated properties in both `style` and `initial`/`animate`. Use only `initial`/`animate` for animated values.
- [ ] **Flexbox + absolute children**: `items-end` with absolutely-positioned children = 0 content height. Use `h-full` on flex items.

### 7. Sub-Pages
- [ ] Explorer page: category filters, indicator list, interactive chart, data loads correctly
- [ ] Methodology page: data sources, indicator definitions, limitations, source links work
- [ ] Glossary page: create `public/data/{domain}/{year}/glossary.json` with ~12-15 curated terms (follow existing schema: `id`, `term`, `simple`, `detail`, `inContext`, `relatedTerms`)
- [ ] Glossary wrapper page: `src/pages/{Domain}GlossaryPage.tsx` → `<GlossaryPage domain="{domain}" />`
- [ ] Add domain config to `DOMAIN_CONFIG` in `GlossaryPage.tsx` (accent color, title, description, SEO)
- [ ] Route added to `App.tsx`, header tabs, and mobile nav
- [ ] Glossary terms added to `SearchOverlay.tsx` search index (loads via `loadGlossary`)

### 8. SEO
- [ ] Routes added to `scripts/prerender.mjs` (including glossary route)
- [ ] Sitemap updated (`public/sitemap.xml`) with story + explore + methodology + glossary routes + data file URLs
- [ ] `public/llms.txt` expanded with domain description and key data points
- [ ] `index.html` noscript fallback updated with domain content
- [ ] JSON-LD Dataset schema added in SEOHead component
- [ ] Favicon and logo assets present in `public/` (not just local — must be committed to git)

### 9. Browser QA (MANDATORY)
- [ ] Hub: domain card renders with stats and mini-viz (scroll to it, screenshot)
- [ ] Story: scroll through ALL sections — every chart renders, axes are readable, legends are accurate
- [ ] Explorer: filter categories, select indicators, chart renders with correct data
- [ ] Methodology: all sections readable, source links present
- [ ] Glossary: terms render, filter works, related term pills scroll to target, accent colors match domain
- [ ] Navigation: header tabs work (including Glossary tab), back chevron → `/#stories`
- [ ] Mobile: bottom nav tabs visible (including Glossary), charts responsive, no horizontal overflow
- [ ] Search: Cmd+K → type a domain term → glossary result appears with purple TERM badge
- [ ] Build: `npm run build` passes with zero errors

### 10. Documentation
- [ ] CHANGELOG.md entry
- [ ] README.md: pages table, data section, project structure, roadmap updated
- [ ] CLAUDE.md: site architecture section updated with new domain

## Polish Hygiene — Patterns for Every Domain

These are recurring polish tasks that should be checked after every domain buildout. Learned during Phase 3 polish of Budget, Economy, and RBI.

### Narrative ↔ Data Alignment
- **If a series is empty or sparse, update the narrative text** to match what's actually visible. Don't describe data the user can't see. (Example: CreditSection mentioned "domestic credit" but only private sector credit was rendered.)
- **Range vs single value**: When a schema provides `low`/`high` fields but data is a single point estimate (e.g., GDP projection), display conditionally: `low === high ? single : range`. Don't show "7.4–7.4%".

### Sparse & Empty Series
- **MIN_POINTS threshold**: Filter out series with < 3 data points before passing to chart components. Define `const MIN_POINTS = 3` at the component level. This prevents disconnected 1-2 point segments.
- **Conditional annotations**: When sparse series are hidden, switch the annotation text to describe only what's shown. Use a `hasBreakdown` flag derived from the filtered series count.
- **Dead code removal**: If a World Bank indicator consistently returns empty for India (e.g., `FS.AST.DOMS.GD.ZS`, `FR.INR.DPST`), remove it from the chart definition rather than relying solely on runtime filtering. Keep the pipeline fetch for future use, but don't render phantom entries.

### OG Images
- **Per-domain OG images**: Every domain gets its own `og-{domain}.png` (1200×630) generated by `scripts/generate-og.mjs`.
- **SEOHead image prop**: Pass `image="/og-{domain}.png"` to `<SEOHead>` on all pages within a domain (story, explore, methodology). Hub uses default `/og-logo.png`.
- **OG generation script**: Parametric — add new variants to the `VARIANTS` array in `generate-og.mjs` with domain title, tagline, and accent colors. Run `node scripts/generate-og.mjs` to regenerate all.
- **Don't embed data values** in OG images (they go stale). Use domain titles and thematic taglines instead.

### World Bank Data Gaps
- World Bank doesn't provide every indicator for India. When an indicator returns empty, the pipeline handles it gracefully (empty arrays pass validation), but the UI must adapt: hide the series, update narrative text, and note the limitation in the methodology page.
- Track empty indicators in the README roadmap so they're visible for future sourcing (e.g., DBIE integration).

## Common Pitfalls
- **Treemap**: Never use `hierarchy.leaves()`. Show one level at a time via `hierarchy.children`.
- **Sankey**: `nodePadding` below 20 causes label overlap with 12+ nodes. Hide value text for nodes < 20px.
- **AnimatePresence + keyed SVGs**: `mode="wait"` causes double-render. Avoid for chart containers.
- **Sticky headers**: `overflow-x-auto` breaks `position: sticky`. Use `overflow-x: clip`.
- **Mobile nav**: Fixed bottom h-14. Content needs `pb-16 md:pb-0`.
- **HorizontalBarChart formatting**: `formatValue` and `unit` are concatenated in bar labels. If `formatValue` returns a complete string (e.g., `₹35.28L Cr`), set `unit=""` to avoid double-display. Tooltip also uses `unit`, so keep it meaningful or empty.

## Future Phases — Planned Audits

### Design & Visualization Overhaul (Phase 13)
**Full brief in `BRAND.md` → "Design & Visualization Audit Brief" section.** This is a full overhaul covering:
1. **Typography**: Replace Inter with a warm humanist sans-serif. Evaluate on actual portal sections, not abstract specimens. Direction: warm + accessible (Guardian data section vibe).
2. **Visualization density**: Audit every section across all 10 domains. Replace low-density charts (>8 items in bar charts creating endless scroll) with high-density alternatives — choropleths, dot strips, scatter plots, small multiples, treemaps. Principle: a viz should show a pattern in 2 seconds that takes 30 seconds to read from a list.
3. **Brand consistency**: Spacing tokens, card styles, hero patterns, accent harmony, source attributions — holistic audit across all domains.
4. **New components needed**: Choropleth, DotStrip, ScatterChart, BumpChart, SmallMultiples, BulletChart.

This happens after Phase 12 (Multiplier Infrastructure) and before the performance pass. Use design agents (`frontend-design` skill + agent-router for UI/UX specialists) for typography selection and visualization proposals.

### Performance & Low-Connectivity Optimization (Phase 14)
**Rationale**: A civic data platform for Indian citizens must work on 2G/3G connections, budget Android devices (1-2GB RAM), and intermittent connectivity. Fast broadband is the exception, not the norm.

Key areas:
1. **Bundle splitting**: Route-level lazy loading for all domain pages + multiplier pages. Separate D3, Framer Motion, Zustand into async chunks. Target: critical path JS under 200KB gzipped.
2. **Data loading**: Progressive JSON loading as user scrolls (not all domain data upfront). Stale-while-revalidate caching. Preload hints for critical files.
3. **Font optimization**: After Phase 13 font change — subset to Latin + Devanagari, `font-display: swap`, preload critical weights, self-host.
4. **Service Worker**: Workbox for app shell precaching + runtime cache for JSON data. Offline fallback page with cached data. Near-PWA for repeat visitors.
5. **SVG/D3 performance**: Profile heavy visualizations (hemicycle 543 nodes, treemap, sankey) on low-end devices. Canvas fallback for mobile if needed.
6. **Lighthouse targets**: 90+ across Performance/Accessibility/Best Practices/SEO. FCP < 2s, LCP < 3s, CLS < 0.1, TTI < 5s on simulated 3G.
7. **Accessibility**: Keyboard nav for all interactive elements, ARIA labels on SVG charts, screen reader testing, color contrast verification.

This happens after the Design Overhaul (Phase 13) because font/asset changes affect bundle size, and before the Codex QA audit so automated checks catch any issues introduced.

### Cross-Domain Linking Audit
Evaluate opportunities to weave connections between domains so users can naturally navigate related data. Examples:
- Budget state allocation → link to that state's GSDP in State Finances
- Economic Survey GDP figures → link to RBI monetary policy context
- State Finances revenue → link to Budget devolution/transfers
- Census state population → link to State Finances per capita

Implementation approaches to evaluate:
1. **Inline contextual links**: "Goa receives ₹X in budget allocation → [See Goa's fiscal health →](/states)"
2. **Related data cards**: At the bottom of each section, show 1-2 related data points from other domains
3. **Shared state selector**: If viewing Maharashtra data in one domain, offer quick navigation to Maharashtra in another domain
4. **Hub as the crossroads**: The hub page could surface cross-domain insights (e.g., "States that get the most budget allocation vs. their own revenue generation")

This is architecturally complex (requires cross-domain data awareness) and should be a separate phase. Use Codex to audit the codebase for natural connection points.

### Post-Launch: Marketing & Experience Documentation
**Runs after Citizen QA is complete.** This is the last phase — showcase the work for awareness and document the building experience.

**What to produce:**
1. **Launch posts** (LinkedIn long-form + Twitter thread): Stream-of-consciousness in Ronit's voice. Origin story, philosophy, what it actually does. Interview Ronit first — surface the real trigger, frustration, or moment that started this.
2. **Ongoing content series** (~1 post every 3-4 days): Each post spotlights one element — a design philosophy, a technical decision, a visualization choice, the pipeline architecture, the AI collaboration experience, or the civic purpose behind it all.
3. **Screenshots and recordings**: Key interactions (scrollytelling, calculator, hemicycle, share cards) as social proof.

**Topic backlog for the series:**
- "Data IS the design" philosophy — no card wrappers, no dashboard chrome
- 11 automated pipelines — zero-touch data freshness from World Bank, MOSPI, RBI, ECI
- Scrollytelling as civic communication — making ₹50L Cr budgets tangible
- Personalization engine — EMI calculator, cost-of-living deflator, state report cards
- Cross-domain topics — weaving 10 datasets into narratives (Women in India, Water Crisis)
- Custom D3 visualizations — hemicycle, waffle, choropleth, Sankey
- Question-first search — 115 citizen questions as entry points
- Pipeline architecture — World Bank API + MOSPI + curated sources
- Building with Claude Code — the AI collaboration experience (honest account)
- Open source as civic infrastructure — AGPL, open data, why this matters

**Process:**
- Load `worldbuilding-writing` skill for persuasive framing
- Use agent-router to find marketing/copy/social media agents
- Interview-first drafting — probing questions before any writing
- Voice reference: `writing-style.md` in the global memory project folder
- Ronit's voice: stream-of-consciousness, edgy-but-grounded, no marketing speak, anti-polish endings
