import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';

const SECTION_COLORS: Record<string, string> = {
  'Data Sources': 'var(--rose)',
  'Infrastructure Indicators': 'var(--rose)',
  'Spending Indicators': 'var(--rose-light)',
  'Disease & Immunization Indicators': 'var(--rose)',
  'Data Vintage': 'var(--gold)',
  'Overlap with Census Domain': 'var(--rose-light)',
  'Limitations': 'var(--saffron)',
};

const SECTIONS = [
  {
    title: 'Data Sources',
    content: (
      <>
        <p>
          Healthcare data draws from three tiers of authoritative sources, each covering different geographic levels and time periods:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />
            <span>
              <strong style={{ color: 'var(--rose)' }}>Tier 1 — World Bank Open Data</strong> (national, 2000-2024, automated).{' '}
              <a
                href="https://data.worldbank.org/country/india"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--rose)' }}
              >
                data.worldbank.org
              </a>{' '}
              — 12 health indicators covering hospital beds, physicians, nurses, health expenditure, out-of-pocket spending, immunization coverage, TB incidence, and HIV prevalence. Auto-refreshed quarterly via GitHub Actions.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />
            <span>
              <strong style={{ color: 'var(--rose)' }}>Tier 2 — National Health Profile 2022</strong> (state-level infrastructure, curated).{' '}
              <a
                href="https://cbhidghs.mohfw.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--rose)' }}
              >
                cbhidghs.mohfw.gov.in
              </a>{' '}
              — Published by the Central Bureau of Health Intelligence (CBHI) under the Ministry of Health and Family Welfare. State-level data on hospital beds, PHCs, CHCs, sub-centres, and doctors at primary health centres.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />
            <span>
              <strong style={{ color: 'var(--rose)' }}>Tier 2 — NFHS-5</strong> (state-level immunization, 2019-21, curated).{' '}
              <a
                href="https://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium link-hover"
                style={{ color: 'var(--rose)' }}
              >
                rchiips.org/nfhs
              </a>{' '}
              — State-level full immunization, BCG, measles, and DPT3 coverage rates from the National Family Health Survey (2019-21). Conducted by IIPS under MoHFW.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Infrastructure Indicators',
    content: (
      <>
        <p>
          Infrastructure data combines World Bank national time series with NHP 2022 state-level facility counts:
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
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Hospital Beds (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2020</td><td className="py-2">per 1,000</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Physicians (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2022</td><td className="py-2">per 1,000</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Nurses/Midwives (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2022</td><td className="py-2">per 1,000</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Beds per Lakh (state)</td><td className="py-2 pr-4 text-xs">NHP 2022</td><td className="py-2 pr-4 text-xs">2022</td><td className="py-2">per lakh</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">PHCs (state)</td><td className="py-2 pr-4 text-xs">NHP 2022</td><td className="py-2 pr-4 text-xs">2022</td><td className="py-2">count</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">CHCs (state)</td><td className="py-2 pr-4 text-xs">NHP 2022</td><td className="py-2 pr-4 text-xs">2022</td><td className="py-2">count</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Sub-Centres (state)</td><td className="py-2 pr-4 text-xs">NHP 2022</td><td className="py-2 pr-4 text-xs">2022</td><td className="py-2">count</td></tr>
              <tr><td className="py-2 pr-4">Doctors at PHC (state)</td><td className="py-2 pr-4 text-xs">NHP 2022</td><td className="py-2 pr-4 text-xs">2022</td><td className="py-2">per 10K</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: 'Spending Indicators',
    content: (
      <>
        <p>
          Health spending data from World Bank covers both total and government expenditure, plus out-of-pocket burden:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Indicator</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>WB Code</th>
                <th scope="col" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>Vintage</th>
                <th scope="col" className="text-left py-2 font-medium" style={{ color: 'var(--text-primary)' }}>Unit</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-secondary)' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Health Expenditure (% GDP)</td><td className="py-2 pr-4 text-xs font-mono">SH.XPD.CHEX.GD.ZS</td><td className="py-2 pr-4 text-xs">2000-2021</td><td className="py-2">% GDP</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Health Exp Per Capita</td><td className="py-2 pr-4 text-xs font-mono">SH.XPD.CHEX.PC.CD</td><td className="py-2 pr-4 text-xs">2000-2021</td><td className="py-2">USD</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Out-of-Pocket (%)</td><td className="py-2 pr-4 text-xs font-mono">SH.XPD.OOPC.CH.ZS</td><td className="py-2 pr-4 text-xs">2000-2021</td><td className="py-2">%</td></tr>
              <tr><td className="py-2 pr-4">Govt Health Exp (% GDP)</td><td className="py-2 pr-4 text-xs font-mono">SH.XPD.GHED.GD.ZS</td><td className="py-2 pr-4 text-xs">2000-2021</td><td className="py-2">% GDP</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Per-capita figures are in current US dollars. India's per-capita health spending (~$80) compares with a global average of ~$1,100.
        </p>
      </>
    ),
  },
  {
    title: 'Disease & Immunization Indicators',
    content: (
      <>
        <p>
          Disease and immunization data combines World Bank national time series with NFHS-5 state-level survey data:
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
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">DPT Immunization (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2023</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Measles Immunization (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2023</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">TB Incidence (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2022</td><td className="py-2">per 100K</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">HIV Prevalence (national)</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2023</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Births Attended by Skilled Staff</td><td className="py-2 pr-4 text-xs">World Bank</td><td className="py-2 pr-4 text-xs">2000-2021</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Full Immunization (state)</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">BCG Coverage (state)</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">%</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">Measles Coverage (state)</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">%</td></tr>
              <tr><td className="py-2 pr-4">DPT3 Coverage (state)</td><td className="py-2 pr-4 text-xs">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2">%</td></tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: 'Data Vintage',
    content: (
      <>
        <p>
          Healthcare data comes from different years depending on the source. Here is a transparency summary:
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
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">World Bank API</td><td className="py-2 pr-4 text-xs">2000-2023</td><td className="py-2 pr-4 text-xs">National</td><td className="py-2">Time series trends (12 indicators)</td></tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}><td className="py-2 pr-4">NHP 2022</td><td className="py-2 pr-4 text-xs">2022</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Infrastructure (beds, PHCs, CHCs, doctors)</td></tr>
              <tr><td className="py-2 pr-4">NFHS-5</td><td className="py-2 pr-4 text-xs">2019-21</td><td className="py-2 pr-4 text-xs">State</td><td className="py-2">Immunization coverage</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          World Bank data typically has a ~1 year lag. NHP 2022 is the latest National Health Profile. NFHS-5 (2019-21) is the most recent family health survey; NFHS-6 is expected around 2026-27.
        </p>
      </>
    ),
  },
  {
    title: 'Overlap with Census Domain',
    content: (
      <>
        <p>
          The Healthcare domain focuses specifically on three areas:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />
            <span>
              <strong>Infrastructure</strong> — Hospital beds, physicians, nurses, PHCs, CHCs, sub-centres, doctors at PHC.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />
            <span>
              <strong>Spending</strong> — Health expenditure as % of GDP, per capita spending, out-of-pocket burden, government health expenditure.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--rose)' }} />
            <span>
              <strong>Disease & Immunization</strong> — DPT coverage, measles coverage, TB incidence, HIV prevalence, births attended by skilled staff, full immunization by state.
            </span>
          </li>
        </ul>
        <p className="mt-4">
          Mortality indicators (IMR, MMR, under-5 mortality) and life expectancy data are in the <strong>Census & Demographics</strong> domain to avoid duplication. If you are looking for state-level IMR or TFR, see the Census domain's Health section.
        </p>
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
              <strong>NHP infrastructure data may not capture the private sector fully.</strong> The National Health Profile primarily covers government healthcare facilities. India's private healthcare sector is substantial (estimated 60-70% of all healthcare delivery) but not systematically enumerated in NHP.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>NFHS-5 is 5 years old.</strong> The immunization data (2019-21) may not reflect current coverage, particularly post-COVID changes to routine immunization programmes. Universal Immunization Programme data from MoHFW may be more current but is not structured for cross-state comparison.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>TB and HIV data has reporting gaps.</strong> TB incidence is estimated by WHO (not directly measured) using modelling that applies to country-level aggregates. State-level TB burden is not available from World Bank. HIV prevalence data is based on sentinel surveillance and modelling, not universal testing.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>World Bank health spending data lags by ~2 years.</strong> The most recent health expenditure figures available are typically from 2021 or earlier. India's National Health Accounts (NHA) released by MOSPI may have more recent estimates, but these are not yet available via automated API.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span>
              <strong>State-level spending data is not available.</strong> Per-state health expenditure (as % of GSDP) is not in our current data sources. This would require state budget analysis similar to the State Finances domain.
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
  const accent = SECTION_COLORS[section.title] || 'var(--rose)';

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

export default function HealthcareMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Healthcare — Indian Data Project"
        description="Data sources, indicator definitions, vintage transparency, and limitations for healthcare data. World Bank, NHP 2022, NFHS-5."
        path="/healthcare/methodology"
        image="/og-healthcare.png"
      />

      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-4 md:pt-14 md:pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: 'var(--rose)' }}
        >
          Healthcare
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
          How we source, validate, and present healthcare data across World Bank, NHP, and NFHS sources. Every number traces to an authoritative publication.
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
            style={{ color: 'var(--rose)' }}
          >
            GitHub
          </a>.
        </p>
      </div>
    </motion.div>
  );
}
