/**
 * Wraps any chart to provide a hover overlay with share/export actions.
 *
 * - Finds the SVG via containerRef.querySelector('svg')
 * - Desktop: hover fade-in, positioned top-right
 * - Mobile: tap chart to reveal share button, auto-hides after 3s
 * - pointer-events: none on overlay, auto on buttons only
 */
import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getChartEntry } from '../../lib/chartRegistry.ts';
import { ChartActions } from './ChartActions.tsx';
import { ShareBottomSheet } from './ShareBottomSheet.tsx';

interface ChartActionsWrapperProps {
  /** Registry key: "domain/sectionId" e.g. "economy/growth" */
  registryKey: string;
  /** Domain data to pass to toTabular/heroStat */
  data: unknown;
  children: ReactNode;
}

export function ChartActionsWrapper({ registryKey, data, children }: ChartActionsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleMobileTap = useCallback(() => {
    if (!svgRef.current && containerRef.current) {
      svgRef.current = containerRef.current.querySelector('svg');
    }
    setShowMobileActions(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowMobileActions(false), 3000);
  }, []);

  const handleMobileShare = useCallback(() => {
    clearTimeout(hideTimer.current);
    setShowMobileActions(false);
    setSheetOpen(true);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  const entry = getChartEntry(registryKey);
  if (!entry) return <>{children}</>;

  const handleMouseEnter = () => {
    // Lazily grab SVG reference on first hover
    if (!svgRef.current && containerRef.current) {
      svgRef.current = containerRef.current.querySelector('svg');
    }
    setHovered(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleMobileTap}
    >
      {children}

      {/* Desktop: hover/focus overlay */}
      <div
        className="absolute top-2 right-2 z-10 hidden md:flex items-center gap-1 rounded-lg px-1.5 py-1 transition-opacity duration-200"
        style={{
          pointerEvents: hovered ? 'auto' : 'none',
          opacity: hovered ? 1 : 0,
          background: 'rgba(6, 8, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
        onFocus={() => {
          if (!svgRef.current && containerRef.current) {
            svgRef.current = containerRef.current.querySelector('svg');
          }
          setHovered(true);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setHovered(false);
          }
        }}
      >
        <ChartActions entry={entry} data={data} svgRef={svgRef} />
      </div>

      {/* Mobile: share button (appears on touch, auto-hides after 3s) */}
      {showMobileActions && (
        <button
          onClick={handleMobileShare}
          className="absolute top-2 right-2 z-10 md:hidden p-3 rounded-lg cursor-pointer"
          style={{
            background: 'rgba(6, 8, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: 'var(--text-muted)',
          }}
          aria-label="Share chart"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8v5a1 1 0 001 1h6a1 1 0 001-1V8" />
            <path d="M8 2v8" />
            <path d="M5 5l3-3 3 3" />
          </svg>
        </button>
      )}

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <ShareBottomSheet
          entry={entry}
          data={data}
          svgRef={svgRef}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
