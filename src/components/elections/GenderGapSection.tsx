import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { RelatedTopics } from '../ui/RelatedTopics.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';
import { LineChart, type LineSeries } from '../viz/LineChart.tsx';
import type { RepresentationData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface GenderGapSectionProps {
  data: RepresentationData;
}

export function GenderGapSection({ data }: GenderGapSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const womenSeries: LineSeries[] = useMemo(() => {
    return [
      {
        id: 'women-pct',
        name: 'Women MPs (%)',
        color: 'var(--indigo)',
        data: data.trend.map((t) => ({
          year: t.year,
          value: t.pct,
        })),
      },
      {
        id: 'target',
        name: '33% Reservation Target',
        color: 'var(--indigo-light)',
        dashed: true,
        data: [
          { year: data.trend[0].year, value: 33 },
          { year: data.trend[data.trend.length - 1].year, value: 33 },
        ],
      },
    ];
  }, [data]);

  const latest = data.trend[data.trend.length - 1];
  const peak = data.trend.reduce((a, b) => a.pct > b.pct ? a : b);
  const gap = data.target.pct - latest.pct;

  return (
    <section ref={ref} id="gender-gap" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={5} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          The gender gap in Parliament
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          {latest.womenMPs} women in a house of {latest.totalSeats} — just {latest.pct}%.
          The highest ever was {peak.pct}% in {peak.year} ({peak.womenMPs} women).
          The 33% reservation law passed in 2023 after 27 years of failed attempts, but it won't take effect until after delimitation (redrawing constituency boundaries so each MP represents roughly equal numbers of people) and a new Census.
          That leaves a {gap.toFixed(1)} percentage point gap to close.
        </motion.p>

        <div className="mb-8">
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Women MPs (% of total), 1957–2024 — dashed line = 33% reservation target
          </p>
          <ChartActionsWrapper registryKey="elections/gender-gap" data={data}>
            <LineChart
              series={womenSeries}
              isVisible={isVisible}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
          </ChartActionsWrapper>
        </div>

        {/* Reservation Act callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="p-5 rounded-lg"
          style={{ background: 'var(--bg-raised)', borderLeft: '3px solid var(--indigo)' }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--indigo-light)' }}>
            {data.target.label}
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            {data.target.note}
          </p>
          <p className="text-xs font-mono mt-3" style={{ color: 'var(--text-muted)' }}>
            Global average: ~27% women in national parliaments. India: {latest.pct}%.
          </p>
        </motion.div>

        <RelatedTopics sectionId="representation" domain="elections" />
        <CrossDomainLink domain="elections" sectionId="gender-gap" />


        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
