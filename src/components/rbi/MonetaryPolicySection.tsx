import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { MonetaryPolicyData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface MonetaryPolicySectionProps {
  data: MonetaryPolicyData;
}

export function MonetaryPolicySection({ data }: MonetaryPolicySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const series: LineSeries[] = useMemo(() => {
    // Convert decisions to fiscal years (Apr-Mar), keep last decision per FY
    const toFiscalYear = (date: string) => {
      const y = parseInt(date.slice(0, 4), 10);
      const m = parseInt(date.slice(5, 7), 10);
      const fy = m >= 4 ? y : y - 1;
      const next = (fy + 1) % 100;
      return `${fy}-${next.toString().padStart(2, '0')}`;
    };

    // decisions are sorted newest-first; take the first (most recent) per FY
    const fyMap = new Map<string, number>();
    for (const d of data.decisions) {
      const fy = toFiscalYear(d.date);
      if (!fyMap.has(fy)) fyMap.set(fy, d.rate);
    }
    const repoSeries = Array.from(fyMap, ([year, value]) => ({ year, value }))
      .sort((a, b) => a.year.localeCompare(b.year));

    const result: LineSeries[] = [
      {
        id: 'repo-rate',
        name: 'Repo Rate',
        color: 'var(--gold)',
        data: repoSeries,
      },
    ];

    if (data.crrHistory.length > 0) {
      result.push({
        id: 'crr',
        name: 'CRR',
        color: 'var(--cyan)',
        data: data.crrHistory,
        dashed: true,
      });
    }

    return result;
  }, [data]);

  return (
    <section ref={ref} id="monetary-policy" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={1} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The price of money
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          The repo rate is the wholesale price of money: when RBI lends to banks at 6%, banks lend to you at 9–10%. When RBI cuts to 5%, your loan gets cheaper — but your savings earn less. The CRR (Cash Reserve Ratio — how much of your deposit stays locked with RBI instead of being lent out) is the secondary lever. Annotated below: the 2019–20 easing cycle, the COVID emergency cut to 4%, the 2022–23 tightening to fight inflation, and the recent cuts.
        </motion.p>

        <ChartActionsWrapper registryKey="rbi/monetary-policy" data={data}>
          <LineChart
          series={series}
          isVisible={isVisible}
          formatValue={(v) => v.toFixed(2)}
          unit="%"
        />
        </ChartActionsWrapper>

        <RelatedTopics sectionId="monetary-policy" domain="rbi" />
        <CrossDomainLink domain="rbi" sectionId="monetary-policy" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
