import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Environment data draws from five tiers of authoritative sources, spanning national time series and state-level assessments:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span>
              <strong style={{ color: 'var(--teal)' }}>Tier 1 — World Bank Open Data</strong> (national, 2000-2023, automated).{' '}
              <a href="https://data.worldbank.org/country/india" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                data.worldbank.org
              </a>{' '}
              — 11 environment indicators covering PM2.5, forest cover, renewable energy share, coal electricity, energy use per capita, CO₂ emissions, GHG, and protected areas. Auto-refreshed quarterly via GitHub Actions.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span>
              <strong style={{ color: 'var(--teal)' }}>Tier 2 — CPCB NAQI</strong> (state + city AQI, 2023, curated).{' '}
              <a href="https://airquality.cpcb.gov.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                airquality.cpcb.gov.in
              </a>{' '}
              — Central Pollution Control Board National Air Quality Index. Annual average AQI across continuous monitoring stations for 30 states/UTs and 30 most polluted cities.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span>
              <strong style={{ color: 'var(--teal)' }}>Tier 2 — ISFR 2023</strong> (state forest cover, curated).{' '}
              <a href="https://fsi.nic.in/isfr-2023" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                fsi.nic.in
              </a>{' '}
              — India State of Forest Report by Forest Survey of India. Satellite-based assessment of forest cover (km²), percentage of geographic area, and change from ISFR 2021 for all states/UTs.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span>
              <strong style={{ color: 'var(--teal)' }}>Tier 2 — CEA + MOSPI Energy API</strong> (capacity + supply, automated + curated).{' '}
              <a href="https://cea.nic.in/installed-capacity-report/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                cea.nic.in
              </a>{' '}
              — CEA installed capacity by fuel type (curated).{' '}
              <a href="https://api.mospi.gov.in" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                MOSPI Energy API
              </a>{' '}
              — Energy supply balance by commodity in KToE (automated via eSankhyiki API).
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span>
              <strong style={{ color: 'var(--teal)' }}>Tier 2 — CWC + CGWB</strong> (water resources, curated).{' '}
              <a href="https://cwc.gov.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                cwc.gov.in
              </a>{' '}
              — Central Water Commission weekly reservoir bulletin (5 regions, % of full storage) and{' '}
              <a href="https://cgwb.gov.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--teal)' }}>
                cgwb.gov.in
              </a>{' '}
              — Central Ground Water Board Dynamic Assessment 2023 (state-wise groundwater development stage).
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Air Quality Indicators',
    content: (
      <>
        <p>
          Air quality data uses two complementary measures:
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>PM2.5 (μg/m³)</strong> — Fine particulate matter annual mean. World Bank series (2000-2020). WHO guideline: 5 μg/m³. India NAAQS: 40 μg/m³.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>AQI</strong> — Composite index (0-500) based on 8 pollutants. CPCB NAQI data. State averages are mean of monitoring station annual averages.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Energy & Carbon Indicators',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>Installed Capacity (MW)</strong> — CEA data. Represents nameplate capacity, not actual generation. Solar/wind capacity factors are 15-25%, so actual generation share is lower than capacity share.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>CO₂ per capita (tonnes)</strong> — World Bank (IEA). Production-based accounting (where emissions occur), not consumption-based.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>Renewable energy %</strong> — World Bank. Final energy consumption from renewable sources (includes traditional biomass, which is large in India).</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Forest & Water Indicators',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>Forest Cover (ISFR)</strong> — Satellite-based (LISS-III, 23.5m resolution). Includes Very Dense (&gt;70% canopy), Moderately Dense (40-70%), Open (10-40%). Plantations and orchards count as forest cover.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>Groundwater Stage (%)</strong> — CGWB Dynamic Assessment. Ratio of annual extraction to annual recharge. Safe (&lt;70%), Semi-Critical (70-90%), Critical (90-100%), Over-Exploited (&gt;100%).</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--teal)' }} />
            <span><strong>Reservoir Storage (%)</strong> — CWC weekly bulletin. Live storage as % of Full Reservoir Level (FRL) for 150 major reservoirs across 5 regions.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Data Vintage & Gaps',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>World Bank data has ~1-2 year lag. PM2.5 latest: 2020. Forest cover latest: 2023. Energy data latest: 2023.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>CO₂ per capita and GHG total time series may be empty from World Bank API. Curated national figures are used as fallback.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>CPCB AQI monitoring is concentrated in urban areas. Rural air quality is underrepresented.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>CEA capacity ≠ generation. Solar/wind have lower capacity factors than coal, so their actual generation share is lower than their capacity share suggests.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Limitations',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>ISFR counts plantations as forest. The national 25% figure overstates natural forest cover. Ecological quality is not captured.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>CWC reservoir data is a snapshot — storage varies weekly with monsoon patterns. The values shown represent a mid-year snapshot.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>CO₂ data uses production-based accounting. India's consumption-based emissions (including imported goods) may differ.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>Groundwater assessment covers major states. Smaller UTs (Lakshadweep, Andaman & Nicobar) may be excluded from CGWB data.</span>
          </li>
        </ul>
      </>
    ),
  },
];

function MethodSection({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  return (
    <section ref={ref} className="composition">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <SectionNumber number={index + 1} className="mb-4 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl font-bold mb-4"
          style={{ color: 'var(--teal)' }}
        >
          {section.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {section.content}
        </motion.div>
      </div>
    </section>
  );
}

export default function EnvironmentMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Environment Data | Indian Data Project"
        description="Data sources, indicator definitions, vintage, and limitations for environment data on Indian Data Project."
        path="/environment/methodology"
        image="/og-environment.png"
      />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 md:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition font-bold mb-3"
        >
          Environment Methodology
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-base mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          How we source, process, and validate India's environment data. Every number traces to an authoritative primary source.
        </motion.p>
      </div>

      {SECTIONS.map((section, i) => (
        <MethodSection key={section.title} section={section} index={i} />
      ))}
    </motion.div>
  );
}
