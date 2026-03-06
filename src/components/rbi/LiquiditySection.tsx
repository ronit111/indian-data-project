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
          How much money flows through the system
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Broad money (M3) is the total money circulating in the economy — cash in wallets, savings accounts, fixed deposits, everything. RBI controls this by buying or selling government bonds in the open market (Open Market Operations, or OMOs). Buying bonds pumps money into banks; selling pulls it out. The growth rate shows how fast this money supply is expanding. (World Bank data available through 2021-22.)
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
