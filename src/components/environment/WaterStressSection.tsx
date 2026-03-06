import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { WaterData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface WaterStressSectionProps {
  data: WaterData;
}

const STAGE_COLORS: Record<string, string> = {
  'Over-Exploited': '#f87171',
  'Critical': '#F59E0B',
  'Semi-Critical': '#FF6B35',
  'Safe': '#14B8A6',
};

export function WaterStressSection({ data }: WaterStressSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Categorical choropleth data
  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.groundwaterStage.map((s) => ({
      id: s.id,
      name: s.name,
      value: s.stagePct,
      category: s.stage,
    }));
  }, [data]);

  // Reservoir storage by region (kept as compact bars)
  const reservoirItems: BarItem[] = useMemo(() => {
    return data.reservoirStorage.map((r) => ({
      id: r.region,
      label: r.region,
      value: r.storagePct,
      color: r.storagePct > 50 ? 'var(--teal)' : r.storagePct > 35 ? 'var(--amber)' : 'var(--negative)',
    }));
  }, [data]);

  // Stage summary counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of data.groundwaterStage) {
      counts[s.stage] = (counts[s.stage] ?? 0) + 1;
    }
    return counts;
  }, [data]);

  return (
    <section ref={ref} id="water-stress" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Water stress
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India is the world's largest groundwater user. Punjab extracts 165% of what naturally recharges — meaning the water table drops every year. According to NITI Aayog, 21 major cities may run dry by 2030.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Solutions exist. Rajasthan's community johads (traditional earthen dams for rainwater harvesting) have recharged groundwater across thousands of villages. Chennai made rooftop rainwater harvesting mandatory after its 2019 crisis. Several states have expanded drip irrigation to cut agricultural water use. The challenge is scaling what works.
        </motion.p>

        {/* Groundwater stage summary pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          {(['Over-Exploited', 'Semi-Critical', 'Safe'] as const).map((stage) => (
            stageCounts[stage] ? (
              <div
                key={stage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[stage] }} />
                <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stageCounts[stage]}
                </span>
                <span className="text-caption" style={{ color: 'var(--text-muted)' }}>{stage}</span>
              </div>
            ) : null
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Categorical choropleth */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Groundwater development stage
            </p>
            <ChartActionsWrapper registryKey="environment/water-stress" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="categorical"
                colorMap={STAGE_COLORS}
                formatValue={(v) => `${v}%`}
                legendLabel="Extraction/Recharge"
                isVisible={isVisible}
              />
            </ChartActionsWrapper>
          </div>

          {/* Reservoir storage */}
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Major reservoir storage by region (% of capacity)
            </p>
            <ChartActionsWrapper registryKey="environment/water-stress" data={data}>
              <HorizontalBarChart
                items={reservoirItems}
                isVisible={isVisible}
                formatValue={(v) => `${v}%`}
                unit=""
                labelWidth={80}
                barHeight={32}
              />
            </ChartActionsWrapper>
          </div>
        </div>

        <RelatedTopics sectionId="water" domain="environment" />
        <CrossDomainLink domain="environment" sectionId="water-stress" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
