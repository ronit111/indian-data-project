import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { SpendingData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;

interface SpendingSectionProps {
  data: SpendingData;
}

export function SpendingSection({ data }: SpendingSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const spendingSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.spendGDPTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'spend-gdp',
        name: 'Education Spending (% GDP)',
        color: 'var(--blue)',
        data: data.spendGDPTimeSeries,
      });
    }
    return series.filter((s) => s.data.length > 0);
  }, [data]);

  const govtSpendSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.spendGovtTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'spend-govt',
        name: 'Education (% Govt Spending)',
        color: 'var(--blue-light)',
        data: data.spendGovtTimeSeries,
      });
    }
    return series.filter((s) => s.data.length > 0);
  }, [data]);

  return (
    <section ref={ref} id="spending" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={6} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Spending vs. the world
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India spends about 4.1% of GDP on education — still below the NEP 2020 target of 6%. Most major economies spend 4-6%.
        </motion.p>

        {spendingSeries.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Education Expenditure (% of GDP)
            </p>
            <ChartActionsWrapper registryKey="education/spending" data={data}>
              <LineChart
              series={spendingSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
              referenceLine={6}
            />
            </ChartActionsWrapper>
          </div>
        )}

        {govtSpendSeries.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Education Expenditure (% of Government Spending)
            </p>
            <ChartActionsWrapper registryKey="education/spending" data={data}>
              <LineChart
              series={govtSpendSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="spending" domain="education" />
        <CrossDomainLink domain="education" sectionId="spending" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
