import type { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ title, subtitle, children, className = '' }: ChartContainerProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)' }}
    >
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-lg md:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        )}
      </div>
      <div className="px-4 pb-6">{children}</div>
    </div>
  );
}
