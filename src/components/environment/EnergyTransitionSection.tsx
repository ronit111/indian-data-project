import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { AreaChart, type AreaSeries } from '../viz/AreaChart.tsx';
import type { EnergyData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface EnergyTransitionSectionProps {
  data: EnergyData;
}

const FUEL_COLORS: Record<string, string> = {
  coal: '#6B7280',      // gray
  gas: '#A78BFA',       // violet
  nuclear: '#818CF8',   // indigo
  hydro: '#3B82F6',     // blue
  solar: '#FBBF24',     // yellow
  wind: '#14B8A6',      // teal
  biomass: '#4ADE80',   // green
  smallHydro: '#22D3EE', // cyan
};

export function EnergyTransitionSection({ data }: EnergyTransitionSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Build stacked area series from CEA fuel capacity mix
  const capacitySeries: AreaSeries[] = useMemo(() => {
    if (data.fuelCapacityMix.length === 0) return [];

    const fuels = ['solar', 'wind', 'hydro', 'biomass', 'smallHydro', 'nuclear', 'gas', 'coal'] as const;
    const fuelLabels: Record<string, string> = {
      coal: 'Coal', gas: 'Gas', nuclear: 'Nuclear', hydro: 'Large Hydro',
      solar: 'Solar', wind: 'Wind', biomass: 'Biomass', smallHydro: 'Small Hydro',
    };

    return fuels.map((fuel) => ({
      id: fuel,
      name: fuelLabels[fuel],
      color: FUEL_COLORS[fuel],
      data: data.fuelCapacityMix.map((entry) => ({
        year: entry.year,
        value: entry[fuel],
      })),
    }));
  }, [data]);

  // Latest year stats
  const latest = data.fuelCapacityMix[data.fuelCapacityMix.length - 1];
  const totalCapacity = latest
    ? latest.coal + latest.gas + latest.nuclear + latest.hydro + latest.solar + latest.wind + latest.biomass + latest.smallHydro
    : 0;
  const solarPct = latest && totalCapacity > 0 ? ((latest.solar / totalCapacity) * 100).toFixed(1) : '—';

  return (
    <section ref={ref} id="energy-transition" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Energy transition
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Solar capacity exploded from 3.7 GW to 82.8 GW in nine years (2015-2024) — a 22x increase. But coal hasn't shrunk. India is adding clean energy on top of fossil fuels, not replacing them.{' '}
          {latest && <span className="font-mono" style={{ color: 'var(--teal)' }}>Solar is now {solarPct}% of <em>installed capacity</em> — but coal still generates over 70% of actual electricity.</span>}
        </motion.p>

        {capacitySeries.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Installed capacity by fuel type (MW), 2015–2024
            </p>
            <ChartActionsWrapper registryKey="environment/energy-transition" data={data}>
              <AreaChart
                series={capacitySeries}
                isVisible={isVisible}
                formatValue={(v) => `${(v / 1000).toFixed(0)} GW`}
                unit=""
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="energy" domain="environment" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
