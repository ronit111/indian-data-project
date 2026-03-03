import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SectionNumber } from '../components/ui/SectionNumber.tsx';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';
import { loadGlossary } from '../lib/dataLoader.ts';
import type { GlossaryTerm, GlossaryData } from '../lib/data/schema.ts';

const DOMAIN_CONFIG = {
  budget: {
    accent: 'var(--saffron)',
    accentDim: 'rgba(255,107,53,0.12)',
    label: 'Budget 2025-26',
    title: 'Budget Glossary',
    description: 'Key budget terms explained in plain language. No economics degree required.',
    ogImage: '/og-budget.png',
    basePath: '/budget/glossary',
    seoTitle: 'Glossary — Budget 2025-26 — Indian Data Project',
    seoDescription: 'Plain-language definitions of Union Budget terms: fiscal deficit, revenue receipts, capital expenditure, cess, devolution, and more.',
  },
  economy: {
    accent: 'var(--cyan)',
    accentDim: 'rgba(74,234,220,0.12)',
    label: 'Economic Survey 2025-26',
    title: 'Economy Glossary',
    description: 'Economic terms and indicators explained simply. What GDP, inflation, and trade numbers actually mean.',
    ogImage: '/og-economy.png',
    basePath: '/economy/glossary',
    seoTitle: 'Glossary — Economic Survey 2025-26 — Indian Data Project',
    seoDescription: 'Plain-language definitions of economic terms: GDP growth, CPI inflation, trade deficit, current account, sectoral composition, and more.',
  },
  rbi: {
    accent: 'var(--gold)',
    accentDim: 'rgba(255,200,87,0.12)',
    label: 'RBI Data',
    title: 'RBI Glossary',
    description: 'Monetary policy terms in plain language. What the repo rate, CRR, and MPC decisions actually mean for you.',
    ogImage: '/og-rbi.png',
    basePath: '/rbi/glossary',
    seoTitle: 'Glossary — RBI Data — Indian Data Project',
    seoDescription: 'Plain-language definitions of RBI terms: repo rate, CRR, SLR, MPC, inflation targeting, forex reserves, and more.',
  },
  states: {
    accent: 'var(--emerald)',
    accentDim: 'rgba(74,222,128,0.12)',
    label: 'State Finances',
    title: 'State Finances Glossary',
    description: 'State-level economic terms explained simply. What GSDP, devolution, and fiscal deficit mean for your state.',
    ogImage: '/og-states.png',
    basePath: '/states/glossary',
    seoTitle: 'Glossary — State Finances — Indian Data Project',
    seoDescription: 'Plain-language definitions of state finance terms: GSDP, per capita income, devolution, FRBM Act, fiscal deficit, and more.',
  },
  census: {
    accent: 'var(--violet)',
    accentDim: 'rgba(139,92,246,0.12)',
    label: 'Census & Demographics',
    title: 'Census Glossary',
    description: 'Demographic terms explained in plain language. What population density, fertility rate, and sex ratio actually mean.',
    ogImage: '/og-census.png',
    basePath: '/census/glossary',
    seoTitle: 'Glossary — Census & Demographics — Indian Data Project',
    seoDescription: 'Plain-language definitions of demographic terms: census, population density, TFR, IMR, MMR, demographic dividend, urbanization, literacy rate, and more.',
  },
  education: {
    accent: 'var(--blue)',
    accentDim: 'rgba(59,130,246,0.12)',
    label: 'Education',
    title: 'Education Glossary',
    description: 'Education terms explained in plain language. What GER, dropout rate, and pupil-teacher ratio actually mean.',
    ogImage: '/og-education.png',
    basePath: '/education/glossary',
    seoTitle: 'Glossary — Education — Indian Data Project',
    seoDescription: 'Plain-language definitions of education terms: GER, NER, dropout rate, PTR, ASER, UDISE, NEP 2020, foundational literacy, and more.',
  },
  employment: {
    accent: 'var(--amber)',
    accentDim: 'rgba(245,158,11,0.12)',
    label: 'Employment',
    title: 'Employment Glossary',
    description: 'Labour market terms explained in plain language. What LFPR, unemployment rate, and informal sector actually mean.',
    ogImage: '/og-employment.png',
    basePath: '/employment/glossary',
    seoTitle: 'Glossary — Employment — Indian Data Project',
    seoDescription: 'Plain-language definitions of employment terms: LFPR, unemployment rate, PLFS, informal sector, gig economy, structural transformation, and more.',
  },
  healthcare: {
    accent: 'var(--rose)',
    accentDim: 'rgba(244,63,94,0.12)',
    label: 'Healthcare',
    title: 'Healthcare Glossary',
    description: 'Healthcare terms explained in plain language. What out-of-pocket spending, PHC, and disease burden actually mean.',
    ogImage: '/og-healthcare.png',
    basePath: '/healthcare/glossary',
    seoTitle: 'Glossary — Healthcare — Indian Data Project',
    seoDescription: 'Plain-language definitions of healthcare terms: PHC, CHC, out-of-pocket spending, immunization, TB incidence, hospital beds, and more.',
  },
  environment: {
    accent: 'var(--teal)',
    accentDim: 'rgba(20,184,166,0.12)',
    label: 'Environment',
    title: 'Environment Glossary',
    description: 'Environment terms explained in plain language. What AQI, PM2.5, forest cover, and groundwater stage actually mean.',
    ogImage: '/og-environment.png',
    basePath: '/environment/glossary',
    seoTitle: 'Glossary — Environment — Indian Data Project',
    seoDescription: 'Plain-language definitions of environment terms: AQI, PM2.5, NAAQS, forest cover, ISFR, renewable energy, CO2 emissions, groundwater, and more.',
  },
  elections: {
    accent: 'var(--indigo)',
    accentDim: 'rgba(99,102,241,0.12)',
    label: 'Elections',
    title: 'Elections Glossary',
    description: 'Election terms explained in plain language. What FPTP, NOTA, EVM, delimitation, and vote share actually mean.',
    ogImage: '/og-elections.png',
    basePath: '/elections/glossary',
    seoTitle: 'Glossary — Elections — Indian Data Project',
    seoDescription: 'Plain-language definitions of election terms: Lok Sabha, FPTP, constituency, EVM, NOTA, vote share, delimitation, coalition, ADR, and more.',
  },
  crime: {
    accent: 'var(--crimson)',
    accentDim: 'rgba(220,38,38,0.12)',
    label: 'Crime & Safety',
    title: 'Crime & Safety Glossary',
    description: 'Crime terms explained in plain language. What IPC, FIR, cognizable offence, chargesheet, conviction rate, and NCRB actually mean.',
    ogImage: '/og-crime.png',
    basePath: '/crime/glossary',
    seoTitle: 'Glossary — Crime & Safety — Indian Data Project',
    seoDescription: 'Plain-language definitions of crime terms: IPC, FIR, chargesheet, conviction rate, NCRB, POCSO, crime rate, pendency, I4C, and more.',
  },
} as const;

type Domain = keyof typeof DOMAIN_CONFIG;

function TermCard({
  term,
  index,
  accent,
  accentDim,
  onRelatedClick,
}: {
  term: GlossaryTerm;
  index: number;
  accent: string;
  accentDim: string;
  onRelatedClick: (id: string) => void;
}) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  return (
    <motion.section
      ref={ref}
      id={term.id}
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl p-6 md:p-8 scroll-mt-24"
      style={{
        background: 'var(--bg-raised)',
        border: 'var(--border-subtle)',
      }}
    >
      {/* Header */}
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
          {term.term}
        </h2>
      </div>

      {/* Simple definition — the hero */}
      <div
        className="rounded-lg px-4 py-3 mb-4"
        style={{ background: accentDim }}
      >
        <p
          className="text-[10px] font-mono uppercase tracking-wider mb-1"
          style={{ color: accent }}
        >
          In simple terms
        </p>
        <p
          className="text-sm font-medium leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          {term.simple}
        </p>
      </div>

      {/* Detail */}
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: 'var(--text-secondary)' }}
      >
        {term.detail}
      </p>

      {/* In context */}
      {term.inContext && (
        <div
          className="flex items-start gap-2 mb-4 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span
            className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: accent }}
          />
          <span>
            <span className="font-mono text-xs" style={{ color: accent }}>
              2025-26:
            </span>{' '}
            {term.inContext}
          </span>
        </div>
      )}

      {/* Related terms */}
      {term.relatedTerms && term.relatedTerms.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Related
          </span>
          {term.relatedTerms.map((relId) => (
            <button
              key={relId}
              onClick={() => onRelatedClick(relId)}
              className="px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors bg-transparent"
              style={{
                color: accent,
                border: `1px solid ${accent}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = accentDim;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {relId.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default function GlossaryPage({ domain }: { domain: Domain }) {
  const config = DOMAIN_CONFIG[domain];
  const [glossary, setGlossary] = useState<GlossaryData | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadGlossary(domain, '2025-26').then(setGlossary).catch(console.error);
  }, [domain]);

  // Scroll to hash on load (for search deep-links)
  useEffect(() => {
    if (!glossary) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [glossary]);

  const scrollToTerm = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Brief highlight
      el.style.boxShadow = `0 0 0 2px ${config.accent}`;
      setTimeout(() => { el.style.boxShadow = ''; }, 1500);
    }
  }, [config.accent]);

  const terms = glossary?.terms ?? [];
  const filtered = filter
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(filter.toLowerCase()) ||
          t.simple.toLowerCase().includes(filter.toLowerCase())
      )
    : terms;

  // Alphabet index
  const letters = [...new Set(terms.map((t) => t.term[0].toUpperCase()))].sort();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title={config.seoTitle}
        description={config.seoDescription}
        path={config.basePath}
        image={config.ogImage}
      />

      {/* Page header */}
      <motion.div
        className="max-w-3xl mx-auto px-6 sm:px-8 pt-10 pb-4 md:pt-14 md:pb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="text-xs font-mono uppercase tracking-wider mb-2"
          style={{ color: config.accent }}
        >
          {config.label}
        </p>
        <h1
          className="text-composition font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {config.title}
        </h1>
        <p
          className="text-base max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          {config.description}
        </p>
      </motion.div>

      {/* Search + alpha index */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 sm:items-center"
        >
          {/* Filter input */}
          <div
            className="relative flex-1"
          >
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={`Filter ${terms.length} terms...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-transparent outline-none transition-colors"
              style={{
                color: 'var(--text-primary)',
                background: 'var(--bg-surface)',
                border: 'var(--border-subtle)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = config.accent;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '';
              }}
            />
          </div>

          {/* Alpha jump pills */}
          <div className="flex gap-1 flex-wrap">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  const term = terms.find((t) => t.term[0].toUpperCase() === letter);
                  if (term) scrollToTerm(term.id);
                }}
                className="w-7 h-7 rounded text-xs font-mono font-medium cursor-pointer transition-colors bg-transparent flex items-center justify-center"
                style={{
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = config.accent;
                  e.currentTarget.style.borderColor = `${config.accent}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Term count */}
        <p
          className="text-xs mt-3 font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          {filtered.length === terms.length
            ? `${terms.length} terms`
            : `${filtered.length} of ${terms.length} terms`}
        </p>
      </div>

      {/* Term cards */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 space-y-4">
        {filtered.map((term, i) => (
          <TermCard
            key={term.id}
            term={term}
            index={i}
            accent={config.accent}
            accentDim={config.accentDim}
            onRelatedClick={scrollToTerm}
          />
        ))}

        {filtered.length === 0 && filter && (
          <p
            className="text-sm text-center py-8"
            style={{ color: 'var(--text-muted)' }}
          >
            No terms matching "{filter}"
          </p>
        )}

        <p
          className="text-xs text-center pt-4"
          style={{ color: 'var(--text-muted)' }}
        >
          Terms explained for citizens, not economists. Source data from{' '}
          {domain === 'budget'
            ? 'Union Budget 2025-26'
            : domain === 'economy'
              ? 'Economic Survey 2025-26, World Bank'
              : domain === 'census'
                ? 'Census of India, NFHS-5, SRS, World Bank'
                : domain === 'states'
                  ? 'RBI Handbook, Finance Commission'
                  : domain === 'education'
                    ? 'UDISE+ 2023-24, ASER 2024, World Bank'
                    : domain === 'employment'
                      ? 'PLFS 2023-24, RBI KLEMS, World Bank'
                      : domain === 'healthcare'
                        ? 'NHP 2022, NFHS-5, World Bank'
                        : 'RBI, World Bank'}
        </p>
      </div>
    </motion.div>
  );
}
