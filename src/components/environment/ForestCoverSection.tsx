import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { ForestData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface ForestCoverSectionProps {
  data: ForestData;
}

export function ForestCoverSection({ data }: ForestCoverSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const forestSeries: LineSeries[] = useMemo(() => {
    if (data.forestPctTimeSeries.length < MIN_POINTS) return [];
    return [{
      id: 'forest_pct',
      name: 'Forest Cover (% of land area)',
      color: 'var(--teal)',
      data: data.forestPctTimeSeries,
    }];
  }, [data]);

  // Diverging choropleth: green (gains) vs red (losses)
  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.stateForestCover
      .filter((s) => Math.abs(s.changeKm2) > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.changeKm2 }));
  }, [data]);

  // Top 8 gainers and top 8 losers for companion bars
  const topGainers: BarItem[] = useMemo(() => {
    return [...data.stateForestCover]
      .filter((s) => s.changeKm2 > 0)
      .sort((a, b) => b.changeKm2 - a.changeKm2)
      .slice(0, 8)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: s.changeKm2,
        color: 'var(--positive)',
      }));
  }, [data]);

  const topLosers: BarItem[] = useMemo(() => {
    return [...data.stateForestCover]
      .filter((s) => s.changeKm2 < 0)
      .sort((a, b) => a.changeKm2 - b.changeKm2)
      .slice(0, 8)
      .map((s) => ({
        id: s.id,
        label: s.name,
        value: Math.abs(s.changeKm2),
        color: 'var(--negative)',
      }));
  }, [data]);

  return (
    <section ref={ref} id="forest-cover" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Forest cover
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India has 25.17% forest cover according to ISFR 2023 (India State of Forest Report) — below the 33% national policy target. Madhya Pradesh leads losses (-372 km²), followed by Andhra Pradesh and Telangana. Mizoram, Gujarat, and Odisha saw the largest gains.
        </motion.p>

        {forestSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Forest cover as % of land area
            </p>
            <ChartActionsWrapper registryKey="environment/forest-cover" data={data}>
              <LineChart
                series={forestSeries}
                isVisible={isVisible}
                formatValue={(v) => `${v.toFixed(1)}%`}
                unit=""
              />
            </ChartActionsWrapper>
          </div>
        )}

        {choroData.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Forest cover change (km², ISFR 2021 → 2023)
            </p>
            <ChartActionsWrapper registryKey="environment/forest-cover" data={data}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <GenericChoropleth
                  data={choroData}
                  colorScaleType="diverging"
                  divergingLow="var(--negative)"
                  divergingHigh="var(--positive)"
                  formatValue={(v) => (v > 0 ? `+${v.toFixed(0)} km²` : `${v.toFixed(0)} km²`)}
                  legendLabel="Change km²"
                  isVisible={isVisible}
                />
                <div className="space-y-6">
                  {topGainers.length > 0 && (
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--positive)' }}>
                        Top gainers
                      </p>
                      <HorizontalBarChart
                        items={topGainers}
                        isVisible={isVisible}
                        formatValue={(v) => `+${v} km²`}
                        unit=""
                        labelWidth={120}
                        barHeight={20}
                      />
                    </div>
                  )}
                  {topLosers.length > 0 && (
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--negative)' }}>
                        Top losers
                      </p>
                      <HorizontalBarChart
                        items={topLosers}
                        isVisible={isVisible}
                        formatValue={(v) => `−${v} km²`}
                        unit=""
                        labelWidth={120}
                        barHeight={20}
                      />
                    </div>
                  )}
                </div>
              </div>
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="forest" domain="environment" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
