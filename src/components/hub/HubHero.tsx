import { motion, useScroll, useTransform } from 'framer-motion';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HubHero() {
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, -60]);
  const subtitleOpacity = useTransform(scrollY, [200, 600], [1, 0]);

  return (
    <section className="relative overflow-hidden pt-16 pb-12" style={{ minHeight: '70vh' }}>
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '1200px',
          height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, rgba(255,200,87,0.03) 40%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 px-6 sm:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center" style={{ minHeight: 'calc(70vh - 4rem - 3rem)' }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
          style={{ y: titleY, fontSize: 'clamp(2.5rem, 8vw, 7rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
          className="font-extrabold"
        >
          <span className="gradient-text-saffron">{'Government'}</span>
          <br />
          <span className="gradient-text-saffron">{'data,'}</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>{'made visible'}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
          style={{ opacity: subtitleOpacity }}
          className="mt-6 max-w-lg"
        >
          <p
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Dense PDFs and buried spreadsheets turned into interactive visual stories.
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Real data. No spin. Open source.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
