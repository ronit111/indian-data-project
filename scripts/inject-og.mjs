/**
 * Post-build OG meta tag injection.
 *
 * Reads dist/index.html (the SPA shell with fallback OG tags),
 * replaces the 10 dynamic meta tag values per route, and writes
 * to dist/{route}/index.html. Vercel serves static files before
 * SPA rewrites, so crawlers (WhatsApp, Telegram, LinkedIn, Discord)
 * see route-specific previews without executing JavaScript.
 *
 * Usage: node scripts/inject-og.mjs
 * Runs automatically as part of `npm run build:no-prerender`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const BASE_URL = 'https://indiandataproject.org';
const EXPECTED_REPLACEMENTS = 10;

// ─── Route metadata ────────────────────────────────────────────────
// Transcribed from each page component's <SEOHead> props.
// When adding a new route, add an entry here (same as prerender.mjs).

const ROUTES = [
  // Hub
  {
    path: '/',
    title: 'Indian Data Project — Government Data, Made Visible',
    description: "India's government data is buried in dense PDFs, broken APIs, and spreadsheets formatted for bureaucrats. This portal turns it into visual stories anyone can follow — 11 domains, from budget to elections to healthcare.",
    image: '/og-logo.png',
  },

  // ── Budget ──────────────────────────────────────────────────────
  {
    path: '/budget',
    title: 'Union Budget 2025-26 — Where Your Tax Money Goes',
    description: "Interactive visual breakdown of India's Union Budget 2025-26. Revenue sources, ministry-wise spending, state transfers, and your personal tax share.",
    image: '/og-budget.png',
  },
  {
    path: '/budget/explore',
    title: 'Budget Data Explorer — Ministry-wise Spending | Indian Data Project',
    description: "Explore India's Union Budget 2025-26 ministry by ministry. Sortable data table with scheme-level detail for all government expenditure. Export to CSV.",
    image: '/og-budget.png',
  },
  {
    path: '/budget/calculator',
    title: 'Income Tax Calculator FY 2025-26 — Where Your Tax Rupees Go',
    description: 'Calculate your income tax under Old and New regimes for FY 2025-26. See exactly how your tax money is allocated across Defence, Education, Health, and other ministries.',
    image: '/og-budget.png',
  },
  {
    path: '/budget/methodology',
    title: 'Methodology — Indian Data Project',
    description: 'Data sources, tax calculation methodology, number formatting, per-capita estimates, and limitations of the Indian Data Project. Data under GODL license.',
    image: '/og-budget.png',
  },
  {
    path: '/budget/glossary',
    title: 'Glossary — Budget 2025-26 — Indian Data Project',
    description: 'Plain-language definitions of Union Budget terms: fiscal deficit, revenue receipts, capital expenditure, cess, devolution, and more.',
    image: '/og-budget.png',
  },

  // ── Economy ─────────────────────────────────────────────────────
  {
    path: '/economy',
    title: "Economic Survey 2025-26 — India's Economic Report Card",
    description: "Interactive visual breakdown of India's Economic Survey 2025-26. GDP growth, inflation trends, fiscal consolidation, trade balance, and sectoral analysis.",
    image: '/og-economy.png',
  },
  {
    path: '/economy/explore',
    title: 'Explore Economic Indicators — Indian Data Project',
    description: "Browse and compare India's key economic indicators. GDP, inflation, trade, fiscal data from the Economic Survey 2025-26.",
    image: '/og-economy.png',
  },
  {
    path: '/economy/calculator',
    title: 'Cost of Living Calculator — How Inflation Affects Your Expenses',
    description: 'See how CPI inflation has changed the real cost of your monthly expenses. Compare your spending power across years.',
    image: '/og-cost-of-living.png',
  },
  {
    path: '/economy/methodology',
    title: 'Methodology — Economic Survey — Indian Data Project',
    description: 'Data sources, methodology, and known limitations for the Economic Survey data on Indian Data Project.',
    image: '/og-economy.png',
  },
  {
    path: '/economy/glossary',
    title: 'Glossary — Economic Survey 2025-26 — Indian Data Project',
    description: 'Plain-language definitions of economic terms: GDP growth, CPI inflation, trade deficit, current account, sectoral composition, and more.',
    image: '/og-economy.png',
  },

  // ── RBI ─────────────────────────────────────────────────────────
  {
    path: '/rbi',
    title: "RBI Data — India's Central Banker | Indian Data Project",
    description: 'Reserve Bank of India monetary policy, repo rate decisions, inflation targeting, money supply, credit growth, and forex reserves — visualized from primary sources.',
    image: '/og-rbi.png',
  },
  {
    path: '/rbi/explore',
    title: 'Explore RBI Indicators — Indian Data Project',
    description: 'Browse and compare RBI monetary policy, liquidity, credit, and forex indicators across a decade of data.',
    image: '/og-rbi.png',
  },
  {
    path: '/rbi/calculator',
    title: 'EMI Impact Calculator — How RBI Rate Changes Affect Your Loan',
    description: 'See how repo rate changes affect your home, car, or personal loan EMI. Calculate monthly payments and understand the real cost of borrowing.',
    image: '/og-emi-calculator.png',
  },
  {
    path: '/rbi/methodology',
    title: 'Methodology — RBI Data — Indian Data Project',
    description: 'Data sources, methodology, indicator definitions, and known limitations for the RBI data on Indian Data Project.',
    image: '/og-rbi.png',
  },
  {
    path: '/rbi/glossary',
    title: 'Glossary — RBI Data — Indian Data Project',
    description: 'Plain-language definitions of RBI terms: repo rate, CRR, SLR, MPC, inflation targeting, forex reserves, and more.',
    image: '/og-rbi.png',
  },

  // ── States ──────────────────────────────────────────────────────
  {
    path: '/states',
    title: "State Finances — India's Federal Mosaic | Indian Data Project",
    description: 'State-wise GDP, growth rates, revenue self-sufficiency, fiscal health, and per capita income across 28 states and 8 union territories — visualized from RBI Handbook data.',
    image: '/og-states.png',
  },
  {
    path: '/states/explore',
    title: 'Explore State Indicators — Indian Data Project',
    description: 'Browse and compare state-wise GSDP, revenue, fiscal health, and per capita income indicators across all Indian states and union territories.',
    image: '/og-states.png',
  },
  {
    path: '/states/your-state',
    title: 'State Report Card — Indian Data Project',
    description: 'How does your state compare to other states? See rankings across economy, budget, education, healthcare, environment, elections, and more.',
    image: '/og-state-report-card.png',
  },
  {
    path: '/states/methodology',
    title: 'Methodology — State Finances — Indian Data Project',
    description: 'Data sources, methodology, indicator definitions, and known limitations for the state finances data on Indian Data Project.',
    image: '/og-states.png',
  },
  {
    path: '/states/glossary',
    title: 'Glossary — State Finances — Indian Data Project',
    description: 'Plain-language definitions of state finance terms: GSDP, per capita income, devolution, FRBM Act, fiscal deficit, and more.',
    image: '/og-states.png',
  },

  // ── Census ──────────────────────────────────────────────────────
  {
    path: '/census',
    title: "Census & Demographics — India's 1.45 Billion Story | Indian Data Project",
    description: "Population trends, age structure, vital statistics, health outcomes, literacy, and urbanization across India's 36 states and union territories — visualized from Census, NFHS, SRS, and World Bank data.",
    image: '/og-census.png',
  },
  {
    path: '/census/explore',
    title: 'Explore Census Indicators — Indian Data Project',
    description: 'Browse and compare state-wise population, demographics, literacy, and health indicators across all Indian states and union territories.',
    image: '/og-census.png',
  },
  {
    path: '/census/methodology',
    title: 'Methodology — Census & Demographics — Indian Data Project',
    description: 'Data sources, indicator definitions, vintage transparency, and limitations for census and demographics data. Census 2011, NFHS-5, SRS 2023, World Bank.',
    image: '/og-census.png',
  },
  {
    path: '/census/glossary',
    title: 'Glossary — Census & Demographics — Indian Data Project',
    description: 'Plain-language definitions of demographic terms: census, population density, TFR, IMR, MMR, demographic dividend, urbanization, literacy rate, and more.',
    image: '/og-census.png',
  },

  // ── Education ───────────────────────────────────────────────────
  {
    path: '/education',
    title: 'Education — 248 Million Students | Indian Data Project',
    description: "Enrollment, learning outcomes, teacher availability, school infrastructure, and education spending across India's states — visualized from UDISE+, ASER, and World Bank data.",
    image: '/og-education.png',
  },
  {
    path: '/education/explore',
    title: 'Explore Education Data — Indian Data Project',
    description: 'Browse and compare state-wise enrollment, learning outcomes, school infrastructure, and education spending indicators across all Indian states.',
    image: '/og-education.png',
  },
  {
    path: '/education/methodology',
    title: 'Methodology — Education — Indian Data Project',
    description: 'Data sources, indicator definitions, vintage transparency, and limitations for education data. UDISE+ 2023-24, ASER 2024, World Bank.',
    image: '/og-education.png',
  },
  {
    path: '/education/glossary',
    title: 'Glossary — Education — Indian Data Project',
    description: 'Plain-language definitions of education terms: GER, NER, dropout rate, PTR, ASER, UDISE, NEP 2020, foundational literacy, and more.',
    image: '/og-education.png',
  },

  // ── Employment ──────────────────────────────────────────────────
  {
    path: '/employment',
    title: 'Employment — 57 Crore Workers | Indian Data Project',
    description: "Labour force participation, unemployment, sectoral shifts, gender gaps, and informality across India's 57-crore workforce — visualized from PLFS, World Bank, and RBI KLEMS data.",
    image: '/og-employment.png',
  },
  {
    path: '/employment/explore',
    title: 'Explore Employment Data — Indian Data Project',
    description: 'Browse and compare state-wise unemployment, participation, sectoral employment, and informality indicators across all Indian states.',
    image: '/og-employment.png',
  },
  {
    path: '/employment/methodology',
    title: 'Methodology — Employment & Labour — Indian Data Project',
    description: 'Data sources, indicator definitions, vintage transparency, and limitations for employment data. PLFS, World Bank, RBI KLEMS.',
    image: '/og-employment.png',
  },
  {
    path: '/employment/glossary',
    title: 'Glossary — Employment — Indian Data Project',
    description: 'Plain-language definitions of employment terms: LFPR, unemployment rate, PLFS, informal sector, gig economy, structural transformation, and more.',
    image: '/og-employment.png',
  },

  // ── Healthcare ──────────────────────────────────────────────────
  {
    path: '/healthcare',
    title: 'Healthcare — 0.7 Doctors per 1,000 | Indian Data Project',
    description: "India's healthcare infrastructure, spending, immunization coverage, and disease burden — visualized from World Bank, NHP, and NFHS data across all states.",
    image: '/og-healthcare.png',
  },
  {
    path: '/healthcare/explore',
    title: 'Explore Healthcare Data — Indian Data Project',
    description: 'Browse and compare state-wise healthcare infrastructure, spending, immunization, and disease indicators across all Indian states.',
    image: '/og-healthcare.png',
  },
  {
    path: '/healthcare/methodology',
    title: 'Methodology — Healthcare — Indian Data Project',
    description: 'Data sources, indicator definitions, vintage transparency, and limitations for healthcare data. World Bank, NHP 2022, NFHS-5.',
    image: '/og-healthcare.png',
  },
  {
    path: '/healthcare/glossary',
    title: 'Glossary — Healthcare — Indian Data Project',
    description: 'Plain-language definitions of healthcare terms: PHC, CHC, out-of-pocket spending, immunization, TB incidence, hospital beds, and more.',
    image: '/og-healthcare.png',
  },

  // ── Environment ─────────────────────────────────────────────────
  {
    path: '/environment',
    title: 'Environment — 53 \u03BCg/m\u00B3 PM2.5 | Indian Data Project',
    description: "India's air quality, forest cover, energy transition, carbon footprint, and water stress — visualized from World Bank, CPCB, FSI, CEA, and CGWB data.",
    image: '/og-environment.png',
  },
  {
    path: '/environment/explore',
    title: 'Explore Environment Data — Indian Data Project',
    description: 'Browse and compare state-wise air quality, forest cover, and water stress indicators across all Indian states.',
    image: '/og-environment.png',
  },
  {
    path: '/environment/methodology',
    title: 'Methodology — Environment Data | Indian Data Project',
    description: 'Data sources, indicator definitions, vintage, and limitations for environment data on Indian Data Project.',
    image: '/og-environment.png',
  },
  {
    path: '/environment/glossary',
    title: 'Glossary — Environment — Indian Data Project',
    description: 'Plain-language definitions of environment terms: AQI, PM2.5, NAAQS, forest cover, ISFR, renewable energy, CO2 emissions, groundwater, and more.',
    image: '/og-environment.png',
  },

  // ── Elections ───────────────────────────────────────────────────
  {
    path: '/elections',
    title: 'Elections — 96.88 Crore Voters | Indian Data Project',
    description: "India's Lok Sabha elections from 1957 to 2024 — turnout trends, party landscape shifts, candidate wealth and criminal records, and women's representation. Data from ECI, TCPD, and ADR.",
    image: '/og-elections.png',
  },
  {
    path: '/elections/explore',
    title: 'Explore Elections Data — Indian Data Project',
    description: 'Browse state-wise voter turnout and election indicators across all Indian states.',
    image: '/og-elections.png',
  },
  {
    path: '/elections/methodology',
    title: 'Methodology — Elections Data | Indian Data Project',
    description: 'Data sources, party groupings, ADR candidate analysis methodology, and limitations for elections data on Indian Data Project.',
    image: '/og-elections.png',
  },
  {
    path: '/elections/glossary',
    title: 'Glossary — Elections — Indian Data Project',
    description: 'Plain-language definitions of election terms: Lok Sabha, FPTP, constituency, EVM, NOTA, vote share, delimitation, coalition, ADR, and more.',
    image: '/og-elections.png',
  },

  // ── Crime & Safety ─────────────────────────────────────────────
  {
    path: '/crime',
    title: 'Crime & Safety — 58.2 Lakh Crimes | Indian Data Project',
    description: "India's crime landscape in data — IPC crimes, crimes against women, road accidents, cybercrime, police infrastructure, and conviction rates. Source: NCRB, MoRTH, BPRD.",
    image: '/og-crime.png',
  },
  {
    path: '/crime/explore',
    title: 'Explore Crime Data — Indian Data Project',
    description: 'Browse state-wise crime rates, conviction rates, police ratios, and other justice indicators across all Indian states.',
    image: '/og-crime.png',
  },
  {
    path: '/crime/methodology',
    title: 'Methodology — Crime Data | Indian Data Project',
    description: 'Data sources, NCRB methodology, underreporting caveats, Kerala paradox, and limitations for crime data on Indian Data Project.',
    image: '/og-crime.png',
  },
  {
    path: '/crime/glossary',
    title: 'Glossary — Crime & Safety — Indian Data Project',
    description: 'Plain-language definitions of crime terms: FIR, chargesheet, cognizable offence, IPC, SLL, conviction rate, cybercrime, and more.',
    image: '/og-crime.png',
  },

  // ── Topics ──────────────────────────────────────────────────────
  {
    path: '/topics',
    title: 'Cross-Domain Topics — Indian Data Project',
    description: "11 curated topics that weave data from multiple domains into coherent stories about India's biggest challenges and opportunities.",
    image: '/og-topics.png',
  },
  {
    path: '/topics/women-in-india',
    title: 'Women in India — Indian Data Project',
    description: 'From parliament to payrolls, classrooms to clinics — how is India doing on gender equity?',
    image: '/og-topics.png',
  },
  {
    path: '/topics/fiscal-health',
    title: "India's Fiscal Health — Indian Data Project",
    description: 'The budget borrows, the RBI manages rates, and the economy grows — is the math adding up?',
    image: '/og-topics.png',
  },
  {
    path: '/topics/inflation-cost',
    title: 'Inflation & Cost of Living — Indian Data Project',
    description: "Prices rise, purchasing power erodes — what's driving inflation and what can the RBI do about it?",
    image: '/og-topics.png',
  },
  {
    path: '/topics/education-employment',
    title: 'Education \u2192 Employment Pipeline — Indian Data Project',
    description: 'India produces millions of graduates each year — but are they getting jobs?',
    image: '/og-topics.png',
  },
  {
    path: '/topics/health-outcomes',
    title: 'Health Outcomes — Indian Data Project',
    description: 'Hospital beds, infant survival, immunization — is India getting healthier?',
    image: '/og-topics.png',
  },
  {
    path: '/topics/regional-inequality',
    title: 'Regional Inequality — Indian Data Project',
    description: "Goa's per capita income is 8x Bihar's. What does the data reveal about India's geographic divide?",
    image: '/og-topics.png',
  },
  {
    path: '/topics/climate-energy',
    title: 'Climate & Energy Transition — Indian Data Project',
    description: 'India is the 3rd largest emitter but has the lowest per capita footprint among major economies. Can growth and green coexist?',
    image: '/og-topics.png',
  },
  {
    path: '/topics/youth-jobs',
    title: 'Youth & Jobs — Indian Data Project',
    description: "India's demographic dividend is a ticking clock — 65% of the population is under 35. Are there enough jobs?",
    image: '/og-topics.png',
  },
  {
    path: '/topics/democratic-health',
    title: "India's Democratic Health — Indian Data Project",
    description: "Turnout has risen for 70 years. But nearly half of elected MPs face criminal charges. How healthy is India's democracy?",
    image: '/og-topics.png',
  },
  {
    path: '/topics/agriculture-food',
    title: 'Agriculture & Food Security — Indian Data Project',
    description: "42% of India's workforce is in agriculture, but it produces only 15% of GDP. Can India feed itself sustainably?",
    image: '/og-topics.png',
  },
  {
    path: '/topics/water-crisis',
    title: 'Water Crisis — Indian Data Project',
    description: "India has 18% of the world's population but only 4% of its freshwater. The numbers are getting worse.",
    image: '/og-topics.png',
  },

  // ── Multiplier pages ───────────────────────────────────────────
  {
    path: '/open-data',
    title: 'Open Data API — Indian Data Project',
    description: 'Free, open JSON API for Indian government data. 80 endpoints across 11 domains — budget, economy, RBI, states, census, education, employment, healthcare, environment, elections, and crime.',
    image: '/og-open-data.png',
  },
  {
    path: '/for-journalists',
    title: 'For Journalists — Indian Data Project',
    description: 'Data tools for journalists: chart gallery, story kits, embed builder, and citation generator. Free, open data from 10 government sources.',
    image: '/og-journalists.png',
  },
  {
    path: '/for-journalists/gallery',
    title: 'Chart Gallery — For Journalists — Indian Data Project',
    description: 'Browse 90+ interactive charts across 10 data domains. Download CSV, copy embed code, generate citations.',
    image: '/og-journalists.png',
  },
  {
    path: '/for-journalists/story-kits',
    title: 'Story Kits — For Journalists — Indian Data Project',
    description: 'Curated data bundles with editorial context and story angles. Each kit combines charts from multiple domains into a ready-to-use narrative framework.',
    image: '/og-journalists.png',
  },
  {
    path: '/for-journalists/embed-builder',
    title: 'Embed Builder — For Journalists — Indian Data Project',
    description: 'Build customizable embed codes for any chart on the Indian Data Project. Copy iframe snippets with live preview.',
    image: '/og-journalists.png',
  },
  {
    path: '/for-teachers',
    title: 'For Teachers — Indian Data Project',
    description: 'NCERT-mapped lesson plans and classroom mode for teaching with real Indian government data. Economics, Political Science, and Geography.',
    image: '/og-teachers.png',
  },
  {
    path: '/for-teachers/lesson-plans',
    title: 'Lesson Plans — For Teachers — Indian Data Project',
    description: 'NCERT-mapped lesson plans using real Indian government data. Economics, Political Science, and Geography for Class 10-12.',
    image: '/og-teachers.png',
  },
  {
    path: '/contribute',
    title: 'Contribute — Indian Data Project',
    description: 'How to use the data, report issues, contribute datasets, and improve the Indian Data Project.',
    image: '/og-logo.png',
  },
];

// ─── Injection engine ──────────────────────────────────────────────

/**
 * Replaces the 10 dynamic OG/meta tag values in the HTML template.
 * Returns the modified HTML and the number of successful replacements.
 */
function injectMeta(html, { title, description, url, imageUrl }) {
  let result = html;
  let count = 0;

  const replacers = [
    // 1. <title>
    [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
    // 2. meta name="description"
    [/(<meta\s+name="description"\s+content=")[^"]*(")/,          `$1${description}$2`],
    // 3. link rel="canonical"
    [/(<link\s+rel="canonical"\s+href=")[^"]*(")/,                `$1${url}$2`],
    // 4. og:title
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/,         `$1${title}$2`],
    // 5. og:description
    [/(<meta\s+property="og:description"\s+content=")[^"]*(")/,   `$1${description}$2`],
    // 6. og:url
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/,           `$1${url}$2`],
    // 7. og:image (not og:image:width or og:image:height)
    [/(<meta\s+property="og:image"\s+content=")[^"]*(")/,         `$1${imageUrl}$2`],
    // 8. twitter:title
    [/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,        `$1${title}$2`],
    // 9. twitter:description
    [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,  `$1${description}$2`],
    // 10. twitter:image
    [/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,        `$1${imageUrl}$2`],
  ];

  for (const [pattern, replacement] of replacers) {
    if (pattern.test(result)) {
      count++;
      result = result.replace(pattern, replacement);
    }
  }

  return { html: result, count };
}

// ─── Font preload injection ───────────────────────────────────────

/**
 * Scans dist/assets/ for Source Sans 3 and JetBrains Mono Latin woff2 files
 * and returns <link rel="preload"> tags to inject into <head>.
 * Eliminates the CSS→font discovery waterfall (~200ms FCP improvement).
 */
function buildFontPreloadTags() {
  const assetsDir = join(DIST, 'assets');
  if (!existsSync(assetsDir)) return '';

  const files = readdirSync(assetsDir);
  // Only preload Latin subset files — the browser only downloads these for English content.
  // Other subsets (cyrillic, greek, vietnamese) are handled by unicode-range.
  const woff2Files = files.filter(
    (f) => f.endsWith('.woff2') && f.includes('-latin-') && !f.includes('-latin-ext-')
  );

  if (woff2Files.length === 0) return '';

  const tags = woff2Files
    .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
    .join('\n    ');

  console.log(`[inject-og] Found ${woff2Files.length} font file(s) to preload: ${woff2Files.join(', ')}`);
  return tags;
}

/**
 * Injects font preload <link> tags right before </head>.
 */
function injectFontPreloads(html, preloadTags) {
  if (!preloadTags) return html;
  return html.replace('</head>', `    ${preloadTags}\n  </head>`);
}

// ─── Main ──────────────────────────────────────────────────────────

function main() {
  const templatePath = join(DIST, 'index.html');
  if (!existsSync(templatePath)) {
    console.error('[inject-og] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  // Inject font preloads into the template before per-route OG injection
  const rawTemplate = readFileSync(templatePath, 'utf-8');
  const fontPreloads = buildFontPreloadTags();
  const template = injectFontPreloads(rawTemplate, fontPreloads);

  // Also update the root index.html with font preloads
  if (fontPreloads) {
    writeFileSync(templatePath, template, 'utf-8');
  }
  let injected = 0;
  let errors = 0;

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    const imageUrl = route.image.startsWith('http') ? route.image : `${BASE_URL}${route.image}`;

    const { html, count } = injectMeta(template, {
      title: route.title,
      description: route.description,
      url,
      imageUrl,
    });

    if (count < EXPECTED_REPLACEMENTS) {
      console.error(
        `[inject-og] WARNING: ${route.path} — only ${count}/${EXPECTED_REPLACEMENTS} tags replaced`
      );
      errors++;
    }

    // Write to dist/{route}/index.html
    const outDir = route.path === '/' ? DIST : join(DIST, route.path.slice(1));
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
    injected++;
  }

  console.log(`[inject-og] Injected OG tags for ${injected} routes.`);

  if (errors > 0) {
    console.error(`[inject-og] ${errors} route(s) had missing tag replacements. Failing build.`);
    process.exit(1);
  }
}

main();
