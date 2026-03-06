import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import type { CensusSummary } from '../../lib/data/schema.ts';

interface CensusHeroSectionProps {
  summary: CensusSummary | null;
}

export function CensusHeroSection({ summary }: CensusHeroSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.2 });

  const formattedPop = summary
    ? (summary.totalPopulation / 1_000_000_000).toFixed(2)
    : '—';

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Radial glow — violet-tinted */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-section-num tracking-[0.2em] uppercase mb-8"
        >
          Census & Demographics
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="text-hero gradient-text-violet">
            {formattedPop}B
          </div>
          <p
            className="text-xl md:text-2xl font-medium mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            people call India home
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-lg md:text-xl mt-6 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          The world's most populous nation. Nearly one in six humans is Indian.
        </motion.p>

        {/* Stat badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            background: 'var(--bg-raised)',
            border: 'var(--border-subtle)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--violet)' }}
          />
          <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            Growth {summary?.populationGrowthRate?.toFixed(1) ?? '—'}%
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            &middot; Literacy {summary?.literacyRate?.toFixed(0) ?? '—'}%
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            &middot; Sex ratio {summary?.sexRatio ?? '—'} per 1,000 males
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isVisible ? { scaleY: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-16 mx-auto w-px h-16 origin-top"
          style={{ backgroundColor: 'var(--text-muted)' }}
        />
      </div>
    </section>
  );
}
