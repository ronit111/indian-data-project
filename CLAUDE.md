# Indian Data Project — Contributor Guide

Instructions for AI assistants and human contributors working on this codebase.

## Stack

React 19 + TypeScript + Vite 7 + Tailwind v4. Zustand (state), Framer Motion (animation), D3 (visualizations), Canvas API (share cards + SVG→PNG export). Deployed on Vercel via GitHub push to `main`.

## Architecture

**Hub + 11 data domains.** Each domain follows the same pattern:
- **Story page** (`/{domain}`) — scrollytelling narrative with scroll-triggered sections
- **Explorer** (`/{domain}/explore`) — interactive indicator table with category filters
- **Methodology** (`/{domain}/methodology`) — data sources, computation methods, limitations
- **Glossary** (`/{domain}/glossary`) — plain-language term definitions

Additional routes: `/topics` (12 cross-domain narratives), `/open-data` (80 JSON endpoints), `/for-journalists` (chart gallery, story kits, embed builder), `/for-teachers` (lesson plans, classroom mode), `/contribute`, `/embed/{domain}/{section}` (standalone charts for iframes).

**Header is context-aware**: hub title on `/`, domain title + sub-nav tabs inside domains, section titles on multiplier pages. Back links point to `/#stories`.

## Key Patterns

### Adding a New Section
Every scrollytelling section follows this structure:
```tsx
useScrollTrigger → SectionNumber → title/annotation → viz → RelatedTopics → CrossDomainLink → source attribution
```

### Chart Sharing
`ChartActionsWrapper` wraps every chart. Desktop: hover overlay with 4 actions (PNG, CSV, permalink, embed). Mobile: persistent share button → `ShareBottomSheet`. Chart registry in `src/lib/registry/{domain}.ts`.

### Cross-Domain Links
`CrossDomainLink` component renders 1-2 contextual pills linking to related sections in other domains. Config in `src/lib/crossDomainLinks.ts`. `DomainCTA` at the bottom of each domain includes "Related Stories" cards.

### Personalization
`personalizationStore.ts` (Zustand + localStorage) holds state ID, household size. State IDs use uppercase vehicle registration (RTO) codes — three differ from ISO: Odisha=OD, Chhattisgarh=CG, Telangana=TS. Mapping in `src/lib/stateMapping.ts`.

### Data Loading
Hub loads only `summary.json` per domain. Story pages load full datasets via domain-specific Zustand hooks. Topics use `Promise.allSettled` for cross-domain data.

## Data Integrity — Non-Negotiable

- **NEVER create mock, fake, placeholder, or hardcoded data.** Every number must trace to an authoritative source.
- All derived values computed at runtime from source data, never hardcoded.
- If data doesn't exist for a feature, the feature waits.

## Data Pipelines

12 GitHub Actions workflows (11 domains + freshness monitor). Shared infrastructure in `pipeline/src/common/`:
- `world_bank.py` — retry with backoff, shared by 7 pipelines
- `mospi_client.py` — paginated fetcher for MOSPI eSankhyiki API (CPI, GDP, PLFS, WPI, IIP, Energy, ASI). No auth required.
- `rbi_handbook.py` — XLSX scraper for both RBI Handbooks (Indian Economy + Indian States). Anti-bot bypass via browser-like headers.

**Pipeline schedules:**
| Domain | Cron | Primary Source |
|--------|------|----------------|
| Budget | Daily + Budget Day polling | CKAN API |
| Economy | Quarterly (Feb/Mar/Jun/Dec) | MOSPI APIs + World Bank |
| RBI | Bi-monthly (MPC schedule) | RBI Handbook XLSX + World Bank |
| States | Semi-annual (Jan/Jul) | RBI Handbook on Indian States |
| Census, Education, Healthcare, Environment | Quarterly | World Bank + curated government data |
| Employment | Quarterly (PLFS schedule) | MOSPI PLFS API + World Bank |
| Elections, Crime | Semi-annual (Jan/Jul) | Purely curated (event-driven data) |

Curated data (NFHS-5, Census 2011, MPC decisions, etc.) requires human updates when publications drop. Freshness monitor creates GitHub issues for stale data. See `pipeline/PIPELINE_DATA_SOURCES.md` for the full catalog of 30+ curated data constants.

**CPI sourcing** (3-tier): MOSPI eSankhyiki API (primary, live) → IMF/DBnomics (historical baseline 2014-19) → curated fallback. Category-specific COICOP CPI where available (Food, Housing, Health, Transport, Education).

## Design Identity

See [BRAND.md](./BRAND.md) for the full guide.

- Dark theme: void `#06080f` / raised `#0e1420` / surface `#131b27`
- Domain accents: saffron, cyan, gold, teal, indigo, crimson, emerald, violet, blue, amber, rose
- Typography: Source Sans 3 (body), JetBrains Mono (data)
- Principle: **Data IS the design** — no card wrappers, no decorative chrome

## Common Pitfalls

- **Empty series**: Filter `.filter(s => s.data.length > 0)` before passing to chart components. Phantom legends otherwise.
- **Sparse data**: Hide series with < 3 data points. Update narrative text to match what's visible.
- **Framer Motion**: Never set animated properties in both `style` and `initial`/`animate`.
- **Flexbox + absolute children**: `items-end` with absolutely-positioned children = 0 content height.
- **Treemap**: Never use `hierarchy.leaves()`. Show one level at a time via `hierarchy.children`.
- **Sankey**: `nodePadding` below 20 causes label overlap. Hide value text for nodes < 20px.
- **Mobile nav**: Fixed bottom h-14. Content needs `pb-16 md:pb-0`.
- **HorizontalBarChart**: `formatValue` + `unit` are concatenated. Set `unit=""` if `formatValue` returns a complete string.
- **Sticky headers**: `overflow-x-auto` breaks `position: sticky`. Use `overflow-x: clip`.

## New Domain Checklist

1. **Pipeline**: Authoritative source, Pydantic schemas matching TypeScript, cross-check key figures
2. **TypeScript**: Interfaces in `schema.ts`, loader in `dataLoader.ts`, Zustand store, data hook
3. **Routing**: `App.tsx` routes, Header detection + tabs, MobileNav tabs, Footer attribution
4. **Hub**: Domain card with mini-viz + stat pills, loads only `summary.json`
5. **Story page**: Scroll-triggered sections with narrative bridges, `DomainCTA` at bottom
6. **Sub-pages**: Explorer (category filters), Methodology, Glossary (`glossary.json` + wrapper page)
7. **Chart sharing**: Registry entries, `ChartActionsWrapper` on every chart, embed routes
8. **Cross-domain**: `CrossDomainLink` config entries, `RelatedTopics` pills, topic integration
9. **SEO**: `prerender.mjs` routes, `sitemap.xml`, `llms.txt`, noscript fallback, OG image, JSON-LD
10. **Browser QA**: Hub card, all story sections, explorer, methodology, glossary, mobile, search

## QA Protocol

**"Build passing" is NOT a product check.** After any visual/interaction change:
1. Browser-verify the changed page (navigate, interact, screenshot)
2. Check mobile layout
3. Full sanity = build + browser inspection + interaction test
