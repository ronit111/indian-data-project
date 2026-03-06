import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { EnergyData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface CarbonFootprintSectionProps {
  data: EnergyData;
}

export function CarbonFootprintSection({ data }: CarbonFootprintSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // CO2 per capita trend — if World Bank data is available
  const co2Series: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.co2PerCapitaTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'co2_pc',
        name: 'India CO₂/capita',
        color: 'var(--teal)',
        data: data.co2PerCapitaTimeSeries,
      });
    }
    return series;
  }, [data]);

  // Coal electricity % trend
  const coalSeries: LineSeries[] = useMemo(() => {
    if (data.coalElecTimeSeries.length < MIN_POINTS) return [];
    return [{
      id: 'coal_pct',
      name: 'Electricity from coal (%)',
      color: '#6B7280',
      data: data.coalElecTimeSeries,
    }];
  }, [data]);

  const hasAnySeries = co2Series.length > 0 || coalSeries.length > 0;

  return (
    <section ref={ref} id="carbon-footprint" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Carbon footprint
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India emits 1.9 tonnes CO₂ per person — well below the US (14) and China (8). But with 1.4 billion people, the total ranks 3rd globally. India needs energy to develop, yet is among the most climate-vulnerable nations.
        </motion.p>

        {/* Peer reference context */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          {[
            { label: 'India', value: '1.9t', color: 'var(--teal)' },
            { label: 'World Avg', value: '4.7t', color: 'var(--text-muted)' },
            { label: 'China', value: '8.0t', color: 'var(--amber)' },
            { label: 'US', value: '14.0t', color: 'var(--negative)' },
          ].map((peer) => (
            <div
              key={peer.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: peer.color }} />
              <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{peer.value}</span>
              <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{peer.label}</span>
            </div>
          ))}
        </motion.div>

        {co2Series.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              CO₂ emissions per capita (tonnes)
            </p>
            <ChartActionsWrapper registryKey="environment/carbon-footprint" data={data}>
              <LineChart
                series={co2Series}
                isVisible={isVisible}
                formatValue={(v) => `${v.toFixed(2)}t`}
                unit=""
              />
            </ChartActionsWrapper>
          </div>
        )}

        {coalSeries.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Electricity from coal (%)
            </p>
            <ChartActionsWrapper registryKey="environment/carbon-footprint" data={data}>
              <LineChart
                series={coalSeries}
                isVisible={isVisible}
                formatValue={(v) => `${v.toFixed(1)}%`}
                unit=""
              />
            </ChartActionsWrapper>
          </div>
        )}

        {!hasAnySeries && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-annotation"
            style={{ color: 'var(--text-muted)' }}
          >
            CO₂ per capita time series data is currently unavailable from the World Bank API. The curated national figure (1.9 tonnes) is shown above.
          </motion.p>
        )}

        <RelatedTopics sectionId="carbon" domain="environment" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
