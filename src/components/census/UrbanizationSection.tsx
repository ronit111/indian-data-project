import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import type { DemographicsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface UrbanizationSectionProps {
  data: DemographicsData;
}

export function UrbanizationSection({ data }: UrbanizationSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const urbanSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.urbanization.length >= MIN_POINTS) {
      series.push({
        id: 'urban',
        name: 'Urban Population',
        color: 'var(--violet)',
        data: data.urbanization,
      });
    }
    return series;
  }, [data]);

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.states
      .filter((s) => s.urbanizationRate > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.urbanizationRate }));
  }, [data]);

  return (
    <section ref={ref} id="urbanization" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-composition mb-2"
        >
          Urban India rising
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          About 35% of Indians live in cities — lower than the global average of 56%. Rural India remains the majority. But urbanization is accelerating: by 2036, projections suggest 39% urban, with mega-cities like Delhi and Mumbai growing faster than many countries.
        </motion.p>

        {/* National urbanization trend */}
        {urbanSeries.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Urban Population (% of total)
            </p>
            <ChartActionsWrapper registryKey="census/urbanization" data={data}>
              <LineChart
                series={urbanSeries}
                isVisible={isVisible}
                formatValue={(v) => `${v.toFixed(1)}%`}
                unit="%"
              />
            </ChartActionsWrapper>
          </div>
        )}

        {/* State choropleth */}
        {choroData.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Urbanization by State — Census 2011 (%)
            </p>
            <ChartActionsWrapper registryKey="census/urbanization" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--violet)"
                formatValue={(v) => `${v.toFixed(1)}%`}
                legendLabel="Urban %"
                isVisible={isVisible}
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
