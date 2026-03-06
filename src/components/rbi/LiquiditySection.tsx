import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart } from '../viz/LineChart.tsx';
import type { LiquidityData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface LiquiditySectionProps {
  data: LiquidityData;
}

export function LiquiditySection({ data }: LiquiditySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  return (
    <section ref={ref} id="liquidity" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The money supply tap
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          M3 — broad money — is the total money in the economy: cash in wallets, savings accounts, fixed deposits, everything. RBI controls the tap through OMOs (Open Market Operations — buying bonds to pump money in, selling to pull it out), CRR (locking a fraction of every deposit with RBI), and SLR (forcing banks to park a fraction in government bonds). When M3 grows faster than GDP, there's too much money chasing too few goods — inflation. When it grows slower, the economy starves for credit.
        </motion.p>

        {/* M3 Growth — year-over-year pace of money creation */}
        <div className="mb-3">
          <h3 className="text-caption uppercase tracking-wider mb-3" style={{ color: 'var(--gold)' }}>
            M3 Growth Rate (year-over-year)
          </h3>
          <ChartActionsWrapper registryKey="rbi/liquidity" data={data}>
            <LineChart
            series={[
              {
                id: 'broad-money-growth',
                name: 'M3 Growth',
                color: 'var(--gold)',
                data: data.broadMoneyGrowth.series,
              },
            ]}
            isVisible={isVisible}
            formatValue={(v) => v.toFixed(1)}
            unit="%"
            height={260}
          />
          </ChartActionsWrapper>
        </div>

        {/* M3 as % of GDP — structural depth of money in the economy */}
        <div className="mt-10">
          <h3 className="text-caption uppercase tracking-wider mb-3" style={{ color: 'var(--cyan)' }}>
            Broad Money as % of GDP
          </h3>
          <ChartActionsWrapper registryKey="rbi/liquidity" data={data}>
            <LineChart
            series={[
              {
                id: 'broad-money-gdp',
                name: 'M3 (% GDP)',
                color: 'var(--cyan)',
                data: data.broadMoneyPctGDP.series,
              },
            ]}
            isVisible={isVisible}
            formatValue={(v) => v.toFixed(1)}
            unit="%"
            height={260}
          />
          </ChartActionsWrapper>
        </div>

        <p className="source-attribution mt-4">
          Source: {data.broadMoneyGrowth.source}
        </p>
      </div>
    </section>
  );
}
