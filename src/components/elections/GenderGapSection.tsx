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
          Half the voters. {latest.womenMPs} out of {latest.totalSeats} MPs — just {latest.pct}%. The line on this chart is nearly flat across 67 years of elections. The highest was {peak.pct}% in {peak.year}. The 33% reservation law passed in 2023 after 27 years of failed attempts — but it won't take effect until after delimitation and a new Census, conditions that may not be met for a decade. The dashed line at 33% sits {gap.toFixed(1)} percentage points above where India actually is. That distance is not a gap. It is a structural failure.
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

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="text-annotation mt-8 max-w-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          96.88 crore people are eligible to choose their representatives. They show up in extraordinary numbers. What they get in return — a Parliament where 1 in 3 members faces criminal charges and 6 in 7 are men — is the gap between India's democratic ambition and its democratic reality. The ballot box works. Everything around it needs work.
        </motion.p>

        <RelatedTopics sectionId="representation" domain="elections" />
        <CrossDomainLink domain="elections" sectionId="gender-gap" />

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
