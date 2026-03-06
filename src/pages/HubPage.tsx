import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { loadSummary, loadEconomySummary, loadRBISummary, loadStatesSummary, loadCensusSummary, loadEducationSummary, loadEmploymentSummary, loadHealthcareSummary, loadEnvironmentSummary, loadElectionsSummary, loadCrimeSummary } from '../lib/dataLoader.ts';
import { formatLakhCrore, formatIndianNumber } from '../lib/format.ts';
import type { BudgetSummary, EconomySummary, RBISummary, StatesSummary, CensusSummary, EducationSummary, EmploymentSummary, HealthcareSummary, EnvironmentSummary, ElectionsSummary, CrimeSummary } from '../lib/data/schema.ts';
import { TopicCard } from '../components/topics/TopicCard.tsx';
import { TOPIC_CONFIGS, FEATURED_TOPIC_IDS } from '../lib/topicConfigs/index.ts';
import type { TopicDataBag } from '../lib/topicConfig.ts';
import { HubHero } from '../components/hub/HubHero.tsx';
import { CategoryNav } from '../components/hub/CategoryNav.tsx';
import { DomainCardShell } from '../components/hub/DomainCardShell.tsx';
import type { CardStat } from '../components/hub/DomainCardShell.tsx';
import { BuildWithDataSection } from '../components/hub/BuildWithDataSection.tsx';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Mini Visualizations ────────────────────────────────────────────
// Each domain card has a unique mini-viz. These are the only parts
// that couldn't be unified into DomainCardShell.

function BudgetMiniViz({ summary, isVisible }: { summary: BudgetSummary | null; isVisible: boolean }) {
  const barSegments = useMemo(() => {
    if (!summary) return [];
    const total = summary.totalExpenditure;
    const receipts = summary.totalReceipts;
    const deficit = summary.fiscalDeficit;
    return [
      { label: 'Revenue', pct: (receipts / total) * 100, color: 'var(--saffron)' },
      { label: 'Deficit', pct: (deficit / total) * 100, color: 'var(--cyan)' },
    ];
  }, [summary]);

  if (barSegments.length === 0) return null;
  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
        {barSegments.map((seg) => (
          <motion.div
            key={seg.label}
            className="h-full rounded-full"
            style={{ background: seg.color }}
            initial={{ width: 0 }}
            animate={isVisible ? { width: `${seg.pct}%` } : {}}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.4 }}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        {barSegments.map((seg) => (
          <span key={seg.label} className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: seg.color, verticalAlign: 'middle' }} />
            {seg.label} {seg.pct.toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

function EconomyMiniViz({ summary, isVisible }: { summary: EconomySummary | null; isVisible: boolean }) {
  const gdpMiniData = useMemo(() => {
    if (!summary) return [];
    return [
      { year: '21-22', value: 9.7 },
      { year: '22-23', value: 7.0 },
      { year: '23-24', value: 8.2 },
      { year: '24-25', value: 6.5 },
      { year: '25-26', value: 7.4 },
    ];
  }, [summary]);

  const maxGdp = Math.max(...gdpMiniData.map((d) => d.value), 1);
  if (gdpMiniData.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-end gap-1.5 h-8">
        {gdpMiniData.map((d, i) => (
          <motion.div
            key={d.year}
            className="flex-1 rounded-t"
            style={{ background: 'var(--cyan)' }}
            initial={{ height: 0 }}
            animate={isVisible ? { height: `${Math.max(10, (d.value / maxGdp) * 100)}%` } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {gdpMiniData.map((d) => (
          <span key={d.year} className="flex-1 text-center text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {d.year}
          </span>
        ))}
      </div>
    </div>
  );
}

function RBIMiniViz({ summary, isVisible }: { summary: RBISummary | null; isVisible: boolean }) {
  const rateSteps = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'May 20', rate: 4.00 },
      { label: 'May 22', rate: 4.40 },
      { label: 'Feb 23', rate: 6.50 },
      { label: 'Feb 25', rate: 6.25 },
    ];
  }, [summary]);

  const minRate = Math.min(...rateSteps.map((d) => d.rate));
  const maxRate = Math.max(...rateSteps.map((d) => d.rate));
  const range = maxRate - minRate || 1;
  if (rateSteps.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex gap-0 h-12 relative">
        {rateSteps.map((d, i) => {
          const pct = ((d.rate - minRate) / range) * 100;
          const targetHeight = `${Math.max(20, pct)}%`;
          return (
            <div key={d.label} className="flex-1 relative h-full">
              <motion.div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  background: 'var(--gold)',
                  borderRadius: i === 0 ? '4px 0 0 0' : i === rateSteps.length - 1 ? '0 4px 0 0' : '0',
                }}
                initial={{ height: '0%' }}
                animate={isVisible ? { height: targetHeight } : { height: '0%' }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex mt-1">
        {rateSteps.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {d.rate}%
          </span>
        ))}
      </div>
    </div>
  );
}

function StatesMiniViz({ summary, isVisible }: { summary: StatesSummary | null; isVisible: boolean }) {
  const topStates = useMemo(() => {
    if (!summary) return [];
    return [
      { name: 'MH', value: 45.32 },
      { name: 'TN', value: 28.27 },
      { name: 'KA', value: 26.32 },
      { name: 'GJ', value: 24.53 },
      { name: 'UP', value: 24.40 },
    ];
  }, [summary]);

  const maxVal = Math.max(...topStates.map((d) => d.value), 1);
  if (topStates.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-end gap-1.5 h-8">
        {topStates.map((d, i) => (
          <motion.div
            key={d.name}
            className="flex-1 rounded-t"
            style={{ background: 'var(--emerald)' }}
            initial={{ height: 0 }}
            animate={isVisible ? { height: `${Math.max(10, (d.value / maxVal) * 100)}%` } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {topStates.map((d) => (
          <span key={d.name} className="flex-1 text-center text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function CensusMiniViz({ summary, isVisible }: { summary: CensusSummary | null; isVisible: boolean }) {
  const topStates = useMemo(() => {
    if (!summary?.topPopulousStates) return [];
    return summary.topPopulousStates.slice(0, 5);
  }, [summary]);

  const maxPop = Math.max(...topStates.map((d) => d.population), 1);
  if (topStates.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs space-y-1">
      {topStates.map((d, i) => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="text-[9px] font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>
            {d.name.length > 4 ? d.name.slice(0, 3) : d.name}
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--violet)' }}
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${(d.population / maxPop) * 100}%` } : {}}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationMiniViz({ summary, isVisible }: { summary: EducationSummary | null; isVisible: boolean }) {
  const gerBars = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Primary', value: summary.gerPrimary },
      { label: 'Secondary', value: summary.gerSecondary },
      { label: 'Tertiary', value: 30.5 },
    ];
  }, [summary]);

  const maxGer = Math.max(...gerBars.map((d) => d.value), 1);
  if (gerBars.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-end gap-1.5 h-8">
        {gerBars.map((d, i) => (
          <motion.div
            key={d.label}
            className="flex-1 rounded-t"
            style={{ background: i === 0 ? 'var(--blue)' : i === 1 ? 'var(--blue-light)' : 'var(--cyan)' }}
            initial={{ height: 0 }}
            animate={isVisible ? { height: `${Math.max(10, (d.value / maxGer) * 100)}%` } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {gerBars.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function EmploymentMiniViz({ summary, isVisible }: { summary: EmploymentSummary | null; isVisible: boolean }) {
  const urSteps = useMemo(() => {
    if (!summary) return [];
    return [
      { label: '20-21', value: 8.2 },
      { label: '21-22', value: 6.1 },
      { label: '22-23', value: 4.5 },
      { label: '23-24', value: 4.2 },
      { label: 'Q3 25', value: 4.2 },
    ];
  }, [summary]);

  const maxUr = Math.max(...urSteps.map((d) => d.value), 1);
  if (urSteps.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-end gap-1.5 h-8">
        {urSteps.map((d, i) => (
          <motion.div
            key={d.label}
            className="flex-1 rounded-t"
            style={{ background: 'var(--amber)' }}
            initial={{ height: 0 }}
            animate={isVisible ? { height: `${Math.max(10, (d.value / maxUr) * 100)}%` } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {urSteps.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{d.value}%</span>
        ))}
      </div>
    </div>
  );
}

function HealthcareMiniViz({ summary, isVisible }: { summary: HealthcareSummary | null; isVisible: boolean }) {
  const compBars = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Beds', india: summary.hospitalBedsPer1000, who: 3.5 },
      { label: 'Docs', india: summary.physiciansPer1000, who: 2.5 },
      { label: 'Exp', india: summary.healthExpGDP, who: 6.0 },
    ];
  }, [summary]);

  if (compBars.length === 0) return null;

  return (
    <div className="mb-2 max-w-xs space-y-1.5">
      {compBars.map((d, i) => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="text-[9px] font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--rose)' }}
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${(d.india / d.who) * 100}%` } : {}}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.06 }}
            />
          </div>
          <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{d.india}/{d.who}</span>
        </div>
      ))}
    </div>
  );
}

function EnvironmentMiniViz({ summary, isVisible }: { summary: EnvironmentSummary | null; isVisible: boolean }) {
  const energySplit = useMemo(() => {
    if (!summary) return null;
    const fossil = summary.coalPct;
    const renewable = 100 - fossil;
    return { fossil, renewable };
  }, [summary]);

  if (!energySplit) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Fossil</span>
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Renewable</span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'var(--text-muted)', borderRadius: '9999px 0 0 9999px' }}
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${energySplit.fossil}%` } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
        />
        <motion.div
          className="h-full"
          style={{ background: 'var(--teal)', borderRadius: '0 9999px 9999px 0' }}
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${energySplit.renewable}%` } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.5 }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{energySplit.fossil.toFixed(0)}%</span>
        <span className="text-[9px] font-mono" style={{ color: 'var(--teal)' }}>{energySplit.renewable.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function ElectionsMiniViz({ summary, isVisible }: { summary: ElectionsSummary | null; isVisible: boolean }) {
  const seatSplit = useMemo(() => {
    if (!summary) return null;
    const total = summary.totalConstituencies;
    return {
      nda: (summary.ndaSeats2024 / total) * 100,
      india: (summary.indiaAllianceSeats2024 / total) * 100,
      others: ((total - summary.ndaSeats2024 - summary.indiaAllianceSeats2024) / total) * 100,
      ndaRaw: summary.ndaSeats2024,
      indiaRaw: summary.indiaAllianceSeats2024,
    };
  }, [summary]);

  if (!seatSplit) return null;

  return (
    <div className="mb-2 max-w-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: '#FF6B35' }}>NDA</span>
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: '#00BFFF' }}>INDIA</span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
        <motion.div
          className="h-full"
          style={{ background: '#FF6B35', borderRadius: '9999px 0 0 9999px' }}
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${seatSplit.nda}%` } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
        />
        <motion.div
          className="h-full"
          style={{ background: '#00BFFF' }}
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${seatSplit.india}%` } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.5 }}
        />
        <motion.div
          className="h-full"
          style={{ background: 'var(--text-muted)', borderRadius: '0 9999px 9999px 0' }}
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${seatSplit.others}%` } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.6 }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] font-mono" style={{ color: '#FF6B35' }}>{seatSplit.ndaRaw}</span>
        <span className="text-[9px] font-mono" style={{ color: '#00BFFF' }}>{seatSplit.indiaRaw}</span>
      </div>
    </div>
  );
}

function CrimeMiniViz({ summary, isVisible }: { summary: CrimeSummary | null; isVisible: boolean }) {
  const funnelStages = useMemo(() => {
    if (!summary) return null;
    return [
      { label: 'Reported', pct: 100 },
      { label: 'Chargesheeted', pct: summary.chargesheetRatePct },
      { label: 'Convicted', pct: summary.convictionRatePct },
    ];
  }, [summary]);

  if (!funnelStages) return null;

  return (
    <div className="mb-2 max-w-xs space-y-1.5">
      {funnelStages.map((stage, i) => (
        <div key={stage.label} className="flex items-center gap-2">
          <span className="text-[9px] font-mono w-20 text-right" style={{ color: 'var(--text-muted)' }}>{stage.label}</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: i === 2 ? 'var(--crimson)' : i === 1 ? 'var(--crimson-light)' : 'var(--text-muted)' }}
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${stage.pct}%` } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 + i * 0.15 }}
            />
          </div>
          <span className="text-[9px] font-mono w-8" style={{ color: 'var(--crimson)' }}>{stage.pct}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Cross-Domain Insights ──────────────────────────────────────────

function CrossDomainInsights({ summaryBag }: { summaryBag: TopicDataBag }) {
  const [ref, isVisible] = useScrollTrigger<HTMLElement>({ threshold: 0.1 });
  const featuredTopics = FEATURED_TOPIC_IDS
    .map((id) => TOPIC_CONFIGS[id])
    .filter(Boolean);

  return (
    <section ref={ref} id="topics" className="max-w-5xl mx-auto px-6 sm:px-8 pb-24 scroll-mt-20">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="text-section-num tracking-[0.15em] uppercase mb-4"
      >
        Cross-Domain Insights
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.05, ease: EASE_OUT_EXPO }}
        className="text-sm mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        Questions that span multiple datasets, answered with cross-domain data.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {featuredTopics.map((topic, i) => (
          <TopicCard key={topic.id} topic={topic} bag={summaryBag} index={i} isVisible={isVisible} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors hover:bg-[var(--bg-raised)]"
          style={{ color: 'var(--saffron)' }}
        >
          View all 12 topics
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}

// ─── Hub Page ───────────────────────────────────────────────────────

export default function HubPage() {
  const location = useLocation();
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [economySummary, setEconomySummary] = useState<EconomySummary | null>(null);
  const [rbiSummary, setRbiSummary] = useState<RBISummary | null>(null);
  const [statesSummary, setStatesSummary] = useState<StatesSummary | null>(null);
  const [censusSummary, setCensusSummary] = useState<CensusSummary | null>(null);
  const [educationSummary, setEducationSummary] = useState<EducationSummary | null>(null);
  const [employmentSummary, setEmploymentSummary] = useState<EmploymentSummary | null>(null);
  const [healthcareSummary, setHealthcareSummary] = useState<HealthcareSummary | null>(null);
  const [environmentSummary, setEnvironmentSummary] = useState<EnvironmentSummary | null>(null);
  const [electionsSummary, setElectionsSummary] = useState<ElectionsSummary | null>(null);
  const [crimeSummary, setCrimeSummary] = useState<CrimeSummary | null>(null);

  useEffect(() => {
    loadSummary('2025-26').then(setSummary).catch(() => {});
    loadEconomySummary('2025-26').then(setEconomySummary).catch(() => {});
    loadRBISummary('2025-26').then(setRbiSummary).catch(() => {});
    loadStatesSummary('2025-26').then(setStatesSummary).catch(() => {});
    loadCensusSummary('2025-26').then(setCensusSummary).catch(() => {});
    loadEducationSummary('2025-26').then(setEducationSummary).catch(() => {});
    loadEmploymentSummary('2025-26').then(setEmploymentSummary).catch(() => {});
    loadHealthcareSummary('2025-26').then(setHealthcareSummary).catch(() => {});
    loadEnvironmentSummary('2025-26').then(setEnvironmentSummary).catch(() => {});
    loadElectionsSummary('2025-26').then(setElectionsSummary).catch(() => {});
    loadCrimeSummary('2025-26').then(setCrimeSummary).catch(() => {});
  }, []);

  // Scroll to hash anchor (e.g. /#stories) after mount
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

  // Helper to build stats array with loading state
  const s = (label: string, value: string | undefined | null, color: string): CardStat => ({
    label,
    value: value ?? '...',
    color,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEOHead
        title="Indian Data Project — Government Data, Made Visible"
        description="India's government data is buried in dense PDFs, broken APIs, and spreadsheets formatted for bureaucrats. This portal turns it into visual stories anyone can follow — 11 domains, from budget to elections to healthcare."
        path="/"
      />

      <HubHero />

      {/* Sentinel element: category nav becomes sticky when this scrolls out of view */}
      <div id="nav-sentinel" className="h-0" />

      <CategoryNav sentinelId="nav-sentinel" />

      {/* Domain stories */}
      <section id="stories" className="max-w-5xl mx-auto px-6 sm:px-8 pb-24 pt-6 scroll-mt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-section-num tracking-[0.15em] uppercase mb-8"
        >
          Data Stories
        </motion.p>

        {/* ── Budget ── */}
        <DomainCardShell
          id="budget"
          to="/budget"
          sectionNumber="01"
          title="Union Budget 2025-26"
          description="Where Rs 50 lakh crore goes. Revenue sources, ministry-wise spending, state transfers, and your personal tax share."
          accentColor="var(--saffron)"
          accentVar="--saffron"
          ctaText="Explore the budget"

          stats={[
            s('Total Expenditure', summary ? formatLakhCrore(summary.totalExpenditure) : null, 'var(--saffron)'),
            s('Per Citizen Per Day', summary ? `Rs ${summary.perCapitaDailyExpenditure.toFixed(2)}` : null, 'var(--cyan)'),
            s('Fiscal Deficit', summary ? `${summary.fiscalDeficitPercentGDP}% of GDP` : null, 'var(--gold)'),
          ]}
        >
          {(isVisible) => <BudgetMiniViz summary={summary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Economy ── */}
        <DomainCardShell
          id="economy"
          to="/economy"
          sectionNumber="02"
          title="Economic Survey 2025-26"
          description="India's economic report card. GDP growth, inflation, fiscal health, trade balance, and sectoral analysis from primary sources."
          accentColor="var(--cyan)"
          accentVar="--cyan"
          ctaText="Explore the economy"

          className="mt-8"
          stats={[
            s('GDP Growth', economySummary ? `${economySummary.realGDPGrowth}%` : null, 'var(--cyan)'),
            s('CPI Inflation', economySummary ? `${economySummary.cpiInflation}%` : null, 'var(--saffron)'),
            s('Per Capita GDP', economySummary ? `Rs ${formatIndianNumber(economySummary.perCapitaGDP)}` : null, 'var(--gold)'),
          ]}
        >
          {(isVisible) => <EconomyMiniViz summary={economySummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── RBI ── */}
        <DomainCardShell
          id="rbi"
          to="/rbi"
          sectionNumber="03"
          title="RBI Data"
          description="India's central banker. Repo rate decisions, inflation targeting, money supply, credit growth, and forex reserves from RBI primary sources."
          accentColor="var(--gold)"
          accentVar="--gold"
          ctaText="Explore RBI data"

          className="mt-8"
          stats={[
            s('Repo Rate', rbiSummary ? `${rbiSummary.repoRate}%` : null, 'var(--gold)'),
            s('Forex Reserves', rbiSummary ? `$${rbiSummary.forexReservesUSD?.toFixed(0) ?? '—'}B` : null, 'var(--saffron)'),
            s('M3 Growth', rbiSummary ? `${rbiSummary.broadMoneyGrowth ?? '—'}%` : null, 'var(--cyan)'),
          ]}
        >
          {(isVisible) => <RBIMiniViz summary={rbiSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── States ── */}
        <DomainCardShell
          id="states"
          to="/states"
          sectionNumber="04"
          title="State Finances"
          description="India's federal mosaic. GSDP, growth rates, revenue self-sufficiency, fiscal health, and per capita income across 28 states and 8 union territories."
          accentColor="var(--emerald)"
          accentVar="--emerald"
          ctaText="Explore state data"

          className="mt-8"
          stats={[
            s('Top State', statesSummary?.topGsdpState ?? null, 'var(--emerald)'),
            s('Growth Range', statesSummary?.growthRange ?? null, 'var(--cyan)'),
            s('States & UTs', '36', 'var(--emerald)'),
          ]}
        >
          {(isVisible) => <StatesMiniViz summary={statesSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Census ── */}
        <DomainCardShell
          id="census"
          to="/census"
          sectionNumber="05"
          title="Census & Demographics"
          description="1.45 billion people. Population structure, literacy, health outcomes, urbanization, and vital statistics across 36 states and union territories."
          accentColor="var(--violet)"
          accentVar="--violet"
          ctaText="Explore demographics"

          className="mt-8"
          stats={[
            s('Population', censusSummary ? `${(censusSummary.totalPopulation / 1e9).toFixed(2)}B` : null, 'var(--violet)'),
            s('Literacy Rate', censusSummary ? `${censusSummary.literacyRate}%` : null, 'var(--saffron)'),
            s('Sex Ratio', censusSummary ? `${censusSummary.sexRatio}` : null, 'var(--violet-light, #A78BFA)'),
          ]}
        >
          {(isVisible) => <CensusMiniViz summary={censusSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Education ── */}
        <DomainCardShell
          id="education"
          to="/education"
          sectionNumber="06"
          title="Education"
          description="248 million students. Enrollment triumphs, quality gaps, the dropout cliff, and spending challenges across India's education system."
          accentColor="var(--blue)"
          accentVar="--blue"
          ctaText="Explore education"

          className="mt-8"
          stats={[
            s('Total Students', educationSummary ? `${(educationSummary.totalStudents / 1e6).toFixed(0)}M` : null, 'var(--blue)'),
            s('GER Primary', educationSummary ? `${educationSummary.gerPrimary}%` : null, 'var(--blue-light, #60A5FA)'),
            s('Spending', educationSummary ? `${educationSummary.educationSpendGDP}% GDP` : null, 'var(--cyan)'),
          ]}
        >
          {(isVisible) => <EducationMiniViz summary={educationSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Employment ── */}
        <DomainCardShell
          id="employment"
          to="/employment"
          sectionNumber="07"
          title="Employment"
          description="57 crore workers. Labour participation, youth unemployment, the structural shift from agriculture to services, and the informality challenge."
          accentColor="var(--amber)"
          accentVar="--amber"
          ctaText="Explore employment"

          className="mt-8"
          stats={[
            s('Unemployment', employmentSummary ? `${employmentSummary.unemploymentRate}%` : null, 'var(--amber)'),
            s('LFPR', employmentSummary ? `${employmentSummary.lfpr}%` : null, 'var(--amber-light, #FBBF24)'),
            s('Female LFPR', employmentSummary ? `${employmentSummary.femaleLfpr}%` : null, 'var(--gold)'),
          ]}
        >
          {(isVisible) => <EmploymentMiniViz summary={employmentSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Healthcare ── */}
        <DomainCardShell
          id="healthcare"
          to="/healthcare"
          sectionNumber="08"
          title="Healthcare"
          description="0.7 doctors per 1,000 people. Infrastructure deficits, spending gaps, out-of-pocket burden, immunization progress, and the disease burden."
          accentColor="var(--rose)"
          accentVar="--rose"
          ctaText="Explore healthcare"

          className="mt-8"
          stats={[
            s('Beds / 1,000', healthcareSummary ? `${healthcareSummary.hospitalBedsPer1000}` : null, 'var(--rose)'),
            s('Health Exp', healthcareSummary ? `${healthcareSummary.healthExpGDP}% GDP` : null, 'var(--rose-light, #FB7185)'),
            s('Out-of-Pocket', healthcareSummary ? `${healthcareSummary.outOfPocketPct}%` : null, 'var(--saffron)'),
          ]}
        >
          {(isVisible) => <HealthcareMiniViz summary={healthcareSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Environment ── */}
        <DomainCardShell
          id="environment"
          to="/environment"
          sectionNumber="09"
          title="Environment"
          description={`PM2.5 at ${environmentSummary ? `${Math.round(environmentSummary.pm25 / 5)}×` : '...'} the WHO limit. Air quality, forest cover, the coal-to-solar shift, carbon footprint, and the water crisis underfoot.`}
          accentColor="var(--teal)"
          accentVar="--teal"
          ctaText="Explore environment"

          className="mt-8"
          stats={[
            s('PM2.5', environmentSummary ? `${environmentSummary.pm25.toFixed(0)} μg/m³` : null, 'var(--negative)'),
            s('Forest Cover', environmentSummary ? `${environmentSummary.forestPct.toFixed(1)}%` : null, 'var(--teal)'),
            s('Renewables', environmentSummary ? `${environmentSummary.renewablesPct.toFixed(1)}%` : null, 'var(--teal-light, #2DD4BF)'),
          ]}
        >
          {(isVisible) => <EnvironmentMiniViz summary={environmentSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Elections ── */}
        <DomainCardShell
          id="elections"
          to="/elections"
          sectionNumber="10"
          title="Elections"
          description={`${electionsSummary ? `${electionsSummary.totalElectorsCrore} crore` : '...'} voters, 543 seats, 7 decades of democracy. Turnout trends, party shifts, and who your MP really is — criminal records, wealth, and all.`}
          accentColor="var(--indigo)"
          accentVar="--indigo"
          ctaText="Explore elections"

          className="mt-8"
          stats={[
            s('Turnout 2024', electionsSummary ? `${electionsSummary.turnout2024}%` : null, 'var(--indigo)'),
            s('Criminal MPs', electionsSummary ? `${electionsSummary.criminalPct}%` : null, 'var(--negative)'),
            s('Women MPs', electionsSummary ? `${electionsSummary.womenMPsPct2024}%` : null, 'var(--indigo-light, #818CF8)'),
          ]}
        >
          {(isVisible) => <ElectionsMiniViz summary={electionsSummary} isVisible={isVisible} />}
        </DomainCardShell>

        {/* ── Crime ── */}
        <DomainCardShell
          id="crime"
          to="/crime"
          sectionNumber="11"
          title="Crime & Safety"
          description={`${crimeSummary ? `${(crimeSummary.totalCrimes / 100000).toFixed(1)}L` : '...'} crimes recorded in ${crimeSummary?.dataYear ?? '2022'}. One every 5 seconds. From FIR to conviction, the justice pipeline loses 60% along the way.`}
          accentColor="var(--crimson)"
          accentVar="--crimson"
          ctaText="Explore crime data"

          className="mt-8"
          stats={[
            s('Crime rate', crimeSummary ? `${crimeSummary.crimeRate}/lakh` : null, 'var(--crimson)'),
            s('Conviction rate', crimeSummary ? `${crimeSummary.convictionRatePct}%` : null, 'var(--crimson)'),
            s('Road deaths/day', crimeSummary ? `${Math.round(crimeSummary.roadDeaths / 365)}` : null, 'var(--crimson-light, #EF4444)'),
          ]}
        >
          {(isVisible) => <CrimeMiniViz summary={crimeSummary} isVisible={isVisible} />}
        </DomainCardShell>
      </section>

      {/* Cross-Domain Insights */}
      <CrossDomainInsights
        summaryBag={{
          'budget/summary': summary,
          'economy/summary': economySummary,
          'rbi/summary': rbiSummary,
          'states/summary': statesSummary,
          'census/summary': censusSummary,
          'education/summary': educationSummary,
          'employment/summary': employmentSummary,
          'healthcare/summary': healthcareSummary,
          'environment/summary': environmentSummary,
          'elections/summary': electionsSummary,
          'crime/summary': crimeSummary,
        } as TopicDataBag}
      />

      {/* Build With This Data */}
      <BuildWithDataSection />
    </motion.div>
  );
}
