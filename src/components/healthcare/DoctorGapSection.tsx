import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import type { InfrastructureData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface DoctorGapSectionProps {
  data: InfrastructureData;
}

export function DoctorGapSection({ data }: DoctorGapSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.stateInfrastructure
      .filter((s) => s.doctorsPer10K > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.doctorsPer10K }));
  }, [data]);

  const whoTarget = 10; // WHO recommended minimum

  return (
    <section ref={ref} id="doctor-gap" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The doctor gap
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          State-level variation in doctor availability is extreme. Kerala has 10x more doctors per capita than Bihar. Rural areas are severely underserved.
        </motion.p>

        {choroData.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Doctors per 10,000 population by state
            </p>
            <ChartActionsWrapper registryKey="healthcare/doctor-gap" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--rose)"
                formatValue={(v) => `${v.toFixed(1)} per 10K`}
                legendLabel="Doctors per 10K"
                isVisible={isVisible}
                nationalAvg={whoTarget}
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
