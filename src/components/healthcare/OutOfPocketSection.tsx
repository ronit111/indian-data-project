import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { HealthSpendingData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface OutOfPocketSectionProps {
  data: HealthSpendingData;
}

export function OutOfPocketSection({ data }: OutOfPocketSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const oopSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.outOfPocketTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'oop',
        name: 'Out-of-Pocket (%)',
        color: 'var(--rose)',
        data: data.outOfPocketTimeSeries,
      });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="oop" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Who pays?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          For every ₹100 spent on healthcare in India, about ₹44 comes from the patient's own pocket (out-of-pocket expenditure, or OOPE) — among the highest rates in the world. This has declined from over ₹70 in 2000, but remains far above the global average. Families often skip treatment or sell assets to pay medical bills. About 5.5 crore Indians are pushed into poverty every year by healthcare costs alone. Ayushman Bharat (the government's health insurance scheme for low-income families) covers hospitalization for 55 crore citizens, but outpatient costs — the everyday doctor visits and medicines — remain largely uncovered.
        </motion.p>

        {oopSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Out-of-pocket expenditure as % of total health spending
            </p>
            <ChartActionsWrapper registryKey="healthcare/oop" data={data}>
              <LineChart
              series={oopSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
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
