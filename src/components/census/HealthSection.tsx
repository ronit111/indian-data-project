import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import type { HealthData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface HealthSectionProps {
  data: HealthData;
}

export function HealthSection({ data }: HealthSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const imrSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.imrNational.length >= MIN_POINTS) {
      series.push({ id: 'imr', name: 'Infant Mortality Rate', color: 'var(--violet)', data: data.imrNational });
    }
    if (data.under5.length >= MIN_POINTS) {
      series.push({ id: 'under5', name: 'Under-5 Mortality', color: 'var(--violet-light)', data: data.under5, dashed: true });
    }
    return series;
  }, [data]);

  // Inverse scale: high IMR = red (bad), low IMR = good
  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.stateImr
      .filter((s) => s.value > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.value }));
  }, [data]);

  return (
    <section ref={ref} id="health" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-composition mb-2"
        >
          Every child counts
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's infant mortality rate has dropped dramatically — from 66 per 1,000 live births in 2000 to under 25 today. But the gap between states tells a different story: Kerala's IMR is at developed-country levels while some northern states lag by a full generation.
        </motion.p>

        {/* National IMR trend */}
        {imrSeries.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Infant & Under-5 Mortality (per 1,000 live births)
            </p>
            <ChartActionsWrapper registryKey="census/health" data={data}>
              <LineChart
                series={imrSeries}
                isVisible={isVisible}
                formatValue={(v) => v.toFixed(0)}
                unit="per 1000"
              />
            </ChartActionsWrapper>
          </div>
        )}

        {/* State-level IMR choropleth — inverse: high IMR = red */}
        {choroData.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Infant Mortality by State — SRS 2023 (per 1,000 live births)
            </p>
            <ChartActionsWrapper registryKey="census/health" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--negative)"
                formatValue={(v) => `${v.toFixed(0)} per 1000`}
                legendLabel="IMR"
                isVisible={isVisible}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="health" domain="census" />
        <CrossDomainLink domain="census" sectionId="health" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
