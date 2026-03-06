import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { ChoroplethMap } from '../viz/ChoroplethMap.tsx';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import type { StatewiseData } from '../../lib/data/schema.ts';
import { formatLakhCrore, formatIndianNumber } from '../../lib/format.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';
import { CrossDomainLink } from '../ui/CrossDomainLink.tsx';

interface MapSectionProps {
  statewise: StatewiseData;
}

export function MapSection({ statewise }: MapSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  const topState = useMemo(
    () => [...statewise.states].sort((a, b) => b.transfer - a.transfer)[0],
    [statewise.states]
  );
  const topPerCapita = useMemo(
    () => [...statewise.states].sort((a, b) => b.perCapita - a.perCapita)[0],
    [statewise.states]
  );

  return (
    <section ref={ref} id="map" className="composition relative overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      {/* Atmospheric glow behind the map */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,234,220,0.06) 0%, rgba(255,107,53,0.03) 40%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={7} className="mb-6 block" isVisible={isVisible} />

        <div className="grid md:grid-cols-[1fr_2.2fr] gap-12 items-start">
          {/* Annotation panel */}
          <div className="md:sticky md:top-24">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-composition mb-4"
            >
              {`${formatLakhCrore(statewise.totalTransfers)} to states`}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-annotation mb-8"
            >
              {"Nearly 1 in 4 rupees of central spending flows directly to state governments. Colour intensity shows per-capita transfer — what each citizen's share looks like."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-lg p-4" style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}>
                <p className="text-caption uppercase tracking-wider mb-1">{'Largest total transfer'}</p>
                <p className="font-semibold text-base" style={{ color: 'var(--saffron)' }}>{topState.name}</p>
                <p className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                  ₹{formatIndianNumber(topState.transfer)} Cr
                </p>
              </div>

              <div className="rounded-lg p-4" style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}>
                <p className="text-caption uppercase tracking-wider mb-1">{'Highest per capita'}</p>
                <p className="font-semibold text-base" style={{ color: 'var(--cyan)' }}>{topPerCapita.name}</p>
                <p className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                  ₹{formatIndianNumber(topPerCapita.perCapita)}/person
                </p>
              </div>
            </motion.div>

            <p className="source-attribution mt-8">
              {'Source: Union Budget 2025-26, Finance Commission'}
            </p>
          </div>

          {/* Full-width choropleth */}
          <ChartActionsWrapper registryKey="budget/map" data={statewise}>
            <ChoroplethMap states={statewise.states} isVisible={isVisible} />
          </ChartActionsWrapper>

          <CrossDomainLink domain="budget" sectionId="map" />
        </div>
      </div>
    </section>
  );
}
