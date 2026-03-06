import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { DiseaseData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface DiseaseBurdenSectionProps {
  data: DiseaseData;
}

export function DiseaseBurdenSection({ data }: DiseaseBurdenSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const diseaseSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.tbIncidenceTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'tb',
        name: 'TB Incidence (per 100K)',
        color: 'var(--rose)',
        data: data.tbIncidenceTimeSeries,
      });
    }
    if (data.hivTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'hiv',
        name: 'HIV Prevalence (%)',
        color: 'var(--rose-light)',
        data: data.hivTimeSeries,
      });
    }
    return series;
  }, [data]);

  const hasTB = data.tbIncidenceTimeSeries.length >= MIN_POINTS;
  const hasHIV = data.hivTimeSeries.length >= MIN_POINTS;

  return (
    <section ref={ref} id="disease" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The disease burden
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {hasTB && hasHIV
            ? 'India has the world\'s highest TB (tuberculosis) burden — over 2.6 million cases per year (WHO, 2023). Meanwhile, lifestyle diseases — diabetes, heart disease, cancer — are rising as the population ages and urbanizes. These can\'t be caught from someone else, but they now cause more deaths than infections.'
            : hasTB
              ? 'India has the world\'s highest TB (tuberculosis) burden — over 2.6 million cases per year (WHO, 2023). Tuberculosis remains the leading infectious disease killer despite decades of public health campaigns.'
              : 'Lifestyle diseases — diabetes, heart disease, cancer — are rising as the population ages and urbanizes. Unlike infections, these can\'t be caught from someone else, but they now cause more deaths.'}
        </motion.p>

        {diseaseSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Disease burden trends
            </p>
            <ChartActionsWrapper registryKey="healthcare/disease" data={data}>
              <LineChart
              series={diseaseSeries}
              isVisible={isVisible}
              formatValue={(v) => v.toFixed(1)}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="disease" domain="healthcare" />
        <CrossDomainLink domain="healthcare" sectionId="disease" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
