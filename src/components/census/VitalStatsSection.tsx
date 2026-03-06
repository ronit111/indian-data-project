import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { DemographicsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface VitalStatsSectionProps {
  data: DemographicsData;
}

export function VitalStatsSection({ data }: VitalStatsSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const vitalSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.vitalStats.birthRate.length >= MIN_POINTS) {
      series.push({ id: 'birth', name: 'Birth Rate', color: 'var(--violet)', data: data.vitalStats.birthRate });
    }
    if (data.vitalStats.deathRate.length >= MIN_POINTS) {
      series.push({ id: 'death', name: 'Death Rate', color: 'var(--saffron)', data: data.vitalStats.deathRate, dashed: true });
    }
    return series;
  }, [data]);

  const fertilitySeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.vitalStats.fertilityRate.length >= MIN_POINTS) {
      series.push({ id: 'tfr', name: 'Total Fertility Rate', color: 'var(--violet)', data: data.vitalStats.fertilityRate });
    }
    return series;
  }, [data]);

  const lifeSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.vitalStats.lifeExpectancy.length >= MIN_POINTS) {
      series.push({ id: 'total', name: 'Total', color: 'var(--violet)', data: data.vitalStats.lifeExpectancy });
    }
    if (data.vitalStats.lifeExpectancyFemale.length >= MIN_POINTS) {
      series.push({ id: 'female', name: 'Female', color: 'var(--violet-light)', data: data.vitalStats.lifeExpectancyFemale });
    }
    if (data.vitalStats.lifeExpectancyMale.length >= MIN_POINTS) {
      series.push({ id: 'male', name: 'Male', color: 'var(--gold)', data: data.vitalStats.lifeExpectancyMale, dashed: true });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="vital-stats" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-composition mb-2"
        >
          Fewer babies, longer lives
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's fertility rate dropped below the replacement level of 2.1 children per woman in 2020. Birth rates have fallen 40% over two decades while life expectancy has climbed past 72 years. The country is aging slowly but surely.
        </motion.p>

        {/* Birth vs Death rate */}
        {vitalSeries.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Birth Rate vs Death Rate (per 1,000 people)
            </p>
            <ChartActionsWrapper registryKey="census/vital-stats" data={data}>
              <LineChart
              series={vitalSeries}
              isVisible={isVisible}
              formatValue={(v) => v.toFixed(1)}
              unit="per 1000"
            />
            </ChartActionsWrapper>
          </div>
        )}

        {/* Fertility rate with replacement line */}
        {fertilitySeries.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Total Fertility Rate (children per woman)
            </p>
            <ChartActionsWrapper registryKey="census/vital-stats" data={data}>
              <LineChart
              series={fertilitySeries}
              isVisible={isVisible}
              referenceLine={2.1}
              formatValue={(v) => v.toFixed(2)}
              unit="children"
            />
            </ChartActionsWrapper>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Dashed line = replacement level (2.1)
            </p>
          </div>
        )}

        {/* Life expectancy with gender split */}
        {lifeSeries.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Life Expectancy at Birth (years)
            </p>
            <ChartActionsWrapper registryKey="census/vital-stats" data={data}>
              <LineChart
              series={lifeSeries}
              isVisible={isVisible}
              formatValue={(v) => v.toFixed(1)}
              unit="years"
            />
            </ChartActionsWrapper>
          </div>
        )}

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
