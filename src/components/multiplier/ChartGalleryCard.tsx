import { useState } from 'react';
import type { ChartRegistryEntry } from '../../lib/chartRegistry.ts';
import { getEmbedUrl, getEmbedSnippet, getPermalink, DOMAIN_META } from '../../lib/chartRegistry.ts';
import { downloadCSV } from '../../lib/csvExport.ts';
import { CitationPopover } from './CitationPopover.tsx';

interface ChartGalleryCardProps {
  entry: ChartRegistryEntry;
  registryKey: string;
}

const CHART_TYPE_LABELS: Record<string, string> = {
  line: 'Line',
  area: 'Area',
  bar: 'Bar',
  'horizontal-bar': 'Bar',
  treemap: 'Treemap',
  sankey: 'Sankey',
  waffle: 'Waffle',
  choropleth: 'Map',
  custom: 'Custom',
};

export function ChartGalleryCard({ entry }: ChartGalleryCardProps) {
  const [feedback, setFeedback] = useState('');
  const [csvLoading, setCsvLoading] = useState(false);
  const [showCitation, setShowCitation] = useState(false);

  const domainMeta = DOMAIN_META[entry.domain];
  const domainName = domainMeta?.name ?? entry.domain;

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 1500);
  };

  const handleEmbed = async () => {
    const snippet = getEmbedSnippet(entry.domain, entry.sectionId);
    await navigator.clipboard.writeText(snippet);
    flash('Embed copied');
  };

  const handlePermalink = async () => {
    const link = `https://indiandataproject.org${getPermalink(entry.domain, entry.sectionId)}`;
    await navigator.clipboard.writeText(link);
    flash('Link copied');
  };

  const handleCSV = async () => {
    if (!entry.dataFiles.length) return;
    setCsvLoading(true);
    try {
      const responses = await Promise.all(entry.dataFiles.map((f) => fetch(f).then((r) => r.json())));
      const data = responses.length === 1 ? responses[0] : responses;
      const tabular = entry.toTabular(data);
      downloadCSV(tabular, `${entry.domain}-${entry.sectionId}.csv`);
      flash('CSV saved');
    } catch {
      flash('CSV failed');
    } finally {
      setCsvLoading(false);
    }
  };

  const handlePreview = () => {
    window.open(getEmbedUrl(entry.domain, entry.sectionId), '_blank');
  };

  return (
    <div
      className="relative h-full rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
      style={{ background: 'var(--bg-surface)' }}
    >
      {/* Accent bar */}
      <div className="h-0.5" style={{ background: entry.accentColor }} />

      <div className="p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: `${entry.accentColor}20`, color: entry.accentColor }}
          >
            {domainName}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
          >
            {CHART_TYPE_LABELS[entry.chartType] ?? entry.chartType}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-sm font-bold mb-1 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {entry.title}
        </h3>

        {/* Source */}
        <p className="text-xs mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {entry.source}
        </p>

        {/* Preview button */}
        <button
          onClick={handlePreview}
          className="w-full mb-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          style={{
            background: 'var(--bg-raised)',
            color: entry.accentColor,
            border: `1px solid ${entry.accentColor}30`,
          }}
        >
          Open chart preview
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ActionButton label="Embed" onClick={handleEmbed} />
          <ActionButton label={csvLoading ? '...' : 'CSV'} onClick={handleCSV} />
          <ActionButton label="Link" onClick={handlePermalink} />
          <div className="relative">
            <ActionButton label="Cite" onClick={() => setShowCitation(!showCitation)} />
            {showCitation && (
              <CitationPopover entry={entry} onClose={() => setShowCitation(false)} />
            )}
          </div>
        </div>

        {/* Feedback flash */}
        {feedback && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: 'var(--positive)', color: 'var(--bg-void)' }}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-1.5 rounded text-[11px] font-medium cursor-pointer transition-colors"
      style={{
        background: 'var(--bg-raised)',
        color: 'var(--text-secondary)',
        border: 'none',
      }}
    >
      {label}
    </button>
  );
}
