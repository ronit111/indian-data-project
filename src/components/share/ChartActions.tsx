/**
 * Action bar with 4 buttons: PNG download, CSV export, permalink copy, embed code copy.
 * Positioned absolutely within ChartActionsWrapper overlay.
 */
import { useState, useCallback } from 'react';
import type { ChartRegistryEntry } from '../../lib/chartRegistry.ts';
import { getPermalink, getEmbedSnippet } from '../../lib/chartRegistry.ts';
import { downloadChartPng } from '../../lib/svgCapture.ts';
import { downloadCSV } from '../../lib/csvExport.ts';

type ActionStatus = 'idle' | 'copied' | 'downloaded' | 'error';

interface ChartActionsProps {
  entry: ChartRegistryEntry;
  data: unknown;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function ChartActions({ entry, data, svgRef }: ChartActionsProps) {
  const [status, setStatus] = useState<ActionStatus>('idle');
  const [statusLabel, setStatusLabel] = useState('');

  const flash = useCallback((s: ActionStatus, label: string) => {
    setStatus(s);
    setStatusLabel(label);
    setTimeout(() => {
      setStatus('idle');
      setStatusLabel('');
    }, 1500);
  }, []);

  const handlePng = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      await downloadChartPng(svg, {
        title: entry.title,
        source: entry.source,
        accentColor: entry.accentColor,
        filename: `${entry.domain}-${entry.sectionId}.png`,
      });
      flash('downloaded', 'PNG saved');
    } catch {
      flash('error', 'Export failed');
    }
  }, [entry, svgRef, flash]);

  const handleCsv = useCallback(() => {
    try {
      const tabular = entry.toTabular(data);
      downloadCSV(tabular, `${entry.domain}-${entry.sectionId}`);
      flash('downloaded', 'CSV saved');
    } catch {
      flash('error', 'Export failed');
    }
  }, [entry, data, flash]);

  const handlePermalink = useCallback(async () => {
    const url = `${window.location.origin}${getPermalink(entry.domain, entry.sectionId)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash('copied', 'Link copied');
    } catch {
      flash('error', 'Copy failed');
    }
  }, [entry, flash]);

  const handleEmbed = useCallback(async () => {
    const snippet = getEmbedSnippet(entry.domain, entry.sectionId);
    try {
      await navigator.clipboard.writeText(snippet);
      flash('copied', 'Embed copied');
    } catch {
      flash('error', 'Copy failed');
    }
  }, [entry, flash]);

  return (
    <div className="flex items-center gap-1" style={{ pointerEvents: 'auto' }}>
      {status !== 'idle' ? (
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{
            color: status === 'error' ? 'var(--negative)' : 'var(--positive)',
            background: status === 'error' ? 'var(--negative-dim)' : 'var(--positive-dim)',
          }}
        >
          {statusLabel}
        </span>
      ) : (
        <>
          <ActionButton onClick={handlePng} title="Download PNG" icon={<PngIcon />} />
          <ActionButton onClick={handleCsv} title="Download CSV" icon={<CsvIcon />} />
          <ActionButton onClick={handlePermalink} title="Copy permalink" icon={<LinkIcon />} />
          <ActionButton onClick={handleEmbed} title="Copy embed code" icon={<EmbedIcon />} />
        </>
      )}
    </div>
  );
}

// ─── Internal Components ─────────────────────────────────────────────

function ActionButton({
  onClick,
  title,
  icon,
}: {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="p-1.5 rounded-md transition-colors duration-150 cursor-pointer"
      style={{
        color: 'var(--text-muted)',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'var(--bg-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
    </button>
  );
}

// ─── Icons (16x16 SVG) ──────────────────────────────────────────────

function PngIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <circle cx="5.5" cy="5.5" r="1" />
      <path d="M14 10l-3-3-7 7" />
    </svg>
  );
}

function CsvIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h6l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M10 2v4h4" />
      <path d="M5 9h6M5 12h4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" />
      <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" />
    </svg>
  );
}

function EmbedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 4L1.5 8l4 4" />
      <path d="M10.5 4l4 4-4 4" />
    </svg>
  );
}
