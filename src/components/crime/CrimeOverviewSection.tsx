import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { DotStrip } from '../viz/DotStrip.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { CrimeOverviewData } from '../../lib/data/schema.ts';

interface CrimeOverviewSectionProps {
  data: CrimeOverviewData;
}

export function CrimeOverviewSection({ data }: CrimeOverviewSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const trendSeries: LineSeries[] = useMemo(() => [
    {
      id: 'ipc',
      name: 'IPC Crimes',
      color: 'var(--crimson)',
      data: data.nationalTrend.map((t) => ({ year: t.year, value: t.ipc })),
    },
    {
      id: 'sll',
      name: 'SLL Crimes',
      color: 'var(--crimson-light)',
      data: data.nationalTrend.map((t) => ({ year: t.year, value: t.sll })),
    },
  ], [data]);

  const dotStripItems = useMemo(() =>
    data.ipcComposition
      .filter((c) => c.id !== 'other-ipc')
      .map((c) => ({
        id: c.id,
        label: c.name,
        value: c.cases,
        color: 'var(--crimson)',
      })),
  [data]);

  const choroData: ChoroplethDataPoint[] = useMemo(() =>
    data.stateRates.map((s) => ({
      id: s.id,
      name: s.name,
      value: s.rate,
    })),
  [data]);

  const latest = data.nationalTrend[data.nationalTrend.length - 1];
  const covidDip = data.nationalTrend.find((t) => t.year === '2020');
  const growth = latest && data.nationalTrend[0]
    ? ((latest.total - data.nationalTrend[0].total) / data.nationalTrend[0].total * 100).toFixed(0)
    : null;

  return (
    <section ref={ref} id="crime-overview" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The state of crime
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          58.2 lakh cognizable crimes in 2022 — up {growth}% since 2014. Cognizable means crimes where police must register an FIR.
          {covidDip && <> The 2020 dip to {(covidDip.total / 100000).toFixed(1)}L reflects lockdown suppression, not safer streets.</>}
          {' '}IPC crimes cover everyday offences (theft, assault, murder, fraud). Special & Local Laws (SLL) cover specific acts like drug offences and cybercrime. IPC makes up 61% of the total.
        </motion.p>

        {/* Trend chart */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Total cognizable crimes, 2014–2022 (IPC vs SLL)
          </p>
          <ChartActionsWrapper registryKey="crime/overview" data={data}>
            <LineChart
              series={trendSeries}
              isVisible={isVisible}
              formatValue={(v) => `${(v / 100000).toFixed(1)}L`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {/* IPC Composition — DotStrip */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            IPC crime composition — what types dominate
          </p>
          <ChartActionsWrapper registryKey="crime/overview" data={data}>
            <DotStrip
              data={dotStripItems}
              isVisible={isVisible}
              formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
              accentColor="var(--crimson)"
            />
          </ChartActionsWrapper>
        </div>

        {/* State choropleth */}
        {choroData.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              State crime rates per lakh — Kerala leads at 1,287 (high reporting, not worse safety)
            </p>
            <ChartActionsWrapper registryKey="crime/overview" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--crimson)"
                formatValue={(v) => `${v.toFixed(0)}`}
                legendLabel="Crimes per lakh"
                isVisible={isVisible}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="crime-overview" domain="crime" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
