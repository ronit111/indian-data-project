/**
 * Wraps any chart to provide a hover overlay with share/export actions.
 *
 * - Finds the SVG via containerRef.querySelector('svg')
 * - Desktop: hover fade-in, positioned top-right
 * - Mobile: tap chart to reveal share button, auto-hides after 3s
 * - pointer-events: none on overlay, auto on buttons only
 */
import { useRef, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
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

// Module-scoped ownership registry: when a section wraps several charts with
// the same registryKey, only one mounted wrapper renders the sr-only data
// table — screen readers were getting the identical table repeated. Each
// mounted wrapper registers as a claimant; the first claimant owns the table,
// and when it unmounts the next one is elected so the table never disappears
// while any duplicate remains mounted.
type SrTableClaimant = { id: symbol; setOwns: (owns: boolean) => void };
const srTableClaimants = new Map<string, SrTableClaimant[]>();

function electSrTableOwner(registryKey: string) {
  const claimants = srTableClaimants.get(registryKey);
  if (!claimants) return;
  claimants.forEach((c, i) => c.setOwns(i === 0));
}

export function ChartActionsWrapper({ registryKey, data, children }: ChartActionsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const instanceId = useRef<symbol | null>(null);
  if (instanceId.current === null) instanceId.current = Symbol(registryKey);
  const [ownsTable, setOwnsTable] = useState(false);

  useEffect(() => {
    const claimant: SrTableClaimant = { id: instanceId.current!, setOwns: setOwnsTable };
    const claimants = srTableClaimants.get(registryKey) ?? [];
    claimants.push(claimant);
    srTableClaimants.set(registryKey, claimants);
    electSrTableOwner(registryKey);
    return () => {
      const list = srTableClaimants.get(registryKey);
      if (!list) return;
      const idx = list.indexOf(claimant);
      if (idx !== -1) list.splice(idx, 1);
      if (list.length === 0) srTableClaimants.delete(registryKey);
      else electSrTableOwner(registryKey);
    };
  }, [registryKey]);

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

  // Accessibility: build a screen-reader data table from the same toTabular()
  // that powers CSV export, so the data behind every chart is reachable by
  // assistive tech and crawlers — not just sighted users. (On-mission: a
  // public-data portal's data should be reachable by everyone.)
  const accessibleTable = useMemo(() => {
    if (!entry) return null;
    try {
      const t = entry.toTabular(data);
      return t && t.rows?.length ? t : null;
    } catch {
      return null;
    }
  }, [entry, data]);

  // Collapse the SVG's jumbled internal text nodes into one labeled image for
  // screen readers; the full detail lives in the adjacent sr-only table.
  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg || !entry) return;
    // Respect hand-authored labels (e.g. PerCapitaSection); only manage
    // labels this wrapper set itself, marked with data-caw-label.
    if (svg.hasAttribute('aria-label') && !svg.hasAttribute('data-caw-label')) return;
    let summary = '';
    if (entry.heroStat) {
      try {
        const h = entry.heroStat(data);
        if (h) summary = `. ${h.value} ${h.label}`;
      } catch { /* heroStat is optional */ }
    }
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${entry.title}${summary}`);
    svg.setAttribute('data-caw-label', '');
    svg.setAttribute('focusable', 'false');
  }, [entry, data]);

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

      {/* Screen-reader-only data table: the chart's data made accessible to
          assistive tech and crawlers. Built from the registry's toTabular(). */}
      {ownsTable && accessibleTable && (
        <table className="sr-only">
          <caption>{entry.title} — data table. Source: {entry.source}</caption>
          <thead>
            <tr>
              {accessibleTable.headers.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accessibleTable.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) =>
                  ci === 0 ? (
                    <th key={ci} scope="row">{cell}</th>
                  ) : (
                    <td key={ci}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
