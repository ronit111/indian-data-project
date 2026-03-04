# Indian Data Project

Open Indian government data made accessible, visual, and shareable. Ten data domains live: Union Budget 2025-26, Economic Survey 2025-26, RBI Data, State Finances, Census & Demographics, Education, Employment, Healthcare, Environment, and Elections. Each gets its own visual story with explorable breakdowns. Three personalization calculators let citizens see how national data applies to their own lives.

**Live:** [indiandataproject.org](https://indiandataproject.org)

---

## What It Does

Indian Data Project turns dense government data into interactive visual experiences. The site is a hub — each data domain gets its own self-contained visual story with explorable breakdowns.

**Hub + 10 data domains + 3 personalization calculators:**

| Page | What it shows |
|------|---------------|
| **Hub** (`/`) | Visual portal — project mission, data domain cards with live stats, gateway to all datasets |
| **Budget Story** (`/budget`) | Scrollytelling narrative — 9 compositions: animated headline, revenue waffle chart, deficit rupee bar, 20-year trends (expenditure vs receipts + deficit % GDP), budget vs actual deviation chart, expenditure treemap, Sankey money flow, state choropleth, per-capita breakdown |
| **Budget Explorer** (`/budget/explore`) | Sortable ministry-level expenditure table with expandable scheme detail, CSV export |
| **Tax Calculator** (`/budget/calculator`) | Personal tax breakdown for FY 2025-26 — Old/New regime with deductions (80C, 80D, HRA, 24b, NPS), spending allocation per ministry, shareable image card |
| **Budget Methodology** (`/budget/methodology`) | Data sources, computation methods, formatting conventions, limitations |
| **Economy Story** (`/economy`) | Scrollytelling visual breakdown — GDP growth trends, inflation tracking (CPI/WPI), trade balance area chart, fiscal position, sectoral composition |
| **Economy Explorer** (`/economy/explore`) | Searchable table of economic indicators with year-over-year comparisons |
| **Economy Methodology** (`/economy/methodology`) | Data sources, indicator definitions, survey methodology, limitations |
| **RBI Story** (`/rbi`) | Scrollytelling narrative — repo rate hero, monetary policy trajectory, inflation targeting vs 4% mandate, M3 money supply, credit expansion, forex reserves, exchange rate |
| **RBI Explorer** (`/rbi/explore`) | Indicator explorer with 4 categories (monetary, liquidity, credit, external), interactive line charts |
| **RBI Methodology** (`/rbi/methodology`) | Data sources (DBIE, World Bank, MPC press releases), indicator definitions, WB codes |
| **Budget Glossary** (`/budget/glossary`) | 13 budget terms explained in plain language — fiscal deficit, revenue deficit, cess, devolution, crore/lakh, etc. |
| **Economy Glossary** (`/economy/glossary`) | 15 economic terms — GDP, inflation, CPI, trade deficit, FDI, sectoral composition, advance estimates, etc. |
| **RBI Glossary** (`/rbi/glossary`) | 12 monetary policy terms — repo rate, CRR, SLR, MPC, inflation targeting, forex reserves, basis points, etc. |
| **States Story** (`/states`) | Scrollytelling narrative — GSDP landscape, growth leaders, revenue self-sufficiency (own tax vs central transfers), fiscal health (debt-to-GSDP with FRBM 3% line), per capita GSDP |
| **States Explorer** (`/states/explore`) | Indicator explorer with 4 categories (GSDP, Revenue, Fiscal, Per Capita), `HorizontalBarChart` per indicator |
| **States Methodology** (`/states/methodology`) | Data sources (RBI Handbook, Finance Commission), indicator definitions, data freshness, limitations |
| **States Glossary** (`/states/glossary`) | 12 state finance terms — GSDP, per capita income, own tax revenue, central transfers, devolution, FRBM Act, debt-to-GSDP, etc. |
| **Census Story** (`/census`) | Scrollytelling narrative — population growth, age structure waffle, vital statistics (birth/death/fertility/life expectancy), health outcomes (IMR + NFHS-5), literacy gender gap butterfly chart, urbanization |
| **Census Explorer** (`/census/explore`) | Indicator explorer with 5 categories (All, Population, Demographics, Literacy, Health), `HorizontalBarChart` per indicator |
| **Census Methodology** (`/census/methodology`) | Data sources (Census 2011, World Bank, NFHS-5, SRS 2023, NPC), multi-vintage strategy, limitations |
| **Census Glossary** (`/census/glossary`) | Demographic terms — census, decadal growth, sex ratio, dependency ratio, IMR, TFR, literacy rate, urbanization, etc. |
| **Education Story** (`/education`) | Scrollytelling narrative — enrollment triumph (GER trends), gender convergence, dropout cliff, learning quality gap (ASER), teacher challenge (PTR), spending vs global peers |
| **Education Explorer** (`/education/explore`) | Indicator explorer with 5 categories (All, Enrollment, Quality, Infrastructure, Spending), 36 states |
| **Education Methodology** (`/education/methodology`) | Data sources (UDISE+ 2023-24, ASER 2024, World Bank), indicator definitions, limitations |
| **Education Glossary** (`/education/glossary`) | 14 education terms — GER, dropout rate, PTR, ASER, UDISE, NEP 2020, foundational literacy, RTE Act, etc. |
| **Employment Story** (`/employment`) | Scrollytelling narrative — participation puzzle (LFPR trends), structural shift, youth unemployment, gender gap, informality challenge, rural vs urban |
| **Employment Explorer** (`/employment/explore`) | Indicator explorer with 5 categories (All, Unemployment, Participation, Sectoral, Informality), 30 states |
| **Employment Methodology** (`/employment/methodology`) | Data sources (PLFS 2023-24, RBI KLEMS, World Bank), indicator definitions, limitations |
| **Employment Glossary** (`/employment/glossary`) | 15 employment terms — LFPR, PLFS, gig economy, structural transformation, informal sector, etc. |
| **Healthcare Story** (`/healthcare`) | Scrollytelling narrative — infrastructure deficit, spending story, out-of-pocket burden, immunization push, disease burden, doctor gap |
| **Healthcare Explorer** (`/healthcare/explore`) | Indicator explorer with 5 categories (All, Infrastructure, Spending, Immunization, Disease), 30 states |
| **Healthcare Methodology** (`/healthcare/methodology`) | Data sources (NHP 2022, NFHS-5, World Bank), indicator definitions, limitations |
| **Healthcare Glossary** (`/healthcare/glossary`) | 13 healthcare terms — PHC, CHC, out-of-pocket spending, immunization, TB incidence, hospital beds per 1000, etc. |
| **Environment Story** (`/environment`) | Air quality, forest cover, energy transition, carbon footprint, water stress scrollytelling |
| **Environment Explorer** (`/environment/explore`) | State-level environment indicators (AQI, forest, water) |
| **Environment Methodology** (`/environment/methodology`) | Data sources and limitations |
| **Environment Glossary** (`/environment/glossary`) | 15 environment terms explained |
| **Elections Story** (`/elections`) | World's largest democracy — turnout trends 1962-2024, party landscape evolution, Lok Sabha 2024 hemicycle, money & muscle in politics, women in Parliament |
| **Elections Explorer** (`/elections/explore`) | State-level election indicators (turnout, representation, candidates) |
| **Elections Methodology** (`/elections/methodology`) | Data sources (ECI, TCPD, ADR) and limitations |
| **Elections Glossary** (`/elections/glossary`) | 15 election terms explained |
| **EMI Calculator** (`/rbi/calculator`) | How repo rate changes affect your EMI — choose home/car/personal loan, set amount and tenure, see monthly EMI + rate impact scenarios at ±25/50 bps. Reads live repo rate from RBI data. |
| **Cost-of-Living Calculator** (`/economy/calculator`) | How inflation has changed what your money buys — input monthly expenses by category, compare against any year from 2014+. Uses category-specific CPI (food, housing, transport, education, health) where available, headline CPI fallback otherwise. |
| **State Report Card** (`/states/your-state`) | Your state's performance across 8 domains — 11 panels with ~25 metrics (GSDP, budget, revenue, fiscal health, demographics, education, employment, healthcare, environment, elections). Ranks, quartile badges, and national average comparison. |
| **Embed Charts** (`/embed/{domain}/{section}`) | Standalone responsive chart pages for iframe embedding — minimal chrome, lazy-loaded charts, ~54 sections available |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (CSS Layers) |
| State | Zustand |
| Visualizations | D3.js (layout) + React (rendering) — waffle, treemap, sankey, choropleth, line, area, step charts |
| Chart Export | Canvas 2D API (SVG→PNG capture, WhatsApp share cards) — zero external dependencies |
| Animation | Framer Motion |
| Search | Fuse.js (Cmd+K overlay) |
| i18n | react-i18next (infrastructure preserved but unwired — relying on browser auto-translate) |
| SEO | react-helmet-async + Puppeteer prerendering |
| Hosting | Vercel |

---

## Getting Started

```bash
# Clone
git clone https://github.com/ronit111/indian-data-project.git
cd indian-data-project

# Install
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build (includes prerendering)
npm run build

# Preview production build
npm run preview
```

### Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + Vite build + Puppeteer prerender (76 routes: 66 pages + 10 embed) |
| `npm run build:no-prerender` | Build without prerendering (used by Vercel) |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build locally |

---

## Project Structure

```
src/
├── pages/                  # Route-level components
│   ├── HubPage.tsx          # Visual portal — data domain showcase
│   ├── BudgetPage.tsx       # Budget scrollytelling with 7 composition sections
│   ├── ExplorePage.tsx      # Ministry-wise data table
│   ├── FindYourSharePage.tsx # Tax calculator
│   ├── MethodologyPage.tsx  # Budget methodology
│   ├── EconomyPage.tsx      # Economy scrollytelling (GDP, inflation, trade, sectors)
│   ├── EconomyExplorePage.tsx # Economy indicators table
│   ├── EconomyMethodologyPage.tsx # Economy methodology
│   ├── RBIPage.tsx          # RBI scrollytelling (monetary policy, forex, credit)
│   ├── RBIExplorePage.tsx   # RBI indicator explorer with category filters
│   ├── RBIMethodologyPage.tsx # RBI methodology
│   ├── StatesPage.tsx        # States scrollytelling (GSDP, revenue, fiscal health)
│   ├── StatesExplorePage.tsx  # States indicator explorer with category filters
│   ├── StatesMethodologyPage.tsx # States methodology
│   ├── CensusPage.tsx          # Census scrollytelling (population, age, health, literacy, urbanization)
│   ├── CensusExplorePage.tsx   # Census indicator explorer with category filters
│   ├── CensusMethodologyPage.tsx # Census methodology
│   ├── EducationPage.tsx        # Education scrollytelling (enrollment, quality, spending)
│   ├── EducationExplorePage.tsx  # Education indicator explorer
│   ├── EducationMethodologyPage.tsx # Education methodology
│   ├── EmploymentPage.tsx       # Employment scrollytelling (LFPR, sectoral, informality)
│   ├── EmploymentExplorePage.tsx # Employment indicator explorer
│   ├── EmploymentMethodologyPage.tsx # Employment methodology
│   ├── HealthcarePage.tsx       # Healthcare scrollytelling (infrastructure, spending, disease)
│   ├── HealthcareExplorePage.tsx # Healthcare indicator explorer
│   ├── HealthcareMethodologyPage.tsx # Healthcare methodology
│   ├── EnvironmentPage.tsx       # Environment scrollytelling (air quality, forest, energy, water, carbon)
│   ├── EnvironmentExplorePage.tsx # Environment indicator explorer
│   ├── EnvironmentMethodologyPage.tsx # Environment methodology
│   ├── ElectionsPage.tsx        # Elections scrollytelling (turnout, parties, Lok Sabha 2024, money & muscle, women)
│   ├── ElectionsExplorePage.tsx  # Elections indicator explorer
│   ├── ElectionsMethodologyPage.tsx # Elections methodology
│   ├── GlossaryPage.tsx      # Shared glossary component (parameterized by domain)
│   ├── BudgetGlossaryPage.tsx # Budget glossary wrapper
│   ├── EconomyGlossaryPage.tsx # Economy glossary wrapper
│   ├── RBIGlossaryPage.tsx   # RBI glossary wrapper
│   ├── StatesGlossaryPage.tsx # States glossary wrapper
│   ├── CensusGlossaryPage.tsx # Census glossary wrapper
│   ├── EducationGlossaryPage.tsx # Education glossary wrapper
│   ├── EmploymentGlossaryPage.tsx # Employment glossary wrapper
│   ├── HealthcareGlossaryPage.tsx # Healthcare glossary wrapper
│   ├── EnvironmentGlossaryPage.tsx # Environment glossary wrapper
│   ├── ElectionsGlossaryPage.tsx # Elections glossary wrapper
│   ├── EMICalculatorPage.tsx    # EMI impact calculator (repo rate → monthly payment)
│   ├── CostOfLivingPage.tsx     # Cost-of-living inflation calculator (CPI by category)
│   ├── StateReportCardPage.tsx  # Cross-domain state report card (8 domains, ~25 metrics)
│   ├── TopicsPage.tsx         # Cross-domain topics hub (12 curated topic cards)
│   ├── TopicDetailPage.tsx    # Individual topic detail (/topics/:topicId)
│   ├── OpenDataPage.tsx       # Open Data API documentation (71 endpoints, code examples)
│   ├── JournalistsPage.tsx    # Journalist toolkit landing (gallery, story kits, embed builder)
│   ├── ChartGalleryPage.tsx   # Filterable chart gallery (92 charts, domain/type filters)
│   ├── StoryKitsPage.tsx      # 6 curated story kits with editorial context
│   ├── EmbedBuilderPage.tsx   # Interactive embed builder with live iframe preview
│   ├── TeachersPage.tsx       # Teacher toolkit landing (lesson plans, classroom mode)
│   ├── LessonPlansPage.tsx    # 7 NCERT-mapped lesson plans (Class 10-12)
│   ├── ContributePage.tsx     # Contributor guide (data usage, issues, code, datasets)
│   └── EmbedPage.tsx          # Standalone embed chart (reads :domain/:section params, renders outside PageShell)
├── components/
│   ├── home/               # Budget story compositions (Hero, Revenue, Expenditure, Flow, Map, CTA)
│   ├── budget/             # Budget-specific compositions (DeficitSection, TrendsSection, BudgetVsActualSection, PerCapitaSection)
│   ├── economy/            # Economy compositions (GrowthSection, InflationSection, TradeSection, etc.)
│   ├── rbi/                # RBI compositions (HeroSection, MonetaryPolicySection, ForexSection, etc.)
│   ├── states/             # States compositions (GSDPSection, GrowthSection, RevenueSection, FiscalHealthSection, PerCapitaSection)
│   ├── census/             # Census compositions (PopulationSection, AgeDemographicsSection, VitalStatsSection, HealthSection, LiteracySection, UrbanizationSection)
│   ├── education/           # Education compositions (EnrollmentSection, GenderSection, DropoutSection, QualitySection, TeacherSection, SpendingSection)
│   ├── employment/          # Employment compositions (ParticipationSection, StructuralSection, YouthSection, GenderGapSection, InformalitySection, RuralUrbanSection)
│   ├── healthcare/          # Healthcare compositions (InfrastructureSection, SpendingSection, OOPSection, ImmunizationSection, DiseaseSection, DoctorGapSection)
│   ├── environment/          # Environment compositions (AirQualitySection, ForestSection, EnergySection, WaterSection, CarbonSection)
│   ├── elections/            # Elections compositions (TurnoutSection, PartyLandscapeSection, LokSabha2024Section, MoneyMuscleSection, GenderGapSection)
│   ├── personalization/     # Personalization components (StateSelector dropdown, PersonalizationBanner)
│   ├── emi/                 # EMI calculator components (EMIInputPanel, EMIBreakdownDisplay, RateImpactViz)
│   ├── cost-of-living/      # Cost-of-living components (ExpenseInput, InflationImpactDisplay)
│   ├── report-card/         # State report card components (ReportCardGrid, DomainPanel, MetricRow)
│   ├── calculator/         # Tax calculator UI (IncomeInput, DeductionsPanel, TaxBreakdown, ShareCard, SpendingAllocation)
│   ├── explore/            # DataTable with expandable rows
│   ├── viz/                # D3 visualizations (TreemapChart, SankeyDiagram, ChoroplethMap, WaffleChart, LineChart, AreaChart, HorizontalBarChart, StepChart, AnimatedCounter)
│   ├── share/              # Chart sharing (ChartActions toolbar, ChartActionsWrapper overlay, ShareBottomSheet for mobile)
│   ├── embed/              # Embed components (EmbedShell minimal chrome, ChartRenderer lazy chart loader)
│   ├── multiplier/          # Multiplier infrastructure (CodeBlock, ChartGalleryCard, DataEndpointRow, EmbedConfigurator, StoryKitCard, LessonPlanCard, CitationPopover, ClassroomModeToggle)
│   ├── topics/              # Cross-domain topic components (TopicCard, TopicHero, TopicSection, RelatedTopics)
│   ├── ui/                 # Shared UI (Tooltip, NarrativeBridge, SearchOverlay, KeyTakeaways, FeedbackButton, Skeleton, etc.)
│   ├── layout/             # Header, Footer, MobileNav, PageShell
│   ├── seo/                # SEOHead (per-route meta tags + OG images + JSON-LD)
│   └── i18n/               # Language provider and switcher
├── lib/
│   ├── data/schema.ts      # TypeScript interfaces for all data shapes (Budget, Economy, RBI, States, Census, Education, Employment, Healthcare, Environment, Elections)
│   ├── chartRegistry.ts    # Central chart registry (~92 entries, CSV/share card serialization, domain metadata)
│   ├── registry/           # Per-domain chart registrations (budget, economy, rbi, states, census, education, employment, healthcare, environment, elections, topics)
│   ├── multiplierTypes.ts  # Types for multiplier infrastructure (DataEndpoint, StoryKitDef, LessonPlanDef, etc.)
│   ├── dataEndpoints.ts    # Static catalog of all 71 JSON endpoints
│   ├── citationGenerator.ts # APA/Chicago/plain text citation formatter
│   ├── storyKitConfigs/    # 6 curated story kit definitions
│   ├── lessonPlanConfigs/  # 7 NCERT-mapped lesson plan definitions
│   ├── topicConfigs/       # 12 cross-domain topic configurations
│   ├── topicConfig.ts      # Topic types and domain data map
│   ├── svgCapture.ts       # SVG→Canvas→PNG capture pipeline (CSS var resolution, font embedding, compositing)
│   ├── shareCard.ts        # WhatsApp share card Canvas generator (1200×630, <100KB)
│   ├── csvExport.ts        # RFC 4180 CSV serialization
│   ├── taxEngine.ts        # Tax computation engine (Old/New regime, deductions, slabs)
│   ├── emiEngine.ts        # EMI calculation + rate impact scenarios (home/car/personal loans)
│   ├── costOfLivingEngine.ts # CPI-based inflation impact (category-specific COICOP CPI + fallback)
│   ├── stateReportEngine.ts # Cross-domain state data aggregation + rank computation
│   ├── format.ts           # Indian number formatting (lakhs/crores)
│   ├── dataLoader.ts       # Fetch + cache layer for JSON data (all domains)
│   ├── stateMapping.ts     # India state ID → name mapping
│   └── i18n.ts             # i18next configuration
├── hooks/                  # useScrollTrigger, useIntersection, useUrlState (URL↔Zustand sync), useBudgetData, useEconomyData, useRBIData, useStatesData, useCensusData, useEducationData, useEmploymentData, useHealthcareData, useEnvironmentData, useElectionsData, etc.
├── store/                  # Zustand stores (budgetStore, economyStore, rbiStore, statesStore, censusStore, educationStore, employmentStore, healthcareStore, environmentStore, electionsStore, calculatorStore, emiCalculatorStore, costOfLivingStore, personalizationStore, uiStore)
└── index.css               # Design tokens, CSS layers, keyframes

public/
├── data/budget/2025-26/    # 9 structured JSON budget datasets
├── data/economy/2025-26/   # 7 structured JSON economy datasets
├── data/rbi/2025-26/       # 6 structured JSON RBI datasets
├── data/states/2025-26/    # 6 structured JSON state finance datasets
├── data/census/2025-26/    # 7 structured JSON census & demographics datasets
├── data/education/2025-26/ # 6 structured JSON education datasets
├── data/employment/2025-26/ # 6 structured JSON employment datasets
├── data/healthcare/2025-26/ # 6 structured JSON healthcare datasets
├── data/environment/2025-26/ # 7 structured JSON environment datasets
├── data/elections/2025-26/  # 7 structured JSON elections datasets
├── data/emi/               # Curated loan spread data (SBI/HDFC rate cards)
├── data/questions.json     # 161 citizen questions across 11 domains (powers question-first search)
├── locales/en/             # Translation files
├── sitemap.xml             # All routes + data endpoints (76 pages + 54 data files)
├── robots.txt              # All bots welcomed (including AI crawlers)
└── llms.txt                # AI-readable site summary (10 domains)

pipeline/
├── src/
│   ├── main.py             # Budget pipeline (CKAN API → JSON)
│   ├── common/             # Shared pipeline utilities
│   │   └── world_bank.py   # World Bank API client (retry, backoff, error handling) — used by all 6 domain pipelines
│   ├── economy/            # Economy pipeline (World Bank API + MOSPI CPI API → JSON)
│   ├── rbi/                # RBI pipeline (World Bank + curated MPC data → JSON)
│   ├── states/             # States pipeline (curated RBI Handbook data → JSON)
│   ├── census/             # Census pipeline (World Bank API + curated Census/NFHS/SRS → JSON)
│   ├── education/          # Education pipeline (World Bank API + curated UDISE+/ASER → JSON)
│   ├── employment/         # Employment pipeline (World Bank API + curated PLFS/KLEMS → JSON)
│   ├── healthcare/         # Healthcare pipeline (World Bank API + curated NHP/NFHS-5 → JSON)
│   ├── environment/        # Environment pipeline (CPCB + MOEFCC + CEA + CWC → JSON)
│   ├── elections/          # Elections pipeline (ECI + TCPD + ADR → JSON)
│   └── publish/            # Shared JSON writer
├── PIPELINE_DATA_SOURCES.md # Catalog of all 30+ curated data constants across 10 domains
└── pyproject.toml          # Python dependencies
```

---

## Data

### Budget Data

Budget data lives in `public/data/budget/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline budget numbers (total expenditure, revenue, deficit) |
| `receipts.json` | Revenue breakdown by category |
| `expenditure.json` | Ministry-wise expenditure with sub-scheme detail |
| `sankey.json` | Revenue-to-expenditure flow links |
| `treemap.json` | Hierarchical expenditure for treemap visualization |
| `statewise.json` | State-wise budget allocations with per-capita figures |
| `schemes.json` | Major government scheme details |
| `trends.json` | 20-year historical budget trends (FY 2005-06 to 2025-26) |
| `budget-vs-actual.json` | Ministry-level BE/RE/Actual across 7 fiscal years |
| `glossary.json` | 13 budget terms with plain-language explanations |

### Economy Data

Economy data lives in `public/data/economy/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline economic indicators (GDP growth, inflation, deficit) |
| `gdp-growth.json` | Real and nominal GDP growth time series |
| `inflation.json` | CPI and WPI inflation data + CPI by COICOP division (Food, Housing, Health, Transport, Education) |
| `fiscal.json` | Fiscal deficit and government finance trends |
| `external.json` | Trade balance, exports, imports |
| `sectors.json` | Sectoral GDP composition (agriculture, industry, services) |
| `indicators.json` | Key economic indicators with year-over-year data |
| `glossary.json` | 15 economy terms with plain-language explanations |

### RBI Data

RBI data lives in `public/data/rbi/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline RBI numbers (repo rate, stance, CRR, forex, M3 growth) |
| `monetary-policy.json` | Repo rate decision history (30 decisions, 2014-2026), CRR time series |
| `liquidity.json` | Broad money (M3) growth and M3 as % of GDP |
| `credit.json` | Domestic and private credit (% of GDP), lending/deposit rates |
| `forex.json` | Forex reserves (US$) and INR/USD exchange rate |
| `indicators.json` | All RBI indicators across 4 categories (monetary, liquidity, credit, external) |
| `glossary.json` | 12 RBI terms with plain-language explanations |

### States Data

States data lives in `public/data/states/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline state finance numbers (top GSDP state, national total, growth range) |
| `gsdp.json` | 31 state entries: GSDP current/constant prices, growth rate, per capita + 3-year history for top 10 |
| `revenue.json` | 31 state entries: own tax revenue, central transfers, self-sufficiency ratio |
| `fiscal-health.json` | 31 state entries: fiscal deficit %, debt-to-GSDP |
| `indicators.json` | All state indicators across 4 categories |
| `glossary.json` | 12 state finance terms with plain-language explanations |

### Census & Demographics Data

Census data lives in `public/data/census/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline census numbers (population, literacy, sex ratio, urbanization) |
| `population.json` | State-wise population, density, urban/rural split, decadal growth, national time series |
| `demographics.json` | Age structure (young/working/elderly %), dependency ratio, vital stats (birth/death/fertility/life expectancy), urbanization trend |
| `literacy.json` | State-wise literacy by gender, national time series |
| `health.json` | IMR time series, state-level IMR, NFHS-5 state health (TFR, IMR, U5MR, stunting, wasting, immunization) |
| `indicators.json` | All census indicators across 4 categories |
| `glossary.json` | Demographic terms with plain-language explanations |

### Education Data

Education data lives in `public/data/education/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline education numbers (total students, GER, PTR, spending % GDP) |
| `enrollment.json` | National enrollment time series (primary/secondary/tertiary) + state GER from UDISE+ |
| `quality.json` | Pupil-teacher ratios, ASER learning outcomes, school infrastructure by state |
| `spending.json` | Education expenditure trends (% GDP, % govt spending) |
| `indicators.json` | All education indicators across 4 categories (enrollment, quality, infrastructure, spending) |
| `glossary.json` | 14 education terms with plain-language explanations |

### Employment Data

Employment data lives in `public/data/employment/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline employment numbers (unemployment rate, LFPR, female LFPR, youth UR) |
| `unemployment.json` | Unemployment time series (total/youth/gender) + state unemployment rates |
| `participation.json` | LFPR time series (total/male/female) + state LFPR |
| `sectoral.json` | Agriculture/industry/services employment shares + RBI KLEMS breakdown |
| `indicators.json` | All employment indicators across 4 categories (unemployment, participation, sectoral, informality) |
| `glossary.json` | 15 employment terms with plain-language explanations |

### Healthcare Data

Healthcare data lives in `public/data/healthcare/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline healthcare numbers (hospital beds/1000, doctors/1000, health spending % GDP, OOP %) |
| `infrastructure.json` | Hospital beds, physicians, nurses time series + state infrastructure from NHP 2022 |
| `spending.json` | Health expenditure trends (% GDP, per capita, out-of-pocket %) |
| `disease.json` | TB incidence, HIV prevalence, immunization coverage trends |
| `indicators.json` | All healthcare indicators across 4 categories (infrastructure, spending, immunization, disease) |
| `glossary.json` | 13 healthcare terms with plain-language explanations |

### Environment Data

Environment data lives in `public/data/environment/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline environment numbers (AQI, forest cover %, renewable energy share, water stress) |
| `air-quality.json` | Air quality index trends, state/city-level AQI, pollutant breakdowns |
| `forest.json` | Forest cover time series, state-wise forest area, tree cover changes |
| `energy.json` | Energy mix composition, renewable capacity trends, carbon emissions |
| `water.json` | Water stress indicators, groundwater levels, per capita water availability |
| `indicators.json` | All environment indicators across categories |
| `glossary.json` | 15 environment terms with plain-language explanations |

### Elections Data

Elections data lives in `public/data/elections/2025-26/`:

| File | Contents |
|------|----------|
| `summary.json` | Headline numbers (turnout 2024, total electors, BJP/INC seats, women MPs, avg assets, criminal %) |
| `turnout.json` | National turnout trend 1962-2024 (17 elections) + state-wise breakdown for 2024 |
| `results.json` | Party-wise Lok Sabha seats and vote share across 17 elections (1962-2024) |
| `candidates.json` | ADR data for 543 Lok Sabha 2024 MPs — criminal cases, assets, education |
| `representation.json` | Women MPs trend 1962-2024 (count and %) |
| `indicators.json` | State-level election indicators across 3 categories |
| `glossary.json` | 15 election terms with plain-language explanations |

### EMI Calculator Data

EMI data lives in `public/data/emi/`:

| File | Contents |
|------|----------|
| `loan-spreads.json` | Curated loan spreads over repo rate for home (2.75%), car (3.5%), personal (8%) loans. Sources: SBI EBLR, HDFC, ICICI published rate cards. |

### Citizen Questions

| File | Contents |
|------|----------|
| `questions.json` | 161 curated citizen questions across 11 domains with answers and section anchors. Powers question-first Cmd+K search. |

Data sourced from [Open Budgets India](https://openbudgetsindia.org), [indiabudget.gov.in](https://www.indiabudget.gov.in), [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/), [RBI DBIE](https://data.rbi.org.in), [RBI Monetary Policy Statements](https://www.rbi.org.in), [RBI Handbook of Statistics on Indian States](https://www.rbi.org.in), [Census of India](https://censusindia.gov.in), [NFHS](http://rchiips.org/nfhs/), [UDISE+](https://udiseplus.gov.in), [ASER](https://asercentre.org), [PLFS](https://mospi.gov.in), [MOSPI eSankhyiki API](https://api.mospi.gov.in), [NHP/CBHI](https://cbhidghs.mohfw.gov.in), [CPCB](https://cpcb.nic.in), [MOEFCC](https://moef.gov.in), [CEA](https://cea.nic.in), [CWC](https://cwc.gov.in), [Election Commission of India](https://eci.gov.in), [TCPD Lok Dhaba](https://lokdhaba.ashoka.edu.in), [ADR/MyNeta](https://myneta.info), [IMF CPI via DBnomics](https://db.nomics.world/IMF/CPI), [SBI/HDFC rate cards](https://sbi.co.in), and [World Bank Open Data API](https://data.worldbank.org) under the [Government Open Data License — India](https://data.gov.in/government-open-data-license-india).

---

## Design System

See [BRAND.md](./BRAND.md) for the full visual identity guide. Key principles:

- **Data IS the design** — visualizations paint directly onto the background, no card wrappers
- **Restrained craft** — numbered narrative sections, scroll-triggered word reveals, generous whitespace
- **IIB-inspired palettes** — 2-3 intentional colors per composition, not 12 random chart colors
- **Dark cinematic theme** — deep navy-black (`#06080f`) with saffron (`#FF6B35`), gold (`#FFC857`), and cyan (`#4AEADC`) accents

---

## SEO & Discoverability

The site is built for maximum discoverability:

- **Prerendered HTML** for all 76 routes (66 pages + 10 embed routes, Puppeteer at build time)
- **JSON-LD** structured data: `WebApplication`, `Dataset` x10 (Budget + Economy + RBI + States + Census + Education + Employment + Healthcare + Environment + Elections for Google Dataset Search), `BreadcrumbList`
- **Per-route meta tags** via react-helmet-async (title, description, OG image, Twitter card, canonical)
- **sitemap.xml** covering 76 pages + 54 downloadable data endpoints
- **robots.txt** explicitly welcoming AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- **llms.txt** for AI model discoverability (all 10 domains + glossary terms + embed API)
- **Noscript fallback** with real content across all ten domains for crawlers that don't execute JS
- **Embeddable charts** via `/embed/{domain}/{section}` — standalone responsive iframes for journalists and bloggers

---

## Roadmap

### Completed

- [x] Scrollytelling budget story with 7 composition sections
- [x] Hub homepage at `/` with data domain portal
- [x] Hub + domain routing (`/` → `/budget` → `/budget/explore`, etc.) with redirects for old URLs
- [x] Context-aware navigation (hub links vs budget sub-nav)
- [x] Deficit visualization (rupee bar: 69p earned / 31p borrowed, stat cards)
- [x] Per-capita breakdown (segmented bar, 8 ministries, daily spending)
- [x] Ministry-wise data explorer with CSV export
- [x] Tax calculator with Old/New regime and deductions (80C, 80D, HRA, 24b, NPS, 80TTA)
- [x] Share card generation for social media
- [x] Full SEO layer (prerendering, structured data, sitemap, OG tags)
- [x] IIB-inspired design system with brand guide
- [x] CDN-friendly caching strategy
- [x] Economic Survey 2025-26 data domain (scrollytelling, explorer, methodology)
- [x] New viz components: LineChart, AreaChart, HorizontalBarChart
- [x] Economy data pipeline (7 structured JSON datasets from Economic Survey)
- [x] RBI Data domain (scrollytelling, indicator explorer, methodology)
- [x] RBI data pipeline (6 structured JSON datasets from World Bank + curated MPC data)
- [x] Automated pipeline infrastructure (GitHub Actions cron jobs for Economy, RBI, data freshness)
- [x] Data accuracy overhaul — truth-verified all figures against authoritative sources
- [x] RBI chart QA fixes — x-axis alignment (fiscal years), liquidity section split, empty series cleanup
- [x] Phase 3 polish — sparse series filtering, GDP projection display fix, credit narrative alignment, per-domain OG images
- [x] Per-domain glossary pages (budget, economy, RBI) — 40 terms in plain language with filter, alpha nav, and related terms
- [x] Floating feedback button — GitHub issue form with pre-filled page context
- [x] Cmd+K search expansion — glossary terms indexed with purple badges, RBI pages added, stale routes fixed

### Next Steps

**Phase 3: Polish Existing Domains** ✓
- [x] Economy inflation chart: sparse Food/Core CPI series (< 3 points) hidden with MIN_POINTS threshold; annotation adapts
- [x] Economy GDP projection: single value display when low === high (was "7.4–7.4%", now "7.4%")
- [x] RBI credit section: narrative updated to focus on private sector credit (domestic credit series empty from WB); dead series removed from chart
- [x] RBI credit section: deposit rate empty — noted in methodology; DBIE integration deferred to Phase 5
- [x] Per-domain OG images: 4 variants (hub, budget, economy, rbi) generated via Puppeteer, wired into SEOHead on all 11 routes

**Phase 3.5: UX & Discoverability** ✓
- [x] Per-domain glossary pages (40 terms across 3 domains, plain-language explanations, related term pills, hash deep-linking)
- [x] Floating feedback button (GitHub issue form with pre-filled page context and simple prompts)
- [x] Cmd+K search indexing for glossary terms (40 terms with purple TERM badges, RBI pages added)
- [ ] Mobile UX audit across all 3 domains (deferred to post-Phase 4 — after all data domains are built)

**Phase 4A: State Finances** ✓
- [x] State Finances domain (scrollytelling, indicator explorer, methodology, glossary)
- [x] States data pipeline (curated RBI Handbook data — GSDP, revenue, fiscal health across 31 states/UTs)
- [x] Hub integration with emerald domain card, mini bar chart, stat pills
- [x] Full SEO layer (prerender, sitemap, JSON-LD Dataset, OG image, llms.txt, noscript)

**Phase 4B: Census & Demographics** ✓
- [x] Census & Demographics domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary)
- [x] Multi-vintage pipeline: World Bank API (national time series) + curated Census 2011 (state-level) + NFHS-5 (health) + SRS 2023 (vital stats)
- [x] Custom visualizations: AgeWaffle (10x10 grid), GenderGapChart (butterfly), IMR color gradient bars
- [x] Hub integration with violet domain card, mini population bars, stat pills
- [x] Full SEO layer (prerender, sitemap, JSON-LD Dataset, OG image, llms.txt, noscript)
- [x] GitHub Actions: `census-pipeline.yml` (quarterly) + freshness monitor updated

**Phase 5: New Domains — Education, Employment, Healthcare** ✓
- [x] Education domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary) — UDISE+ 2023-24, ASER 2024, World Bank
- [x] Employment domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary) — PLFS 2023-24, RBI KLEMS, World Bank
- [x] Healthcare domain (scrollytelling with 6 sections, indicator explorer, methodology, glossary) — NHP 2022, NFHS-5, World Bank
- [x] 3 automated pipelines: `education-pipeline.yml`, `employment-pipeline.yml`, `healthcare-pipeline.yml`
- [x] Hub expanded to 9 domain cards with mini-visualizations
- [x] Full SEO layer for all 3 domains (prerender, sitemap, JSON-LD, OG images, llms.txt, noscript)
- [x] 42 new glossary terms across 3 domains (14 education, 15 employment, 13 healthcare)

**Phase 6: Historical Data & Depth** ✓
- [x] Budget 20-year historical trends (FY 2005-06 to 2025-26: expenditure, receipts, fiscal/revenue deficit % GDP)
- [x] Budget vs Actual tracker (10 ministries, 7 fiscal years of BE/RE/Actual, deviation chart)
- [x] World Bank historical extension: Economy + RBI pipelines now fetch from year 2000 (was 2014)
- [x] State GSDP 3-year history for top 10 states (FY 2020-21 through 2022-23)
- [ ] RBI DBIE direct API integration (bypass World Bank lag for monetary indicators) — deferred

**Phase 7: Chart Shareability & Distribution Infrastructure** ✓
- [x] `<ChartActions>` overlay on every chart (PNG download, CSV export, permalink copy, embed iframe code copy)
- [x] Embed routes (`/embed/{domain}/{section}`) rendering standalone charts for journalist/blogger embedding
- [x] WhatsApp-optimized share cards (one stat + source, Canvas API, under 100KB) with deep link sharing
- [x] URL-encoded chart state (explorer filters and selections reflected in shareable URLs, section hash anchors)
- [x] Central chart registry (`src/lib/chartRegistry.ts`) with ~59 entries across 10 domains
- [x] SVG→Canvas→PNG capture pipeline (CSS var resolution, font embedding, Canvas compositing)
- [x] Mobile bottom sheet for chart sharing on touch devices

**Phase 8: "Make It Personal" Engine** ✓
- [x] Persistent user context (state, household size) in localStorage via `personalizationStore`
- [x] RBI EMI impact calculator (`/rbi/calculator`) — repo rate → monthly payment change on home/car/personal loans, rate impact scenarios at ±25/50 bps
- [x] Economy cost-of-living calculator (`/economy/calculator`) — input expenses by category, compare against CPI over time. Uses category-specific COICOP CPI (food, housing, transport, education, health) with headline fallback.
- [x] Cross-domain state report card (`/states/your-state`) — 11 domain panels, ~25 metrics, rank badges, quartile coloring. Aggregates data from 16 JSON files across 8 domains.
- [x] Personalization banner — contextual state bar on scrollytelling pages with domain-specific stat
- [x] CPI-by-COICOP-division data in economy pipeline: IMF/DBnomics baseline (2014-19) + MOSPI eSankhyiki API (2019+, live) + curated fallback
- [x] State code standardization — all pipelines use uppercase vehicle registration (RTO) codes
- [x] MOSPI eSankhyiki CPI API integration — no auth, monthly group-wise CPI → fiscal year averages. Three-tier strategy: API primary, curated fallback if unreachable
- [x] Shared World Bank API client (`pipeline/src/common/world_bank.py`) — retry, backoff, error handling. 6 domain clients refactored to thin wrappers
- [x] States pipeline workflow (`states-pipeline.yml`) — semi-annual schedule with RBI Handbook reminder issues
- [x] Pipeline data sources catalog (`pipeline/PIPELINE_DATA_SOURCES.md`) — all 30+ curated data constants documented

**Phase 9: Key Insights & Question-First Search** ✓
- [x] "Key Takeaways" stat pill strip on all 10 story pages (4 pills each, runtime-computed, scroll-to-section click, staggered entrance animation)
- [x] 161 curated citizen questions across 11 domains (`public/data/questions.json`) with one-sentence answers mapped to section anchors
- [x] Questions indexed in Fuse.js Cmd+K search with amber QUESTION badges ("Why are prices rising?" → `/economy#inflation`)

**Phase 10: New Domains — Environment, Elections** ✓
- [x] Environment domain: CPCB air quality, FSI forest cover, CEA energy mix, CWC water resources, World Bank indicators. Teal (#14B8A6) accent. Scrollytelling + explorer + methodology + glossary.
- [x] Elections domain: TCPD Lok Sabha 1962-2024, ECI turnout history, ADR candidate profiles. Indigo (#6366F1) accent. Pure election data with hemicycle visualization.
- [x] Phase 7-9 feature extension: ChartActionsWrapper on all env/elections charts, 10 chart registry entries, 2 embed routes, KeyTakeaways pills, 26 citizen questions, personalization banner for both domains
- [x] State Report Card extension: environment panel (AQI, forest cover, groundwater) + elections panel (voter turnout) added to cross-domain report card
- [x] Hub expanded to 10 domain cards
- [x] Full SEO layer for both domains (prerender, sitemap, OG images, llms.txt, noscript, JSON-LD)
- [x] 2 new GitHub Actions pipelines (environment quarterly, elections semi-annual)

**Phase 11: Topic-Based Cross-Domain Views** ✓
- [x] 12 curated cross-domain topics composing data across all 10 domains into narrative stories (Women in India, Fiscal Health, Inflation & Cost of Living, Education→Employment Pipeline, Health Outcomes, Regional Inequality, Climate & Energy, Youth & Jobs, Urban vs Rural, Democratic Health, Agriculture & Food Security, Water Crisis)
- [x] `/topics` hub page with 12 topic cards (live hero stats, domain badges, accent colors)
- [x] `/topics/{id}` detail pages with hero section, key takeaways, 2-3 chart sections with `ChartActionsWrapper`, deep-link CTAs to source domains
- [x] Config-driven architecture: `TopicDef` type, `extractData` functions, `useTopicData` hook with `Promise.allSettled`, `DOMAIN_DATA_MAP` mapping ~60 data keys to loaders
- [x] `RelatedTopics` accent-colored pills wired into 28 existing domain section components
- [x] Hub integration: "Cross-Domain Insights" section with 4 featured topic cards
- [x] Chart registry auto-registration for all topic section charts via `registry/topics.ts`
- [x] Full SEO layer: 13 topic routes prerendered (68 total), sitemap, og-topics.png, llms.txt, search index entries

**Phase 12: Multiplier Infrastructure** ✓
- [x] `/open-data` — Open Data API documentation: 71 JSON endpoints browsable by domain with code examples (curl, Python, JS), "Try it" live preview, and download buttons
- [x] `/for-journalists` — Journalist toolkit: chart gallery (92 charts with domain/type filters, CSV download, embed copy, citation generator), 6 curated story kits with editorial context and story angles, interactive embed builder with live iframe preview
- [x] `/for-teachers` — Teacher toolkit: 7 NCERT-mapped lesson plans (Class 10-12, Economics/Political Science/Geography) with teaching notes, discussion questions, and interactive chart references; classroom mode toggle (larger fonts via CSS + URL param `?classroom=true`)
- [x] `/contribute` — Contributor guide: data usage, issue reporting, code contribution, dataset contribution guidelines
- [x] Hub integration: "Build With This Data" section with 3 cards linking to Open Data, Journalists, Teachers
- [x] Navigation: context-aware header titles + sub-tabs for journalists (4 tabs) and teachers (2 tabs), mobile nav wired
- [x] Full SEO layer: 8 new routes prerendered (76 total), sitemap, llms.txt, 3 OG images, search index entries, noscript fallback

**Phase 13: Design & Visualization Overhaul** *(see BRAND.md audit brief)*
- [ ] Typography overhaul: replace Inter with warm humanist sans-serif (warm + accessible direction). Evaluate body + heading + mono combinations on actual portal sections.
- [ ] Visualization density audit: walk every section of every domain, identify low-density charts (>8 items in bar charts), propose high-density alternatives (choropleths, dot strips, scatter plots, small multiples, treemaps)
- [ ] New viz components: `Choropleth.tsx` (India state map), `DotStrip.tsx`, `ScatterChart.tsx`, `BumpChart.tsx`, `SmallMultiples.tsx`, `BulletChart.tsx`
- [ ] Brand consistency pass: audit spacing, card styles, hero patterns, accent harmony, source attributions, mobile consistency across all 10 domains
- [ ] Implementation + browser QA for every changed section

**Phase 14: Performance & Low-Connectivity Optimization**

*Context: A large portion of the Indian audience accesses the web on 2G/3G connections, budget Android devices (1-2GB RAM), and intermittent connectivity. A civic data platform that only works on fast broadband fails its purpose.*

- [ ] **Bundle audit & code splitting**: Analyze current bundle (index.js is ~1.1MB, ~276KB gzipped). Route-level lazy loading for all 10 domain pages + multiplier pages. Separate D3, Framer Motion, and Zustand into async chunks so the critical path loads fast.
- [ ] **Image optimization**: Audit all 18 OG images + any inline assets. Convert to WebP/AVIF with fallbacks. Ensure OG PNGs aren't loaded on page (they're only for social previews). Lazy-load any below-fold images.
- [ ] **JSON data loading strategy**: Hub loads only `summary.json` (good). But scrollytelling pages load full domain data upfront via Zustand hooks. Evaluate: (a) progressive loading (load section data as user scrolls), (b) compression (gzip/brotli on Vercel), (c) stale-while-revalidate caching headers, (d) preload hints for critical data files.
- [ ] **Font optimization**: Current: Inter (body) + JetBrains Mono (data). After Phase 13 font change, ensure: subset to Latin + Devanagari glyphs only, `font-display: swap`, preload critical weights, self-host (no Google Fonts round-trip).
- [ ] **Service Worker / offline resilience**: Evaluate Workbox for: (a) precache app shell + critical routes, (b) runtime cache for JSON data files (network-first with cache fallback), (c) offline fallback page ("You're offline — cached data shown below"). This turns the portal into a near-PWA for repeat visitors on flaky connections.
- [ ] **SVG & D3 rendering performance**: Profile treemap, sankey, hemicycle on low-end devices. Reduce DOM node count where possible (hemicycle has 543 SVG circles). Consider canvas fallback for heavy visualizations on mobile.
- [ ] **Perceived performance**: Add skeleton screens for data-loading states (replace current spinners). Preload next likely route on hover/touch. Use `content-visibility: auto` for below-fold sections to reduce initial paint cost.
- [ ] **Lighthouse audit targets**: Score 90+ on Performance, Accessibility, Best Practices, SEO across all routes. Test on simulated "Slow 3G" + "Low-end Mobile" in Chrome DevTools. Specific targets: FCP < 2s, LCP < 3s, CLS < 0.1, TTI < 5s on 3G.
- [ ] **Device testing**: Test on actual low-end Android (Chrome on a Redmi/Realme with 2GB RAM) if available, or use BrowserStack/remote device lab. Verify: smooth scroll through 9-section scrollytelling, chart interactions responsive, no OOM crashes.
- [ ] **Accessibility pass**: Keyboard navigation for all interactive elements (chart filters, calculators, search). ARIA labels on SVG visualizations. Screen reader testing on at least hub + 1 domain story page. Color contrast verification for all accent colors against dark backgrounds.

**Phase 15: Crime & Safety Domain**

*India's 11th data domain. Source: NCRB "Crime in India" annual reports + data.gov.in NCRB catalog + MoRTH road accident statistics + World Bank indicators.*

**15a. Pipeline & Data**
- [ ] Create `pipeline/src/crime/` with sources, validation schemas, and main script
- [ ] **data.gov.in NCRB API**: Fetch structured crime datasets (IPC crimes, crimes against women, crimes against children, cybercrimes, state-wise breakdowns). Catalog API at `data.gov.in/catalog/crime-india-*`
- [ ] **World Bank API**: Intentional homicides per 100K (`VC.IHR.PSRC.P5`), other safety indicators
- [ ] **Curated NCRB data**: Crime in India annual report tables — IPC crime rates, SLL crimes, conviction rates, chargesheet rates, police personnel strength. Data available as Excel/CSV on NCRB website
- [ ] **Curated MoRTH data**: Road accident fatalities, causes, state-wise breakdown. "Road Accidents in India" annual report
- [ ] Pydantic validation schemas matching TypeScript interfaces exactly
- [ ] Cross-check every key figure against NCRB primary publication
- [ ] GitHub Actions workflow (`crime-pipeline.yml`) — semi-annual cron (Jan 15, Jul 15) aligned to NCRB publication cycle (typically 6-12 month lag)
- [ ] Target: 7 JSON output files (summary, crimes-overview, crimes-against-women, road-accidents, cybercrime, police-infrastructure, state-wise)
- [ ] Pick accent color (suggestion: warm crimson/red like `#DC2626` or steel `#64748B`)

**15b. TypeScript Scaffolding**
- [ ] Interfaces in `src/lib/data/schema.ts` — CrimeData, CrimeOverview, CrimesAgainstWomen, RoadAccidents, CyberCrime, PoliceInfrastructure, etc.
- [ ] Loader functions in `src/lib/dataLoader.ts`
- [ ] Zustand store in `src/store/crimeStore.ts`
- [ ] Data hook in `src/hooks/useCrimeData.ts`

**15c. Scrollytelling Page (`/crime`)**
- [ ] 5-6 sections with narrative bridges. Candidate sections:
  1. **Crime Overview** — Total cognizable crimes trend (IPC + SLL), crime rate per lakh, composition breakdown
  2. **Crimes Against Women** — Rape, domestic violence, dowry deaths, acid attacks, trafficking. State-wise comparison. Trend lines.
  3. **Road Accidents** — 170,000+ deaths/year. Causes breakdown (speeding, drunk driving, etc.). State-wise fatality rates. Two-wheeler vulnerability.
  4. **Cybercrime** — Surge trend, financial fraud losses (Rs 22,495 Cr in 2025), complaint types
  5. **Police Infrastructure** — Police-to-population ratio, women in police force, state-wise strength, vacancies
  6. **Justice Pipeline** — Chargesheet rate → conviction rate → pendency. How many crimes lead to punishment?
- [ ] Each section: `useScrollTrigger` → `SectionNumber` → title/annotation → viz → source attribution
- [ ] Use appropriate viz types (NOT just bar charts): choropleths for state-wise data, dot strips for comparisons, small multiples for crime type trends, bump charts for state rankings over time
- [ ] Narrative bridges between sections with storytelling connectors
- [ ] CTA section at bottom with Explore + Methodology glow cards

**15d. Sub-Pages**
- [ ] Explorer page (`/crime/explore`): Category filters (IPC, crimes against women, road accidents, cyber, police), indicator list, interactive chart
- [ ] Methodology page (`/crime/methodology`): Data sources, indicator definitions, limitations, NCRB reporting methodology caveats, data lag notes
- [ ] Glossary page (`/crime/glossary`): ~12-15 terms (IPC, SLL, FIR, chargesheet, cognizable offence, POCSO, dowry death, etc.). Create `public/data/crime/glossary.json`
- [ ] Glossary wrapper: `src/pages/CrimeGlossaryPage.tsx` → `<GlossaryPage domain="crime" />`
- [ ] Add domain config to `DOMAIN_CONFIG` in `GlossaryPage.tsx`

**15e. Routing & Navigation**
- [ ] Routes in `App.tsx` (story, explore, methodology, glossary)
- [ ] Header: `isDomainSection` detection for `/crime`, title, 4 sub-tabs (Story, Explore, Methodology, Glossary)
- [ ] MobileNav: add to `hubTabs` array with appropriate icon (shield or alert icon)
- [ ] Footer: domain-specific NCRB/MoRTH attribution with source links
- [ ] Back chevron → `/#stories`, footer back link → `/#stories`
- [ ] Old route redirects (if any)

**15f. Hub Integration**
- [ ] Domain card in `HubPage.tsx` with mini-visualization and stat pills
- [ ] Hub loads only `crime/summary.json` — never the full dataset
- [ ] Update "stories" section order

**15g. Phase 7 Features (Chart Sharing)**
- [ ] Chart registry entries in `src/lib/registry/crime.ts` — register all scrollytelling + explorer charts
- [ ] `ChartActionsWrapper` on every chart section (SVG→PNG, CSV, permalink, embed)
- [ ] `toTabular()` function for each chart (CSV export)
- [ ] `heroStat()` function for WhatsApp share cards
- [ ] Embed routes: `/embed/crime/{sectionId}` for all sections
- [ ] Add to `ChartRenderer` lazy-loaded chart component map

**15h. Phase 8 Features (Personalization)**
- [ ] State Report Card: Add crime panel to `stateReportEngine.ts` — crime rate, crimes against women rate, road accident fatality rate, police-to-population ratio. Now 12 panels.
- [ ] Personalization banner stat for `/crime` scrollytelling page (e.g., "{state} crime rate: X per lakh")

**15i. Phase 9 Features (Key Insights & Search)**
- [ ] `KeyTakeaways` component on crime story page — 4 stat pills (e.g., total crimes trend, crimes against women %, road deaths, conviction rate)
- [ ] ~13 citizen questions in `questions.json` (e.g., "How many crimes against women are reported each year?", "Which state has the highest crime rate?", "What is India's road accident death toll?", "What percentage of crimes lead to conviction?")
- [ ] Search overlay entries for crime pages + glossary terms

**15j. Phase 11 Features (Cross-Domain Topics)**
- [ ] Add `RelatedTopics` pills to crime section components where relevant
- [ ] Check if existing topics should reference crime data:
  - "Women in India" topic — should pull crimes against women data
  - "Democratic Health" topic — could reference police/justice data
  - "Regional Inequality" topic — crime rate disparity across states
- [ ] Potentially create new topic: "Safety & Justice" composing crime + judiciary data
- [ ] Update `DOMAIN_DATA_MAP` in `topicDataMap.ts` with crime data keys

**15k. Phase 12 Features (Multiplier Infrastructure)**
- [ ] Add crime JSON endpoints to `dataEndpoints.ts` for Open Data page
- [ ] Chart gallery entries auto-populated from chart registry
- [ ] Potential story kit: "crime-safety" kit for journalists (data narrative + chart refs + story angles)
- [ ] Potential lesson plan: Class 11-12 Political Science / Sociology — crime data, justice system, women's safety
- [ ] Embed routes registered in embed builder dropdown

**15l. Phase 13-14 Features (Design & Performance)**
- [ ] Use Phase 13 viz components where appropriate (choropleths for state crime maps, dot strips, small multiples)
- [ ] Lazy-load crime pages via `React.lazy()` (Phase 14 pattern)
- [ ] ARIA labels on all SVG chart components
- [ ] Service worker caching for crime JSON files
- [ ] Mobile: tap-to-reveal share, safe-area padding, scrollable nav (all inherited from this session's fixes)

**15m. SEO & Documentation**
- [ ] Routes added to `scripts/prerender.mjs`
- [ ] Sitemap updated (`public/sitemap.xml`) with crime routes + data file URLs
- [ ] `public/llms.txt` expanded with crime domain description
- [ ] `index.html` noscript fallback updated with crime domain content
- [ ] JSON-LD Dataset schema in SEOHead for crime data
- [ ] OG image: add `og-crime.png` variant to `scripts/generate-og.mjs` and regenerate
- [ ] Add to `scripts/inject-og.mjs` route→OG mapping
- [ ] Update CLAUDE.md site architecture section
- [ ] Update README: pages table, data section (Crime Data), project structure, acknowledgments

**15n. Browser QA (MANDATORY)**
- [ ] Hub: crime domain card renders with stats and mini-viz
- [ ] Story: scroll through ALL sections — every chart renders, axes readable, legends accurate
- [ ] Explorer: filter categories, select indicators, chart renders with correct data
- [ ] Methodology: all sections readable, source links present
- [ ] Glossary: terms render, filter works, related term pills scroll to target
- [ ] Navigation: header tabs work (including Glossary tab), back chevron → `/#stories`
- [ ] Mobile: bottom nav scrollable (crime tab visible), charts responsive, no horizontal overflow
- [ ] Search: Cmd+K → type crime term → glossary result appears, citizen questions appear
- [ ] Share: hover chart → overlay works (desktop), tap chart → share button appears (mobile)
- [ ] State report card: crime panel renders with correct state data
- [ ] Embed: `/embed/crime/{section}` renders standalone chart
- [ ] Build: `npm run build` passes with zero errors

**Phase 16: Data Source Automation Audit**

Systematic audit of all 11 domains to identify API-based or machine-readable data sources that we may have missed. The goal: if an authentic, government-published API exists for data we currently curate manually, we should be using it. Post-audit, we'll have a clear picture of automation coverage vs. gaps across every domain.

**Audit scope per domain:**
- [ ] **Budget**: Audit Open Budgets India API, CKAN/data.gov.in endpoints beyond what `data-pipeline.yml` already fetches. Check for any new CKAN datasets (expenditure actuals, revised estimates) that could replace curated trend data.
- [ ] **Economy**: Audit MOSPI eSankhyiki API beyond CPI (GDP quarterly estimates, IIP, WPI). Check NSO API for advance/provisional GDP. Verify if RBI DBIE has usable endpoints for macro indicators (GDP, GVA, savings rate).
- [ ] **RBI**: Audit RBI DBIE (Database on Indian Economy) for programmatic access — repo rate history, forex reserves, monetary aggregates, credit/deposit data. Check if the DBIE download interface has a stable URL pattern or hidden API. Evaluate RBI's new data portal if any.
- [ ] **State Finances**: Audit RBI Handbook of Statistics on Indian States for any API or bulk download. Check CAG (Comptroller and Auditor General) for state audit data APIs. Check Finance Commission reports for machine-readable data.
- [ ] **Census**: Audit Census of India website for any API or bulk download (census.gov.in). Check Office of the Registrar General (SRS, CRS) for programmatic access. Evaluate NFHS data API (if DHS Program offers one for India). Check National Population Commission for digital releases.
- [ ] **Education**: Audit UDISE+ portal for API or bulk download (udiseplus.gov.in). Check ASER Centre for programmatic data access. Evaluate MHRD/MoE data portals. Check data.gov.in for education datasets.
- [ ] **Employment**: Audit MOSPI PLFS microdata/API access. Check Labour Bureau (labourbureau.gov.in) for digital releases. Evaluate e-Shram portal data. Check RBI KLEMS for programmatic access.
- [ ] **Healthcare**: Audit CBHI (Central Bureau of Health Intelligence) for NHP data API. Check HMIS (Health Management Information System) portal for facility/outcome data. Evaluate IDSP (Integrated Disease Surveillance Programme) for disease burden data. Check NHA (National Health Authority) for Ayushman Bharat data.
- [ ] **Environment**: Audit CPCB real-time AQI API (already known: `api.data.gov.in/resource/` CPCB endpoints). Check ISFR (India State of Forest Report) for digital data. Evaluate CEA (Central Electricity Authority) for generation/capacity APIs. Check CWC/CGWB for water level APIs.
- [ ] **Elections**: Audit ECI (Election Commission of India) for any structured data API. Check Lok Dhaba (TCPD) for programmatic access. Evaluate MyNeta (ADR) for candidate data APIs. Check data.gov.in for election datasets.
- [ ] **Crime (Phase 15)**: Audit NCRB data.gov.in API endpoints for "Crime in India" datasets. Check MoRTH for road accident data API. Evaluate NCRB website for structured downloads beyond Excel.

**Cross-cutting checks:**
- [ ] data.gov.in: Comprehensive search across all 11 domain keywords — many ministries publish datasets here with CKAN API access that we may not know about
- [ ] World Bank API: Verify we're using all relevant India indicators (currently ~30 across 7 domains). Cross-check against full WDI indicator list for gaps.
- [ ] RBI DBIE: Single most likely source of missed APIs — covers monetary, banking, fiscal, external sector, and state-level data
- [ ] MOSPI eSankhyiki: Beyond CPI, check for GDP, IIP, WPI, trade, and other macro APIs

**Deliverables:**
- [ ] Audit report: per-domain table of (current source → available API → recommendation → effort estimate)
- [ ] For each newly discovered API: test accessibility (auth requirements, rate limits, data freshness, coverage years)
- [ ] Prioritized implementation list: which APIs to integrate first (based on data freshness gain vs. effort)
- [ ] Update `pipeline/PIPELINE_DATA_SOURCES.md` with findings
- [ ] Implement highest-priority API integrations before Codex QA

**Pre-Final: Code-Level QA Audit (Codex)**
- [ ] End-to-end automated code audit via Codex CLI (`codex exec --full-auto`)
- [ ] Verify all JSON pipeline outputs match TypeScript schema interfaces (Pydantic ↔ TypeScript alignment)
- [ ] Check for broken imports, stale references, dead code across all 10 domains + personalization
- [ ] Validate data integrity: state ID consistency (uppercase vehicle codes), cross-domain ID matching
- [ ] Audit calculation engines (EMI, cost-of-living, state report card) for edge cases and correctness
- [ ] Verify all route registrations match (App.tsx, prerender.mjs, sitemap.xml, Header tabs, MobileNav tabs)
- [ ] Check for security issues: XSS in user inputs, OWASP top 10
- [ ] Pipeline validation: run all 10 pipelines locally, verify JSON output, cross-check key figures against sources

**Final: Citizen-Perspective QA**
- [ ] Full product review from the perspective of an average Indian citizen (per CLAUDE.md Final QA protocol)

**Pre-Launch: Repository Documentation Audit**

Audit every non-code file in the repo for long-term hygiene before going public. The goal: a clean, minimal documentation footprint that serves contributors and users — no internal breadcrumbs, stale references, or files that only made sense during buildout.

- [ ] Inventory all markdown, text, and config files across the repo (README, CHANGELOG, CLAUDE.md, pipeline docs, llms.txt, etc.)
- [ ] Remove or consolidate files that are redundant, outdated, or internal-only (build notes, scratch docs, phase-specific plans that are now complete)
- [ ] Streamline README.md: collapse completed phases into a concise "what shipped" summary, keep only active/future phases as detailed checklists
- [ ] Review CLAUDE.md for stale instructions, completed TODOs, or references to removed code — tighten to reflect the current codebase
- [ ] Audit pipeline documentation (`pipeline/PIPELINE_DATA_SOURCES.md`, pipeline READMEs) for accuracy against actual pipeline code
- [ ] Check for any files that shouldn't be public (internal notes, credentials references, debug artifacts)
- [ ] Verify all documentation cross-references (links between files, route references, file paths) are still valid
- [ ] Ensure LICENSE, CONTRIBUTING guidelines, and repo metadata are present and accurate for an open-source project

**Post-Launch: Marketing, Launch Strategy & Documentation Assets**

*Launch context (documented Mar 2 2026):* The US-Israeli military operation against Iran began Feb 28 2026 (Operation "Epic Fury" / "Roaring Lion"). 200+ dead in Iran, Khamenei killed, 3 US soldiers dead, regional escalation into Lebanon and Gulf states. This is ongoing at time of planned launch (week of Mar 2-9 or Mar 9-16). **Before writing any launch content, interview Ronit on:** (a) Is the conflict still active? (b) How to acknowledge the moment with genuine empathy — not marketing, not performative, but honest recognition that launching a civic data tool during a time of death and destruction carries weight. The connection point: this project exists because transparent, accessible information is a civic good; war is what happens when information, diplomacy, and accountability fail. If we can say something honest about building in dark times without exploiting the moment, we should. If we can't do it right, we stay silent on it.

- [ ] **Launch strategy** (beyond LinkedIn/Twitter/Instagram):
  - [ ] Identify target communities: Indian civic tech (DataMeet, Open Data India), developer communities (HackerNews, Indie Hackers, Product Hunt, Reddit r/India, r/dataisbeautiful, r/opensource), journalism networks (GIJN, DataJournalism.com), education communities (NCERT teacher forums, education Twitter), open data communities (OKFN, Civic Tech slack groups)
  - [ ] Product Hunt launch: prepare screenshots, tagline, maker comment. Time for Indian morning (US evening)
  - [ ] HackerNews Show HN post: technical angle (11 automated pipelines, D3 viz, 71 open endpoints, zero-auth API)
  - [ ] Direct outreach: Indian data journalists (IndiaSpend, The Wire Data, Scroll.in data team, FactChecker.in), civic tech organizations (CivicDataLab, Janaagraha), education influencers who use data in teaching
  - [ ] Reddit posts: r/India (civic angle), r/dataisbeautiful (viz angle), r/opensource (AGPL civic infra angle), r/webdev (technical angle)
  - [ ] Open data community announcements: DataMeet mailing list, Open Government Data India forums
  - [ ] Executable launch week plan: Day 1 (LinkedIn + Twitter), Day 2 (Product Hunt + HN), Day 3 (Reddit), Day 4-5 (direct outreach to journalists + educators), Day 6-7 (community forums + follow-up engagement)
  - [ ] Prep: 5-6 high-quality screenshots/GIFs of key interactions (scrollytelling, hemicycle, embed builder, Cmd+K search, calculator, state report card)
- [ ] **Launch announcement posts** (LinkedIn long-form + Twitter thread + Instagram stories/posts) — stream-of-consciousness in Ronit's voice, covering origin story, philosophy, what the portal actually does
- [ ] **Ongoing content series** (1 post every 3-4 days) spotlighting individual elements:
  - The "Data IS the design" philosophy and why no card wrappers, no dashboard chrome
  - Building 10 data domains with 11 automated pipelines — zero-touch data freshness
  - Scrollytelling as civic communication — making ₹50 lakh crore budgets tangible
  - The personalization engine — EMI calculator, cost-of-living deflator, state report cards
  - Cross-domain topic views — weaving 10 datasets into narratives (Women in India, Water Crisis, etc.)
  - Custom D3 visualizations — hemicycle parliament, waffle charts, choropleth maps, Sankey flows
  - Question-first search — 115 citizen questions as entry points into government data
  - The pipeline architecture — World Bank API + MOSPI + curated government sources
  - Building this entire platform with Claude Code — the AI collaboration experience
  - Open source as civic infrastructure — why AGPL, why open data matters
- [ ] Interview-first drafting process: surface real triggers, frustrations, and philosophy before writing
- [ ] Use worldbuilding-writing skill + marketing/copy agents for persuasive framing
- [ ] Screenshots and screen recordings of key interactions for social proof

---

## Contributing

This is a civic tech project and contributions are welcome. Whether you're a developer, designer, data journalist, or translator — there's room to help.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run `npm run build` to verify everything compiles and prerenders
5. Submit a pull request

For major changes, please open an issue first to discuss the approach.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

**What this means:**
- You can freely use, modify, and distribute this code
- If you run a modified version as a web service, you must share your source code
- All derivative works must use the same license

**Why AGPL-3.0:** This is a public-good platform. AGPL ensures the code stays open — if someone builds on it to create a similar service, they must contribute their improvements back to the community. This protects against commercial extraction while encouraging civic participation.

The underlying budget data is published by the Government of India under the [Government Open Data License — India (GODL)](https://data.gov.in/government-open-data-license-india).

---

## Acknowledgments

- Budget data from [Open Budgets India](https://openbudgetsindia.org) and [Union Budget documents](https://www.indiabudget.gov.in)
- Economy data from [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/) and [World Bank Open Data](https://data.worldbank.org)
- RBI data from [RBI DBIE](https://data.rbi.org.in), [RBI Monetary Policy Statements](https://www.rbi.org.in), and [World Bank Open Data](https://data.worldbank.org)
- States data from [RBI Handbook of Statistics on Indian States](https://www.rbi.org.in) and [Finance Commission of India](https://fincomindia.nic.in)
- Census data from [Census of India](https://censusindia.gov.in), [NFHS-5](http://rchiips.org/nfhs/), [Sample Registration System](https://censusindia.gov.in/census.website/data/srs), and [World Bank Open Data](https://data.worldbank.org)
- Education data from [UDISE+ 2023-24](https://udiseplus.gov.in), [ASER 2024](https://asercentre.org), and [World Bank Open Data](https://data.worldbank.org)
- Employment data from [PLFS Quarterly Bulletin](https://mospi.gov.in), [RBI KLEMS Database](https://www.rbi.org.in), and [World Bank Open Data](https://data.worldbank.org)
- Healthcare data from [National Health Profile 2022](https://cbhidghs.mohfw.gov.in), [NFHS-5](http://rchiips.org/nfhs/), and [World Bank Open Data](https://data.worldbank.org)
- Environment data from [CPCB](https://cpcb.nic.in) (air quality), [MOEFCC](https://moef.gov.in) (forest cover), [CEA](https://cea.nic.in) (energy mix), and [CWC](https://cwc.gov.in) (water resources)
- Elections data from [Election Commission of India](https://eci.gov.in), [TCPD Lok Dhaba](https://lokdhaba.ashoka.edu.in) (Lok Sabha results 1962-2024), [ADR/MyNeta](https://myneta.info) (candidate profiles), and [Lok Sabha Secretariat](https://loksabha.nic.in) (women MPs)
- Crime data from [NCRB "Crime in India"](https://ncrb.gov.in), [data.gov.in NCRB catalog](https://www.data.gov.in/ministrydepartment/National%20Crime%20Records%20Bureau%20(NCRB)), [MoRTH Road Accidents in India](https://morth.nic.in), and [World Bank Open Data](https://data.worldbank.org)
- CPI category data from [MOSPI eSankhyiki API](https://api.mospi.gov.in) (primary, live CPI by COICOP group), [IMF CPI dataset via DBnomics](https://db.nomics.world/IMF/CPI) (historical baseline), and [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/)
- Loan spread data from [SBI](https://sbi.co.in), [HDFC Bank](https://hdfcbank.com), and [ICICI Bank](https://icicibank.com) published rate cards
- Design inspired by [Information is Beautiful](https://informationisbeautiful.net), [Visual Cinnamon](https://www.visualcinnamon.com), and [Kasia Siwosz](https://kasiasiwosz.com)
- Built with React, D3, Framer Motion, and Tailwind CSS
