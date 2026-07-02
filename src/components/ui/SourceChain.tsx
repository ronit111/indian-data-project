import { useEffect, useId, useRef, useState } from 'react';
import { useProvenance } from '../../lib/provenance.ts';
import type { ProvenanceStep } from '../../lib/provenance.ts';

interface SourceChainProps {
  domain: string;
  year: string;
  figureKey: string;
  /** The stat this chain documents. Rendered unadorned if no provenance exists. */
  children: React.ReactNode;
  /** Where the popover opens relative to the trigger. */
  placement?: 'top' | 'bottom';
  className?: string;
}

function stepDetail(step: ProvenanceStep): string | null {
  if (step.kind === 'api' && step.retrieved) return `retrieved ${step.retrieved}`;
  if (step.publisher) return step.publisher;
  return null;
}

/**
 * Wraps a displayed statistic with its chain of custody: hover (desktop) or
 * tap (touch) reveals document → API → recomputed integrity checks, read
 * from the domain's provenance sidecar. Degrades to plain children when the
 * domain has no sidecar — adoption is per-domain, per-figure.
 */
export function SourceChain({
  domain,
  year,
  figureKey,
  children,
  placement = 'top',
  className = '',
}: SourceChainProps) {
  const figure = useProvenance(domain, year, figureKey);
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const popId = useId();

  // Tap-to-pin: close on any outside click / Escape
  useEffect(() => {
    if (!pinned) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setPinned(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPinned(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [pinned]);

  if (!figure) return <span className={className}>{children}</span>;

  const checks = figure.chain.filter((s) => s.kind === 'check');
  const documentStep = figure.chain.find((s) => s.kind === 'document');

  return (
    <span ref={rootRef} className={`source-chain group relative inline-block ${className}`}>
      <button
        type="button"
        aria-expanded={pinned}
        aria-describedby={popId}
        onClick={(e) => {
          e.stopPropagation();
          setPinned((p) => !p);
        }}
        className="source-chain-trigger cursor-help border-0 bg-transparent p-0 font-inherit text-inherit"
        style={{
          borderBottom: '1px dotted rgba(74, 234, 220, 0.6)',
          color: 'inherit',
          font: 'inherit',
        }}
      >
        {children}
      </button>

      <span
        id={popId}
        role="tooltip"
        className={`source-chain-pop pointer-events-none absolute left-1/2 z-30 w-80 -translate-x-1/2 rounded-xl px-5 py-4 text-left opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 ${
          pinned ? 'pointer-events-auto opacity-100' : ''
        } ${placement === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'}`}
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(74, 234, 220, 0.25)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          fontFamily: 'var(--font-body, inherit)',
          fontWeight: 400,
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          letterSpacing: 'normal',
          whiteSpace: 'normal',
          WebkitTextFillColor: 'initial',
        }}
      >
        <span
          className="mb-2 block font-mono text-sm font-bold"
          style={{ color: 'var(--cyan)' }}
        >
          {figure.label}
        </span>

        <span className="block">
          {figure.chain.map((step, i) => (
            <span key={i} className="relative block pb-3 pl-5 last:pb-0">
              {/* timeline dot + connector */}
              <span
                className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full"
                style={{
                  background: step.kind === 'check' ? 'var(--positive)' : 'var(--cyan)',
                }}
              />
              {i < figure.chain.length - 1 && (
                <span
                  className="absolute bottom-0 left-[2.5px] top-3.5 w-px"
                  style={{ background: 'rgba(74, 234, 220, 0.25)' }}
                />
              )}
              <span style={{ color: 'var(--text-secondary)' }}>
                {step.kind === 'check' ? (
                  <>
                    <span style={{ color: 'var(--positive)' }}>✓</span> {step.name}
                  </>
                ) : (
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {step.name}
                  </span>
                )}
              </span>
              {stepDetail(step) && (
                <span
                  className="block font-mono text-[11px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {stepDetail(step)}
                </span>
              )}
            </span>
          ))}
        </span>

        {figure.basis && (
          <span
            className="mt-2 block border-t pt-2 text-xs"
            style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
          >
            {figure.basis}
          </span>
        )}

        <span
          className="mt-2 flex items-center justify-between border-t pt-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="font-mono text-[11px]" style={{ color: 'var(--positive)' }}>
            ✓ {checks.length} check{checks.length === 1 ? '' : 's'} recomputed
          </span>
          {documentStep?.url && (
            <a
              href={documentStep.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: 'var(--cyan)' }}
              onClick={(e) => e.stopPropagation()}
            >
              source ↗
            </a>
          )}
        </span>
      </span>
    </span>
  );
}
