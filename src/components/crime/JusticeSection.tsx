import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { FunnelChart, type FunnelStage } from '../viz/FunnelChart.tsx';
import { BulletChart } from '../viz/BulletChart.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { JusticeData } from '../../lib/data/schema.ts';

interface JusticeSectionProps {
  data: JusticeData;
}

export function JusticeSection({ data }: JusticeSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const funnelStages: FunnelStage[] = useMemo(() => [
    { label: 'Cases for Investigation', value: data.funnel.totalForInvestigation },
    { label: 'Investigated', value: data.funnel.investigated },
    { label: 'Chargesheeted (accused in court filing)', value: data.funnel.chargesheeted },
    { label: 'Trial Completed', value: data.funnel.trialCompleted },
    { label: 'Convicted', value: data.funnel.convicted },
  ], [data]);

  return (
    <section ref={ref} id="justice-pipeline" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The justice pipeline
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Of every 100 crimes reported, only 13 end in conviction. The funnel narrows at every stage:
          investigation backlogs, low chargesheet rates, and trial delays averaging {data.trialDuration.avgYears} years.
          Even among cases that reach trial, the conviction rate is just {data.funnel.convictionRate}%. {data.trialDuration.casesOver5Years}% of cases
          have been pending for over 5 years.
        </motion.p>

        {/* Justice funnel */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            From FIR to conviction — how cases drain away
          </p>
          <ChartActionsWrapper registryKey="crime/justice" data={data}>
            <FunnelChart
              stages={funnelStages}
              isVisible={isVisible}
              accentColor="var(--crimson)"
              ariaLabel="Justice pipeline funnel: from investigation to conviction"
              formatValue={(v) => `${(v / 100000).toFixed(1)}L`}
            />
          </ChartActionsWrapper>
        </div>

        {/* Conviction rate bullet */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Conviction rate — India vs reasonable benchmark
          </p>
          <ChartActionsWrapper registryKey="crime/justice" data={data}>
            <BulletChart
              value={data.funnel.convictionRate}
              target={50}
              ranges={{ good: 50, satisfactory: 35, max: 100 }}
              label="Conviction rate %"
              formatValue={(v) => `${v}%`}
              accentColor="var(--crimson)"
              isVisible={isVisible}
            />
          </ChartActionsWrapper>
        </div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          <div
            className="p-5 rounded-xl"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Avg Trial Duration
            </p>
            <p className="text-3xl font-mono font-bold" style={{ color: 'var(--crimson)' }}>
              {data.trialDuration.avgYears} yrs
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {data.trialDuration.casesOver10Years}% pending 10+ years
            </p>
          </div>
          <div
            className="p-5 rounded-xl"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Judges per Million
            </p>
            <p className="text-3xl font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
              {data.trialDuration.judgesPerMillion}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Global average: ~50 per million
            </p>
          </div>
          <div
            className="p-5 rounded-xl"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Pending Cases
            </p>
            <p className="text-3xl font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
              {(data.funnel.pendingTrial / 100000).toFixed(1)}L
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Pendency rate: {data.funnel.pendencyRate}%
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="text-annotation mt-8 max-w-xl"
        >
          For context, conviction rates in the UK and Japan exceed 70%. India is expanding fast-track courts, e-FIRs, and virtual hearings to clear the backlog — but with just {data.trialDuration.judgesPerMillion} judges per million citizens (global average: ~50), the system needs fundamental expansion, not just efficiency tweaks.
        </motion.p>

        <RelatedTopics sectionId="justice-pipeline" domain="crime" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
