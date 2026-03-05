import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface CardStat {
  label: string;
  value: string;
  color: string;
}

interface DomainCardShellProps {
  id?: string;
  to: string;
  sectionNumber: string;
  title: string;
  description: string;
  accentColor: string;
  accentVar: string;
  ctaText: string;
  stats: CardStat[];
  className?: string;
  children: (isVisible: boolean) => React.ReactNode;
}

export function DomainCardShell({
  id,
  to,
  sectionNumber,
  title,
  description,
  accentColor,
  accentVar,
  ctaText,
  stats,
  className = '',
  children,
}: DomainCardShellProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
      className={className}
    >
      <Link
        to={to}
        className="group block relative rounded-2xl p-px no-underline overflow-hidden"
        style={{ transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, transparent 40%, ${accentColor}40 80%, transparent)`,
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}08)`,
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Hover left accent bar */}
        <div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-0 group-hover:opacity-100"
          style={{ background: accentColor, transition: 'opacity 0.3s ease' }}
        />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="grid md:grid-cols-[1.4fr_1fr]">
            {/* Left: description + mini viz */}
            <div className="relative p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-3/4 h-full pointer-events-none opacity-[0.03]"
                style={{
                  background: `radial-gradient(ellipse at 70% 50%, var(${accentVar}), transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <span className="text-section-num tracking-[0.15em] uppercase mb-4 block">
                  {sectionNumber} — Data Story
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}
                >
                  {title}
                </h2>
                <p className="text-annotation mb-6 max-w-md">{description}</p>
              </div>

              {/* Mini viz slot + CTA */}
              <div className="relative z-10">
                {children(isVisible)}

                <div
                  className="inline-flex items-center gap-2 text-sm font-medium mt-4"
                  style={{ color: accentColor }}
                >
                  <span>{ctaText}</span>
                  <svg
                    className="group-hover:translate-x-1.5 transition-transform duration-200"
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: key stats */}
            <div
              className="p-8 md:p-10 flex flex-col justify-center gap-7 border-t md:border-t-0 md:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 + i * 0.1 }}
                >
                  <p className="text-caption uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="font-mono font-bold text-xl" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
