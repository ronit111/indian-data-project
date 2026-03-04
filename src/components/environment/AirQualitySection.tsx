import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { DotStrip, type DotStripDataPoint } from '../viz/DotStrip.tsx';
import type { AirQualityData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface AirQualitySectionProps {
  data: AirQualityData;
}

export function AirQualitySection({ data }: AirQualitySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const pm25Series: LineSeries[] = useMemo(() => {
    if (data.pm25TimeSeries.length < MIN_POINTS) return [];
    return [{
      id: 'pm25',
      name: 'PM2.5 (μg/m³)',
      color: 'var(--teal)',
      data: data.pm25TimeSeries,
    }];
  }, [data]);

  const hasStateAQI = data.stateAQI && data.stateAQI.length > 0;

  const stateChoroData: ChoroplethDataPoint[] = useMemo(() => {
    if (!hasStateAQI) return [];
    return data.stateAQI.map((s) => ({
      id: s.id,
      name: s.name,
      value: s.aqi,
      category: s.category,
    }));
  }, [data, hasStateAQI]);

  const cityDots: DotStripDataPoint[] = useMemo(() => {
    return data.cityAQI.slice(0, 20).map((c) => ({
      id: c.city,
      label: c.city,
      value: c.aqi,
      color: c.aqi > 200 ? 'var(--negative)' : c.aqi > 100 ? 'var(--amber)' : 'var(--teal)',
    }));
  }, [data]);

  // Highlight the worst 5 cities
  const worst5 = useMemo(() => cityDots.slice(0, 5).map((d) => d.id), [cityDots]);

  return (
    <section ref={ref} id="air-quality" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The air we breathe
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's average PM2.5 is 10 times the WHO safe limit. The Indo-Gangetic Plain is the worst — Delhi, Patna, and Lucknow rarely see clean air.
        </motion.p>

        {pm25Series.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              PM2.5 exposure (annual mean, μg/m³)
            </p>
            <ChartActionsWrapper registryKey="environment/air-quality" data={data}>
              <LineChart
                series={pm25Series}
                isVisible={isVisible}
                formatValue={(v) => v.toFixed(1)}
                unit="μg/m³"
              />
            </ChartActionsWrapper>
          </div>
        )}

        {hasStateAQI && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              State-level air quality index
            </p>
            <ChartActionsWrapper registryKey="environment/air-quality" data={data}>
              <GenericChoropleth
                data={stateChoroData}
                colorScaleType="sequential"
                accentColor="var(--negative)"
                formatValue={(v) => v.toFixed(0)}
                legendLabel="AQI"
                isVisible={isVisible}
                invertScale
              />
            </ChartActionsWrapper>
          </div>
        )}

        {cityDots.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Most polluted cities — annual average AQI (2023)
            </p>
            <ChartActionsWrapper registryKey="environment/air-quality" data={data}>
              <DotStrip
                data={cityDots}
                formatValue={(v) => v.toFixed(0)}
                valueLabel="AQI"
                accentColor="var(--negative)"
                referenceLine={{ value: 150, label: 'Hazardous (CPCB)', color: 'var(--negative)' }}
                highlightIds={worst5}
                isVisible={isVisible}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="air-quality" domain="environment" />
        <CrossDomainLink domain="environment" sectionId="air-quality" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
