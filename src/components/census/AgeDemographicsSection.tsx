import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { DemographicsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface AgeDemographicsSectionProps {
  data: DemographicsData;
}

/**
 * For every 100 Indians — how many are children, working-age, elderly?
 * Uses the latest year from age structure time series.
 */
function AgeWaffle({
  young,
  elderly,
  isVisible,
}: {
  young: number;
  elderly: number;
  isVisible: boolean;
}) {
  const GRID = 10;
  const cells: { color: string; label: string }[] = [];
  const youngCount = Math.round(young);
  const elderlyCount = Math.round(elderly);
  const workingCount = 100 - youngCount - elderlyCount;

  for (let i = 0; i < youngCount; i++) {
    cells.push({ color: 'var(--violet-light)', label: 'Young (0-14)' });
  }
  for (let i = 0; i < workingCount; i++) {
    cells.push({ color: 'var(--violet)', label: 'Working age (15-64)' });
  }
  for (let i = 0; i < elderlyCount; i++) {
    cells.push({ color: 'var(--gold)', label: 'Elderly (65+)' });
  }

  // Pad to 100 if rounding left us short
  while (cells.length < 100) cells.push({ color: 'var(--violet)', label: 'Working age (15-64)' });

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid gap-1.5 mb-4 w-full"
        style={{
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          maxWidth: '420px',
        }}
      >
        {cells.map((cell, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-sm"
            style={{ background: cell.color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.3,
              ease: EASE_OUT_EXPO,
              delay: 0.3 + i * 0.008,
            }}
          />
        ))}
      </div>
      <div className="flex gap-4 flex-wrap">
        <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--violet-light)' }} />
          0-14: {youngCount}%
        </span>
        <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--violet)' }} />
          15-64: {workingCount}%
        </span>
        <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--gold)' }} />
          65+: {elderlyCount}%
        </span>
      </div>
    </div>
  );
}

export function AgeDemographicsSection({ data }: AgeDemographicsSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Latest year values for waffle
  const latestYoung = data.ageStructure.young.at(-1)?.value ?? 26;
  const latestElderly = data.ageStructure.elderly.at(-1)?.value ?? 7;

  const ageSeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.ageStructure.young.length >= MIN_POINTS) {
      series.push({ id: 'young', name: '0-14 years', color: 'var(--violet-light)', data: data.ageStructure.young });
    }
    if (data.ageStructure.working.length >= MIN_POINTS) {
      series.push({ id: 'working', name: '15-64 years', color: 'var(--violet)', data: data.ageStructure.working });
    }
    if (data.ageStructure.elderly.length >= MIN_POINTS) {
      series.push({ id: 'elderly', name: '65+ years', color: 'var(--gold)', data: data.ageStructure.elderly });
    }
    return series;
  }, [data]);

  return (
    <section ref={ref} id="age" className="composition">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={2} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-composition mb-2"
        >
          The demographic dividend
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          India's working-age population share is near its peak. Two-thirds of the country is between 15 and 64 — a demographic window that closes around 2040. How this workforce is educated, employed, and healthy will define India's next two decades.
        </motion.p>

        {/* Waffle: for every 100 Indians */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
          className="mb-10"
        >
          <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            For every 100 Indians
          </p>
          <AgeWaffle
            young={latestYoung}
            elderly={latestElderly}
            isVisible={isVisible}
          />
        </motion.div>

        {/* Time series trend */}
        {ageSeries.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Age composition over time (% of population)
            </p>
            <ChartActionsWrapper registryKey="census/age" data={data}>
              <LineChart
              series={ageSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit="%"
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
