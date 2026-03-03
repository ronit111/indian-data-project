import { Link, useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isBudget = location.pathname.startsWith('/budget');
  const isEconomy = location.pathname.startsWith('/economy');
  const isRBI = location.pathname.startsWith('/rbi');
  const isStates = location.pathname.startsWith('/states');
  const isCensus = location.pathname.startsWith('/census');
  const isEducation = location.pathname.startsWith('/education');
  const isEmployment = location.pathname.startsWith('/employment');
  const isHealthcare = location.pathname.startsWith('/healthcare');
  const isEnvironment = location.pathname.startsWith('/environment');
  const isElections = location.pathname.startsWith('/elections');
  const isCrime = location.pathname.startsWith('/crime');
  const isTopics = location.pathname.startsWith('/topics');
  const isOpenData = location.pathname === '/open-data';
  const isJournalists = location.pathname.startsWith('/for-journalists');
  const isTeachers = location.pathname.startsWith('/for-teachers');
  const isContribute = location.pathname === '/contribute';
  const isMultiplier = isOpenData || isJournalists || isTeachers || isContribute;
  const isDataDomain = isBudget || isEconomy || isRBI || isStates || isCensus || isEducation || isEmployment || isHealthcare || isEnvironment || isElections || isCrime || isTopics || isMultiplier;

  return (
    <footer className="relative py-8 pb-24 md:pb-8" style={{ background: 'var(--bg-surface)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {isDataDomain && (
          <div className="flex justify-center mb-6">
            <Link
              to="/#stories"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm no-underline transition-colors hover:bg-[var(--bg-raised)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5" />
              </svg>
              Indian Data Project
            </Link>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        {isBudget ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://openbudgetsindia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              Open Budgets India
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.gov.in/government-open-data-license-india"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              GODL
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isEconomy ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://www.indiabudget.gov.in/economicsurvey/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              Economic Survey of India
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.gov.in/government-open-data-license-india"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              GODL
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isRBI ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://data.rbi.org.in/DBIE/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              RBI DBIE
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot; Not affiliated with RBI or GoI
          </p>
        ) : isStates ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20States"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              RBI Handbook
            </a>
            {' '}&middot;{' '}
            <a
              href="https://fincomindia.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              Finance Commission
            </a>
            {' '}&middot; Not affiliated with RBI or GoI
          </p>
        ) : isCensus ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://censusindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              Census of India
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot;{' '}
            <a
              href="https://rchiips.org/nfhs/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              NFHS-5
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isEducation ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://udiseplus.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              UDISE+
            </a>
            {' '}&middot;{' '}
            <a
              href="https://asercentre.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              ASER
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isEmployment ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://mospi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              PLFS (MoSPI)
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isHealthcare ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://cbhidghs.mohfw.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              NHP (CBHI)
            </a>
            {' '}&middot;{' '}
            <a
              href="https://rchiips.org/nfhs/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              NFHS-5
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isEnvironment ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://airquality.cpcb.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              CPCB
            </a>
            {' '}&middot;{' '}
            <a
              href="https://fsi.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              ISFR 2023
            </a>
            {' '}&middot;{' '}
            <a
              href="https://cea.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              CEA
            </a>
            {' '}&middot;{' '}
            <a
              href="https://cwc.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              CWC/CGWB
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isElections ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              ECI
            </a>
            {' '}&middot;{' '}
            <a
              href="https://lokdhaba.ashoka.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              TCPD Lok Dhaba
            </a>
            {' '}&middot;{' '}
            <a
              href="https://adrindia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              ADR / MyNeta
            </a>
            {' '}&middot; Not affiliated with ECI or GoI
          </p>
        ) : isCrime ? (
          <p className="text-caption text-center md:text-left">
            Data from{' '}
            <a
              href="https://ncrb.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              NCRB
            </a>
            {' '}&middot;{' '}
            <a
              href="https://morth.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              MoRTH
            </a>
            {' '}&middot;{' '}
            <a
              href="https://bprd.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              BPRD
            </a>
            {' '}&middot;{' '}
            <a
              href="https://data.worldbank.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              World Bank
            </a>
            {' '}&middot; Not affiliated with GoI
          </p>
        ) : isTopics ? (
          <p className="text-caption text-center md:text-left">
            Cross-domain analysis from multiple government sources &middot; Not affiliated with GoI
          </p>
        ) : isMultiplier ? (
          <p className="text-caption text-center md:text-left">
            Open data tools for journalists, teachers, and developers &middot;{' '}
            <a
              href="https://github.com/ronit111/indian-data-project"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              AGPL-3.0
            </a>
          </p>
        ) : (
          <p className="text-caption text-center md:text-left">
            Open-source civic tech. Real government data, made accessible.
          </p>
        )}
        <p className="text-caption font-mono" style={{ color: 'var(--text-muted)' }}>
          {isBudget ? (
            'Union Budget 2025-26'
          ) : isEconomy ? (
            'Economic Survey 2025-26'
          ) : isRBI ? (
            'RBI Data 2025-26'
          ) : isStates ? (
            'State Finances 2022-23'
          ) : isCensus ? (
            'Census & Demographics'
          ) : isEducation ? (
            'Education 2025-26'
          ) : isEmployment ? (
            'Employment 2025-26'
          ) : isHealthcare ? (
            'Healthcare 2025-26'
          ) : isEnvironment ? (
            'Environment 2025-26'
          ) : isElections ? (
            'Elections 2025-26'
          ) : isCrime ? (
            'Crime & Safety 2022'
          ) : isTopics ? (
            'Cross-Domain Insights'
          ) : isOpenData ? (
            'Open Data API'
          ) : isJournalists ? (
            'For Journalists'
          ) : isTeachers ? (
            'For Teachers'
          ) : isContribute ? (
            'Contribute'
          ) : (
            <a
              href="https://github.com/ronit111/indian-data-project"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover"
              style={{ color: 'var(--text-muted)' }}
            >
              AGPL-3.0 · Open Source
            </a>
          )}
        </p>
        </div>
      </div>
    </footer>
  );
}
