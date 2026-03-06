import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { CandidatesData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface MoneyMuscleSectionProps {
  data: CandidatesData;
}

export function MoneyMuscleSection({ data }: MoneyMuscleSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Wealthiest MPs bar chart
  const wealthBars: BarItem[] = useMemo(() => {
    return data.topWealthiest.slice(0, 15).map((mp) => ({
      id: `w-${mp.rank}`,
      label: `${mp.name} (${mp.party})`,
      value: mp.assetsCrore,
      color: 'var(--gold)',
    }));
  }, [data]);

  // Criminal cases bar chart
  const criminalBars: BarItem[] = useMemo(() => {
    return data.topCriminal.map((mp) => ({
      id: `c-${mp.rank}`,
      label: `${mp.name} (${mp.party})`,
      value: mp.cases,
      color: 'var(--negative)',
    }));
  }, [data]);

  const { criminal, assets, education } = data;

  return (
    <section ref={ref} id="money-muscle" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Money &amp; muscle in Parliament
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          These numbers come from the candidates themselves. Not allegations. Not media reports. Sworn affidavits filed under oath with the Election Commission of India. {criminal.pctAny}% of elected MPs declared criminal cases. {criminal.pctSerious}% face serious charges — murder, attempt to murder, kidnapping, rape. The average MP declared assets of ₹{assets.avgCrore.toFixed(0)} crore. The 64 crore people who showed up chose this Parliament.
        </motion.p>

        {/* Summary stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
        >
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-raised)' }}>
            <p className="text-xl font-mono font-bold" style={{ color: 'var(--negative)' }}>
              {criminal.withAnyCases}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              MPs with criminal cases
            </p>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-raised)' }}>
            <p className="text-xl font-mono font-bold" style={{ color: 'var(--saffron)' }}>
              {criminal.withSeriousCases}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Serious charges
            </p>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-raised)' }}>
            <p className="text-xl font-mono font-bold" style={{ color: 'var(--gold)' }}>
              ₹{assets.avgCrore}Cr
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Avg declared assets
            </p>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--bg-raised)' }}>
            <p className="text-xl font-mono font-bold" style={{ color: 'var(--indigo)' }}>
              {education.postGradAndAbove}%
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Post-graduates
            </p>
          </div>
        </motion.div>

        {/* Wealthiest MPs */}
        {wealthBars.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Wealthiest MPs — declared assets (₹ crore)
            </p>
            <ChartActionsWrapper registryKey="elections/money-muscle" data={data}>
              <HorizontalBarChart
                items={wealthBars}
                isVisible={isVisible}
                formatValue={(v) => `₹${v.toLocaleString('en-IN')} Cr`}
                unit=""
                labelWidth={180}
                barHeight={22}
              />
            </ChartActionsWrapper>
          </div>
        )}

        {/* Most criminal cases */}
        {criminalBars.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Most criminal cases — from sworn affidavits
            </p>
            <ChartActionsWrapper registryKey="elections/money-muscle" data={data}>
              <HorizontalBarChart
                items={criminalBars}
                isVisible={isVisible}
                formatValue={(v) => `${v} cases`}
                unit=""
                labelWidth={200}
                barHeight={22}
              />
            </ChartActionsWrapper>
          </div>
        )}

        {/* Education breakdown — inline donut-style display */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-10 p-5 rounded-lg"
          style={{ background: 'var(--bg-raised)' }}
        >
          <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Education profile of 543 MPs
          </p>
          <div className="flex items-center gap-1 h-6 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-l-full"
              style={{ width: `${education.postGradAndAbove}%`, background: 'var(--indigo)' }}
            />
            <div
              className="h-full"
              style={{ width: `${education.graduate}%`, background: 'var(--indigo-light)' }}
            />
            <div
              className="h-full rounded-r-full"
              style={{ width: `${education.belowGraduate}%`, background: 'var(--text-muted)' }}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--indigo)' }} />
              Post-graduate+ ({education.postGradAndAbove}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--indigo-light)' }} />
              Graduate ({education.graduate}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--text-muted)' }} />
              Below graduate ({education.belowGraduate}%)
            </span>
          </div>
        </motion.div>

        <RelatedTopics sectionId="candidates" domain="elections" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
