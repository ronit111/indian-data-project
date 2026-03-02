/**
 * Minimal chrome shell for embedded charts.
 * Shows: accent bar, title, chart, source, branding link.
 */
import type { ReactNode } from 'react';

interface EmbedShellProps {
  title: string;
  source: string;
  accentColor: string;
  domainPath: string;
  sectionId: string;
  children: ReactNode;
}

export function EmbedShell({ title, source, accentColor, domainPath, sectionId, children }: EmbedShellProps) {
  return (
    <div
      style={{
        background: 'var(--bg-void)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: accentColor }} />

      {/* Title */}
      <div style={{ padding: '16px 24px 8px' }}>
        <h1
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            margin: 0,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h1>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, padding: '0 24px 16px', overflow: 'hidden' }}>
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--text-caption)',
          color: 'var(--text-muted)',
        }}
      >
        <span>Source: {source}</span>
        <a
          href={`https://indiandataproject.org${domainPath}#${sectionId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accentColor, textDecoration: 'none' }}
        >
          indiandataproject.org
        </a>
      </div>
    </div>
  );
}
