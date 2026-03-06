/**
 * Mobile bottom sheet with chart actions + WhatsApp CTA.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChartRegistryEntry } from '../../lib/chartRegistry.ts';
import { getPermalink, getEmbedSnippet } from '../../lib/chartRegistry.ts';
import { downloadChartPng } from '../../lib/svgCapture.ts';
import { downloadCSV } from '../../lib/csvExport.ts';
import { shareCard } from '../../lib/shareCard.ts';

interface ShareBottomSheetProps {
  entry: ChartRegistryEntry;
  data: unknown;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onClose: () => void;
}

export function ShareBottomSheet({ entry, data, svgRef, onClose }: ShareBottomSheetProps) {
  const [feedback, setFeedback] = useState('');
  const sheetRef = useRef<HTMLDivElement>(null);

  const flash = useCallback((msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 1500);
  }, []);

  // Focus trap + Escape key
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    // Focus first button
    const focusable = sheet.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
      flash('PNG saved');
    } catch {
      flash('Export failed');
    }
  }, [entry, svgRef, flash]);

  const handleCsv = useCallback(() => {
    try {
      const tabular = entry.toTabular(data);
      downloadCSV(tabular, `${entry.domain}-${entry.sectionId}`);
      flash('CSV saved');
    } catch {
      flash('Export failed');
    }
  }, [entry, data, flash]);

  const handlePermalink = useCallback(async () => {
    const url = `${window.location.origin}${getPermalink(entry.domain, entry.sectionId)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash('Link copied');
    } catch {
      flash('Copy failed');
    }
  }, [entry, flash]);

  const handleEmbed = useCallback(async () => {
    const snippet = getEmbedSnippet(entry.domain, entry.sectionId);
    try {
      await navigator.clipboard.writeText(snippet);
      flash('Embed copied');
    } catch {
      flash('Copy failed');
    }
  }, [entry, flash]);

  const handleWhatsApp = useCallback(async () => {
    const heroStat = entry.heroStat?.(data);
    if (heroStat) {
      const result = await shareCard({
        domain: entry.domain,
        sectionId: entry.sectionId,
        stat: heroStat,
      });
      flash(result === 'shared' ? 'Shared' : 'Downloaded');
    } else {
      // No hero stat — share permalink instead
      const url = `${window.location.origin}${getPermalink(entry.domain, entry.sectionId)}`;
      const text = `${entry.title} — Indian Data Project\n${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      flash('Opening WhatsApp');
    }
  }, [entry, data, flash]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Share: ${entry.title}`}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl px-6 pt-4"
        style={{
          background: 'var(--bg-raised)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: 'max(5rem, calc(3.5rem + env(safe-area-inset-bottom)))',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--text-muted)' }} />

        <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          {entry.title}
        </p>

        {feedback && (
          <p className="text-xs font-mono mb-3" style={{ color: 'var(--positive)' }} role="status">
            {feedback}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <SheetButton onClick={handlePng} label="Save PNG" icon="image" />
          <SheetButton onClick={handleCsv} label="Save CSV" icon="file" />
          <SheetButton onClick={handlePermalink} label="Copy Link" icon="link" />
          <SheetButton onClick={handleEmbed} label="Embed Code" icon="code" />
        </div>

        {/* WhatsApp CTA */}
        <button
          onClick={handleWhatsApp}
          className="w-full py-3 rounded-xl font-medium text-sm cursor-pointer transition-colors duration-150"
          style={{
            background: '#25D366',
            color: '#fff',
          }}
        >
          Share on WhatsApp
        </button>
      </div>
    </>
  );
}

function SheetButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: 'image' | 'file' | 'link' | 'code';
}) {
  const icons: Record<string, React.ReactNode> = {
    image: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" />
        <circle cx="5.5" cy="5.5" r="1" />
        <path d="M14 10l-3-3-7 7" />
      </svg>
    ),
    file: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 2h6l4 4v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
        <path d="M10 2v4h4" />
      </svg>
    ),
    link: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" />
        <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" />
      </svg>
    ),
    code: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5.5 4L1.5 8l4 4" />
        <path d="M10.5 4l4 4-4 4" />
      </svg>
    ),
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm cursor-pointer transition-colors duration-150"
      style={{
        background: 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {icons[icon]}
      {label}
    </button>
  );
}
