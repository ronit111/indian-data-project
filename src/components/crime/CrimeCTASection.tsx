import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';

export function CrimeCTASection() {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.15 });

  return (
    <section ref={ref} className="composition">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-4"
        >
          Go deeper
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-10 max-w-lg mx-auto"
        >
          Explore state-level crime indicators, or read about our NCRB sources and the limitations of FIR-based data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/crime/explore"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--crimson), var(--crimson-light))',
              color: '#fff',
            }}
          >
            Explore indicators
            <span aria-hidden>&#8594;</span>
          </Link>

          <Link
            to="/crime/methodology"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: 'var(--bg-raised)',
              border: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            Methodology
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
