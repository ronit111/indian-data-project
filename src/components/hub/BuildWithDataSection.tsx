import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface AudienceCard {
  to: string;
  title: string;
  stat: string;
  desc: string;
  accent: string;
  icon: React.ReactNode;
}

const AUDIENCES: AudienceCard[] = [
  {
    to: '/open-data',
    title: 'Open Data',
    stat: '80 endpoints',
    desc: 'JSON APIs. No auth. No rate limits. Build anything.',
    accent: 'var(--cyan)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
        <path d="M2 12h4" /><path d="M18 12h4" />
      </svg>
    ),
  },
  {
    to: '/for-journalists',
    title: 'For Journalists',
    stat: '12 story kits',
    desc: 'Chart gallery, embed builder, pre-written data briefs.',
    accent: 'var(--saffron)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    to: '/for-teachers',
    title: 'For Teachers',
    stat: '8 lesson plans',
    desc: 'NCERT-mapped activities. Classroom mode ready.',
    accent: 'var(--positive)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    to: '/contribute',
    title: 'Contribute',
    stat: 'Open source',
    desc: 'Add data, fix errors, suggest features. This is a civic project.',
    accent: 'var(--gold)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
];

export function BuildWithDataSection() {
  const [ref, isVisible] = useScrollTrigger<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative mt-8 mb-16">
      {/* Transition gradient */}
      <div
        className="absolute -top-24 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(14,20,32,0.3))',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Divider */}
        <div className="composition-divider mb-16" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-center mb-10"
        >
          <p className="text-section-num tracking-[0.15em] uppercase mb-4">
            Beyond Reading
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            What will you do with this data?
          </h2>
          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Everything here is open. Download it, embed it, teach with it, investigate with it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {AUDIENCES.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.06 }}
            >
              <Link
                to={card.to}
                className="group block h-full rounded-xl overflow-hidden no-underline transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                }}
              >
                {/* Accent top bar */}
                <div className="h-px" style={{ background: card.accent }} />

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: `color-mix(in srgb, ${card.accent} 10%, transparent)`, color: card.accent }}
                    >
                      {card.icon}
                    </div>
                    <span
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full"
                      style={{ color: card.accent, background: `color-mix(in srgb, ${card.accent} 8%, transparent)` }}
                    >
                      {card.stat}
                    </span>
                  </div>

                  <h3
                    className="text-base font-bold mb-1 group-hover:underline"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {card.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
