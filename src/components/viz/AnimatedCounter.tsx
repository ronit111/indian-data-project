import { useEffect, useRef } from 'react';
import { formatIndianNumber } from '../../lib/format.ts';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  trigger?: boolean;
}

// Deceleration curve matching gsap's power2.out
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function AnimatedCounter({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  trigger = true,
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current || !spanRef.current) return;
    hasAnimated.current = true;

    // Skip animation for users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      spanRef.current.textContent = `${prefix}${formatIndianNumber(target)}${suffix}`;
      return;
    }

    const durationMs = duration * 1000;
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const value = Math.round(easeOutQuad(progress) * target);

      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${formatIndianNumber(value)}${suffix}`;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [trigger, target, duration, prefix, suffix]);

  return (
    <span ref={spanRef} className={`font-mono tabular-nums ${className}`}>
      {prefix}0{suffix}
    </span>
  );
}
