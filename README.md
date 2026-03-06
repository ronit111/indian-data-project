# Indian Data Project

Open Indian government data, made accessible. 11 data domains presented as interactive visual stories with explorable breakdowns. Real data. No spin. Open source.

**Live:** [indiandataproject.org](https://indiandataproject.org)

---

## What It Does

India publishes vast amounts of government data — budgets, economic surveys, RBI reports, census figures, crime statistics, election results. But this data is buried in dense PDFs, broken APIs, and spreadsheets formatted for bureaucrats. Indian Data Project makes it accessible, visual, and engaging for regular citizens.

### Data Domains

| Domain | Route | Source |
|--------|-------|--------|
| Union Budget 2025-26 | `/budget` | Open Budgets India, indiabudget.gov.in |
| Economic Survey 2025-26 | `/economy` | MOSPI, World Bank, Economic Survey |
| RBI & Monetary Policy | `/rbi` | RBI Handbook, World Bank |
| State Finances | `/states` | RBI Handbook on Indian States |
| Census & Demographics | `/census` | Census 2011, NFHS-5, SRS, World Bank |
| Education | `/education` | UDISE+ 2023-24, ASER 2024, World Bank |
| Employment | `/employment` | PLFS 2023-24, RBI KLEMS, World Bank |
| Healthcare | `/healthcare` | NHP 2022, NFHS-5, World Bank |
| Environment | `/environment` | CPCB, MOEFCC, CEA, CWC, World Bank |
| Elections | `/elections` | ECI, TCPD Lok Dhaba, ADR/MyNeta |
| Crime & Safety | `/crime` | NCRB, MoRTH, BPRD, World Bank |

Each domain has a scrollytelling narrative, interactive explorer, methodology page, and glossary.

### Additional Features

- **11 cross-domain topics** weaving data across multiple domains into thematic narratives (`/topics`)
- **3 personalization calculators** — tax breakdown, EMI impact, cost-of-living deflator
- **State report card** — your state ranked across 28 metrics from 12 domains (`/states/your-state`)
- **161 citizen questions** searchable via Cmd+K ("Why are prices rising?", "How safe is my city?")
- **80 open JSON endpoints** — no API key, no rate limit, CORS enabled (`/open-data`)
- **Journalist toolkit** — chart gallery, story kits, embed builder (`/for-journalists`)
- **Teacher toolkit** — NCERT-mapped lesson plans with classroom mode (`/for-teachers`)
- **Cross-domain links** — contextual links between related sections across domains

---

## Tech Stack

React 19 · TypeScript · Vite 7 · Tailwind v4 · D3 (visualizations) · Framer Motion (animation) · Zustand (state) · Canvas API (share cards, SVG→PNG export)

Deployed on Vercel via GitHub push to `main`.

---

## Getting Started

```bash
npm install
npm run dev
```

### Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + Vite build + Puppeteer prerender (81 routes) |
| `npm run build:no-prerender` | Build without prerendering (used by Vercel) |
| `npm run preview` | Preview production build locally |

---

## Project Structure

```
src/
├── pages/              # Route-level components (story, explore, methodology, glossary per domain)
├── components/
│   ├── home/           # Budget story compositions
│   ├── {domain}/       # Domain-specific scrollytelling sections
│   ├── viz/            # D3 visualizations (LineChart, AreaChart, Choropleth, Sankey, Treemap, etc.)
│   ├── ui/             # Shared UI (SearchOverlay, RelatedTopics, CrossDomainLink, DomainCTA, etc.)
│   ├── share/          # Chart sharing (ChartActionsWrapper, ShareBottomSheet, SVG→PNG capture)
│   ├── embed/          # Standalone embed chart renderer
│   ├── calculator/     # Tax calculator
│   ├── emi/            # EMI impact calculator
│   ├── cost-of-living/ # CPI-based inflation calculator
│   └── report-card/    # Cross-domain state report card
├── lib/
│   ├── data/           # TypeScript schemas for all domain data
│   ├── registry/       # Central chart registry (per-domain)
│   ├── crossDomainLinks.ts  # Cross-domain link config
│   └── chartRegistry.ts     # Chart registry + sharing infrastructure
├── store/              # Zustand stores (per-domain + personalization)
├── hooks/              # Data loading hooks + scroll triggers
└── styles/             # Design tokens, classroom mode, animations

public/data/            # All JSON data files (80 endpoints across 11 domains)

pipeline/               # Python data pipelines
├── src/
│   ├── common/         # Shared clients (World Bank API, MOSPI API, RBI Handbook scraper)
│   └── {domain}/       # Per-domain pipeline (sources, validation, main script)
└── .github/workflows/  # 12 GitHub Actions (11 domain pipelines + freshness monitor)
```

---

## Data Sources

Every number traces to an authoritative primary source. Methodology pages for each domain document exactly where each number comes from, how it was processed, and what the limitations are.

**Automated sources (API-fetched):**
- [World Bank Open Data API](https://data.worldbank.org) — 30+ indicators across 7 domains
- [MOSPI eSankhyiki API](https://api.mospi.gov.in) — CPI, GDP, PLFS, WPI, IIP, Energy
- [RBI Handbook XLSX](https://www.rbi.org.in) — monetary policy, state finances, banking data
- [Open Budgets India / CKAN](https://openbudgetsindia.org) — Union Budget data

**Curated sources (manually updated):**
- [NCRB "Crime in India"](https://ncrb.gov.in), [NFHS-5](http://rchiips.org/nfhs/), [Census 2011](https://censusindia.gov.in), [UDISE+](https://udiseplus.gov.in), [ASER](https://asercentre.org), [ECI](https://eci.gov.in), [TCPD Lok Dhaba](https://lokdhaba.ashoka.edu.in), [ADR/MyNeta](https://myneta.info), [MoRTH](https://morth.nic.in), [CPCB](https://cpcb.nic.in), [CEA](https://cea.nic.in)

Data is published under the [Government Open Data License — India](https://data.gov.in/government-open-data-license-india).

---

## Design Philosophy

See [BRAND.md](./BRAND.md) for the full visual identity guide.

- **Data IS the design** — visualizations paint directly onto the background, no card wrappers
- **IIB-inspired palettes** — 2-3 intentional colors per composition
- **Dark cinematic theme** — deep navy-black with saffron, gold, and cyan accents
- **Creative viz first** — unconventional approaches over standard bar charts

---

## Contributing

Contributions are welcome — whether you're a developer, designer, data journalist, or educator.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run build` to verify everything compiles
5. Submit a pull request

For major changes, please open an issue first to discuss the approach.

---

## License

**GNU Affero General Public License v3.0 (AGPL-3.0)**

You can freely use, modify, and distribute this code. If you run a modified version as a web service, you must share your source code. All derivative works must use the same license.

AGPL ensures this civic infrastructure stays open — if someone builds on it, they must contribute their improvements back to the community.

---

## Acknowledgments

Built with data from: [Open Budgets India](https://openbudgetsindia.org) · [MOSPI](https://mospi.gov.in) · [RBI](https://www.rbi.org.in) · [Census of India](https://censusindia.gov.in) · [NFHS-5](http://rchiips.org/nfhs/) · [UDISE+](https://udiseplus.gov.in) · [ASER](https://asercentre.org) · [NCRB](https://ncrb.gov.in) · [ECI](https://eci.gov.in) · [TCPD](https://lokdhaba.ashoka.edu.in) · [ADR](https://myneta.info) · [CPCB](https://cpcb.nic.in) · [World Bank](https://data.worldbank.org)

Design inspired by [Information is Beautiful](https://informationisbeautiful.net) and [Visual Cinnamon](https://www.visualcinnamon.com).

Built with React, D3, Framer Motion, and Tailwind CSS.
