import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { TopicCTALink } from '../../lib/topicConfig.ts';
import { DOMAIN_META } from '../../lib/chartRegistry.ts';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';

interface TopicCTAProps {
  links: TopicCTALink[];
  accent: string;
}

export function TopicCTA({ links, accent }: TopicCTAProps) {
  const [ref, isVisible] = useScrollTrigger<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div ref={ref} className="py-16 md:py-24 max-w-4xl mx-auto px-6 sm:px-8">
      <h3
        className="text-lg font-bold mb-6 text-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        Explore the source data
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link, i) => {
          const domainAccent = DOMAIN_META[link.domain]?.accent ?? accent;
          return (
            <motion.div
              key={link.route}
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Link
                to={link.route}
                className="block h-full rounded-xl p-5 no-underline transition-all duration-200 hover:brightness-125"
                style={{
                  background: 'var(--bg-raised)',
                  borderLeft: `3px solid ${domainAccent}`,
                }}
              >
                <span
                  className="block text-sm font-bold mb-1"
                  style={{ color: domainAccent }}
                >
                  {link.label}
                </span>
                <span
                  className="block text-xs leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {link.description}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
