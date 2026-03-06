import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { HealthSpendingData, ForexData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { AnimatedCounter } from '../viz/AnimatedCounter.tsx';

const MIN_POINTS = 3;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SpendingSectionProps {
  data: HealthSpendingData;
  forex?: ForexData | null;
}

/**
 * Build a year→INR/USD lookup from the forex exchange rate series.
 * Forex uses fiscal years ("2014-15"), spending uses calendar years ("2014").
 * Map fiscal "2014-15" → calendar "2014" (the starting year of the fiscal pair).
 */
function buildRateMap(forex: ForexData): Map<string, number> {
  const map = new Map<string, number>();
  for (const pt of forex.exchangeRate.series) {
    const calYear = pt.year.split('-')[0];
    map.set(calYear, pt.value);
  }
  return map;
}

export function SpendingSection({ data, forex }: SpendingSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const spendingSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.healthExpGDPTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'total-health-exp',
        name: 'Total Health Exp (% GDP)',
        color: 'var(--rose)',
        data: data.healthExpGDPTimeSeries,
      });
    }
    if (data.govtHealthExpTimeSeries.length >= MIN_POINTS) {
      series.push({
        id: 'govt-health-exp',
        name: 'Govt Health Exp (% GDP)',
        color: 'var(--rose-light)',
        data: data.govtHealthExpTimeSeries,
      });
    }
    return series;
  }, [data]);

  // Convert per-capita USD → INR using exchange rate data
  const perCapitaINR = useMemo(() => {
    if (!forex || data.healthExpPerCapitaTimeSeries.length === 0) return null;
    const rateMap = buildRateMap(forex);

    const inrSeries: { year: string; value: number }[] = [];
    for (const pt of data.healthExpPerCapitaTimeSeries) {
      const rate = rateMap.get(pt.year);
      if (rate) {
        inrSeries.push({ year: pt.year, value: Math.round(pt.value * rate) });
      }
    }
    if (inrSeries.length === 0) return null;

    const latest = inrSeries[inrSeries.length - 1];
    const earliest = inrSeries[0];
    const dailyAmount = latest.value / 365;
    const growthPct = earliest.value > 0
      ? Math.round(((latest.value - earliest.value) / earliest.value) * 100)
      : 0;

    return { series: inrSeries, latest, earliest, dailyAmount, growthPct };
  }, [data, forex]);

  const perCapitaSeries: LineSeries[] = useMemo(() => {
    if (!perCapitaINR || perCapitaINR.series.length < MIN_POINTS) return [];
    return [{
      id: 'per-capita-inr',
      name: 'Per Capita (₹)',
      color: 'var(--rose)',
      data: perCapitaINR.series,
    }];
  }, [perCapitaINR]);

  return (
    <section ref={ref} id="spending" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-composition mb-2"
        >
          The spending story
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India spends about 3.3% of GDP on health — roughly half the global average of ~6.5%. The gap translates to fewer doctors, fewer hospital beds, and families bearing a large share of the cost directly from their pockets. For context, even countries with smaller economies like Sri Lanka and Thailand spend a higher share of GDP on public health.
        </motion.p>

        {spendingSeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Health expenditure as share of GDP (%)
            </p>
            <ChartActionsWrapper registryKey="healthcare/spending" data={data}>
              <LineChart
              series={spendingSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
            </ChartActionsWrapper>
          </div>
        )}

        {/* ─── Per-Capita Hero — "₹19/day" ─── */}
        {perCapitaINR && (
          <>
            <div className="mt-16 mb-3">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.2 }}
                className="text-xs font-mono uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-muted)' }}
              >
                What does that mean for you?
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
                className="font-extrabold"
              >
                <span className="gradient-text-rose font-mono">
                  <AnimatedCounter
                    target={Math.round(perCapitaINR.dailyAmount)}
                    prefix="₹"
                    trigger={isVisible}
                    duration={2}
                  />
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.42 }}
                className="text-composition mt-2"
              >
                on your health, every day
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
              className="text-annotation mb-10 max-w-xl"
            >
              {`India spends ₹${perCapitaINR.latest.value.toLocaleString('en-IN')} per citizen per year on health (public + private combined). That's less per day than what most Indians spend on a cup of chai.`}
            </motion.p>

            {perCapitaSeries.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  Health spending per citizen (₹)
                </p>
                <LineChart
                  series={perCapitaSeries}
                  isVisible={isVisible}
                  formatValue={(v) => `₹${Math.round(v).toLocaleString('en-IN')}`}
                  unit=""
                />
                <p className="text-xs mt-3 max-w-lg" style={{ color: 'var(--text-muted)' }}>
                  {`From ₹${perCapitaINR.earliest.value.toLocaleString('en-IN')} in ${perCapitaINR.earliest.year} to ₹${perCapitaINR.latest.value.toLocaleString('en-IN')} in ${perCapitaINR.latest.year} — a ${perCapitaINR.growthPct}% increase. USD values converted at annual average INR/USD exchange rates from the RBI.`}
                </p>
              </div>
            )}
          </>
        )}

        <RelatedTopics sectionId="spending" domain="healthcare" />
        <CrossDomainLink domain="healthcare" sectionId="spending" />

        <p className="source-attribution">
          Source: {data.source} · Exchange rates: RBI / World Bank
        </p>
      </div>
    </section>
  );
}
