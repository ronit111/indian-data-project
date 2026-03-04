import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import { GenericChoropleth, type ChoroplethDataPoint } from '../viz/GenericChoropleth.tsx';
import type { LiteracyData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

const MIN_POINTS = 3;
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface LiteracySectionProps {
  data: LiteracyData;
}

/**
 * Gender gap butterfly chart — shows male and female literacy side by side
 * for each state, sorted by the gender gap (largest gap at top).
 */
function GenderGapChart({
  states,
  isVisible,
}: {
  states: LiteracyData['states'];
  isVisible: boolean;
}) {
  const sorted = useMemo(
    () => [...states].sort((a, b) => b.genderGap - a.genderGap).slice(0, 15),
    [states]
  );

  return (
    <div className="space-y-1.5">
      {sorted.map((s, i) => (
        <motion.div
          key={s.id}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -8 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.2 + i * 0.03 }}
        >
          <span
            className="text-xs font-medium text-right flex-shrink-0"
            style={{ width: '100px', color: 'var(--text-secondary)' }}
          >
            {s.name}
          </span>
          <div className="flex-1 flex items-stretch gap-0.5 h-5">
            {/* Female bar */}
            <div className="flex-1 flex justify-end">
              <motion.div
                className="h-full rounded-l"
                style={{ background: 'var(--violet-light)' }}
                initial={{ width: 0 }}
                animate={isVisible ? { width: `${s.femaleRate}%` } : {}}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 + i * 0.03 }}
              />
            </div>
            {/* Center divider */}
            <div className="w-px h-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />
            {/* Male bar */}
            <div className="flex-1">
              <motion.div
                className="h-full rounded-r"
                style={{ background: 'var(--violet)' }}
                initial={{ width: 0 }}
                animate={isVisible ? { width: `${s.maleRate}%` } : {}}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 + i * 0.03 }}
              />
            </div>
          </div>
          <span
            className="text-[10px] font-mono flex-shrink-0"
            style={{ width: '36px', color: 'var(--saffron)', textAlign: 'right' }}
          >
            {s.genderGap.toFixed(0)}pp
          </span>
        </motion.div>
      ))}
      <div className="flex items-center gap-2 mt-3">
        <span style={{ width: '100px' }} />
        <div className="flex-1 flex justify-between text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--violet-light)' }} />
            Female
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--violet)' }} />
            Male
          </span>
        </div>
        <span className="text-[10px] font-mono" style={{ width: '36px', color: 'var(--text-muted)', textAlign: 'right' }}>
          Gap
        </span>
      </div>
    </div>
  );
}

export function LiteracySection({ data }: LiteracySectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const literacySeries: LineSeries[] = useMemo(() => {
    const series: LineSeries[] = [];
    if (data.totalTimeSeries.length >= MIN_POINTS) {
      series.push({ id: 'total', name: 'Total', color: 'var(--violet)', data: data.totalTimeSeries });
    }
    if (data.maleTimeSeries.length >= MIN_POINTS) {
      series.push({ id: 'male', name: 'Male', color: 'var(--violet)', data: data.maleTimeSeries, dashed: true });
    }
    if (data.femaleTimeSeries.length >= MIN_POINTS) {
      series.push({ id: 'female', name: 'Female', color: 'var(--violet-light)', data: data.femaleTimeSeries });
    }
    return series;
  }, [data]);

  const choroData: ChoroplethDataPoint[] = useMemo(() => {
    return data.states
      .filter((s) => s.overallRate > 0)
      .map((s) => ({ id: s.id, name: s.name, value: s.overallRate }));
  }, [data]);

  const hasTimeSeries = literacySeries.length > 0;

  return (
    <section ref={ref} id="literacy" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-composition mb-2"
        >
          The literacy revolution
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          Kerala's literacy rate approaches 94%, rivaling developed nations. Bihar sits near 62%. The gender gap is narrowing — from 22 percentage points in 2001 to about 14 now — but it remains the defining divide.
        </motion.p>

        {/* National trend */}
        {hasTimeSeries && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Literacy Rate Trend (% of adults 15+)
            </p>
            <ChartActionsWrapper registryKey="census/literacy" data={data}>
              <LineChart
                series={literacySeries}
                isVisible={isVisible}
                formatValue={(v) => `${v.toFixed(1)}%`}
                unit="%"
              />
            </ChartActionsWrapper>
          </div>
        )}

        {/* Gender gap butterfly chart */}
        {data.states.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              Gender Literacy Gap by State — Census 2011 (percentage points)
            </p>
            <ChartActionsWrapper registryKey="census/literacy" data={data}>
              <GenderGapChart states={data.states} isVisible={isVisible} />
            </ChartActionsWrapper>
          </div>
        )}

        {/* State choropleth replacing the 20-bar ranking */}
        {choroData.length > 0 && (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Overall Literacy Rate by State — Census 2011
            </p>
            <ChartActionsWrapper registryKey="census/literacy" data={data}>
              <GenericChoropleth
                data={choroData}
                colorScaleType="sequential"
                accentColor="var(--violet)"
                formatValue={(v) => `${v.toFixed(1)}%`}
                legendLabel="Literacy Rate"
                isVisible={isVisible}
                nationalAvg={74}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <RelatedTopics sectionId="literacy" domain="census" />
        <CrossDomainLink domain="census" sectionId="literacy" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
