import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--violet)',
  'Population Indicators': 'var(--violet)',
  'Health Indicators': 'var(--violet-light)',
  'Literacy Indicators': 'var(--violet)',
  'Data Vintage Transparency': 'var(--gold)',
  'Data Freshness': 'var(--violet-light)',
  'Limitations': 'var(--saffron)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Census and demographics data draws from four tiers of authoritative sources, each covering different time periods and geographic levels:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong style={{ color: 'var(--violet)' }}>Tier 1 — World Bank Open Data</strong> (national, 2000–2024, automated).{' '}
              <a
                href="https://data.worldbank.org/country/india"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--violet)' }}
              >
                data.worldbank.org
              </a>{' '}
              — 21 indicators covering population, age structure, vital statistics, urbanization, health outcomes, and literacy. Auto-refreshed semi-annually via GitHub Actions.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong style={{ color: 'var(--violet)' }}>Tier 2 — NPC Population Projections</strong> (state-level, projected 2026, curated).{' '}
              <a
                href="https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--violet)' }}
              >
                Population Projections for India and States 2011-2036
              </a>{' '}
              — Official government projections by the Technical Group on Population Projections, National Commission on Population (July 2020). Used for state-level population estimates since Census 2021 was never conducted. These are projections, not enumerated counts.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong style={{ color: 'var(--violet)' }}>Tier 2 — NFHS-5</strong> (state-level, 2019-21, curated).{' '}
              <a
                href="https://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--violet)' }}
              >
                National Family Health Survey-5
              </a>{' '}
              — The most recent large-scale health and demographics survey (2019-21). State-level TFR, IMR, immunization, nutrition, and gender indicators. Conducted by IIPS under MoHFW.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong style={{ color: 'var(--violet)' }}>Tier 2 — SRS 2023</strong> (state-level, 2023, curated).{' '}
              <a
                href="https://censusindia.gov.in/nada/index.php/catalog/46172"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--violet)' }}
              >
                Sample Registration System
              </a>{' '}
              — Annual vital statistics from the Office of the Registrar General. Provides the most current state-level birth rates, death rates, IMR, and TFR (2023 data).
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong style={{ color: 'var(--violet)' }}>Tier 3 — Census of India 2011</strong> (state-level, 2011, baseline).{' '}
              <a
                href="https://censusindia.gov.in/census.website/data/census-tables"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--violet)' }}
              >
                censusindia.gov.in
              </a>{' '}
              — The last complete enumeration of India's population. Provides the baseline for state-level density, literacy (gender-wise), sex ratio, and urbanization. Primary Census Abstract (Table C-01, C-08).
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Population Indicators',
    content: (
      <>
        <p>
          Population data combines World Bank national time series, NPC 2026 state projections, and Census 2011 state-level metadata:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Vintage</th>
                <th scope="col" className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Total Population (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2024</td><td className="py-2">persons</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">State Population</td><td className="py-2 pr-4 text-xs">NPC Projections</td><td className="py-2 pr-4 text-xs">2026 projected</td><td className="py-2">persons</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Population Growth (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2024</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Population Density</td><td className="py-2 pr-4 text-xs">Census 2011</td><td className="py-2 pr-4 text-xs">2011</td><td className="py-2">per sq km</td></tr>
              <tr><td className="py-2 pr-4">Decadal Growth (2001-11)</td><td className="py-2 pr-4 text-xs">Census 2011</td><td className="py-2 pr-4 text-xs">2011</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          State population figures are NPC projections (as of 1 July 2026), not census counts. Density, urbanization, and decadal growth remain from Census 2011 — no newer state-level enumeration exists.
        </p>
      </>
    ),
  },
  {
    title: 'Health Indicators',
    content: (
      <>
        <p>
          Health data blends three sources: World Bank for national trends, SRS 2023 for the most current state-level vital stats, and NFHS-5 for health survey indicators:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Vintage</th>
                <th scope="col" className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">IMR (national trend)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2024</td><td className="py-2">per 1000 births</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">IMR (state-level)</td><td className="py-2 pr-4 text-xs">SRS 2023</td><td className="py-2 pr-4 text-xs">2023</td><td className="py-2">per 1000 births</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">MMR (national trend)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2020</td><td className="py-2">per 100K births</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Under-5 Mortality</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000–2024</td><td className="py-2">per 1000 births</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">TFR (state-level)</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">children/woman</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Stunting</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">% under-5</td></tr>
              <tr><td className="py-2 pr-4">Full Immunization</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">% 12-23 months</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: 'Literacy Indicators',
    content: (
      <>
        <p>
          Literacy data comes from Census 2011 (state-level gender-wise breakdown) and World Bank (sparse national time series):
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>Literacy Rate</strong> — Percentage of persons aged 7+ who can read and write with understanding in any language (Census definition). National: 74.04% (2011). World Bank indicator SE.ADT.LITR.ZS uses 15+ definition.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>Gender Gap</strong> — Male literacy rate minus female literacy rate, in percentage points. National gap: 16.68pp (2011), down from 21.59pp (2001).
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>Sex Ratio</strong> — Number of females per 1,000 males. Census 2011 national: 943. Above 1,000 indicates more females (only Kerala at 1,084 in 2011).
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Data Vintage Transparency',
    content: (
      <>
        <p>
          India's last census was in 2011. Census 2021 was never conducted — first delayed by COVID-19, then by administrative and political factors. Census 2027 is planned to begin houselisting in April 2026 with enumeration in February 2027. This creates a 16-year data gap for state-level population counts.
        </p>
        <p className="mt-4">
          We bridge this gap with a multi-vintage approach:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Source</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Data Year</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Level</th>
                <th scope="col" className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Coverage</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">World Bank API</td><td className="py-2 pr-4 text-xs">2000–2024</td><td className="py-2 pr-4 text-xs">National</td><td className="py-2">Time series trends</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">NPC Projections</td><td className="py-2 pr-4 text-xs">2026 (projected)</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">State population estimates</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">SRS 2023</td><td className="py-2 pr-4 text-xs">2023</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Vital stats (CBR, CDR, IMR, TFR)</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Health, nutrition, gender</td></tr>
              <tr><td className="py-2 pr-4">Census 2011</td><td className="py-2 pr-4 text-xs">2011</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Literacy, density, sex ratio, urbanization</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Each chart and indicator explicitly notes its data vintage. State-level literacy and density figures are from Census 2011 — they are the most recent complete enumeration available for these metrics.
        </p>
      </>
    ),
  },
  {
    title: 'Data Freshness',
    content: (
      <>
        <p>
          Automated and manual data refresh cycles:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>World Bank indicators</strong> — Auto-refreshed semi-annually (January + July) via GitHub Actions. World Bank data has a ~1 year lag.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>SRS data</strong> — Updated manually when the Registrar General publishes the annual SRS Statistical Report (typically mid-year following the reference year).
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>NFHS data</strong> — Updated when a new round is published. NFHS-6 fieldwork is expected around 2026-27.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--violet)' }} />
            <span>
              <strong>Census data</strong> — Static until Census 2027 results are published (expected 2028-29).
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Census 2011 is 14+ years old.</strong> State-level literacy, density, and sex ratio figures are from 2011. State population uses NPC 2026 projections (not enumerated counts). The actual current values for literacy and urbanization are likely different — particularly for fast-urbanizing and high-growth states.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>NPC projections are not census counts.</strong> State population figures are statistical projections based on Census 2011 baseline plus state-specific fertility, mortality, and migration assumptions. Actual populations may differ — the projections were published in 2020 and do not account for COVID-19 migration effects or post-2020 demographic shifts. Census 2027 will provide actual enumerated counts.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Bifurcated states.</strong> Census 2011 was conducted before the formation of Telangana (2014) and the reorganization of J&K into two UTs (2019). State figures for these entities are derived from district-level aggregations.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>World Bank literacy data is sparse.</strong> India doesn't conduct annual literacy surveys, so WB has only a handful of data points (from NSS/NSSO rounds). The literacy time series may show gaps or discontinuities.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>Different survey definitions.</strong> Census defines literacy for age 7+, while World Bank (UNESCO) uses 15+. NFHS measures "women's literacy" for ages 15-49. These are not directly comparable across sources.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>SRS is sample-based.</strong> Unlike the Census which is a complete enumeration, SRS is a dual-record system using a sample of ~8.5 million people. State-level estimates have confidence intervals that are not shown here.
            </span>
          </li>
        </ul>
      </>
    ),
  },
];

function MethodologySection({
  section,
  index,
}: {
  section: (typeof SECTIONS)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });
  const accent = SECTION_COLORS[section.title] || 'var(--violet)';

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl p-6 md:p-8"
      style={{
        background: 'var(--bg-raised)',
        border: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <SectionNumber number={index + 1} isVisible={isVisible} />
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: accent }}
        />
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {section.title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {section.content}
      </div>
    </motion.section>
  );
}

export default function CensusMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Census & Demographics — Indian Data Project"
        description="Data sources, indicator definitions, vintage transparency, and limitations for census and demographics data. Census 2011, NFHS-5, SRS 2023, World Bank."
        path="/census/methodology"
        image="/og-census.png"
      />

      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-4 md:pt-14 md:pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: 'var(--violet)' }}
        >
          Census & Demographics
        </p>
        <h1
          className="text-composition font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Methodology
        </h1>
        <p
          className="text-base max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          How we source, validate, and present demographic data across four tiers of government sources. Every number traces to an authoritative publication.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-4">
        {SECTIONS.map((section, i) => (
          <MethodologySection key={section.title} section={section} index={i} />
        ))}

        <p
          className="text-xs text-center pt-4"
          style={{ color: 'var(--text-muted)' }}
        >
          Questions about methodology? Check the source links above or open an issue on{' '}
          <a
            href="https://github.com/ronit111/indian-data-project"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover"
            style={{ color: 'var(--violet)' }}
          >
            GitHub
          </a>.
        </p>
      </div>
    </motion.div>
  );
}
