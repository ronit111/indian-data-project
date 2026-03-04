import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useUIStore } from '../../store/uiStore.ts';
import { useBudgetStore } from '../../store/budgetStore.ts';
import { useBudgetData } from '../../hooks/useBudgetData.ts';
import { loadGlossary, loadQuestions } from '../../lib/dataLoader.ts';
import type { GlossaryTerm, CitizenQuestion } from '../../lib/data/schema.ts';

interface SearchItem {
  type: 'ministry' | 'scheme' | 'page' | 'term' | 'question';
  id: string;
  name: string;
  subtitle: string;
  route: string;
}

const BADGE_STYLES: Record<SearchItem['type'], { bg: string; color: string }> = {
  ministry: { bg: 'var(--saffron-dim)', color: 'var(--saffron)' },
  scheme: { bg: 'rgba(16,185,129,0.15)', color: 'var(--positive)' },
  page: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  term: { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  question: { bg: 'rgba(251,191,36,0.15)', color: '#FBBF24' },
};

function glossaryTermToSearchItem(term: GlossaryTerm, domain: string): SearchItem {
  return {
    type: 'term',
    id: `${domain}-${term.id}`,
    name: term.term,
    subtitle: term.simple,
    route: `/${domain}/glossary#${term.id}`,
  };
}

function questionToSearchItem(q: CitizenQuestion): SearchItem {
  return {
    type: 'question',
    id: q.id,
    name: q.question,
    subtitle: q.answer,
    route: q.route,
  };
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const year = useBudgetStore((s) => s.selectedYear);
  const { expenditure, schemes } = useBudgetData(year);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogPanelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<SearchItem[]>([]);
  const [questionItems, setQuestionItems] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // Load glossary terms and citizen questions once
  useEffect(() => {
    Promise.all([
      loadGlossary('budget', '2025-26').catch(() => null),
      loadGlossary('economy', '2025-26').catch(() => null),
      loadGlossary('rbi', '2025-26').catch(() => null),
      loadGlossary('states', '2025-26').catch(() => null),
      loadGlossary('census', '2025-26').catch(() => null),
      loadGlossary('education', '2025-26').catch(() => null),
      loadGlossary('employment', '2025-26').catch(() => null),
      loadGlossary('healthcare', '2025-26').catch(() => null),
      loadGlossary('environment', '2025-26').catch(() => null),
      loadGlossary('elections', '2025-26').catch(() => null),
      loadGlossary('crime', '2025-26').catch(() => null),
    ]).then(([budget, economy, rbi, states, census, education, employment, healthcare, environment, elections, crime]) => {
      const items: SearchItem[] = [];
      if (budget) items.push(...budget.terms.map((t) => glossaryTermToSearchItem(t, 'budget')));
      if (economy) items.push(...economy.terms.map((t) => glossaryTermToSearchItem(t, 'economy')));
      if (rbi) items.push(...rbi.terms.map((t) => glossaryTermToSearchItem(t, 'rbi')));
      if (states) items.push(...states.terms.map((t) => glossaryTermToSearchItem(t, 'states')));
      if (census) items.push(...census.terms.map((t) => glossaryTermToSearchItem(t, 'census')));
      if (education) items.push(...education.terms.map((t) => glossaryTermToSearchItem(t, 'education')));
      if (employment) items.push(...employment.terms.map((t) => glossaryTermToSearchItem(t, 'employment')));
      if (healthcare) items.push(...healthcare.terms.map((t) => glossaryTermToSearchItem(t, 'healthcare')));
      if (environment) items.push(...environment.terms.map((t) => glossaryTermToSearchItem(t, 'environment')));
      if (elections) items.push(...elections.terms.map((t) => glossaryTermToSearchItem(t, 'elections')));
      if (crime) items.push(...crime.terms.map((t) => glossaryTermToSearchItem(t, 'crime')));
      setGlossaryTerms(items);
    });

    loadQuestions()
      .then((questions) => setQuestionItems(questions.map(questionToSearchItem)))
      .catch(() => {});
  }, []);

  // Build search index (memoized to avoid Fuse reconstruction on every render)
  const searchItems = useMemo(() => {
    const items: SearchItem[] = [];
    if (expenditure) {
      for (const m of expenditure.ministries) {
        items.push({
          type: 'ministry',
          id: m.id,
          name: m.name,
          subtitle: m.humanContext,
          route: `/budget/explore?ministry=${m.id}`,
        });
      }
    }
    if (schemes) {
      for (const s of schemes.schemes) {
        items.push({
          type: 'scheme',
          id: s.id,
          name: s.name,
          subtitle: s.humanContext,
          route: `/budget/explore?scheme=${s.id}`,
        });
      }
    }
    // Pages
    items.push(
      { type: 'page', id: 'topics', name: 'Cross-Domain Topics', subtitle: '12 topics weaving data across domains', route: '/topics' },
      { type: 'page', id: 'topic-women', name: 'Women in India', subtitle: 'Political voice, economic participation, education & health', route: '/topics/women-in-india' },
      { type: 'page', id: 'topic-fiscal', name: "India's Fiscal Health", subtitle: 'Growth engine, spending vs borrowing, monetary lever', route: '/topics/fiscal-health' },
      { type: 'page', id: 'topic-inflation', name: 'Inflation & Cost of Living', subtitle: 'Price trajectory, RBI response, fiscal connection', route: '/topics/inflation-cost' },
      { type: 'page', id: 'topic-edu-emp', name: 'Education to Employment Pipeline', subtitle: 'Enrollment, jobs crisis, spending gap', route: '/topics/education-employment' },
      { type: 'page', id: 'topic-health', name: 'Health Outcomes', subtitle: 'Infrastructure, disease burden, spending gap', route: '/topics/health-outcomes' },
      { type: 'page', id: 'topic-regional', name: 'Regional Inequality', subtitle: 'Economic divergence, human development, fiscal', route: '/topics/regional-inequality' },
      { type: 'page', id: 'topic-climate', name: 'Climate & Energy Transition', subtitle: 'Energy mix, carbon footprint, forest cover', route: '/topics/climate-energy' },
      { type: 'page', id: 'topic-youth', name: 'Youth & Jobs', subtitle: 'Youth unemployment, structural shift, education gap', route: '/topics/youth-jobs' },
      { type: 'page', id: 'topic-urban', name: 'Urban vs Rural Divide', subtitle: 'Urbanization wave, access gap', route: '/topics/urban-rural' },
      { type: 'page', id: 'topic-democracy', name: "India's Democratic Health", subtitle: 'Participation arc, quality of representation', route: '/topics/democratic-health' },
      { type: 'page', id: 'topic-agri', name: 'Agriculture & Food Security', subtitle: 'Productivity paradox, food prices, sustainability', route: '/topics/agriculture-food' },
      { type: 'page', id: 'topic-water', name: 'Water Crisis', subtitle: 'Groundwater stress, quality deficit, urban challenge', route: '/topics/water-crisis' },
      { type: 'page', id: 'home', name: 'Home', subtitle: 'Data domain portal and stories', route: '/' },
      { type: 'page', id: 'budget', name: 'Budget Story', subtitle: 'Union Budget 2025-26 visual narrative', route: '/budget' },
      { type: 'page', id: 'budget-explore', name: 'Budget Explorer', subtitle: 'Sortable table of all ministries', route: '/budget/explore' },
      { type: 'page', id: 'calculator', name: 'Tax Calculator', subtitle: 'Find where your taxes go', route: '/budget/calculator' },
      { type: 'page', id: 'budget-methodology', name: 'Budget Methodology', subtitle: 'Budget data sources and notes', route: '/budget/methodology' },
      { type: 'page', id: 'budget-glossary', name: 'Budget Glossary', subtitle: 'Budget terms in plain language', route: '/budget/glossary' },
      { type: 'page', id: 'economy', name: 'Economic Survey', subtitle: 'GDP, inflation, fiscal, trade analysis', route: '/economy' },
      { type: 'page', id: 'economy-explore', name: 'Economy Explorer', subtitle: 'Browse economic indicators across years', route: '/economy/explore' },
      { type: 'page', id: 'economy-methodology', name: 'Economy Methodology', subtitle: 'Economic Survey data sources and notes', route: '/economy/methodology' },
      { type: 'page', id: 'economy-glossary', name: 'Economy Glossary', subtitle: 'Economic terms in plain language', route: '/economy/glossary' },
      { type: 'page', id: 'rbi', name: 'RBI Story', subtitle: 'Monetary policy, forex, and credit narrative', route: '/rbi' },
      { type: 'page', id: 'rbi-explore', name: 'RBI Explorer', subtitle: 'Monetary and financial indicators', route: '/rbi/explore' },
      { type: 'page', id: 'rbi-methodology', name: 'RBI Methodology', subtitle: 'RBI data sources and indicator codes', route: '/rbi/methodology' },
      { type: 'page', id: 'rbi-glossary', name: 'RBI Glossary', subtitle: 'Monetary policy terms in plain language', route: '/rbi/glossary' },
      { type: 'page', id: 'states', name: 'State Finances', subtitle: 'GSDP, revenue, fiscal health across states', route: '/states' },
      { type: 'page', id: 'states-explore', name: 'States Explorer', subtitle: 'Browse state indicators and compare', route: '/states/explore' },
      { type: 'page', id: 'states-methodology', name: 'States Methodology', subtitle: 'State finances data sources and notes', route: '/states/methodology' },
      { type: 'page', id: 'states-glossary', name: 'States Glossary', subtitle: 'State finance terms in plain language', route: '/states/glossary' },
      { type: 'page', id: 'census', name: 'Census & Demographics', subtitle: 'Population, literacy, health, urbanization', route: '/census' },
      { type: 'page', id: 'census-explore', name: 'Census Explorer', subtitle: 'Browse demographic indicators by state', route: '/census/explore' },
      { type: 'page', id: 'census-methodology', name: 'Census Methodology', subtitle: 'Census data sources, vintages, and notes', route: '/census/methodology' },
      { type: 'page', id: 'census-glossary', name: 'Census Glossary', subtitle: 'Demographic terms in plain language', route: '/census/glossary' },
      { type: 'page', id: 'education', name: 'Education', subtitle: 'Enrollment, quality, dropout, spending', route: '/education' },
      { type: 'page', id: 'education-explore', name: 'Education Explorer', subtitle: 'Browse education indicators by state', route: '/education/explore' },
      { type: 'page', id: 'education-methodology', name: 'Education Methodology', subtitle: 'UDISE+, ASER, and World Bank data sources', route: '/education/methodology' },
      { type: 'page', id: 'education-glossary', name: 'Education Glossary', subtitle: 'Education terms in plain language', route: '/education/glossary' },
      { type: 'page', id: 'employment', name: 'Employment', subtitle: 'LFPR, unemployment, sectoral shift', route: '/employment' },
      { type: 'page', id: 'employment-explore', name: 'Employment Explorer', subtitle: 'Browse labour market indicators by state', route: '/employment/explore' },
      { type: 'page', id: 'employment-methodology', name: 'Employment Methodology', subtitle: 'PLFS, World Bank, RBI KLEMS sources', route: '/employment/methodology' },
      { type: 'page', id: 'employment-glossary', name: 'Employment Glossary', subtitle: 'Labour market terms in plain language', route: '/employment/glossary' },
      { type: 'page', id: 'healthcare', name: 'Healthcare', subtitle: 'Infrastructure, spending, immunization, disease', route: '/healthcare' },
      { type: 'page', id: 'healthcare-explore', name: 'Healthcare Explorer', subtitle: 'Browse health indicators by state', route: '/healthcare/explore' },
      { type: 'page', id: 'healthcare-methodology', name: 'Healthcare Methodology', subtitle: 'NHP, NFHS-5, and World Bank data sources', route: '/healthcare/methodology' },
      { type: 'page', id: 'healthcare-glossary', name: 'Healthcare Glossary', subtitle: 'Healthcare terms in plain language', route: '/healthcare/glossary' },
      { type: 'page', id: 'environment', name: 'Environment', subtitle: 'Air quality, forest cover, energy transition, water stress', route: '/environment' },
      { type: 'page', id: 'environment-explore', name: 'Environment Explorer', subtitle: 'Browse environment indicators by state', route: '/environment/explore' },
      { type: 'page', id: 'environment-methodology', name: 'Environment Methodology', subtitle: 'CPCB, ISFR, CEA, CWC, and World Bank data sources', route: '/environment/methodology' },
      { type: 'page', id: 'environment-glossary', name: 'Environment Glossary', subtitle: 'Environment terms in plain language', route: '/environment/glossary' },
      { type: 'page', id: 'elections', name: 'Elections', subtitle: 'Turnout, party landscape, candidates, women in Parliament', route: '/elections' },
      { type: 'page', id: 'elections-explore', name: 'Elections Explorer', subtitle: 'Browse election indicators by state', route: '/elections/explore' },
      { type: 'page', id: 'elections-methodology', name: 'Elections Methodology', subtitle: 'ECI, TCPD, and ADR data sources', route: '/elections/methodology' },
      { type: 'page', id: 'elections-glossary', name: 'Elections Glossary', subtitle: 'Election terms in plain language', route: '/elections/glossary' },
      { type: 'page', id: 'crime', name: 'Crime & Safety', subtitle: 'IPC crimes, women safety, road accidents, cybercrime, police, justice', route: '/crime' },
      { type: 'page', id: 'crime-explore', name: 'Crime Explorer', subtitle: 'Browse crime indicators by state', route: '/crime/explore' },
      { type: 'page', id: 'crime-methodology', name: 'Crime Methodology', subtitle: 'NCRB, MoRTH, and BPRD data sources', route: '/crime/methodology' },
      { type: 'page', id: 'crime-glossary', name: 'Crime Glossary', subtitle: 'Crime and justice terms in plain language', route: '/crime/glossary' },
      { type: 'page', id: 'emi-calculator', name: 'EMI Calculator', subtitle: 'How repo rate changes affect your loan EMI', route: '/rbi/calculator' },
      { type: 'page', id: 'cost-of-living', name: 'Cost of Living Calculator', subtitle: 'How inflation changed your spending power', route: '/economy/calculator' },
      { type: 'page', id: 'state-report-card', name: 'State Report Card', subtitle: 'Your state ranked across 6 domains', route: '/states/your-state' },
      { type: 'page', id: 'open-data', name: 'Open Data API', subtitle: '80 JSON endpoints, no API key, CORS enabled', route: '/open-data' },
      { type: 'page', id: 'journalists', name: 'For Journalists', subtitle: 'Chart gallery, story kits, embed builder', route: '/for-journalists' },
      { type: 'page', id: 'chart-gallery', name: 'Chart Gallery', subtitle: 'Browse and filter all charts with CSV and embed', route: '/for-journalists/gallery' },
      { type: 'page', id: 'story-kits', name: 'Story Kits', subtitle: 'Curated data bundles with editorial context', route: '/for-journalists/story-kits' },
      { type: 'page', id: 'embed-builder', name: 'Embed Builder', subtitle: 'Build customizable iframe embed codes', route: '/for-journalists/embed-builder' },
      { type: 'page', id: 'teachers', name: 'For Teachers', subtitle: 'NCERT-mapped lesson plans and classroom mode', route: '/for-teachers' },
      { type: 'page', id: 'lesson-plans', name: 'Lesson Plans', subtitle: 'Class 10-12 Economics, Political Science, Geography', route: '/for-teachers/lesson-plans' },
      { type: 'page', id: 'contribute', name: 'Contribute', subtitle: 'How to use data, report issues, contribute datasets', route: '/contribute' },
    );
    // Glossary terms + citizen questions
    items.push(...glossaryTerms);
    items.push(...questionItems);
    return items;
  }, [expenditure, schemes, glossaryTerms, questionItems]);

  const fuse = useMemo(
    () => new Fuse(searchItems, { keys: ['name', 'subtitle'], threshold: 0.4 }),
    [searchItems]
  );

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setActiveIndex(-1);
      if (q.trim().length === 0) {
        setResults(searchItems.filter((s) => s.type === 'page'));
      } else {
        setResults(fuse.search(q).map((r) => r.item).slice(0, 10));
      }
    },
    [searchItems, fuse]
  );

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen, setSearchOpen]);

  // Reset state when search opens/closes (React "setState during render" pattern)
  const [prevSearchOpen, setPrevSearchOpen] = useState(searchOpen);
  if (prevSearchOpen !== searchOpen) {
    setPrevSearchOpen(searchOpen);
    setActiveIndex(-1);
    if (searchOpen) {
      handleSearch('');
    } else {
      setQuery('');
    }
  }

  // Focus input when opened (side effect — must be in useEffect)
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Focus trap: keep Tab within the dialog
  useEffect(() => {
    if (!searchOpen) return;
    const panel = dialogPanelRef.current;
    if (!panel) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [searchOpen]);

  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => setSearchOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogPanelRef}
        className="relative w-full max-w-lg mx-4 rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4" style={{ borderBottom: 'var(--border-divider)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
              } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
                e.preventDefault();
                navigate(results[activeIndex].route);
                setSearchOpen(false);
              }
            }}
            placeholder="Ask a question, or search ministries, schemes, terms..."
            className="w-full px-3 py-4 bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeIndex >= 0 && results[activeIndex] ? `search-item-${results[activeIndex].type}-${results[activeIndex].id}` : undefined}
            aria-autocomplete="list"
          />
          <kbd
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-raised)' }}
          >
            Esc
          </kbd>
        </div>

        <div ref={listRef} id="search-results" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && query.length > 0 && (
            <p className="text-sm px-3 py-4 text-center" style={{ color: 'var(--text-muted)' }}>
              No results found
            </p>
          )}
          {results.map((item, idx) => {
            const badge = BADGE_STYLES[item.type];
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${item.type}-${item.id}`}
                id={`search-item-${item.type}-${item.id}`}
                role="option"
                aria-selected={isActive}
                ref={(el) => {
                  if (isActive && el) el.scrollIntoView({ block: 'nearest' });
                }}
                onClick={() => {
                  navigate(item.route);
                  setSearchOpen(false);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className="w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-3 cursor-pointer bg-transparent border-none"
                style={{ background: isActive ? 'var(--bg-raised)' : 'transparent' }}
              >
                <span
                  className="mt-0.5 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {item.type}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
