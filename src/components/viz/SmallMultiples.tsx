import type { ReactNode } from 'react';

interface SmallMultiplesProps {
  children: ReactNode[];
  columns?: { sm?: number; md?: number; lg?: number };
  gap?: number;
}

/**
 * Pure CSS grid layout wrapper for small-multiples pattern.
 * Uses inline grid with responsive column counts.
 */
export function SmallMultiples({
  children,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 24,
}: SmallMultiplesProps) {
  const { sm = 1, md = 2, lg = 3 } = columns;

  return (
    <>
      <style>{`
        .sm-grid { display: grid; gap: ${gap}px; grid-template-columns: repeat(${sm}, 1fr); }
        @media (min-width: 768px) { .sm-grid { grid-template-columns: repeat(${md}, 1fr); } }
        @media (min-width: 1024px) { .sm-grid { grid-template-columns: repeat(${lg}, 1fr); } }
      `}</style>
      <div className="sm-grid w-full">
        {children.map((child, i) => (
          <div
            key={i}
            className="rounded-lg p-4"
            style={{ background: 'var(--bg-raised)' }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
