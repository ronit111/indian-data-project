import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import type { WomenSafetyData } from '../../lib/data/schema.ts';

interface WomenSafetySectionProps {
  data: WomenSafetyData;
}

export function WomenSafetySection({ data }: WomenSafetySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const trendSeries: LineSeries[] = useMemo(() => [
    {
      id: 'total',
      name: 'Total Cases',
      color: 'var(--crimson)',
      data: data.nationalTrend.map((t) => ({ year: t.year, value: t.total })),
    },
  ], [data]);

  const typeItems: BarItem[] = useMemo(() =>
    data.crimeTypes.map((ct) => ({
      id: ct.id,
      label: ct.name,
      value: ct.cases,
      color: ct.id === 'cruelty' ? 'var(--crimson)' : 'var(--crimson-light)',
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
  const perDay = latest ? Math.round(latest.total / 365) : null;

  return (
    <section ref={ref} id="women-safety" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Crimes against women
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {latest ? `${(latest.total / 1000).toFixed(0)}K` : '—'} reported cases in 2022 — {perDay ?? '—'} every day.
          Cruelty by husband or relatives accounts for 1 in 3 cases.
          The rate climbed from 56 to 66 per lakh women in 8 years — rising awareness or rising violence, likely both.
        </motion.p>

        {/* National trend */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Crimes against women (total cases), 2014–2022
          </p>
          <ChartActionsWrapper registryKey="crime/crimes-against-women" data={data}>
            <LineChart
              series={trendSeries}
              isVisible={isVisible}
              formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {/* Crime types */}
        <div className="mb-10">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            By type — cruelty, kidnapping, and assault dominate
          </p>
          <ChartActionsWrapper registryKey="crime/crimes-against-women" data={data}>
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

        {/* State choropleth */}
        {choroData.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              State rates per lakh women — Rajasthan and Delhi lead
            </p>
            <ChartActionsWrapper registryKey="crime/crimes-against-women" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--crimson)"
                formatValue={(v) => `${v.toFixed(1)}`}
                legendLabel="Per lakh women"
                isVisible={isVisible}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="women-safety" domain="crime" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
