import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { BulletChart } from '../viz/BulletChart.tsx';
import { SmallMultiples } from '../viz/SmallMultiples.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { PoliceData } from '../../lib/data/schema.ts';

interface PoliceSectionProps {
  data: PoliceData;
}

export function PoliceSection({ data }: PoliceSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const sortedStates = useMemo(() =>
    [...data.stateRatios].sort((a, b) => b.actual - a.actual),
  [data]);

  return (
    <section ref={ref} id="police-infrastructure" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Who polices 140 crore people?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {data.actualStrength.toLocaleString('en-IN')} police personnel for 140 crore people — a ratio of {data.actualRatePerLakh} per lakh,
          well below the UN-recommended {data.unRecommended}. {data.vacancyPct}% of sanctioned posts lie vacant.
          Women make up just {data.womenPolicePct}% of the force.
        </motion.p>

        {/* Bullet: Actual vs UN recommended */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Police-population ratio: India vs UN recommendation
          </p>
          <ChartActionsWrapper registryKey="crime/police" data={data}>
            <BulletChart
              value={data.actualRatePerLakh}
              target={data.unRecommended}
              ranges={{ good: data.unRecommended, satisfactory: data.unRecommended * 0.75, max: Math.round(data.unRecommended * 1.3) }}
              label="Police per lakh"
              formatValue={(v) => `${v}`}
              accentColor="var(--crimson)"
              isVisible={isVisible}
            />
          </ChartActionsWrapper>
        </div>

        {/* Small multiples: state ratios */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            State-wise police ratio — dashed line = UN recommended (222)
          </p>
          <ChartActionsWrapper registryKey="crime/police" data={data}>
            <SmallMultiples columns={{ sm: 2, md: 3, lg: 4 }}>
              {sortedStates.map((s) => {
                const maxVal = Math.max(data.unRecommended * 1.2, ...sortedStates.map((st) => st.actual));
                const barW = (s.actual / maxVal) * 100;
                const targetW = (data.unRecommended / maxVal) * 100;
                const meetsTarget = s.actual >= data.unRecommended;
                return (
                  <div key={s.id} className="py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono truncate" style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                      <span className="text-[10px] font-mono ml-1" style={{ color: meetsTarget ? 'var(--crimson)' : 'var(--text-muted)' }}>{s.actual.toFixed(0)}</span>
                    </div>
                    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: meetsTarget ? 'var(--crimson)' : 'var(--crimson-dim)' }}
                        initial={{ width: 0 }}
                        animate={isVisible ? { width: `${barW}%` } : {}}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <div
                        className="absolute inset-y-0 w-px"
                        style={{ left: `${targetW}%`, background: 'var(--text-muted)', opacity: 0.5 }}
                      />
                    </div>
                  </div>
                );
              })}
            </SmallMultiples>
          </ChartActionsWrapper>
        </div>

        {/* Women in police — annotated stat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 mt-8"
        >
          <div
            className="flex-1 p-5 rounded-xl"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Women in Police Force
            </p>
            <p className="text-3xl font-mono font-bold" style={{ color: 'var(--crimson)' }}>
              {data.womenPolicePct}%
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {(data.womenPoliceTotal / 100000).toFixed(1)} lakh out of {(data.actualStrength / 100000).toFixed(1)} lakh total
            </p>
          </div>
          <div
            className="flex-1 p-5 rounded-xl"
            style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
          >
            <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Vacancy
            </p>
            <p className="text-3xl font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
              {data.vacancyPct}%
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {(data.sanctionedStrength - data.actualStrength).toLocaleString('en-IN')} posts unfilled
            </p>
          </div>
        </motion.div>

        <RelatedTopics sectionId="police-infrastructure" domain="crime" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
