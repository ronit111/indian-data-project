import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface NarrativeBridgeProps {
  text: string;
  /** Map of lowercase words to CSS color values for emphasis coloring */
  highlights?: Record<string, string>;
  className?: string;
}

/**
 * Scroll-triggered split-text reveal between homepage sections.
 * Each word fades in as the user scrolls, Kasia Siwosz-style.
 * Supports IIB-style colored emphasis on key words.
 * Generous whitespace above and below for breathing room.
 */
export function NarrativeBridge({ text, highlights, className = '' }: NarrativeBridgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'start 0.4'],
  });

  return (
    <div
      ref={containerRef}
      className={`py-24 md:py-32 px-4 max-w-3xl mx-auto ${className}`}
    >
      <p className="text-composition text-center leading-relaxed">
        {words.map((word, i) => (
          <WordReveal
            key={i}
            word={word}
            index={i}
            total={words.length}
            progress={scrollYProgress}
            color={highlights?.[word.toLowerCase().replace(/[.,!?;:'"]/g, '')]}
          />
        ))}
      </p>
    </div>
  );
}

function WordReveal({
  word,
  index,
  total,
  progress,
  color,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  color?: string;
}) {
  const start = index / (total + 3);
  const end = Math.min((index + 4) / (total + 3), 1);

  const prefersReducedMotion = useReducedMotion();
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);

  // Honor reduced-motion: skip the scroll-driven word reveal (opacity + y
  // movement) and render the text statically. CSS `prefers-reduced-motion`
  // cannot stop Framer's `useTransform`, so this must be gated in JS.
  const style = prefersReducedMotion
    ? { display: 'inline-block', color: color || undefined }
    : { opacity, y, display: 'inline-block', color: color || undefined };

  return (
    <motion.span style={style} className="mr-[0.3em]">
      {word}
    </motion.span>
  );
}
