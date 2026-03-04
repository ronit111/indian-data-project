# Changelog

## [0.19.0] - 2026-03-04

### Phase 19: LLM & Search Metadata Overhaul

Rewrote all LLM-facing and search-engine-facing metadata to center the portal's core essence: dense PDFs, broken APIs, and buried spreadsheets turned into accessible visual stories for citizens.

**llms.txt** — Major rewrite of intro and structure
- New opening leads with the citizen problem (buried data) instead of a generic feature list
- Added "Why this exists", "What you can do here", "What makes this credible", "Who built this and why" sections
- Fixed stale counts (128 → 136 citizen questions, 8 → 11 domains)

**Meta descriptions** (index.html) — All 4 tags updated
- `<meta name="description">`, `og:description`, `twitter:description`, JSON-LD `description`
- Shifted from tax-money framing to data accessibility framing
- Noscript fallback rewritten with comprehensive citizen-facing paragraph

**Hub page** (HubPage.tsx, home.json, inject-og.mjs)
- SEOHead description aligned with new meta copy
- Hero subtitle updated in locale file
- OG injection script updated for hub path

**5 files changed**, 40 insertions, 16 deletions. Zero build errors, 81 prerendered routes.

## [0.18.0] - 2026-03-04

### Phase 18: Citizen QA — Holistic Product Review

Editorial pass lifting citizen-friendliness from ~7.2/10 to 8.5+ across all 11 domains. Every annotation rewritten from the perspective of a class 10-12 educated Indian citizen visiting the portal for the first time.

**Track 1: Jargon Translation (15 rewrites)**
- **RBI (5)**: Repo rate/CRR mechanism explained, M3/OMO in plain language, forex reserves as citizen-impact ("petrol, phones, imports"), credit-to-GDP demystified, MPC voting explained with 2-6% tolerance band
- **Healthcare (3)**: Out-of-pocket poverty impact + Ayushman Bharat context, "non-communicable diseases" → "lifestyle diseases", spending per-citizen with Sri Lanka/Thailand comparison
- **Economy (2)**: GDP growth one-liner definition, CAD/remittances with citizen-impact ("weakens rupee, makes imports expensive")
- **States (2)**: GSDP defined inline, FRBM Act explained + Punjab 47% debt-to-GSDP (verified from data)
- **Crime (1)**: IPC/SLL/cognizable explained in one paragraph
- **Employment (1)**: "Informal" defined as no contract, no PF, no ESI, no paid leave
- **Education (1)**: ASER source context added, evidence-first reorder

**Track 2: "So What?" Bridges (2 sections)**
- Justice pipeline: global conviction rate comparison + judges-per-million context (live data)
- Water stress: solutions frame — Rajasthan johads, Chennai rainwater harvesting, drip irrigation

**Track 3: Hub + Calculator + Report Card UX (3 fixes)**
- Hub: "Pick a story below, or press Cmd+K to ask a question" prompt for first-time visitors
- Calculator: inflation definition + action prompt replacing passive subtitle
- Report card: explanatory message for missing state data

**Track 4: Glossary + Citizen Questions**
- 2 new glossary terms: `underreporting` (crime), `installed-vs-generation` (environment)
- 8 new citizen questions (128 → 136 total): Ayushman Bharat, climate targets, crime rate variation, informal work, court duration, MPC, FRBM

**Analogy Quality Gate**: All comparisons verified against portal JSON data. Punjab debt (47% from fiscal-health.json), inflation (generic prompt, not hardcoded), healthcare spending (verified global average).

**23 files changed**, 121 insertions, 20 deletions. Zero build errors, 81 prerendered routes. All changes browser-verified via DOM text inspection across every modified page.

## [0.15.0] - 2026-03-02

### Phase 10B: Elections Domain

**New domain: Elections** — Indigo accent (#6366F1). India's electoral data story spanning 17 Lok Sabha elections from 1962 to 2024.

**Data Pipeline** (`pipeline/src/elections/`)
- Purely curated pipeline (no API calls) — all data from authoritative government sources
- 4 curated sources: ECI (turnout, state breakdown), TCPD Lok Dhaba (party-wise Lok Sabha results 1962-2024, 17 elections), ADR/MyNeta (543 MP criminal cases, assets, education for 2024), Lok Sabha Secretariat (women MPs trend)
- 7 JSON output files: summary, turnout, results, candidates, representation, indicators, glossary
- Pydantic validation schemas matching TypeScript interfaces
- GitHub Actions semi-annual cron (`elections-pipeline.yml`, Jan 15 + Jul 15)

**Scrollytelling** (5 sections + hero + CTA)
1. **The World's Largest Election** — Turnout trends 1962-2024 (annotated LineChart with election event markers) + state-wise turnout 2024 (HorizontalBarChart)
2. **Party Landscape** — Stacked AreaChart showing seat share evolution across 17 elections for major parties (BJP, INC, Left, Regional)
3. **Lok Sabha 2024** — Parliament hemicycle (543 dots in concentric semicircular arcs colored by party) + top parties by seats (HorizontalBarChart)
4. **Money & Muscle** — Top 20 wealthiest MPs (HorizontalBarChart) + top 20 by criminal cases + summary pills (criminal %, crorepati %, avg assets)
5. **The Gender Gap** — Women MPs % trend (LineChart) with 33% reservation target dashed reference line

**Sub-pages**
- Explorer: 3 categories (All, Turnout, Representation), state-level indicator comparison
- Methodology: 4-tier source documentation with links to ECI, TCPD, ADR, Lok Sabha Secretariat
- Glossary: 15 election terms (FPTP, EVM, NOTA, Lok Sabha, anti-defection, delimitation, etc.)

**Hub Integration**
- Elections domain card (#10) with parliament hemicycle mini-viz (543 dots) + 3 stat pills (Turnout %, Criminal MPs %, Women MPs %)

**Chart Infrastructure**
- 5 chart registry entries (turnout, party-landscape, lok-sabha-2024, money-muscle, gender-gap)
- ChartActionsWrapper on all section charts (PNG export, CSV, embed, permalink)
- 13 citizen questions added to search (115 total across 10 domains)
- Party colors section-scoped: BJP=#FF6B35, INC=#00BFFF, Left=#DC2626, BSP=#3B82F6, SP=#22C55E, TMC=#16A34A, Others=#9CA3AF

**State Report Card Extension**
- Environment panel (3 metrics: AQI Average, Forest Cover %, Groundwater Stage) added to `stateReportEngine.ts`
- Elections panel (1 metric: Voter Turnout 2024 %) added to `stateReportEngine.ts`
- State report card now loads 16 JSON files across 8 domains, 11 panels with ~25 metrics
- Source attribution updated on report card page

**SEO & Distribution**
- 55 prerendered routes (was 50), updated sitemap with 4 page routes + 7 data URLs + 1 embed URL
- Elections OG image (`og-elections.png`), JSON-LD Dataset entry, BreadcrumbList entries
- `llms.txt` updated: ten domains, elections section with page routes
- `index.html` noscript section with 4 stat bullets + 4 navigation links

---

## [0.14.0] - 2026-03-01

### Phase 10A: Environment Domain

**New domain: Environment** — Teal accent (#14B8A6). India's environmental data story across air, forests, energy, carbon, and water.

**Data Pipeline** (`pipeline/src/environment/`)
- 11 World Bank indicators (CO2/capita, PM2.5, forest %, renewables %, coal electricity, GHG, protected areas, energy use/capita, renewable electricity)
- 5 curated government sources: CPCB state/city AQI (30 states, 30 cities), ISFR 2023 forest cover (36 states/UTs with change data), CEA installed capacity mix (8 fuel types, 2015-2024), CWC reservoir storage (4 regions), CGWB groundwater assessment (30 states)
- 7 JSON output files: summary, air-quality, forest, energy, water, indicators, glossary
- Pydantic validation schemas matching TypeScript interfaces
- GitHub Actions quarterly cron (`environment-pipeline.yml`)

**Scrollytelling** (5 sections + hero + CTA)
1. **Air We Breathe** — PM2.5 trend (LineChart) + top 20 most polluted cities (HorizontalBarChart)
2. **Forest Cover** — Forest area % trend (LineChart) + diverging bar chart (gainers vs losers by state, ISFR 2021→2023)
3. **Energy Transition** — Stacked AreaChart showing installed capacity mix evolution (8 fuel types, 2015-2024)
4. **Carbon Footprint** — Coal electricity % trend + peer comparison pills (India 1.9t vs US 14t vs China 8t vs World 4.7t)
5. **Water Stress** — Groundwater exploitation by state (HorizontalBarChart) + reservoir storage by region + summary pills (Over-Exploited/Semi-Critical/Safe)

**Sub-pages**
- Explorer: 4 categories (All, Air, Forest, Water), state-level indicator comparison
- Methodology: 5-tier source documentation with links to CPCB, ISFR, CEA, CWC/CGWB, World Bank
- Glossary: 15 environment terms (AQI, PM2.5, NAAQS, carbon sink, groundwater stage, etc.)

**Hub Integration**
- Environment domain card (#09) with fossil-vs-renewable split bar mini-viz + 3 stat pills (PM2.5 with WHO multiplier, Forest Cover %, Renewables %)

**Chart Infrastructure**
- 5 chart registry entries (air-quality, forest-cover, energy-transition, carbon-footprint, water-stress)
- ChartActionsWrapper on all section charts (PNG export, CSV, embed, permalink)
- 13 citizen questions added to search (115 total across 9 domains)

**HorizontalBarChart Diverging Support**
- Added diverging bar support for mixed positive/negative datasets
- Symmetric scale with zero reference line, bars extend left (negative) and right (positive)
- Smart value label positioning: outside bar for small values, inside bar with contrasting fill for large negative bars (prevents label overlap)

**Bug Fixes**
- Fixed `'summary' is possibly null'` TypeScript build errors in 6 story pages (RBI, States, Census, Education, Employment, Healthcare) — added null guards around KeyTakeaways components

**SEO & Distribution**
- 50 prerendered routes (was 45), updated sitemap with 4 page routes + 7 data URLs + 1 embed URL
- Environment OG image (`og-environment.png`), JSON-LD Dataset entry, BreadcrumbList entries
- `llms.txt` updated: nine domains, environment section with page routes

---

## [0.13.0] - 2026-03-01

### Phase 9: Key Insights & Question-First Search

**Key Takeaways Component**
- New `KeyTakeaways` component (`src/components/ui/KeyTakeaways.tsx`) — stat pill strip between Hero and first scrollytelling section on all 8 story pages
- 4 pills per domain (32 total), each showing a headline stat with citizen-friendly label and scroll-to-section click behavior
- All values computed at runtime from summary data (never hardcoded)
- Staggered fade-in entrance animation via `useScrollTrigger` + Framer Motion
- Domain accent color on left border (saffron for Budget, cyan for Economy/RBI, emerald for States, violet for Census, blue for Education, amber for Employment, rose for Healthcare)
- Responsive: 2-column grid on mobile, flex-wrap row on desktop

**Question-First Search**
- 102 curated citizen questions across 8 domains (`public/data/questions.json`)
- Questions phrased in natural citizen language: "Why are prices rising?", "How much does the government spend on me per day?", "Which is the richest state in India?"
- Each question mapped to a specific story page section with a one-sentence answer grounded in actual portal data
- `CitizenQuestion` interface added to `schema.ts`, `loadQuestions()` added to `dataLoader.ts`
- Search overlay (`SearchOverlay.tsx`) extended with `'question'` type, amber badge styling, and question indexing via Fuse.js
- Updated search placeholder: "Ask a question, or search ministries, schemes, terms..."

**Coverage by domain:**
- Budget: 13 questions (expenditure, revenue, deficit, per-capita, trends, subsidies)
- Economy: 13 questions (GDP, inflation, sectors, trade, debt sustainability)
- RBI: 13 questions (repo rate, EMI impact, forex, CRR, inflation targeting)
- States: 13 questions (GSDP, per capita, growth, fiscal health, tax redistribution)
- Census: 13 questions (population, literacy, sex ratio, urbanization, mortality)
- Education: 12 questions (spending, learning quality, dropout, teachers, enrollment)
- Employment: 13 questions (unemployment, youth, gender gap, informality, sectoral)
- Healthcare: 12 questions (hospital beds, spending, OOP costs, vaccination, disease burden)

## [0.12.0] - 2026-03-01

### Phase 8: "Make It Personal" Engine

**Personalization Infrastructure**
- Global `personalizationStore` (Zustand + localStorage persist) — holds selected state ID, name, and household size
- `StateSelector` component — dropdown with 28 states + 8 UTs, grouped and sorted alphabetically, reads/writes personalization store
- State ID standardization: all pipelines (census, education, employment, healthcare) now use uppercase vehicle registration (RTO) codes (e.g., MH, UP, KA). Three codes differ from ISO 3166-2: Odisha=OD (not OR), Chhattisgarh=CG (not CT), Telangana=TS (not TG).
- CPI-by-COICOP-division data added to economy pipeline: Food (01), Housing (04), Health (06), Transport (07), Education (10). Three-tier sourcing: IMF/DBnomics baseline (FY 2014-19), MOSPI eSankhyiki API live data (FY 2019+, `api.mospi.gov.in/api/cpi/getCPIIndex`), curated fallback if API is down. Gap detection in `cumulativeMultiplier` prevents incorrect inflation computation when category series have missing years.

**EMI Impact Calculator** (`/rbi/calculator`)
- Pure calculation engine (`emiEngine.ts`): standard EMI formula `P * r * (1+r)^n / ((1+r)^n - 1)`, rate impact scenarios at -50/-25/current/+25/+50 bps
- Three loan types: Home (repo + 2.75%), Car (repo + 3.5%), Personal (repo + 8%) — spreads sourced from SBI/HDFC published EBLR rate cards
- Curated loan spreads data (`public/data/emi/loan-spreads.json`) with explicit source attribution
- Interactive inputs: segmented control for loan type, slider for amount (with Indian number formatting), slider for tenure
- Rate impact visualization: horizontal diverging bar chart showing monthly EMI change and total tenure difference per scenario
- Reads current repo rate from `monetary-policy.json` (5.25% as of Feb 2026)

**Cost-of-Living Calculator** (`/economy/calculator`)
- Inflation impact engine (`costOfLivingEngine.ts`): CPI-based deflation using cumulative multiplier math. Category-specific CPI (COICOP division) where available, headline CPI fallback otherwise.
- Seven expense categories mapped to COICOP divisions: Rent/Housing (04), Groceries (01), Transport (07), Education (10), Healthcare (06), Utilities (04), Other (headline)
- Expense presets: "Single (Rs 25K)" and "Family (Rs 50K)" with category-proportional multipliers
- Comparison year selector: dropdown from inflation series (2014+). Default: 2019-20
- "Then vs Now" display: cumulative CPI change %, annualized rate, purchasing power loss in Rs, per-category breakdown showing which used division-specific CPI vs headline fallback
- Gap detection: `cumulativeMultiplier` verifies no missing years in category series — returns null for ranges containing non-consecutive years, triggering headline CPI fallback

**Cross-Domain State Report Card** (`/states/your-state`)
- State report engine (`stateReportEngine.ts`): aggregates data from 12 JSON files across 6 domains (States, Budget, Census, Education, Employment, Healthcare)
- 9 domain panels with ~25 metrics: Economy (per capita GSDP, growth, total GSDP), Budget (central transfer, per capita), Revenue (self-sufficiency), Fiscal Health (deficit, debt), Demographics (population, density, urban %, literacy, gender gap), Education (GER secondary, dropout), Employment (unemployment rate), Healthcare (beds per lakh, doctors per 10K), Health/NFHS-5 (IMR, immunization, stunting)
- Rank computation with quartile coloring: green (top 25%), amber (middle), red (bottom 25%). Rank direction flags (`higherIsBetter`) ensure correct ordering.
- `Promise.allSettled` for partial data loading — if a domain's file fails, that panel shows "Data unavailable" rather than blocking the page
- State ID matching uses uppercase vehicle codes (after Step 0A standardization)

**Personalization Banner**
- 40px bar below header on all scrollytelling pages when a state is selected
- Shows state name + domain-specific contextual stat (e.g., "GSDP growth: 16.4%" on States, "Unemployment: 3.2%" on Employment)
- Dismissable (stores dismissal key in localStorage), reappears when state changes
- "Full report" link navigates to `/states/your-state`

**Navigation & Routing**
- 3 new routes: `/rbi/calculator`, `/economy/calculator`, `/states/your-state`
- Header tabs: "EMI Calc" under RBI, "Your Cost" under Economy, "Your State" under States
- Mobile bottom nav: corresponding tab entries added
- 3 routes added to prerender script (45 routes total: 37 pages + 8 embed)
- Sitemap updated with 3 new page URLs + 1 data file URL (loan-spreads.json)

**New Files**
- `src/store/personalizationStore.ts` — Global state/household Zustand store with localStorage persist
- `src/store/emiCalculatorStore.ts` — EMI calculator state (loan type, amount, tenure, custom rate)
- `src/store/costOfLivingStore.ts` — Cost-of-living calculator state (expenses, comparison year)
- `src/lib/emiEngine.ts` — EMI calculation + rate impact scenarios
- `src/lib/costOfLivingEngine.ts` — CPI-based inflation impact calculator
- `src/lib/stateReportEngine.ts` — Cross-domain state data aggregation + rank computation
- `src/components/personalization/StateSelector.tsx` — State/UT dropdown
- `src/components/personalization/PersonalizationBanner.tsx` — Contextual state banner
- `src/components/emi/EMIInputPanel.tsx` — Loan type, amount, tenure inputs
- `src/components/emi/EMIBreakdownDisplay.tsx` — Monthly EMI, total payment, interest ratio
- `src/components/emi/RateImpactViz.tsx` — Diverging bar chart for rate scenarios
- `src/components/cost-of-living/ExpenseInput.tsx` — Category sliders with preset buttons
- `src/components/cost-of-living/InflationImpactDisplay.tsx` — Then vs Now comparison
- `src/components/report-card/ReportCardGrid.tsx` — Multi-domain panel layout
- `src/components/report-card/DomainPanel.tsx` — Domain icon + metrics
- `src/components/report-card/MetricRow.tsx` — Value + national avg + rank badge + range gauge
- `src/pages/EMICalculatorPage.tsx` — Route component for `/rbi/calculator`
- `src/pages/CostOfLivingPage.tsx` — Route component for `/economy/calculator`
- `src/pages/StateReportCardPage.tsx` — Route component for `/states/your-state`
- `public/data/emi/loan-spreads.json` — Curated loan spreads from bank rate cards
- `src/components/emi/EMIShareCard.tsx` — Canvas 1200x630 share card: loan details, EMI, rate impact scenarios
- `src/components/cost-of-living/CostShareCard.tsx` — Canvas share card: then vs now, cumulative inflation, category breakdown
- `src/components/report-card/ReportShareCard.tsx` — Canvas share card: state name, key metrics with rank badges

**SEO & Discoverability**
- 3 dedicated OG images: `og-emi-calculator.png`, `og-cost-of-living.png`, `og-state-report-card.png`
- SearchOverlay: 3 calculator pages added to search index (EMI Calculator, Cost of Living, State Report Card)
- Noscript fallback: personalization tools section added to `index.html` with calculator links
- JSON-LD BreadcrumbList: 3 calculator entries added (positions 35-37)
- JSON-LD WebApplication featureList: 3 personalization feature descriptions added

**Modified Files**
- `src/lib/stateMapping.ts` — `OR→OD` for Odisha in `ALL_STATE_CODES` and `BUDGET_CODE_TO_TOPO_NAME`
- `pipeline/src/census/sources/curated.py` — All state IDs uppercase vehicle codes
- `pipeline/src/education/sources/curated.py` — All state IDs uppercase vehicle codes
- `pipeline/src/employment/sources/curated.py` — All state IDs uppercase vehicle codes
- `pipeline/src/healthcare/sources/curated.py` — All state IDs uppercase vehicle codes
- `pipeline/src/economy/transform/inflation.py` — Added `_build_cpi_by_category()` with curated COICOP CPI data
- `pipeline/src/economy/validate/schemas.py` — Added `CPICategoryEntry`, `CPICategoryPoint` models
- `src/lib/data/schema.ts` — Added `cpiByCategory` to `InflationData`, `LoanSpreadsData` interface
- `src/lib/dataLoader.ts` — Added `loadLoanSpreads()` function
- `pipeline/src/economy/sources/mospi.py` — MOSPI eSankhyiki CPI API client (no auth, fetches group-wise monthly CPI, computes FY averages)
- `pipeline/src/economy/transform/inflation.py` — Three-tier CPI data: IMF baseline (2014-19) + MOSPI API (2019+) + curated fallback
- `pipeline/src/economy/main.py` — Added MOSPI CPI fetch call before inflation transform
- `pipeline/src/common/world_bank.py` — Shared World Bank API client (retry, backoff, error handling)
- `pipeline/src/*/sources/world_bank.py` (x6) — Refactored to thin wrappers over shared client
- `.github/workflows/states-pipeline.yml` — Semi-annual schedule (Jan/Jul) with RBI Handbook reminder issues
- `.github/workflows/economy-pipeline.yml` — Updated commit message to include MOSPI source
- `pipeline/PIPELINE_DATA_SOURCES.md` — Comprehensive catalog of all 30+ curated data constants
- `src/App.tsx` — 3 new routes + lang-prefixed variants
- `src/components/layout/Header.tsx` — Calculator tabs for RBI, Economy, States
- `src/components/layout/MobileNav.tsx` — Tab entries for 3 new routes
- `src/components/layout/PageShell.tsx` — `PersonalizationBanner` rendered below header
- `scripts/prerender.mjs` — 3 routes added
- `public/sitemap.xml` — 3 page URLs + 1 data file URL added

---

## [0.11.0] - 2026-03-01

### Phase 7: Chart Shareability & Distribution Infrastructure

**ChartActions Overlay** — Every chart across all 8 domains now has a hover/tap toolbar
- PNG download: SVG→Canvas→PNG pipeline clones the chart SVG, resolves CSS custom properties (`var(--saffron)` → `#FF6B35`), composites dark background + accent bar + title + chart + source watermark. No external dependencies — pure SVG serialization + Canvas 2D API.
- CSV export: RFC 4180-compliant CSV serialization from chart registry's `toTabular()` function. Proper escaping for commas, quotes, and newlines.
- Permalink copy: `#{sectionId}` hash anchor + clipboard API. Each scrollytelling section now has a stable `id` attribute.
- Embed code copy: generates `<iframe>` snippet pointing to `/embed/{domain}/{section}` with responsive styling.
- Desktop: hover fade-in overlay (glass background, top-right). Mobile: persistent share button → bottom sheet with 2×2 action grid + WhatsApp CTA.
- Pointer-events layering (`pointer-events: none` on overlay, `auto` only on buttons) preserves chart tooltips and treemap drill-down.

**Embed Routes** (`/embed/{domain}/{section}`)
- Standalone responsive chart pages for iframe embedding by journalists, bloggers, educators
- Minimal chrome: accent bar, title, chart area, source attribution, branding link back to full portal
- `ChartRenderer` component lazy-loads only the needed chart component (LineChart, AreaChart, HorizontalBarChart, TreemapChart, SankeyDiagram, WaffleChart, ChoroplethMap) — small embed bundle
- Generic series builders detect time series fields by naming convention (`*TimeSeries`)
- Renders outside PageShell (no header/footer/nav chrome)
- 8 representative embed routes prerendered for SEO

**WhatsApp Share Cards**
- One-stat image (1200×630, Canvas API) with domain accent color, hero stat value + context, deep link URL, branding strip
- Tries Web Share API first (mobile native share sheet), falls back to PNG download
- Under 100KB target for fast WhatsApp compression

**URL-Encoded Chart State**
- Bidirectional `useUrlState` hook syncs Zustand store ↔ URLSearchParams
- URL wins on mount (enables deep linking), store wins after (no infinite loops)
- Uses `replace: true` to avoid polluting browser history
- All 8 explorer pages wired: `?category=growth&indicator=gdp-real` becomes a shareable deep link
- Scrollytelling sections: `#sectionId` hash anchors for all ~49 sections

**Central Chart Registry** (`src/lib/chartRegistry.ts`)
- Map-based registry keyed by `"{domain}/{sectionId}"` (e.g., `"economy/growth"`)
- Each entry: title, source, accent color, data files, chartType, `toTabular()` for CSV, `heroStat()` for share cards
- `DOMAIN_META` for all 8 domains (accent colors, labels, base paths)
- 8 registration files (`src/lib/registry/{domain}.ts`) covering ~49 chart sections
- Lookup functions: `getChartEntry()`, `getChartsByDomain()`, `getAllCharts()`
- Permalink and embed URL builder utilities

**New Files**
- `src/lib/chartRegistry.ts` — Registry types, Map, lookup functions
- `src/lib/svgCapture.ts` — SVG→Canvas→PNG capture pipeline
- `src/lib/shareCard.ts` — WhatsApp share card Canvas generator
- `src/lib/csvExport.ts` — CSV serialization utility
- `src/hooks/useUrlState.ts` — Zustand↔URL bidirectional sync
- `src/components/share/ChartActions.tsx` — Action bar (4 buttons)
- `src/components/share/ChartActionsWrapper.tsx` — Hover overlay container
- `src/components/share/ShareBottomSheet.tsx` — Mobile bottom sheet
- `src/components/embed/EmbedShell.tsx` — Minimal embed chrome
- `src/components/embed/ChartRenderer.tsx` — Lazy chart component switch
- `src/pages/EmbedPage.tsx` — Route component for `/embed/:domain/:section`
- `src/lib/registry/index.ts` + 8 domain files

**Modified Files**
- `src/main.tsx` — Registry import at startup
- `src/App.tsx` — Embed route handling outside PageShell
- ~49 scrollytelling section files — Added `id` attributes and `ChartActionsWrapper`
- 8 explorer pages — Added `useUrlState` hook
- `scripts/prerender.mjs` — 8 embed routes added
- `public/sitemap.xml` — Embed route URLs added
- `public/llms.txt` — Embed API documentation section

---

## [0.10.0] - 2026-03-01

### Phase 6: Historical Data & Depth

**Budget 20-Year Historical Trends** (Section 03)
- New "Trends" scrollytelling section showing India's budget evolution from FY 2005-06 to FY 2025-26
- Dual-chart visualization: expenditure vs receipts (Rs lakh crore) + fiscal/revenue deficit as % of GDP
- 21 curated data points from Budget at a Glance documents (indiabudget.gov.in/budget_archive/)
- Dynamic narrative: spending growth multiple, COVID-year spike, and the persistent deficit gap
- Pipeline: `pipeline/src/transform/budget_trends.py` → `public/data/budget/2025-26/trends.json`

**Budget vs Actual Tracker** (Section 04)
- New "Promises vs Reality" scrollytelling section showing ministry-level execution accuracy
- Custom SVG deviation chart: % deviation from Budget Estimate per ministry, color-coded (green ±5%, saffron overspend, cyan underspend)
- 10 top ministries tracked across 7 fiscal years (FY 2019-20 through FY 2025-26) with BE/RE/Actual data
- Year selector for historical comparison; insight cards highlighting biggest over/underspends
- Pipeline: `pipeline/src/transform/budget_vs_actual.py` → `public/data/budget/2025-26/budget-vs-actual.json`
- Source: Expenditure Budget statements (indiabudget.gov.in)

**Budget Story Expanded**
- Budget scrollytelling now has 9 sections (was 7): Hero, 01-Revenue, 02-Deficit, **03-Trends (new)**, **04-Budget vs Actual (new)**, 05-Expenditure, 06-Flow, 07-Map, 08-PerCapita, 09-CTA
- Narrative bridges added between Deficit→Trends and Trends→BvA sections

**World Bank Historical Extension**
- Economy and RBI pipelines now fetch data from year 2000 (was 2014), giving 25+ years of time series for macro charts
- Modified: `economy/sources/world_bank.py`, `economy/main.py`, `rbi/sources/world_bank.py`, `rbi/main.py`

**State GSDP 3-Year History**
- Top 10 states by GSDP now include historical data (FY 2020-21, 2021-22, 2022-23)
- `gsdpHistory` added to `gsdp.json` output (additive, no breaking changes)
- Source: RBI Handbook of Statistics on Indian States (same handbook, prior year tables)

**Pipeline Validation**
- 5 new Pydantic models: `BudgetTrendYear`, `BudgetTrendsData`, `BudgetVsActualYear`, `MinistryBudgetHistory`, `BudgetVsActualData`
- 2 new TypeScript interfaces matching pipeline schemas
- State schemas extended with `StateGSDPHistoryPoint`, `StateGSDPHistory`
- All pipelines pass validation; `npm run build` passes with zero errors

**SEO**
- Sitemap updated with 2 new data file URLs (trends.json, budget-vs-actual.json)

---

## [0.9.0] - 2026-03-01

### Phase 5: Education, Employment & Healthcare Domains

**Education Domain** (`/education`) — Blue accent (#3B82F6)
- Six-section scrollytelling: enrollment triumph (primary/secondary/tertiary GER line chart), gender convergence (slope chart showing girls catching up), dropout cliff (funnel/waterfall — primary 1.9% → secondary 14.1%), learning quality gap (ASER outcomes bar chart), teacher challenge (PTR trends + state ranking), spending vs global peers (India 4.1% GDP vs NEP 6% target)
- Pipeline: World Bank API (14 indicators) + curated UDISE+ 2023-24 (36 states) + ASER 2024 (25 states)
- Explorer with 5 categories (All, Enrollment, Quality, Infrastructure, Spending)
- Methodology: 7 sections covering UDISE+, ASER, World Bank data sourcing
- Glossary: 14 education terms (GER, dropout rate, PTR, ASER, NEP 2020, RTE Act, etc.)

**Employment Domain** (`/employment`) — Amber accent (#F59E0B)
- Six-section scrollytelling: participation puzzle (LFPR trend line chart), structural shift (agriculture declining, services rising stacked area), youth unemployment crisis (age-cohort bar chart), gender gap (male vs female LFPR butterfly chart), informality challenge (waffle chart — 8/10 workers informal), rural vs urban patterns
- Pipeline: World Bank API (17 indicators) + curated PLFS Oct-Dec 2025 + PLFS state data (30 states) + RBI KLEMS sectoral breakdown
- Explorer with 5 categories (All, Unemployment, Participation, Sectoral, Informality)
- Methodology: 7 sections covering PLFS, KLEMS, World Bank data sourcing
- Glossary: 15 employment terms (LFPR, PLFS, gig economy, structural transformation, etc.)

**Healthcare Domain** (`/healthcare`) — Rose accent (#F43F5E)
- Six-section scrollytelling: infrastructure deficit (India 0.5 beds vs WHO 3.5 bar chart), spending story (health expenditure % GDP line chart), out-of-pocket burden (waffle chart — ₹50 of every ₹100 from patient pockets), immunization push (DPT + measles coverage trends), disease burden (TB incidence, NCD shift), doctor gap (state-level doctors per 10K bar chart)
- Pipeline: World Bank API (12 indicators) + curated NHP 2022 (30 states) + NFHS-5 immunization (30 states)
- Explorer with 5 categories (All, Infrastructure, Spending, Immunization, Disease)
- Methodology: 7 sections covering NHP, NFHS-5, World Bank data sourcing
- Glossary: 13 healthcare terms (PHC, CHC, out-of-pocket spending, TB incidence, etc.)

**Hub Integration**
- 3 new domain cards: Education (#06), Employment (#07), Healthcare (#08)
- Mini-visualizations: enrollment bars (blue), sectoral area (amber), infrastructure bars (rose)
- Hub now shows 8 data domain cards

**SEO**
- 12 new routes added to Puppeteer prerender (34 routes total)
- Sitemap expanded with 12 page URLs + 15 data file URLs (43 data files total)
- 3 JSON-LD Dataset schemas (Education/Employment/Healthcare for Google Dataset Search)
- JSON-LD BreadcrumbList updated with 12 new entries (34 total)
- `llms.txt` expanded with 3 domain descriptions, key data points, and datasets
- Noscript fallback updated with 3 domain content sections + data download links
- 3 per-domain OG images: `og-education.png`, `og-employment.png`, `og-healthcare.png`

**Navigation**
- Header: `isEducationSection`/`isEmploymentSection`/`isHealthcareSection` detection, domain titles, 4 sub-nav tabs each
- Mobile bottom nav: 3 new domain icons and tab arrays
- Footer: domain-specific attribution with source links
- Search (Cmd+K): 42 new glossary terms indexed + 12 page entries

**GitHub Actions**
- `education-pipeline.yml`: quarterly (Jan/Apr/Jul/Oct 15th) — aligned to UDISE+/ASER/WB release cycles
- `employment-pipeline.yml`: quarterly (Mar/Jun/Sep/Dec 1st) — aligned to PLFS quarterly bulletin releases
- `healthcare-pipeline.yml`: quarterly (Feb/May/Aug/Nov 15th) — aligned to NHP/WB release cycles
- `data-freshness-monitor.yml` updated with 3 new domain entries (8 domains total)

---

## [0.8.0] - 2026-02-28

### Phase 4B: Census & Demographics Domain

**Census & Demographics Scrollytelling** (`/census`)
- Six-section narrative: population growth (national time series from World Bank), age structure (custom 10x10 waffle grid showing young/working/elderly %), vital statistics (birth vs death rate, fertility rate with 2.1 replacement reference line, life expectancy with gender split), health outcomes (IMR time series + state-level IMR with color gradient bars + NFHS-5 state health), literacy gender gap (custom butterfly chart showing male vs female literacy by state, sorted by gap), urbanization trends
- Multi-vintage data sourcing: World Bank API (national time series), Census 2011 (state baseline), NFHS-5 2019-21 (health by state), SRS 2023 (vital statistics), NPC population projections
- Violet (#8B5CF6) accent color for the census domain
- Custom visualizations: AgeWaffle (10x10 grid, each cell = 1% of population), GenderGapChart (bilateral bars with gap percentage), IMR color gradient (saffron worst → gold middle → violet best)

**Census & Demographics Sub-Pages**
- `/census/explore`: indicator explorer with 5 categories (All, Population, Demographics, Literacy, Health), `HorizontalBarChart` per indicator
- `/census/methodology`: 7 sections covering data sources (4-tier explanation), indicator definitions (World Bank codes, NFHS/SRS indicators), data vintage transparency (Census 2021 gap, Census 2027 timeline), data freshness cycles, 5 documented limitations
- `/census/glossary`: demographic terms in plain language

**Hub Integration**
- Census domain card (05 — DATA STORY) with mini horizontal population bars (top 5 states from `summary.json`), stat pills (Population in billions, Literacy Rate, Sex Ratio)
- "Coming Soon" section removed — all planned Phase 4 domains are now live

**SEO**
- 4 census routes added to Puppeteer prerender (22 routes total)
- Sitemap expanded with 4 page URLs + 6 data file URLs (28 data files total)
- JSON-LD Dataset schema for Census data (Google Dataset Search)
- JSON-LD BreadcrumbList updated with 4 census entries (22 total)
- `llms.txt` expanded with Census domain description, key data points, and datasets
- Noscript fallback updated with census content and data download links
- Per-domain OG image: `og-census.png` (violet gradient)
- WebApplication featureList updated with census capabilities

**Navigation**
- Header: `isCensusSection` detection, "Census & Demographics" title, 4 sub-nav tabs
- Mobile bottom nav: census icon (people/users SVG) and tab array
- Footer: census-specific attribution (Census of India, World Bank, NFHS-5)
- Search (Cmd+K): census glossary terms indexed + 4 page entries

**GitHub Actions**
- `census-pipeline.yml`: quarterly runs (Jan/Apr/Jul/Oct 15th) — aligned to World Bank annual update cycle
- `data-freshness-monitor.yml` updated with Census domain (120-day staleness threshold)

**Data Accuracy Fix (truth verification)**
- Fixed `literacyRate` in summary.json: was 72.82 (incorrectly weighted by total population), now 74.04 (Census 2011 national figure for age 7+)
- Corrected 57 NFHS-5 health values across 23 states: fullImmunization (21 states), IMR (16), under-5 mortality (17), wasting (3). Source: NFHS-5 state factsheet CSV (IIPS/DHS Program)
- All 138 NFHS-5 values (23 states x 6 fields) now match authoritative source exactly

---

## [0.7.0] - 2026-02-28

### Phase 4A: State Finances Domain

**State Finances Scrollytelling** (`/states`)
- Five-section narrative: GSDP landscape (top 20 states), growth leaders (constant prices), revenue self-sufficiency (own tax vs central transfers), fiscal health (debt-to-GSDP with FRBM 3% reference line), per capita GSDP
- All data sourced from RBI Handbook of Statistics on Indian States (FY 2022-23) — no mock data
- Emerald (#4ADE80) accent color for the states domain
- Mini bar chart on hub domain card showing top 5 states by GSDP

**State Finances Data Pipeline** (Python)
- Curated extraction from RBI Handbook covering 31 states/UTs (5 small UTs lack complete accounts)
- 4 transform modules: GSDP, revenue composition, fiscal health, cross-sectional indicators
- Pydantic validation schemas for all state data shapes
- 6 verified JSON outputs in `public/data/states/2025-26/`

**State Finances Sub-Pages**
- `/states/explore`: indicator explorer with 4 categories (GSDP, Revenue, Fiscal, Per Capita), `HorizontalBarChart` per indicator
- `/states/methodology`: data sources (RBI Handbook, State Finances report, Finance Commission), indicator definitions, data freshness (FY 2022-23 vintage), limitations
- `/states/glossary`: 12 state finance terms (GSDP, per capita income, own tax revenue, devolution, FRBM Act, etc.)

**Hub Integration**
- States domain card (04 — DATA STORY) with mini bar chart, stat pills (Top GSDP State, Growth Range, # States)
- "Coming Soon" reduced to Census & Demographics only

**SEO**
- 4 states routes added to Puppeteer prerender (18 routes total)
- Sitemap expanded with 4 page URLs + 5 data file URLs
- JSON-LD Dataset schema for State Finances data (Google Dataset Search)
- JSON-LD BreadcrumbList updated with 4 states entries
- `llms.txt` expanded with State Finances domain description and key data points
- Noscript fallback updated with states content and data download links
- Per-domain OG image: `og-states.png` (emerald gradient)

**Navigation**
- Header: `isStatesSection` detection, "State Finances" title, 4 sub-nav tabs (Story, Explore, Methodology, Glossary)
- Mobile bottom nav: states icon and tab array
- Footer: states-specific attribution (RBI Handbook, Finance Commission)
- Search (Cmd+K): 12 states glossary terms indexed with purple TERM badges + 4 page entries

**Bug Fixes**
- Fixed `HorizontalBarChart` double-display bug across all states sections — `formatValue` and `unit` prop both contained unit info, causing "₹20,843 Rs 00 Cr". Set `unit=""` in all sections where `formatValue` returns the complete display string.

---

## [0.6.0] - 2026-02-28

### Phase 3.5: UX & Discoverability

**Per-Domain Glossary Pages** (`/budget/glossary`, `/economy/glossary`, `/rbi/glossary`)
- Shared `GlossaryPage` component parameterized by domain (accent colors, SEO, data loading)
- 40 terms total: 13 budget, 15 economy, 12 RBI — all explained in plain language with "In Simple Terms" callouts
- Each term has: one-liner explanation, detail paragraph, live "In Context" value traced to `summary.json`, related term pills
- Filter input + alphabet jump pills for quick navigation
- Hash-based deep linking from search results (e.g., `/budget/glossary#fiscal-deficit`)
- Header tabs and mobile bottom nav updated for all 3 domains

**Floating Feedback Button**
- Fixed bottom-right corner button on all pages (flag icon, `z-40`)
- Opens GitHub new issue form with pre-filled page context and plain-language prompts ("What looks wrong?", "What should it say instead?")
- Positioned above mobile nav on small screens (`bottom-20 md:bottom-6`)
- Tooltip on hover: "Report incorrect data"

**Cmd+K Search Expansion**
- Glossary terms indexed in search overlay with purple `TERM` badges
- All 40 glossary terms searchable, linking to `/{domain}/glossary#{term-id}`
- Added missing RBI pages (Story, Explore, Methodology) to search index
- Fixed stale routes (`/explore` → `/budget/explore`, `/calculator` → `/budget/calculator`)
- Updated placeholder: "Search terms, ministries, schemes, pages..."

**SEO**
- 3 glossary routes added to Puppeteer prerender (14 routes total)
- Sitemap expanded with 3 glossary URLs
- JSON-LD BreadcrumbList updated with glossary entries
- `llms.txt` expanded with glossary descriptions per domain
- Noscript fallback updated with glossary links

**Note:** Mobile UX audit deferred to post-Phase 4 (after all data domains are built).

---

## [0.5.1] - 2026-02-28

### Phase 3: Polish Existing Domains

**Economy Inflation Chart**
- Sparse series filtering: Food CPI and Core CPI hidden when < 3 data points (World Bank doesn't provide food/core CPI breakdown for India — only 2 curated Economic Survey values existed)
- Annotation text adapts: shows headline-only description when breakdown series are hidden

**Economy GDP Projection**
- Fixed "7.4–7.4%" display in OutlookSection — now shows single "7.4%" when `projectedGrowthLow === projectedGrowthHigh`
- Schema unchanged (supports real ranges when future surveys provide them)

**RBI Credit Section**
- Updated narrative to focus on private sector credit (what's actually rendered) instead of mentioning domestic credit (World Bank `FS.AST.DOMS.GD.ZS` returns no data for India)
- Removed phantom domestic credit series from chart definition — was silently filtered at runtime, now removed at source

**Per-Domain OG Images**
- 4 domain-specific OG cards generated via Puppeteer: hub (`og-logo.png`), budget (`og-budget.png`), economy (`og-economy.png`), rbi (`og-rbi.png`)
- OG generation script (`generate-og.mjs`) rewritten as parametric — add variants to `VARIANTS` array
- `<SEOHead image>` prop wired on all 11 routes (story, explore, calculator, methodology per domain)
- Domain-specific accent color gradients: saffron→gold (budget), cyan→gold (economy), gold→saffron (rbi)

**Documentation**
- Added "Polish Hygiene" section to CLAUDE.md — reusable patterns for narrative↔data alignment, sparse series handling, OG images, and World Bank data gaps
- README roadmap: Phase 3 marked complete

---

## [0.5.0] - 2026-02-28

### RBI Data Domain + Data Accuracy Overhaul + Automation

**RBI Scrollytelling** (`/rbi`)
- Six-section narrative: repo rate hero with stance badge, monetary policy trajectory (decade of rate decisions), inflation targeting vs RBI's 4% mandate, M3 money supply growth, credit expansion (domestic + private sector), forex reserves ($700B+ war chest), INR/USD exchange rate
- All data sourced from RBI DBIE, World Bank API, and curated MPC decision history — no mock data
- Step chart mini-visualization on hub domain card showing last 5 repo rate decisions

**RBI Data Pipeline** (Python)
- Hybrid three-tier data sourcing: World Bank API (historical backbone), curated RBI MPC decisions (hand-verified from official statements), merged at transform time
- 4 transform modules: monetary policy, liquidity, credit, forex
- Pydantic validation schemas for all RBI data shapes
- 6 verified JSON outputs in `public/data/rbi/2025-26/`
- 30 repo rate decisions tracked from 2014 onward

**RBI Sub-Pages**
- `/rbi/explore`: indicator explorer with 4 categories (monetary, liquidity, credit, external), interactive line charts
- `/rbi/methodology`: data sources (DBIE, World Bank, MPC press releases), WB indicator code table, fiscal year mapping

**Data Accuracy Overhaul** (all domains)
- Truth-verified every key figure against authoritative sources (RBI MPC statements, NSO releases, World Bank API, Economic Survey 2025-26)
- RBI corrections: repo rate 6.00% → 5.25%, CRR 4.50% → 3.00%, added 5 MPC decisions (Jun-Dec 2025, Feb 2026)
- Economy corrections: GDP FY2024-25 6.4% → 6.5% (Provisional Estimate), FY2025-26 projection 6.3-6.8% → 7.4% (NSO FAE Jan 2026), CPI 4.2% → 4.0% (Survey revised)
- Fixed economy pipeline schema: `cpiFood` changed to `Optional[float]` (World Bank doesn't provide food-specific CPI breakdown)

**Automated Pipeline Infrastructure** (GitHub Actions)
- `economy-pipeline.yml`: quarterly runs aligned to data releases (Feb 5 post-Survey, Mar 5 post-Second Advance, Jun 1 post-WB update, Dec 1 post-First Revised)
- `rbi-pipeline.yml`: bi-monthly runs on 10th of Feb/Apr/Jun/Aug/Oct/Dec (post-MPC meeting dates)
- `data-freshness-monitor.yml`: monthly staleness checks with auto-created GitHub issues — MPC decision reminders, Economic Survey reminders, Budget readiness reminders
- All workflows: auto-commit-and-push on data changes, failure alerts via GitHub issues

**Hub Integration**
- RBI domain card (03 — DATA STORY) with step chart, stat pills (Repo Rate, Forex Reserves, M3 Growth)
- "Coming Soon" reduced to State Finances and Census & Demographics

**SEO**
- Sitemap expanded: 3 RBI routes + 5 RBI data file URLs (11 pages + 17 data files total)
- JSON-LD Dataset schema for RBI data (Google Dataset Search)
- llms.txt expanded with RBI domain description and key data points
- Noscript fallback with RBI content
- Prerender routes expanded to 11

---

## [0.4.1] - 2026-02-28

### SEO Overhaul + Viz Fixes

**SEO: Duplicate Meta Tag Cleanup**
- Removed static OG/Twitter/description/canonical tags from `index.html` that duplicated per-route tags from react-helmet-async — crawlers were seeing hub meta on every page
- Added `og:image` and `twitter:image` support to SEOHead component
- Fixed JSON-LD breadcrumb paths, added Economy Dataset schema for Google Dataset Search
- Updated sitemap.xml with correct `/budget/*` routes + all economy routes (8 pages + 12 data files)
- Economy routes added to Puppeteer prerender script (8 routes total)
- Expanded `llms.txt` and noscript fallback with economy content
- Fixed `useRef<T>()` TypeScript error for React 19 compatibility

**Visualization Fixes**
- Tooltip scroll persistence: added scroll debounce to `useTooltip` hook preventing phantom re-triggers during scroll (SVG hover rects fire mouseEnter as they pass under cursor)
- Area chart contrast: increased gradient opacity (0.5/0.08) for better export/import distinction on dark backgrounds
- HorizontalBarChart: widened right margin when annotations present to prevent text clipping

**Data Integrity (Codex Review)**
- Treemap rebuilt from expenditure.json (was 43,810 Cr gap between treemap sum and source)
- Scheme allocations synced to expenditure.json (7 mismatches corrected)
- Paise denominator fix: borrowings/earned not borrowings/total (24→32 paise)
- Removed synthetic food/core CPI from inflation data — kept only Economic Survey sourced values
- Pipeline cross-file invariants added: treemap sum, scheme consistency, receipt percentages, statewise totals
- CSV export: proper RFC 4180 quoting for fields containing commas

---

## [0.4.0] - 2026-02-27

### Economic Survey 2025-26 — Second Data Domain

**Economy Scrollytelling** (`/economy`)
- Six-section narrative: GDP growth trends, inflation tracking (CPI/WPI), fiscal deficit position, trade balance, sectoral composition, outlook projections
- All data sourced from World Bank API and Economic Survey 2025-26 — no mock data

**New Visualization Components**
- `LineChart`: time series with dot markers, gradient area fill, responsive axes
- `AreaChart`: stacked/layered areas with configurable gradients, used for trade balance (exports vs imports)
- `HorizontalBarChart`: labeled bars with optional annotations and configurable `labelWidth` prop

**Economy Data Pipeline** (Python)
- World Bank API client with country/indicator fetching
- 5 transform modules: GDP, inflation, fiscal, external trade, sectors
- Pydantic validation schemas for all economy data shapes
- 7 verified JSON outputs in `public/data/economy/2025-26/`

**Economy Sub-Pages**
- `/economy/explore`: searchable indicator table with year-over-year comparisons
- `/economy/methodology`: data sources, indicator definitions, survey methodology, limitations

**Hub Integration**
- Economy domain card on hub with sparkline visualization and stat pills
- Context-aware navigation: header, mobile tabs, and footer adapt for economy routes

**Bug Fixes**
- Tax engine: fixed slab off-by-one boundary + added Section 87A marginal relief
- Schema: economy TypeScript interfaces, `cpiFood` nullable, `note` fields on `ReceiptsData` and `StatewiseData`
- Removed redundant "Indian Data Project" overline from hub hero

---

## [0.3.1] - 2026-02-24

### Navigation Overhaul + i18n Removal

**Navigation UX**
- Context-aware header title: shows "Indian Data Project" on hub, "Budget 2025-26" inside budget section
- Back chevron in header on budget pages, linking to `/#stories` on the hub
- Back-to-hub link in footer on budget pages (`‹ Indian Data Project`)
- Hub header shows no nav links (DomainCard is the sole CTA)
- Budget header shows Story / Explore / Your Share / Methodology tabs
- Search icon (SVG magnifying glass) replaces "Cmd+K" text button; shortcut preserved in tooltip
- `id="stories"` anchor on hub Data Stories section with `scroll-mt-20` and hash-scroll effect

**i18n: Wired Then Deliberately Removed**
- Full react-i18next integration completed across all 13 UI components with Hindi locale files
- Fixed LanguageProvider bug: `useParams()` doesn't work outside `<Routes>` — switched to pathname parsing
- Decision: browser auto-translate covers ~80% of use cases; i18n overhead slows platform expansion
- All `useTranslation()` calls and LanguageSwitcher removed from UI
- Infrastructure preserved for future reactivation: `i18n.ts`, `LanguageSwitcher.tsx`, `LanguageProvider.tsx`, 7 Hindi locale files

**Documentation**
- README roadmap updated: removed i18n phase, added Expand Scope phase (Economic Survey, State Finances, RBI Data, Census)

---

## [0.3.0] - 2026-02-24

### Hub Architecture + New Compositions

**Site Architecture**
- New hub homepage at `/` — visual portal with project mission, data domain cards with live summary stats
- Budget scrollytelling moved from `/` to `/budget` with sub-routes (`/budget/explore`, `/budget/calculator`, `/budget/methodology`)
- Context-aware navigation: header and mobile nav switch between hub links and budget sub-nav based on current route
- Permanent redirects for old routes (`/explore` → `/budget/explore`, etc.) in vercel.json
- Prerender routes updated to match new structure

**New Compositions**
- Deficit section (02): rupee bar visualization showing 69p earned (saffron) / 31p borrowed (dashed cyan), three stat cards (Total Receipts, Fiscal Deficit, % of GDP), all values computed from real data
- Per-capita section (06): horizontal segmented bar of daily per-citizen spending by top 8 ministries, semantic color grouping (warm for sovereign, cool for welfare), 4-column legend grid
- Two new narrative bridges connecting Revenue → Deficit and Map → Per-capita sections
- Section numbering updated: Revenue(01), Deficit(02), Expenditure(03), Flow(04), Map(05), PerCapita(06), CTA(07)

**Documentation**
- Added "Creative License" section to BRAND.md — explicit permission for unconventional design choices
- Added "Data Integrity — Non-Negotiable" section to CLAUDE.md
- Added "Site Architecture — Hub + Data Domains" section to CLAUDE.md
- Updated README with current project structure and roadmap status

**Cleanup**
- Removed dead HomePage.tsx (replaced by HubPage.tsx + BudgetPage.tsx)
- Fixed AnimatedCounter rounding bug in PerCapitaSection (showed "Rs 96" instead of "Rs 95.71")

---

## [0.2.0] - 2026-02-24

### Design Overhaul & Features

**IIB-Inspired Visual Redesign**
- Complete UI/UX overhaul inspired by Information is Beautiful, Visual Cinnamon, and Kasia Siwosz
- New design system: deep navy-black backgrounds, saffron/gold/cyan accent palette
- Numbered narrative sections (01, 02, 03...) with scroll-triggered word reveals
- Glass header with scroll-aware opacity and layoutId nav animation
- Composition dividers and NarrativeBridge components for storytelling flow
- Brand guide documented in BRAND.md

**Old Regime Tax Deductions**
- Full deduction support for Old Regime: 80C, 80D (self + parents), 80CCD(1B), 24(b), HRA, 80TTA
- Accordion UI with collapsible sections, cap enforcement, and progress bars
- Quick presets: "Salaried basics", "With home loan", "Max deductions"
- Deduction breakdown in tax calculation display (gold-colored rows)
- Share card updated with deduction summary

**Data Explorer Fixes**
- Fixed sticky header overlap bug (overflow-x: clip instead of overflow-x: auto)
- Fixed calculator results not visible (scroll trigger threshold issue)

**Infrastructure**
- Domain migration to indiandataproject.org (all SEO, canonical URLs, JSON-LD updated)
- Fixed stale data serving: CDN-only caching (s-maxage) with browser revalidation
- Added README.md with architecture docs, setup guide, and roadmap
- Added AGPL-3.0 license
- Updated llms.txt with deduction details

### Known Issues
- Choropleth map uses approximate hardcoded SVG paths instead of real TopoJSON geometry
- Homepage prerender shows React #418 hydration warnings (cosmetic, doesn't affect end users)

---

## [0.1.0] - 2026-02-22

### Initial Release — MVP

**Data Pipeline (Python)**
- ETL pipeline pulling Union Budget 2025-26 data from Open Budgets India (CKAN API)
- 10 structured JSON output files: summary, receipts, expenditure, sankey, treemap, statewise, schemes, tax slabs, expenditure shares, year index
- Fallback to direct Budget document parsing when CKAN is unavailable
- 21 validation tests covering data integrity
- GitHub Actions workflow for daily data freshness checks + Budget Day polling

**Frontend (React + TypeScript)**
- 4 pages: Home (scrollytelling), Data Explorer, Tax Calculator, Methodology
- Visualizations: Waffle chart (revenue), Treemap (expenditure, drill-down), Sankey diagram (money flow), Choropleth map (state allocations), Animated counters
- Tax calculator: Old/New regime, slab-by-slab breakdown, spending allocation bars with human context, shareable image card
- Data Explorer: Sortable table, expandable scheme rows, CSV export
- Indian number formatting throughout (lakhs/crores)
- Dark cinematic theme with saffron accent
- Cmd+K search overlay (Fuse.js)
- Mobile navigation with safe area support

**SEO & Discoverability**
- Build-time prerendering via Puppeteer (all 4 routes get static HTML)
- Hydration detection (hydrateRoot vs createRoot)
- Per-route meta tags via react-helmet-async (title, description, OG, Twitter, canonical)
- JSON-LD structured data: WebApplication, Dataset (Google Dataset Search), BreadcrumbList
- robots.txt welcoming all bots including AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- sitemap.xml with all routes + downloadable JSON datasets
- llms.txt for AI model discoverability
- Noscript fallback with real budget content
- vercel.json with cache headers, security headers, CORS for data files

**Performance**
- Vendor chunk splitting: react-vendor (16KB gz), d3-vendor (8KB gz), motion-vendor (41KB gz)
- Self-hosted Inter + JetBrains Mono fonts (eliminated Google Fonts render-blocking)
- Replaced gsap with vanilla requestAnimationFrame (saved 27KB gzip)
- Total JS: ~150KB gzip

### Known Issues
- Choropleth map uses approximate hardcoded SVG paths instead of real TopoJSON geometry
- UI needs significant design polish — layout alignment, visual hierarchy, spacing, and overall cohesion
- Homepage prerender shows React #418 hydration warnings (cosmetic, doesn't affect end users)
