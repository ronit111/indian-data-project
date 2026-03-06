import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import type { HealthcareSummary } from '../../lib/data/schema.ts';

interface HealthcareHeroSectionProps {
  summary: HealthcareSummary | null;
}

export function HealthcareHeroSection({ summary }: HealthcareHeroSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.2 });

  const formattedDoctors = summary
    ? (summary.physiciansPer1000 * 10).toFixed(0)
    : '—';

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Radial glow — rose-tinted */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0.04) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,113,133,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-section-num tracking-[0.2em] uppercase mb-8"
        >
          Healthcare
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="text-hero gradient-text-rose">
            {formattedDoctors}
          </div>
          <p
            className="text-xl md:text-2xl font-medium mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            doctors per 10,000 people
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-lg md:text-xl mt-6 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          The world's most populous nation, with one of the lowest doctor-to-population ratios.
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
            style={{ backgroundColor: 'var(--rose)' }}
          />
          <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            Beds {summary?.hospitalBedsPer1000?.toFixed(1) ?? '—'}/1K
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            &middot; Health Exp {summary?.healthExpGDP?.toFixed(1) ?? '—'}% GDP
          </span>
          <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
            &middot; Out-of-Pocket {summary?.outOfPocketPct?.toFixed(0) ?? '—'}%
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
