import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import type { TurnoutData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface TurnoutSectionProps {
  data: TurnoutData;
}

export function TurnoutSection({ data }: TurnoutSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const turnoutSeries: LineSeries[] = useMemo(() => {
    return [{
      id: 'turnout',
      name: 'Voter Turnout',
      color: 'var(--indigo)',
      data: data.nationalTrend.map((t) => ({
        year: t.year,
        value: t.turnout,
      })),
    }];
  }, [data]);

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.stateBreakdown2024.map((s) => ({
      id: s.id,
      name: s.name,
      value: s.turnout,
    }));
  }, [data]);

  const highest = data.stateBreakdown2024[0];
  const lowest = data.stateBreakdown2024[data.stateBreakdown2024.length - 1];
  const peak = data.nationalTrend.reduce((a, b) => a.turnout > b.turnout ? a : b);

  return (
    <section ref={ref} id="turnout" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The world's largest election
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          From 19 crore voters in 1957 to nearly 97 crore in 2024 — India's electorate grew 5× in 67 years.
          Peak turnout: {peak.turnout}% in {peak.year}.
          {highest && lowest && (
            <> The gap between states is enormous: {highest.name} at {highest.turnout}% vs. {lowest.name} at {lowest.turnout}%.</>
          )}
        </motion.p>

        {/* Event annotations as chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {data.events.map((e) => (
            <span
              key={e.year}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
              style={{
                background: 'var(--indigo-dim)',
                color: 'var(--indigo-light)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <span className="font-bold">{e.year}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{e.event}</span>
            </span>
          ))}
        </motion.div>

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            National voter turnout (%), 1957–2024
          </p>
          <ChartActionsWrapper registryKey="elections/turnout" data={data}>
            <LineChart
              series={turnoutSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {choroData.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              State-wise turnout — Lok Sabha 2024
            </p>
            <ChartActionsWrapper registryKey="elections/turnout" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--indigo)"
                formatValue={(v) => `${v.toFixed(1)}%`}
                legendLabel="Turnout %"
                isVisible={isVisible}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="turnout" domain="elections" />
        <CrossDomainLink domain="elections" sectionId="turnout" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
