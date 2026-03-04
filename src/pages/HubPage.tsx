import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollTrigger } from '../hooks/useScrollTrigger.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { loadSummary, loadEconomySummary, loadRBISummary, loadStatesSummary, loadCensusSummary, loadEducationSummary, loadEmploymentSummary, loadHealthcareSummary, loadEnvironmentSummary, loadElectionsSummary, loadCrimeSummary } from '../lib/dataLoader.ts';
import { formatLakhCrore, formatIndianNumber } from '../lib/format.ts';
import type { BudgetSummary, EconomySummary, RBISummary, StatesSummary, CensusSummary, EducationSummary, EmploymentSummary, HealthcareSummary, EnvironmentSummary, ElectionsSummary, CrimeSummary } from '../lib/data/schema.ts';
import { TopicCard } from '../components/topics/TopicCard.tsx';
import { TOPIC_CONFIGS, FEATURED_TOPIC_IDS } from '../lib/topicConfigs/index.ts';
import type { TopicDataBag } from '../lib/topicConfig.ts';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function HubHero() {
  const { scrollY } = useScroll();
  // Parallax: title drifts up slowly as user scrolls
  const titleY = useTransform(scrollY, [0, 600], [0, -60]);
  const subtitleOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-16">
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, rgba(255,200,87,0.03) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 px-6 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Viewport-filling title — typography as architecture */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
          style={{ y: titleY, fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
          className="font-extrabold"
        >
          <span className="gradient-text-saffron">{'Government'}</span>
          <br />
          <span className="gradient-text-saffron">{'data,'}</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>{'made visible'}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
          style={{ opacity: subtitleOpacity }}
          className="mt-8 max-w-lg"
        >
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {'Dense PDFs and buried spreadsheets turned into interactive visual stories.'}
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {'Real data. No spin. Open source.'}
          </p>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
            {'Pick a story below, or press '}
            <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}>⌘K</kbd>
            {' to ask a question.'}
          </p>
        </motion.div>

        {/* Scroll indicator — thin line growing downward */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.9 }}
          className="mt-20 w-px h-20 origin-top"
          style={{ backgroundColor: 'var(--text-muted)', opacity: 0.5 }}
        />
      </div>
    </section>
  );
}

function DomainCard({ summary }: { summary: BudgetSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini sparkline data from summary — the three key ratios
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
    >
      <Link
        to="/budget"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--saffron), transparent 40%, var(--cyan) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.06), rgba(74,234,220,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Card content */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            {/* Left: description + mini viz */}
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, var(--saffron), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  {'01 — Data Story'}
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  {'Union Budget 2025-26'}
                </h2>
                <p className="text-annotation mb-6 max-w-md">
                  {'Where Rs 50 lakh crore goes. Revenue sources, ministry-wise spending, state transfers, and your personal tax share.'}
                </p>
              </div>

              {/* Mini revenue/deficit bar — a taste of the data inside */}
              <div className="relative z-10">
                {barSegments.length > 0 && (
                  <div className="mb-6 max-w-xs">
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
                )}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--saffron)' }}
                >
                  <span>{'Explore the budget'}</span>
                  <span
                    className="group-hover:translate-x-1.5 inline-block"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Right: key stats — large, monospaced, unapologetic */}
            <div
              className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <StatPill
                label={'Total Expenditure'}
                value={summary ? formatLakhCrore(summary.totalExpenditure) : '...'}
                color="var(--saffron)"
                delay={0.3}
                isVisible={isVisible}
              />
              <StatPill
                label={'Per Citizen Per Day'}
                value={summary ? `Rs ${summary.perCapitaDailyExpenditure.toFixed(2)}` : '...'}
                color="var(--cyan)"
                delay={0.4}
                isVisible={isVisible}
              />
              <StatPill
                label={'Fiscal Deficit'}
                value={summary ? `${summary.fiscalDeficitPercentGDP}% of GDP` : '...'}
                color="var(--gold)"
                delay={0.5}
                isVisible={isVisible}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatPill({
  label,
  value,
  color,
  delay,
  isVisible,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay }}
    >
      <p className="text-caption uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono font-bold text-xl" style={{ color }}>{value}</p>
    </motion.div>
  );
}

function EconomyDomainCard({ summary }: { summary: EconomySummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini sparkline: GDP growth last 5 years (from indicators.json GDP series)
  const gdpMiniData = useMemo(() => {
    if (!summary) return [];
    // Hardcode the last 5 GDP growth points for the sparkline (from gdp-growth.json)
    // These are loaded separately for the story page; for the hub we show summary stats only
    return [
      { year: '21-22', value: 9.7 },
      { year: '22-23', value: 7.6 },
      { year: '23-24', value: 9.2 },
      { year: '24-25', value: 6.5 },
      { year: '25-26', value: 6.4 },
    ];
  }, [summary]);

  const maxGdp = Math.max(...gdpMiniData.map((d) => d.value), 1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/economy"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border — cyan-tinted for economy */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--cyan), transparent 40%, var(--gold) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(74,234,220,0.06), rgba(255,200,87,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, var(--cyan), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  02 — Data Story
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  Economic Survey 2025-26
                </h2>
                <p className="text-annotation mb-6 max-w-md">
                  India's economic report card. GDP growth, inflation, fiscal health, trade balance, and sectoral analysis from primary sources.
                </p>
              </div>

              {/* Mini GDP sparkline bar */}
              <div className="relative z-10">
                {gdpMiniData.length > 0 && (
                  <div className="mb-6 max-w-xs">
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
                )}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--cyan)' }}
                >
                  <span>Explore the economy</span>
                  <span
                    className="group-hover:translate-x-1.5 inline-block"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            <div
              className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <StatPill
                label="GDP Growth"
                value={summary ? `${summary.realGDPGrowth}%` : '...'}
                color="var(--cyan)"
                delay={0.3}
                isVisible={isVisible}
              />
              <StatPill
                label="CPI Inflation"
                value={summary ? `${summary.cpiInflation}%` : '...'}
                color="var(--saffron)"
                delay={0.4}
                isVisible={isVisible}
              />
              <StatPill
                label="Per Capita GDP"
                value={summary ? `Rs ${formatIndianNumber(summary.perCapitaGDP)}` : '...'}
                color="var(--gold)"
                delay={0.5}
                isVisible={isVisible}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function RBIDomainCard({ summary }: { summary: RBISummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini step chart: key repo rate milestones showing the full arc
  const rateSteps = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'May 20', rate: 4.00 },
      { label: 'Feb 23', rate: 6.50 },
      { label: 'Feb 25', rate: 6.25 },
      { label: 'Jun 25', rate: 5.50 },
      { label: 'Feb 26', rate: 5.25 },
    ];
  }, [summary]);

  const minRate = Math.min(...rateSteps.map((d) => d.rate));
  const maxRate = Math.max(...rateSteps.map((d) => d.rate));
  const range = maxRate - minRate || 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/rbi"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border — gold-saffron for RBI */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--gold), transparent 40%, var(--saffron) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,200,87,0.06), rgba(255,107,53,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, var(--gold), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  03 — Data Story
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  RBI Data
                </h2>
                <p className="text-annotation mb-6 max-w-md">
                  India's central banker. Repo rate decisions, inflation targeting, money supply, credit growth, and forex reserves from RBI primary sources.
                </p>
              </div>

              {/* Mini repo rate step chart */}
              <div className="relative z-10">
                {rateSteps.length > 0 && (
                  <div className="mb-6 max-w-xs">
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
                )}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--gold)' }}
                >
                  <span>Explore RBI data</span>
                  <span
                    className="group-hover:translate-x-1.5 inline-block"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            <div
              className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <StatPill
                label="Repo Rate"
                value={summary ? `${summary.repoRate}%` : '...'}
                color="var(--gold)"
                delay={0.3}
                isVisible={isVisible}
              />
              <StatPill
                label="Forex Reserves"
                value={summary ? `$${summary.forexReservesUSD?.toFixed(0) ?? '—'}B` : '...'}
                color="var(--saffron)"
                delay={0.4}
                isVisible={isVisible}
              />
              <StatPill
                label="M3 Growth"
                value={summary ? `${summary.broadMoneyGrowth ?? '—'}%` : '...'}
                color="var(--cyan)"
                delay={0.5}
                isVisible={isVisible}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatesDomainCard({ summary }: { summary: StatesSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini bar chart: top 5 states by GSDP
  const topStates = useMemo(() => {
    if (!summary) return [];
    return [
      { name: 'MH', value: 35.28 },
      { name: 'TN', value: 24.81 },
      { name: 'KA', value: 22.26 },
      { name: 'GJ', value: 20.84 },
      { name: 'UP', value: 21.73 },
    ];
  }, [summary]);

  const maxVal = Math.max(...topStates.map((d) => d.value), 1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/states"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border — emerald for states */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--emerald), transparent 40%, var(--cyan) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(74,234,220,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, var(--emerald), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  04 — Data Story
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  State Finances
                </h2>
                <p className="text-annotation mb-6 max-w-md">
                  India's federal mosaic. GSDP, growth rates, revenue self-sufficiency, fiscal health, and per capita income across 28 states and 8 union territories.
                </p>
              </div>

              {/* Mini top-5 bar chart */}
              <div className="relative z-10">
                {topStates.length > 0 && (
                  <div className="mb-6 max-w-xs">
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
                )}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--emerald)' }}
                >
                  <span>Explore state data</span>
                  <span
                    className="group-hover:translate-x-1.5 inline-block"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            <div
              className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <StatPill
                label="Top State"
                value={summary?.topGsdpState ?? '...'}
                color="var(--emerald)"
                delay={0.3}
                isVisible={isVisible}
              />
              <StatPill
                label="Growth Range"
                value={summary?.growthRange ?? '...'}
                color="var(--cyan)"
                delay={0.4}
                isVisible={isVisible}
              />
              <StatPill
                label="States & UTs"
                value="36"
                color="var(--emerald)"
                delay={0.5}
                isVisible={isVisible}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CensusDomainCard({ summary }: { summary: CensusSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini horizontal bars: top 5 most populous states
  const topStates = useMemo(() => {
    if (!summary?.topPopulousStates) return [];
    return summary.topPopulousStates.slice(0, 5);
  }, [summary]);

  const maxPop = Math.max(...topStates.map((d) => d.population), 1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/census"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border — violet for census */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--violet), transparent 40%, var(--saffron) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(255,107,53,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: 'radial-gradient(ellipse at 70% 50%, var(--violet), transparent 70%)',
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  05 — Data Story
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  Census & Demographics
                </h2>
                <p className="text-annotation mb-6 max-w-md">
                  1.45 billion people. Population structure, literacy, health outcomes, urbanization, and vital statistics across 36 states and union territories.
                </p>
              </div>

              {/* Mini population bars — top 5 states */}
              <div className="relative z-10">
                {topStates.length > 0 && (
                  <div className="mb-6 max-w-xs space-y-1">
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
                )}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--violet)' }}
                >
                  <span>Explore demographics</span>
                  <span
                    className="group-hover:translate-x-1.5 inline-block"
                    style={{ transition: 'transform 0.2s ease' }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            <div
              className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <StatPill
                label="Population"
                value={summary ? `${(summary.totalPopulation / 1e9).toFixed(2)}B` : '...'}
                color="var(--violet)"
                delay={0.3}
                isVisible={isVisible}
              />
              <StatPill
                label="Literacy Rate"
                value={summary ? `${summary.literacyRate}%` : '...'}
                color="var(--saffron)"
                delay={0.4}
                isVisible={isVisible}
              />
              <StatPill
                label="Sex Ratio"
                value={summary ? `${summary.sexRatio}` : '...'}
                color="var(--violet-light, #A78BFA)"
                delay={0.5}
                isVisible={isVisible}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EducationDomainCard({ summary }: { summary: EducationSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini bar chart: primary/secondary/tertiary GER
  const gerBars = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Primary', value: summary.gerPrimary },
      { label: 'Secondary', value: summary.gerSecondary },
      { label: 'Tertiary', value: 30.5 },
    ];
  }, [summary]);

  const maxGer = Math.max(...gerBars.map((d) => d.value), 1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/education"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--blue), transparent 40%, var(--cyan) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(74,234,220,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{ background: 'radial-gradient(ellipse at 70% 50%, var(--blue), transparent 70%)' }}
              />
              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">06 — Data Story</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>Education</h2>
                <p className="text-annotation mb-6 max-w-md">248 million students. Enrollment triumphs, quality gaps, the dropout cliff, and spending challenges across India's education system.</p>
              </div>
              <div className="relative z-10">
                {gerBars.length > 0 && (
                  <div className="mb-6 max-w-xs">
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
                )}
                <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--blue)' }}>
                  <span>Explore education</span>
                  <span className="group-hover:translate-x-1.5 inline-block" style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <StatPill label="Total Students" value={summary ? `${(summary.totalStudents / 1e6).toFixed(0)}M` : '...'} color="var(--blue)" delay={0.3} isVisible={isVisible} />
              <StatPill label="GER Primary" value={summary ? `${summary.gerPrimary}%` : '...'} color="var(--blue-light, #60A5FA)" delay={0.4} isVisible={isVisible} />
              <StatPill label="Spending" value={summary ? `${summary.educationSpendGDP}% GDP` : '...'} color="var(--cyan)" delay={0.5} isVisible={isVisible} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmploymentDomainCard({ summary }: { summary: EmploymentSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini stacked area concept: show UR trend as step bars
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/employment"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--amber), transparent 40%, var(--gold) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(255,200,87,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 70% 50%, var(--amber), transparent 70%)' }} />
              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">07 — Data Story</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>Employment</h2>
                <p className="text-annotation mb-6 max-w-md">57 crore workers. Labour participation, youth unemployment, the structural shift from agriculture to services, and the informality challenge.</p>
              </div>
              <div className="relative z-10">
                {urSteps.length > 0 && (
                  <div className="mb-6 max-w-xs">
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
                )}
                <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--amber)' }}>
                  <span>Explore employment</span>
                  <span className="group-hover:translate-x-1.5 inline-block" style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <StatPill label="Unemployment" value={summary ? `${summary.unemploymentRate}%` : '...'} color="var(--amber)" delay={0.3} isVisible={isVisible} />
              <StatPill label="LFPR" value={summary ? `${summary.lfpr}%` : '...'} color="var(--amber-light, #FBBF24)" delay={0.4} isVisible={isVisible} />
              <StatPill label="Female LFPR" value={summary ? `${summary.femaleLfpr}%` : '...'} color="var(--gold)" delay={0.5} isVisible={isVisible} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function HealthcareDomainCard({ summary }: { summary: HealthcareSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini comparison bars: India vs WHO recommendation
  const compBars = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Beds', india: summary.hospitalBedsPer1000, who: 3.5 },
      { label: 'Docs', india: summary.physiciansPer1000, who: 2.5 },
      { label: 'Exp', india: summary.healthExpGDP, who: 6.0 },
    ];
  }, [summary]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/healthcare"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--rose), transparent 40%, var(--saffron) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(244,63,94,0.06), rgba(255,107,53,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 70% 50%, var(--rose), transparent 70%)' }} />
              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">08 — Data Story</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>Healthcare</h2>
                <p className="text-annotation mb-6 max-w-md">0.7 doctors per 1,000 people. Infrastructure deficits, spending gaps, out-of-pocket burden, immunization progress, and the disease burden.</p>
              </div>
              <div className="relative z-10">
                {compBars.length > 0 && (
                  <div className="mb-6 max-w-xs space-y-1.5">
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
                )}
                <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--rose)' }}>
                  <span>Explore healthcare</span>
                  <span className="group-hover:translate-x-1.5 inline-block" style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <StatPill label="Beds / 1,000" value={summary ? `${summary.hospitalBedsPer1000}` : '...'} color="var(--rose)" delay={0.3} isVisible={isVisible} />
              <StatPill label="Health Exp" value={summary ? `${summary.healthExpGDP}% GDP` : '...'} color="var(--rose-light, #FB7185)" delay={0.4} isVisible={isVisible} />
              <StatPill label="Out-of-Pocket" value={summary ? `${summary.outOfPocketPct}%` : '...'} color="var(--saffron)" delay={0.5} isVisible={isVisible} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EnvironmentDomainCard({ summary }: { summary: EnvironmentSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini split bar: fossil vs renewable share of electricity capacity
  const energySplit = useMemo(() => {
    if (!summary) return null;
    const fossil = summary.coalPct;
    const renewable = 100 - fossil;
    return { fossil, renewable };
  }, [summary]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/environment"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--teal), transparent 40%, var(--cyan) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(74,234,220,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 70% 50%, var(--teal), transparent 70%)' }} />
              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">09 — Data Story</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>Environment</h2>
                <p className="text-annotation mb-6 max-w-md">PM2.5 at {summary ? `${Math.round(summary.pm25 / 5)}×` : '...'} the WHO limit. Air quality, forest cover, the coal-to-solar shift, carbon footprint, and the water crisis underfoot.</p>
              </div>
              <div className="relative z-10">
                {energySplit && (
                  <div className="mb-6 max-w-xs">
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
                )}
                <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--teal)' }}>
                  <span>Explore environment</span>
                  <span className="group-hover:translate-x-1.5 inline-block" style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <StatPill label="PM2.5" value={summary ? `${summary.pm25.toFixed(0)} μg/m³` : '...'} color="var(--negative)" delay={0.3} isVisible={isVisible} />
              <StatPill label="Forest Cover" value={summary ? `${summary.forestPct.toFixed(1)}%` : '...'} color="var(--teal)" delay={0.4} isVisible={isVisible} />
              <StatPill label="Renewables" value={summary ? `${summary.renewablesPct.toFixed(1)}%` : '...'} color="var(--teal-light, #2DD4BF)" delay={0.5} isVisible={isVisible} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ElectionsDomainCard({ summary }: { summary: ElectionsSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini seat bar: NDA vs INDIA alliance vs Others
  const seatSplit = useMemo(() => {
    if (!summary) return null;
    const total = summary.totalConstituencies;
    return {
      nda: (summary.ndaSeats2024 / total) * 100,
      india: (summary.indiaAllianceSeats2024 / total) * 100,
      others: ((total - summary.ndaSeats2024 - summary.indiaAllianceSeats2024) / total) * 100,
    };
  }, [summary]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/elections"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--indigo), transparent 40%, var(--indigo-light) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(129,140,248,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 70% 50%, var(--indigo), transparent 70%)' }} />
              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">10 — Data Story</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>Elections</h2>
                <p className="text-annotation mb-6 max-w-md">{summary ? `${summary.totalElectorsCrore} crore` : '...'} voters, 543 seats, 67 years of democracy. Turnout trends, party shifts, and who your MP really is — criminal records, wealth, and all.</p>
              </div>
              <div className="relative z-10">
                {seatSplit && (
                  <div className="mb-6 max-w-xs">
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
                      <span className="text-[9px] font-mono" style={{ color: '#FF6B35' }}>{summary?.ndaSeats2024}</span>
                      <span className="text-[9px] font-mono" style={{ color: '#00BFFF' }}>{summary?.indiaAllianceSeats2024}</span>
                    </div>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--indigo)' }}>
                  <span>Explore elections</span>
                  <span className="group-hover:translate-x-1.5 inline-block" style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <StatPill label="Turnout 2024" value={summary ? `${summary.turnout2024}%` : '...'} color="var(--indigo)" delay={0.3} isVisible={isVisible} />
              <StatPill label="Criminal MPs" value={summary ? `${summary.criminalPct}%` : '...'} color="var(--negative)" delay={0.4} isVisible={isVisible} />
              <StatPill label="Women MPs" value={summary ? `${summary.womenMPsPct2024}%` : '...'} color="var(--indigo-light, #818CF8)" delay={0.5} isVisible={isVisible} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CrimeDomainCard({ summary }: { summary: CrimeSummary | null }) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Mini justice funnel: 3 shrinking bars showing attrition
  const funnelStages = useMemo(() => {
    if (!summary) return null;
    return [
      { label: 'Reported', pct: 100 },
      { label: 'Chargesheeted', pct: 74.6 },
      { label: 'Convicted', pct: summary.convictionRatePct },
    ];
  }, [summary]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className="mt-8"
    >
      <Link
        to="/crime"
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--crimson), transparent 40%, var(--crimson-light) 80%, transparent)',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.06), rgba(239,68,68,0.04))',
            transition: 'opacity 0.4s ease',
          }}
        />

        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            <div className="relative p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 70% 50%, var(--crimson), transparent 70%)' }} />
              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">11 — Data Story</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>Crime &amp; Safety</h2>
                <p className="text-annotation mb-6 max-w-md">{summary ? `${(summary.totalCrimes / 100000).toFixed(1)}L` : '...'} crimes recorded in {summary?.dataYear ?? '2022'}. One every 5 seconds. From FIR to conviction, the justice pipeline loses 60% along the way.</p>
              </div>
              <div className="relative z-10">
                {funnelStages && (
                  <div className="mb-6 max-w-xs space-y-1.5">
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
                )}
                <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--crimson)' }}>
                  <span>Explore crime data</span>
                  <span className="group-hover:translate-x-1.5 inline-block" style={{ transition: 'transform 0.2s ease' }}>&rarr;</span>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center gap-8 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <StatPill label="Crime rate" value={summary ? `${summary.crimeRate}/lakh` : '...'} color="var(--crimson)" delay={0.3} isVisible={isVisible} />
              <StatPill label="Conviction rate" value={summary ? `${summary.convictionRatePct}%` : '...'} color="var(--crimson)" delay={0.4} isVisible={isVisible} />
              <StatPill label="Road deaths/day" value={summary ? `${Math.round(summary.roadDeaths / 365)}` : '...'} color="var(--crimson-light, #EF4444)" delay={0.5} isVisible={isVisible} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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
        // Small delay lets the page render and animations initialize
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

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

      {/* Domain stories */}
      <section id="stories" className="max-w-5xl mx-auto px-6 sm:px-8 pb-24 scroll-mt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-section-num tracking-[0.15em] uppercase mb-8"
        >
          {'Data Stories'}
        </motion.p>

        <DomainCard summary={summary} />

        <EconomyDomainCard summary={economySummary} />

        <RBIDomainCard summary={rbiSummary} />

        <StatesDomainCard summary={statesSummary} />

        <CensusDomainCard summary={censusSummary} />

        <EducationDomainCard summary={educationSummary} />

        <EmploymentDomainCard summary={employmentSummary} />

        <HealthcareDomainCard summary={healthcareSummary} />

        <EnvironmentDomainCard summary={environmentSummary} />

        <ElectionsDomainCard summary={electionsSummary} />

        <CrimeDomainCard summary={crimeSummary} />
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

      {/* For Developers, Journalists & Teachers */}
      <section className="mt-24 mb-16">
        <h2
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          Build With This Data
        </h2>
        <p
          className="text-sm text-center mb-8 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Open data for everyone — developers, journalists, and teachers.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <MultiplierCard
            to="/open-data"
            title="Open Data"
            desc="80 JSON endpoints. No API key."
            accent="var(--cyan)"
          />
          <MultiplierCard
            to="/for-journalists"
            title="For Journalists"
            desc="Chart gallery, story kits, embeds."
            accent="var(--saffron)"
          />
          <MultiplierCard
            to="/for-teachers"
            title="For Teachers"
            desc="NCERT-mapped lesson plans."
            accent="var(--positive)"
          />
        </div>
      </section>
    </motion.div>
  );
}

function MultiplierCard({ to, title, desc, accent }: { to: string; title: string; desc: string; accent: string }) {
  return (
    <Link
      to={to}
      className="group block rounded-xl overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="h-0.5" style={{ background: accent }} />
      <div className="p-5 text-center">
        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
