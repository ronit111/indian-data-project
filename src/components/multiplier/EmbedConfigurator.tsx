import { useState, useMemo } from 'react';
import { getAllCharts, getEmbedUrl, DOMAIN_META } from '../../lib/chartRegistry.ts';
import { CodeBlock } from './CodeBlock.tsx';

interface EmbedConfiguratorProps {
  defaultDomain?: string;
  defaultSection?: string;
}

export function EmbedConfigurator({ defaultDomain, defaultSection }: EmbedConfiguratorProps) {
  const charts = useMemo(() => {
    const all = getAllCharts();
    const grouped: Record<string, { key: string; title: string; domain: string; sectionId: string }[]> = {};
    for (const [key, entry] of all) {
      const domain = entry.domain;
      if (!grouped[domain]) grouped[domain] = [];
      grouped[domain].push({ key, title: entry.title, domain, sectionId: entry.sectionId });
    }
    return grouped;
  }, []);

  const defaultKey = defaultDomain && defaultSection
    ? `${defaultDomain}/${defaultSection}`
    : Object.values(charts)[0]?.[0]?.key ?? '';

  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('450');

  const parts = selectedKey.split('/');
  const domain = parts[0];
  const sectionId = parts.slice(1).join('/');
  const embedUrl = domain && sectionId ? getEmbedUrl(domain, sectionId) : '';
  const fullUrl = `https://indiandataproject.org${embedUrl}`;

  const snippet = `<iframe\n  src="${fullUrl}"\n  width="${width}"\n  height="${height}"\n  frameborder="0"\n  title="Indian Data Project"\n  loading="lazy"\n  style="border-radius: 8px;"\n></iframe>`;

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        {/* Chart selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Select Chart
          </label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full rounded-lg px-4 py-3 text-sm font-mono appearance-none cursor-pointer"
            style={{
              background: 'var(--bg-raised)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-hover)',
            }}
          >
            {Object.entries(charts).map(([domainKey, entries]) => (
              <optgroup key={domainKey} label={DOMAIN_META[domainKey]?.name ?? domainKey}>
                {entries.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Size controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Width
            </label>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-mono"
              style={{
                background: 'var(--bg-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--bg-hover)',
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Height (px)
            </label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-mono"
              style={{
                background: 'var(--bg-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--bg-hover)',
              }}
            />
          </div>
        </div>

        {/* Snippet */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Embed Code
            </label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors"
              style={{
                background: copied ? 'var(--positive)' : 'var(--bg-hover)',
                color: copied ? 'var(--bg-void)' : 'var(--text-secondary)',
                border: 'none',
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <CodeBlock code={snippet} language="html" copyable={false} />
        </div>

        {/* Direct link */}
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs"
          style={{ color: 'var(--cyan)' }}
        >
          Open chart in new tab
        </a>
      </div>

      {/* Live preview */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
          Live Preview
        </label>
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--bg-hover)' }}
        >
          {embedUrl ? (
            <iframe
              key={selectedKey}
              src={embedUrl}
              width="100%"
              height={parseInt(height) || 450}
              style={{ border: 'none', display: 'block' }}
              title="Chart preview"
              loading="lazy"
            />
          ) : (
            <div
              className="flex items-center justify-center py-24 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Select a chart to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
