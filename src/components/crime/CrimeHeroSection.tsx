import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import type { CrimeSummary } from '../../lib/data/schema.ts';

interface CrimeHeroSectionProps {
  summary: CrimeSummary | null;
}

export function CrimeHeroSection({ summary }: CrimeHeroSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.2 });

  const totalLakh = summary ? (summary.totalCrimes / 100000).toFixed(1) : '—';

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Radial glow — crimson-tinted */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220,38,38,0.10) 0%, rgba(220,38,38,0.03) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-section-num tracking-[0.2em] uppercase mb-8"
        >
          Crime &amp; Safety
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="text-hero gradient-text-crimson">
            {totalLakh}L
          </div>
          <p
            className="text-xl md:text-2xl font-medium mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            crimes recorded in 2022 — roughly one every 5 seconds
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-lg md:text-xl mt-6 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Crime trends, women's safety, road fatalities, cybercrime, policing gaps, and the justice pipeline.
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
            style={{ backgroundColor: 'var(--crimson)' }}
          />
          <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            Rate {summary?.crimeRate ?? '—'}/lakh
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            &middot; Conviction {summary?.convictionRatePct ?? '—'}%
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            &middot; {summary ? Math.round(summary.roadDeaths / 365) : '—'} road deaths/day
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
