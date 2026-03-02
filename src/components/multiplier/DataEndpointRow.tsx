import { useState } from 'react';
import type { DataEndpoint } from '../../lib/multiplierTypes.ts';

interface DataEndpointRowProps {
  endpoint: DataEndpoint;
}

export function DataEndpointRow({ endpoint }: DataEndpointRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [rawData, setRawData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://indiandataproject.org${endpoint.path}`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTryIt = async () => {
    if (expanded && rawData) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (rawData) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint.path);
      const json = await res.json();
      setRawData(JSON.stringify(json, null, 2).slice(0, 2000) + '\n...');
    } catch {
      setRawData('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = endpoint.path;
    a.download = endpoint.file;
    a.click();
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)' }}
    >
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Path + info */}
        <div className="flex-1 min-w-0">
          <code
            className="text-xs font-mono block truncate mb-1"
            style={{ color: 'var(--cyan)' }}
          >
            {endpoint.path}
          </code>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {endpoint.description}
          </p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Schema: <span className="font-mono">{endpoint.schema}</span>
            {' · '}
            <a
              href={endpoint.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
            >
              {endpoint.source}
            </a>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <SmallButton
            label={copied ? 'Copied' : 'Copy URL'}
            onClick={handleCopyUrl}
            highlight={copied}
          />
          <SmallButton label="Download" onClick={handleDownload} />
          <SmallButton
            label={expanded ? 'Hide' : 'Try it'}
            onClick={handleTryIt}
            accent
          />
        </div>
      </div>

      {/* Expandable raw JSON preview */}
      {expanded && (
        <div className="border-t" style={{ borderColor: 'var(--bg-raised)' }}>
          <pre
            className="p-4 text-xs font-mono overflow-x-auto max-h-64"
            style={{ color: 'var(--text-secondary)', margin: 0 }}
          >
            {loading ? 'Loading...' : rawData}
          </pre>
        </div>
      )}
    </div>
  );
}

function SmallButton({
  label,
  onClick,
  accent,
  highlight,
}: {
  label: string;
  onClick: () => void;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap"
      style={{
        background: highlight
          ? 'var(--positive)'
          : accent
            ? 'var(--bg-hover)'
            : 'var(--bg-raised)',
        color: highlight
          ? 'var(--bg-void)'
          : accent
            ? 'var(--cyan)'
            : 'var(--text-secondary)',
        border: 'none',
      }}
    >
      {label}
    </button>
  );
}
