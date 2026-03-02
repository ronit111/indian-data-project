import { useState } from 'react';
import type { ChartRegistryEntry } from '../../lib/chartRegistry.ts';
import type { CitationFormat } from '../../lib/multiplierTypes.ts';
import { generateCitation } from '../../lib/citationGenerator.ts';

interface CitationPopoverProps {
  entry: ChartRegistryEntry;
  onClose: () => void;
}

const FORMATS: { key: CitationFormat; label: string }[] = [
  { key: 'apa', label: 'APA' },
  { key: 'chicago', label: 'Chicago' },
  { key: 'plain', label: 'Plain' },
];

export function CitationPopover({ entry, onClose }: CitationPopoverProps) {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>('plain');
  const [copied, setCopied] = useState(false);

  const citation = generateCitation(entry, activeFormat);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 z-50 rounded-xl p-4 w-80 shadow-xl"
      style={{ background: 'var(--bg-raised)', border: '1px solid var(--bg-hover)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Cite this chart
        </span>
        <button
          onClick={onClose}
          className="text-xs cursor-pointer"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
        >
          Close
        </button>
      </div>

      <div className="flex gap-1 mb-3">
        {FORMATS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setActiveFormat(f.key); setCopied(false); }}
            className="px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: activeFormat === f.key ? 'var(--bg-hover)' : 'transparent',
              color: activeFormat === f.key ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg p-3 text-xs font-mono leading-relaxed mb-3"
        style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
      >
        {citation}
      </div>

      <button
        onClick={handleCopy}
        className="w-full py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
        style={{
          background: copied ? 'var(--positive)' : entry.accentColor,
          color: copied ? 'var(--bg-void)' : '#fff',
          border: 'none',
        }}
      >
        {copied ? 'Copied' : 'Copy Citation'}
      </button>
    </div>
  );
}
