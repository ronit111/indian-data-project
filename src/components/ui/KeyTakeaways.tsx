import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';

export interface TakeawayPill {
  value: string;
  label: string;
  sectionId: string;
}

interface KeyTakeawaysProps {
  pills: TakeawayPill[];
  accent: string;
}

export function KeyTakeaways({ pills, accent }: KeyTakeawaysProps) {
  const [ref, isVisible] = useScrollTrigger<HTMLDivElement>({ threshold: 0.3 });

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={ref} className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3">
        {pills.map((pill, i) => (
          <motion.button
            key={pill.sectionId + i}
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: i * 0.08,
            }}
            onClick={() => scrollTo(pill.sectionId)}
            className="group relative text-left px-4 py-3 rounded-lg cursor-pointer border-none"
            style={{
              background: 'var(--bg-raised)',
              borderLeft: `3px solid ${accent}`,
            }}
          >
            {/* Value */}
            <span
              className="block font-mono text-base md:text-lg font-bold leading-tight"
              style={{ color: accent }}
            >
              {pill.value}
            </span>

            {/* Label + arrow */}
            <span
              className="block text-xs mt-1 leading-snug"
              style={{ color: 'var(--text-muted)' }}
            >
              {pill.label}
              <span
                className="inline-block ml-1 opacity-0 -translate-x-1 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                aria-hidden
              >
                &rarr;
              </span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
