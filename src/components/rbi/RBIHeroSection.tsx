import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import type { RBISummary } from '../../lib/data/schema.ts';

interface RBIHeroSectionProps {
  summary: RBISummary | null;
}

export function RBIHeroSection({ summary }: RBIHeroSectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.2 });

  const stanceColor = summary?.stance === 'Accommodative'
    ? 'var(--cyan)'
    : summary?.stance === 'Neutral'
      ? 'var(--gold)'
      : 'var(--saffron)';

  const stanceExplain = summary?.stance === 'Accommodative'
    ? 'Leaning toward lower rates to support growth'
    : summary?.stance === 'Neutral'
      ? 'Watching both inflation and growth before deciding'
      : summary?.stance === 'Withdrawal of Accommodation'
        ? 'Gradually pulling back support to control inflation'
        : 'Leaning toward higher rates to control inflation';

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Radial glow — gold-tinted for RBI domain */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,87,0.12) 0%, rgba(255,107,53,0.05) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,234,220,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Overline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-section-num tracking-[0.2em] uppercase mb-8"
        >
          India's Central Banker
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-lg md:text-xl mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          The price of money in India
        </motion.p>

        {/* Hero repo rate number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="text-hero gradient-text-gold">
            {summary?.repoRate ?? '—'}%
          </div>
          <p
            className="text-xl md:text-2xl font-medium mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Repo rate
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            the interest rate at which RBI lends to banks
          </p>
        </motion.div>

        {/* Stance badge */}
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
            style={{ backgroundColor: stanceColor }}
          />
          <span className="text-caption font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            {summary?.stance ?? 'Loading'} stance
          </span>
          {summary?.repoRateDate && (
            <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
              &middot; {new Date(summary.repoRateDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </motion.div>
        {summary?.stance && (
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {stanceExplain}
          </p>
        )}

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
