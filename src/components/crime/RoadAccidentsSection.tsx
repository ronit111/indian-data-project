import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { AreaChart, type AreaSeries } from '../viz/AreaChart.tsx';
import { HorizontalBarChart } from '../viz/HorizontalBarChart.tsx';
import { DotStrip } from '../viz/DotStrip.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { RoadAccidentData } from '../../lib/data/schema.ts';

interface RoadAccidentsSectionProps {
  data: RoadAccidentData;
}

export function RoadAccidentsSection({ data }: RoadAccidentsSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const areaSeries: AreaSeries[] = useMemo(() => [
    {
      id: 'killed',
      name: 'Killed',
      color: 'var(--crimson)',
      data: data.nationalTrend.map((t) => ({ year: t.year, value: t.killed })),
    },
    {
      id: 'injured',
      name: 'Injured',
      color: 'var(--crimson-light)',
      data: data.nationalTrend.map((t) => ({ year: t.year, value: t.injured })),
    },
  ], [data]);

  const causesBars = useMemo(() =>
    data.causes
      .sort((a, b) => b.pct - a.pct)
      .map((c) => ({
        id: c.id,
        label: c.name,
        value: c.pct,
      })),
  [data]);

  const fatalityDots = useMemo(() =>
    data.stateFatalities.slice(0, 15).map((s) => ({
      id: s.id,
      label: s.name,
      value: s.rate,
      color: s.rate > 17 ? 'var(--crimson)' : 'var(--crimson-light)',
    })),
  [data]);

  const latest = data.nationalTrend[data.nationalTrend.length - 1];
  const perDay = latest ? Math.round(latest.killed / 365) : null;

  return (
    <section ref={ref} id="road-accidents" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Roads that kill
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {latest ? `${(latest.killed / 1000).toFixed(1)}K` : '—'} dead on Indian roads in 2022 — {perDay ?? '—'} every day.
          India has 1% of the world's vehicles but 11% of global road deaths.
          Over-speeding alone causes 72% of fatal accidents.
        </motion.p>

        {/* Killed + Injured trend */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Road accident deaths and injuries, 2014–2022
          </p>
          <ChartActionsWrapper registryKey="crime/road-accidents" data={data}>
            <AreaChart
              series={areaSeries}
              isVisible={isVisible}
              formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {/* Causes breakdown — waffle */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            What causes fatal accidents
          </p>
          <ChartActionsWrapper registryKey="crime/road-accidents" data={data}>
            <HorizontalBarChart
              items={causesBars.map((b) => ({ ...b, color: 'var(--crimson)' }))}
              isVisible={isVisible}
              formatValue={(v) => `${v}%`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {/* State fatality rates — DotStrip */}
        <div className="mt-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            State fatality rates per lakh population — top 15
          </p>
          <ChartActionsWrapper registryKey="crime/road-accidents" data={data}>
            <DotStrip
              data={fatalityDots}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}`}
              accentColor="var(--crimson)"
            />
          </ChartActionsWrapper>
        </div>

        <RelatedTopics sectionId="road-accidents" domain="crime" />
        <CrossDomainLink domain="crime" sectionId="road-accidents" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
