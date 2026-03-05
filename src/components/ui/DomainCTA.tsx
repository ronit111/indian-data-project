/**
 * Unified CTA component for all non-Budget data domains.
 * Replaces 10 nearly-identical domain-specific CTA files.
 * Optionally shows 2 "Related stories" cards linking to other domains.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import type { DomainId } from '../../lib/topicConfig.ts';
import {
  DOMAIN_META,
  DOMAIN_CTA_CONFIG,
  CTA_RELATED_DOMAINS,
} from '../../lib/crossDomainLinks.ts';

interface DomainCTAProps {
  domain: DomainId;
}

export function DomainCTA({ domain }: DomainCTAProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.15 });
  const config = DOMAIN_CTA_CONFIG[domain];
  const related = CTA_RELATED_DOMAINS[domain];

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
          {config.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to={`/${domain}/explore`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: config.accentGradient,
              color: config.accentTextColor,
            }}
          >
            Explore indicators
            <span aria-hidden>&#8594;</span>
          </Link>

          <Link
            to={`/${domain}/methodology`}
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

        {/* Related stories from other domains */}
        {related && related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="mt-12"
          >
            <div
              className="mx-auto mb-6"
              style={{
                width: 40,
                height: 1,
                background: 'var(--text-tertiary)',
                opacity: 0.3,
              }}
            />
            <p
              className="text-xs font-medium uppercase tracking-widest mb-5"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Related stories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
              {related.map((r) => {
                const meta = DOMAIN_META[r.domain];
                return (
                  <Link
                    key={r.domain}
                    to={meta.route}
                    className="group flex h-full items-center gap-3 px-4 py-3 rounded-lg no-underline transition-all duration-150 hover:brightness-110"
                    style={{
                      background: 'var(--bg-raised)',
                      borderLeft: `3px solid ${meta.accent}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: meta.accent }}
                      >
                        {meta.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {r.description}
                      </p>
                    </div>
                    <span
                      className="text-sm group-hover:translate-x-0.5 transition-transform"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
