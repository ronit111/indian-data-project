import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing tooltip state in visualizations.
 */
export function useTooltip<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const scrollingRef = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((item: T, e: React.MouseEvent) => {
    if (scrollingRef.current) return;
    setData(item);
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const move = useCallback((e: React.MouseEvent) => {
    if (scrollingRef.current) return;
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const hide = useCallback(() => {
    setData(null);
  }, []);

  // Auto-hide on scroll and prevent re-show while scrolling.
  // SVG hover rects fire onMouseEnter as they pass under the cursor
  // during scroll, so we debounce to avoid tooltip flicker.
  useEffect(() => {
    const dismiss = () => {
      setData(null);
      scrollingRef.current = true;
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        scrollingRef.current = false;
      }, 150);
    };
    window.addEventListener('scroll', dismiss, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', dismiss, { capture: true });
      clearTimeout(scrollTimer.current);
    };
  }, []);

  return {
    data,
    position,
    visible: data !== null,
    show,
    move,
    hide,
  };
}
