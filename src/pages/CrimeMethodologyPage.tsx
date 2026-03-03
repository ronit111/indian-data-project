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
          Crime data draws from four authoritative Indian institutions covering different aspects of crime, safety, and policing:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span>
              <strong style={{ color: 'var(--crimson)' }}>National Crime Records Bureau (NCRB)</strong> — Crime in India 2022.{' '}
              <a href="https://ncrb.gov.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--crimson)' }}>
                ncrb.gov.in
              </a>{' '}
              — FIR-based crime statistics for all cognizable offences across all states and UTs. Published annually, typically with a 1-2 year lag.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span>
              <strong style={{ color: 'var(--crimson)' }}>Ministry of Road Transport &amp; Highways (MoRTH)</strong> — Road Accidents in India 2022.{' '}
              <a href="https://morth.nic.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--crimson)' }}>
                morth.nic.in
              </a>{' '}
              — Comprehensive road accident data compiled from police and transport department records. More detailed than NCRB motor vehicle accident data.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span>
              <strong style={{ color: 'var(--crimson)' }}>Bureau of Police Research &amp; Development (BPRD)</strong> — Data on Police Organisations 2022.{' '}
              <a href="https://bprd.nic.in/" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--crimson)' }}>
                bprd.nic.in
              </a>{' '}
              — Police workforce statistics: sanctioned vs actual strength, state-wise ratios, gender composition, vacancies.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span>
              <strong style={{ color: 'var(--crimson)' }}>World Bank</strong> — Intentional homicide rate (per 100,000).{' '}
              <a href="https://data.worldbank.org/indicator/VC.IHR.PSRC.P5" target="_blank" rel="noopener noreferrer" className="font-medium link-hover" style={{ color: 'var(--crimson)' }}>
                World Bank Open Data
              </a>{' '}
              — UNODC-sourced homicide data for international comparison. Time series from 1990 to 2022.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'NCRB Methodology — FIR-Based Data',
    content: (
      <>
        <p>
          NCRB data is fundamentally based on First Information Reports (FIRs) — official complaints registered at police stations for cognizable offences. This has important implications:
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span><strong>Only cognizable offences</strong> — Non-cognizable offences (minor fights, defamation) are excluded because they don't generate FIRs.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span><strong>Underreporting is structural</strong> — Crimes must be reported AND registered as FIRs to appear in NCRB data. Victims may not report due to social stigma, distrust of police, or fear of retaliation. Police may refuse to register FIRs or downgrade offences.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
            <span><strong>Two crime categories</strong> — IPC crimes (Indian Penal Code, now Bharatiya Nyaya Sanhita) and SLL crimes (Special &amp; Local Laws like NDPS, Arms Act, POCSO). Our data uses the 2022 IPC classification since BNS took effect only in July 2024.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'The Kerala Paradox',
    content: (
      <>
        <p>
          Kerala consistently records India's highest crime rate (~1,287 per lakh in 2022, 3x the national average), yet ranks among the safest states in citizen surveys. This "paradox" is well-documented:
        </p>
        <ul className="mt-4 space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span><strong>Better reporting</strong> — Higher literacy and awareness leads to more crimes being reported. Kerala's police-population ratio (188 per lakh) is well above the national average (151).</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span><strong>Accessible policing</strong> — More police stations per capita, women-friendly stations, and online FIR filing increase registration rates.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span><strong>Compare with caution</strong> — States with low rates (Bihar at 295, UP at 452) may have higher underreporting due to fewer police stations, social barriers, and lower awareness. Crime rate alone is a poor proxy for safety.</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Data Vintage',
    content: (
      <>
        <ul className="space-y-2">
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>NCRB Crime in India: <strong>2022</strong> (published December 2023). National trend data from 2014 to 2022 (9 data points). This is the latest available edition.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>MoRTH Road Accidents: <strong>2022</strong>. National trend from 2014 to 2022. State fatality rates for 2022.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>BPRD Police Data: <strong>2022</strong>. Sanctioned and actual police strength, state-wise ratios, women in police.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>Cybercrime: NCRB FIR data from 2017-2022. I4C portal data for 2022 complaints and financial losses.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span>World Bank homicide rate: 1990-2022 (UNODC-sourced).</span>
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
            <span><strong>Underreporting</strong> — NCRB captures only crimes that become FIRs. The National Crime Victimization Survey (2019) estimated actual crime incidence is significantly higher than registered crimes. Crimes against women and lower-caste communities are particularly underreported.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>State comparability</strong> — Different states have different reporting cultures, policing infrastructure, and willingness to register FIRs. Direct state-to-state comparisons should account for these differences.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>Classification changes</strong> — The transition from IPC to BNS (2024) will make future comparisons with pre-2024 data challenging. Some offences have been reclassified or merged.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>COVID-19 effect</strong> — The 2020 dip in crime data reflects lockdown restrictions suppressing both crime and reporting, not a genuine improvement in safety. 2021-22 figures include a "catch-up" effect.</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--saffron)' }} />
            <span><strong>Cybercrime gap</strong> — The 34x gap between I4C complaints (22.68L) and NCRB FIRs (65.9K) means formal crime data severely understates cybercrime. Most online fraud victims file portal complaints but few become investigated FIRs.</span>
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
          style={{ color: 'var(--crimson)' }}
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

export default function CrimeMethodologyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <SEOHead
        title="Methodology — Crime & Safety Data | Indian Data Project"
        description="Data sources, NCRB methodology, Kerala paradox explanation, and limitations for crime and safety data on Indian Data Project."
        path="/crime/methodology"
        image="/og-crime.png"
      />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 md:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition font-bold mb-3"
        >
          Crime &amp; Safety Methodology
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-base mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          How we compiled India's crime data from NCRB, MoRTH, BPRD, and World Bank. Why crime rates don't mean what you think, and what FIR-based data cannot tell you.
        </motion.p>
      </div>

      {SECTIONS.map((section, i) => (
        <MethodSection key={section.title} section={section} index={i} />
      ))}
    </motion.div>
  );
}
