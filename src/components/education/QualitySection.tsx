import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import type { QualityData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';

interface QualitySectionProps {
  data: QualityData;
}

export function QualitySection({ data }: QualitySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.learningOutcomes
      .filter((s) => s.canReadStd2 > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.canReadStd2 }));
  }, [data]);

  const nationalAvg = useMemo(() => {
    const valid = data.learningOutcomes.filter((s) => s.canReadStd2 > 0);
    return valid.reduce((sum, s) => sum + s.canReadStd2, 0) / valid.length;
  }, [data]);

  return (
    <section ref={ref} id="quality" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Enrollment is not learning
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          1 in 5 children in Class 3 can read a Class 2 textbook. That is the finding of ASER 2024, India's largest rural education survey. The enrollment numbers are real — nearly every child is in school. But being in school and learning to read are not the same thing. The system has solved the access problem and stumbled on the outcome. The map below makes the state variation visceral: some states are below 15%, others above 40%. These are children in the same grade, in the same country.
        </motion.p>

        {choroData.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              % Children in Std III who can read Std II text (by state)
            </p>
            <ChartActionsWrapper registryKey="education/quality" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--blue)"
                formatValue={(v) => `${v.toFixed(1)}%`}
                legendLabel="Can read at level"
                isVisible={isVisible}
                nationalAvg={nationalAvg}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <CrossDomainLink domain="education" sectionId="quality" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
