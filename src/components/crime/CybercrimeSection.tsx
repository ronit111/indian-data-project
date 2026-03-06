import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { CybercrimeData } from '../../lib/data/schema.ts';

interface CybercrimeSectionProps {
  data: CybercrimeData;
}

function GapVisualization({ complaints, firs, isVisible }: { complaints: number; firs: number; isVisible: boolean }) {
  const ratio = complaints > 0 ? ((firs / complaints) * 100).toFixed(1) : '—';

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-stretch my-8">
      {/* I4C Complaints */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 p-5 rounded-xl"
        style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
      >
        <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          I4C Portal Complaints
        </p>
        <p className="text-3xl md:text-4xl font-mono font-bold" style={{ color: 'var(--crimson)' }}>
          {(complaints / 100000).toFixed(1)}L
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          citizen-reported online
        </p>
      </motion.div>

      {/* Arrow / connector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center"
      >
        <div className="px-3 py-2 rounded-full text-xs font-mono font-bold"
          style={{ background: 'var(--crimson-dim)', color: 'var(--crimson-light)', border: '1px solid rgba(220,38,38,0.25)' }}>
          Only {ratio}% become FIRs
        </div>
      </motion.div>

      {/* NCRB FIRs */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="flex-1 p-5 rounded-xl"
        style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
      >
        <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          NCRB Registered FIRs
        </p>
        <p className="text-3xl md:text-4xl font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
          {(firs / 1000).toFixed(1)}K
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          formally investigated
        </p>
      </motion.div>
    </div>
  );
}

export function CybercrimeSection({ data }: CybercrimeSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const trendSeries: LineSeries[] = useMemo(() => [
    {
      id: 'firs',
      name: 'Cybercrime FIRs',
      color: 'var(--crimson)',
      data: data.ncrbTrend.map((t) => ({ year: t.year, value: t.cases })),
    },
  ], [data]);

  const typeItems: BarItem[] = useMemo(() =>
    data.crimeTypes.map((ct) => ({
      id: ct.id,
      label: ct.name,
      value: ct.cases,
      color: ct.id === 'fraud' ? 'var(--crimson)' : 'var(--crimson-light)',
    })),
  [data]);

  const firstYear = data.ncrbTrend[0];
  const lastYear = data.ncrbTrend[data.ncrbTrend.length - 1];
  const multiplier = firstYear && lastYear ? (lastYear.cases / firstYear.cases).toFixed(0) : null;

  return (
    <section ref={ref} id="cybercrime" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The digital crime wave
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {lastYear ? `${(lastYear.cases / 1000).toFixed(0)}K` : '—'} cybercrime FIRs in 2022 — {multiplier ?? '—'}x growth in {data.ncrbTrend.length - 1} years.
          The I4C (Indian Cyber Crime Coordination Centre) portal received 22.68 lakh complaints — 34 times the number of FIRs registered.
          Online fraud alone accounts for ~42% of registered cases.
        </motion.p>

        {/* NCRB FIR trend */}
        <div className="mb-6">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            NCRB-registered cybercrime FIRs, 2017–2022
          </p>
          <ChartActionsWrapper registryKey="crime/cybercrime" data={data}>
            <LineChart
              series={trendSeries}
              isVisible={isVisible}
              formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {/* The gap visualization */}
        <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
          The reporting gap — complaints vs formal FIRs
        </p>
        <GapVisualization
          complaints={data.i4cComplaints}
          firs={lastYear?.cases ?? 0}
          isVisible={isVisible}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs mb-8 italic max-w-lg"
          style={{ color: 'var(--text-muted)' }}
        >
          Financial loss via I4C: ₹{data.i4cFinancialLossCrore.toLocaleString('en-IN')} Cr (2022). {data.i4cNote}
        </motion.p>

        {/* Crime types */}
        <div className="mt-8">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Cybercrime types — online fraud dominates
          </p>
          <ChartActionsWrapper registryKey="crime/cybercrime" data={data}>
            <HorizontalBarChart
              items={typeItems}
              isVisible={isVisible}
              formatValue={(v) => `${(v / 1000).toFixed(1)}K`}
              unit=""
              labelWidth={200}
              barHeight={26}
            />
          </ChartActionsWrapper>
        </div>

        <RelatedTopics sectionId="cybercrime" domain="crime" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
