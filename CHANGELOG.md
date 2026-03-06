# Changelog

All notable changes to the Indian Data Project.

## [0.22.0] - 2026-03-06

### Narrative Arc Overhaul

- Restructured all 11 domain pages with deliberate top-down narrative arcs (outlines first, then code)
- Budget: inverted section order — per-capita (₹96/day) opens, traces backward to revenue, forward to spending
- RBI: complete rebuild — cause-chain from repo rate to rupee, all jargon translated for citizens
- Economy: contradiction hook ("GDP crossed ₹300L Cr. Your salary didn't notice.")
- Education: triumph-first arc (enrollment success → ASER learning crisis)
- All 68 NarrativeBridge texts rewritten with forward momentum and causal logic
- KeyTakeaway pill labels rewritten for citizen clarity across all domains
- Merged urban-rural topic into Regional Inequality (Beat 3: city-village access gap)
- Expanded Democratic Health topic with Budget accountability gap (Beat 3)
- Added "coal generates 70%+ of actual electricity" caveat to all energy capacity references
- Topic roster: 12 → 11 (urban-rural merged, not removed — content preserved)
- Fixed NarrativeBridge highlight keys (multi-word → single-word, lowercase)
- Zero data or chart changes — narrative text only

## [0.21.2] - 2026-03-05

### Bug Fix

- Fixed "Top state GSDP" stat pill on Regional Inequality topic showing "₹0.0L Cr" instead of "₹35.3L Cr" — `topGsdpValue` was being divided by 100,000 despite already being in lakh crore units

## [0.21.1] - 2026-03-05

### Data Accuracy Audit

- Verified all 11 domain curated data constants against authoritative government publications
- Fixed 15 wrong values across 6 domains (Elections, Employment, Education, Healthcare, Environment, Crime)
- Rebuilt all 27 ASER 2024 state entries from PDF (47 of 50 previous values were AI-fabricated)
- Rebuilt all 30 NFHS-5 immunization state entries from machine-readable dataset (21 had errors >5pp)
- Rebuilt all 32 UDISE+ 2023-24 state entries from PDF tables
- Fixed Elections alliance totals: NDA 284→293, INDIA 221→234, Others 38→16 (17 missing parties added)
- Fixed Employment: youth unemployment 12.8→10.2%, self-employed 52.4→58.4%, female LFPR 35.2→34.9%
- Fixed Environment: Mizoram forest change sign reversal (-186→+242 km²)
- Added `curated_validator.py` — automated cross-checks for curated data (run after every edit)
- Added `CURATED_DATA_AUDIT.md` documenting all findings, fixes, and prevention guidelines

## [0.21.0] - 2026-03-04

### Cross-Domain Linking & Copy Audit

- Added `CrossDomainLink` component — contextual domain-to-domain link pills at the bottom of 26 scrollytelling sections (17 connection pairs across all 11 domains)
- Unified 10 domain-specific CTA files into a single `DomainCTA` component with "Related Stories" cross-domain cards
- Created central cross-domain link config (`crossDomainLinks.ts`) with 34 directional entries
- Fixed stale copy: endpoint count (71→80), domain count (10→11), question count (136→161) across 8 files
- Fixed classroom mode toggle — now scales root font-size (16px→19px) affecting all rem-based Tailwind classes, plus higher contrast text colors for projector readability

## [0.20.0] - 2026-03-04

### Data Completeness Pass

- Filled empty explorer tabs across healthcare and employment domains
- Added ₹19/day per-capita health spending hero stat (USD→INR conversion via RBI forex data)
- Added "no indicators" fallback state to all 10 explorer pages
- 13 new citizen questions (148→161 total)

## [0.19.0] - 2026-03-04

### LLM & Search Metadata Overhaul

- Rewrote `llms.txt`, meta descriptions, and hub copy to center the citizen problem (buried data → accessible stories)
- Updated all SEO metadata to reflect 11 domains, 161 questions, 80 endpoints

## [0.18.0] - 2026-03-04

### Citizen QA Pass

- 15 jargon rewrites across all domains for plain-language accessibility
- 2 new narrative bridges connecting sections
- 3 UX fixes (layout, interaction, mobile)

## [0.17.0] - 2026-03-04

### Code-Level QA Audit

- Comprehensive Codex-driven audit across 73 files
- Fixed schema drift between pipeline Pydantic models and TypeScript interfaces
- Fixed embed renderer chart loading

## [0.16.0] - 2026-03-03

### Data Source Automation

- Integrated MOSPI eSankhyiki API (CPI, GDP, PLFS, WPI, IIP, Energy) and RBI Handbook XLSX scraper
- Automation coverage improved from ~45% to ~65% across 11 domains
- Shared pipeline infrastructure: `world_bank.py`, `mospi_client.py`, `rbi_handbook.py`

## [0.15.0] - 2026-03-03

### Crime & Safety Domain

- 11th data domain: IPC crimes overview, crimes against women, road accidents, cybercrime, police infrastructure, justice pipeline
- New `FunnelChart` visualization for justice pipeline (FIR → chargesheet → conviction)
- Crimson (#DC2626) accent palette
- Full pipeline, explorer, methodology, glossary, 13 citizen questions

## [0.14.0] - 2026-03-02

### Performance & Accessibility

- Route-level lazy loading — 59% bundle size reduction
- Service worker with offline fallback
- ARIA labels on all SVG visualizations
- Keyboard navigation for all interactive elements

## [0.13.0] - 2026-03-02

### Design & Visualization Overhaul

- Typography: Source Sans 3 Variable (body) + JetBrains Mono (data)
- 6 new viz components: GenericChoropleth, DotStrip, ScatterChart, BumpChart, SmallMultiples, BulletChart
- Brand consistency pass across all 10 domains

## [0.12.0] - 2026-03-02

### Multiplier Infrastructure

- `/open-data` — 80 JSON endpoints with code examples and live preview
- `/for-journalists` — chart gallery (92 charts), 6 story kits, embed builder
- `/for-teachers` — 8 NCERT-mapped lesson plans, classroom mode
- `/contribute` — contributor guide

## [0.11.0] - 2026-03-02

### Cross-Domain Topics

- 12 curated topics composing data across multiple domains (later reduced to 11 — urban-rural merged into regional-inequality in v0.22.0) (Women in India, Fiscal Health, Water Crisis, etc.)
- Config-driven architecture with `TopicDef`, `extractData`, `useTopicData`
- `RelatedTopics` pills wired into 28 section components

## [0.10.0] - 2026-03-02

### Environment & Elections Domains

- Environment: CPCB air quality, FSI forest cover, CEA energy mix, CWC water resources (teal accent)
- Elections: Lok Sabha 1962-2024 turnout, party landscape, ADR candidate profiles (indigo accent)

## [0.9.0] - 2026-03-01

### Key Insights & Question-First Search

- "Key Takeaways" stat pill strips on all story pages
- 136 curated citizen questions with Cmd+K search integration

## [0.8.0] - 2026-03-01

### Personalization Engine

- EMI impact calculator, cost-of-living deflator, cross-domain state report card
- Persistent user context (state, household) via Zustand + localStorage
- CPI-by-COICOP-division data (MOSPI API + IMF/DBnomics + curated fallback)

## [0.7.0] - 2026-03-01

### Chart Sharing Infrastructure

- ChartActionsWrapper on every chart (PNG download, CSV export, permalink, embed code)
- SVG→Canvas→PNG capture pipeline
- WhatsApp-optimized share cards
- Central chart registry with ~92 entries

## [0.6.0] - 2026-02-28

### Historical Data & Depth

- Budget 20-year trends (FY 2005-06 to 2025-26)
- Budget vs Actual tracker (10 ministries, 7 fiscal years)
- Extended World Bank data to year 2000

## [0.5.0] - 2026-02-28

### Education, Employment & Healthcare Domains

- 3 new domains with scrollytelling, explorers, methodology, glossaries
- 3 automated GitHub Actions pipelines

## [0.4.0] - 2026-02-27

### State Finances & Census Domains

- State Finances: GSDP, revenue, fiscal health across 31 states/UTs
- Census & Demographics: population, age structure, health, literacy, urbanization
- Custom viz: AgeWaffle, GenderGapChart, IMR gradient bars

## [0.3.0] - 2026-02-26

### RBI Data Domain & Polish

- RBI monetary policy, forex, credit data with scrollytelling + explorer
- Per-domain glossary pages, floating feedback button, Cmd+K search expansion
- Data accuracy overhaul — truth-verified all figures against authoritative sources

## [0.2.0] - 2026-02-25

### Economic Survey Domain

- Economic Survey 2025-26 scrollytelling (GDP, inflation, trade, sectors, fiscal, outlook)
- New viz components: LineChart, AreaChart, HorizontalBarChart
- Automated data pipeline (7 structured JSON datasets)

## [0.1.0] - 2026-02-24

### Initial Release — Union Budget 2025-26

- Hub homepage with data domain portal
- Budget scrollytelling: revenue waffle, expenditure treemap, Sankey flow, state choropleth
- Tax calculator with Old/New regime and deductions
- Ministry-wise data explorer with CSV export
- Full SEO layer: prerendering, structured data, sitemap, OG tags
