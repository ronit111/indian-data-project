import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { MonetaryPolicyData } from '../../lib/data/schema.ts';
import { useRBIStore } from '../../store/rbiStore.ts';
import { loadRBIIndicators } from '../../lib/dataLoader.ts';
import { useState, useEffect } from 'react';
import type { RBIIndicatorsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface InflationTargetSectionProps {
  monetaryPolicy: MonetaryPolicyData | null;
}

export function InflationTargetSection({ monetaryPolicy }: InflationTargetSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });
  const year = useRBIStore((s) => s.selectedYear);
  const [indicators, setIndicators] = useState<RBIIndicatorsData | null>(null);

  useEffect(() => {
    loadRBIIndicators(year).then(setIndicators).catch(() => {});
  }, [year]);

  const series: LineSeries[] = useMemo(() => {
    const cpiIndicator = indicators?.indicators.find((i) => i.id === 'inflation_cpi');
    if (!cpiIndicator) return [];

    const result: LineSeries[] = [
      {
        id: 'cpi',
        name: 'CPI Inflation',
        color: 'var(--saffron)',
        data: cpiIndicator.series,
      },
    ];

    if (monetaryPolicy) {
      // Convert calendar dates to fiscal years to match CPI series
      const toFiscalYear = (date: string) => {
        const y = parseInt(date.slice(0, 4), 10);
        const m = parseInt(date.slice(5, 7), 10);
        // Apr-Mar fiscal year: month >= 4 means current FY, else previous
        const fy = m >= 4 ? y : y - 1;
        const next = (fy + 1) % 100;
        return `${fy}-${next.toString().padStart(2, '0')}`;
      };

      const seen = new Set<string>();
      result.push({
        id: 'repo',
        name: 'Repo Rate',
        color: 'var(--gold)',
        data: monetaryPolicy.decisions
          .filter((d) => {
            const fy = toFiscalYear(d.date);
            if (seen.has(fy)) return false;
            seen.add(fy);
            return true;
          })
          .map((d) => ({
            year: toFiscalYear(d.date),
            value: d.rate,
          })),
        dashed: true,
      });
    }

    return result;
  }, [indicators, monetaryPolicy]);

  return (
    <section ref={ref} id="inflation-target" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Is RBI hitting its inflation target?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          The MPC — a committee of 6 experts — votes on interest rates every 2 months. Their job: keep price rises between 2-6% per year, targeting 4%. Below 2% signals a sluggish economy. Above 6% means your grocery bill is rising too fast. The dashed line shows how the repo rate tracks against actual CPI inflation.
        </motion.p>

        {series.length > 0 && (
          <ChartActionsWrapper registryKey="rbi/inflation-target" data={monetaryPolicy}>
            <LineChart
            series={series}
            band={{
              lower: 2,
              upper: 6,
              color: '#FFC857',
              label: 'RBI target band (2-6%)',
            }}
            referenceLine={4}
            isVisible={isVisible}
            formatValue={(v) => v.toFixed(1)}
            unit="%"
          />
          </ChartActionsWrapper>
        )}

        <p className="source-attribution">
          Source: World Bank, RBI Monetary Policy Statements
        </p>
      </div>
    </section>
  );
}
