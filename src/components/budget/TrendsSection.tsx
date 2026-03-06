import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { BudgetTrendsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface TrendsSectionProps {
  trends: BudgetTrendsData;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function TrendsSection({ trends }: TrendsSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  // Find the COVID spike year for callout
  const covidYear = trends.series.find((d) => d.year === '2020-21');
  const covidDeficit = covidYear?.fiscalDeficitPctGDP ?? 9.2;

  // Build series for expenditure vs receipts chart (Rs lakh crore)
  const expenditureSeries: LineSeries = {
    id: 'expenditure',
    name: 'Total Expenditure',
    color: 'var(--saffron)',
    data: trends.series.map((d) => ({
      year: d.year,
      value: Math.round(d.expenditure / 100000 * 100) / 100,
    })),
  };

  const receiptsSeries: LineSeries = {
    id: 'receipts',
    name: 'Total Receipts',
    color: 'var(--gold)',
    data: trends.series.map((d) => ({
      year: d.year,
      value: Math.round(d.receipts / 100000 * 100) / 100,
    })),
  };

  // Build series for fiscal deficit % GDP chart
  const deficitSeries: LineSeries = {
    id: 'fiscal-deficit-pct',
    name: 'Fiscal Deficit (% of GDP)',
    color: 'var(--cyan)',
    data: trends.series.map((d) => ({
      year: d.year,
      value: d.fiscalDeficitPctGDP,
    })),
    dashed: true,
  };

  const revenueDeficitSeries: LineSeries = {
    id: 'revenue-deficit-pct',
    name: 'Revenue Deficit (% of GDP)',
    color: '#a78bfa',
    data: trends.series.map((d) => ({
      year: d.year,
      value: d.revenueDeficitPctGDP,
    })),
    dashed: true,
  };

  // Growth stat: expenditure multiplied over the period
  const firstExp = trends.series[0]?.expenditure ?? 1;
  const lastExp = trends.series[trends.series.length - 1]?.expenditure ?? 1;
  const growthMultiple = (lastExp / firstExp).toFixed(1);

  return (
    <section ref={ref} id="trends" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={4} className="mb-6 block" isVisible={isVisible} />

        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            className="font-extrabold"
          >
            <span className="gradient-text-saffron">20 years</span>
            <span style={{ color: 'var(--text-primary)' }}>{' of India\u2019s budget'}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="text-composition mt-3"
          >
            {'The deficit didn\u2019t happen overnight. Two decades tell a larger story.'}
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.25 }}
          className="text-annotation mb-8 max-w-2xl"
        >
          {`Government spending has grown ${growthMultiple}x since FY 2005-06, but receipts have consistently lagged behind. The gap widened dramatically in 2020-21 when COVID pushed the fiscal deficit to ${covidDeficit}% of GDP \u2014 the highest in decades.`}
        </motion.p>

        {/* Chart 1: Expenditure vs Receipts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-caption uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Expenditure vs Receipts (Rs lakh crore)
          </p>
          <ChartActionsWrapper registryKey="budget/trends" data={trends}>
            <LineChart
            series={[expenditureSeries, receiptsSeries]}
            isVisible={isVisible}
            formatValue={(v) => `${v.toFixed(0)}`}
            unit="L Cr"
          />
          </ChartActionsWrapper>
        </motion.div>

        {/* Chart 2: Deficit as % of GDP */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.5 }}
        >
          <p className="text-caption uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Deficit as % of GDP
          </p>
          <ChartActionsWrapper registryKey="budget/trends" data={trends}>
            <LineChart
            series={[deficitSeries, revenueDeficitSeries]}
            isVisible={isVisible}
            formatValue={(v) => `${v.toFixed(1)}`}
            unit="%"
            height={280}
          />
          </ChartActionsWrapper>
        </motion.div>

        {/* Stat row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
        >
          <StatPill label="Spending growth" value={`${growthMultiple}x`} color="var(--saffron)" />
          <StatPill label="COVID peak deficit" value={`${covidDeficit}%`} color="var(--cyan)" />
          <StatPill
            label="FY 2025-26 target"
            value={`${trends.series[trends.series.length - 1]?.fiscalDeficitPctGDP}%`}
            color="var(--gold)"
          />
        </motion.div>

        <RelatedTopics sectionId="borrowing" domain="budget" />


        <p className="source-attribution">
          Source: Budget at a Glance, indiabudget.gov.in (various years)
        </p>
      </div>
    </section>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: 'var(--bg-raised)',
        border: 'var(--border-subtle)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p className="text-caption uppercase tracking-wider mb-1">{label}</p>
      <p className="font-mono font-bold text-lg" style={{ color }}>{value}</p>
    </div>
  );
}
