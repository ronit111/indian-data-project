import { useState, useMemo } from 'react';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { ChartGalleryCard } from '../components/multiplier/ChartGalleryCard.tsx';
import { getAllCharts, DOMAIN_META } from '../lib/chartRegistry.ts';
import type { ChartType } from '../lib/chartRegistry.ts';

const CHART_TYPE_OPTIONS: { value: ChartType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' },
  { value: 'horizontal-bar', label: 'Horizontal Bar' },
  { value: 'treemap', label: 'Treemap' },
  { value: 'sankey', label: 'Sankey' },
  { value: 'waffle', label: 'Waffle' },
  { value: 'custom', label: 'Custom' },
];

export default function ChartGalleryPage() {
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ChartType | 'all'>('all');
  const [search, setSearch] = useState('');

  const allCharts = useMemo(() => {
    const entries: { key: string; entry: ReturnType<typeof getAllCharts> extends Map<string, infer V> ? V : never }[] = [];
    for (const [key, entry] of getAllCharts()) {
      entries.push({ key, entry });
    }
    return entries;
  }, []);

  const domainKeys = useMemo(() => {
    const set = new Set<string>();
    for (const { entry } of allCharts) set.add(entry.domain);
    return [...set];
  }, [allCharts]);

  const filtered = useMemo(() => {
    return allCharts.filter(({ entry }) => {
      if (domainFilter && entry.domain !== domainFilter) return false;
      if (typeFilter !== 'all' && entry.chartType !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.domain.toLowerCase().includes(q) ||
          entry.source.toLowerCase().includes(q) ||
          entry.sectionId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allCharts, domainFilter, typeFilter, search]);

  return (
    <>
      <SEOHead
        title="Chart Gallery — For Journalists — Indian Data Project"
        description="Browse 59+ interactive charts across 10 data domains. Download CSV, copy embed code, generate citations."
        path="/for-journalists/gallery"
        image="/og-journalists.png"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Chart Gallery
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {allCharts.length} charts across {domainKeys.length} domains.
            Download CSV, copy embed code, or generate a citation.
          </p>
        </div>

        {/* Sticky filter bar */}
        <div
          className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mb-6"
          style={{ background: 'var(--bg-void)', borderBottom: '1px solid var(--bg-raised)' }}
        >
          {/* Domain pills */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              onClick={() => setDomainFilter(null)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
              style={{
                background: !domainFilter ? 'var(--saffron)' : 'var(--bg-raised)',
                color: !domainFilter ? 'var(--bg-void)' : 'var(--text-secondary)',
                border: 'none',
              }}
            >
              All Domains
            </button>
            {domainKeys.map((dk) => {
              const meta = DOMAIN_META[dk];
              const isActive = domainFilter === dk;
              return (
                <button
                  key={dk}
                  onClick={() => setDomainFilter(isActive ? null : dk)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: isActive ? (meta?.accent ?? 'var(--saffron)') : 'var(--bg-raised)',
                    color: isActive ? 'var(--bg-void)' : 'var(--text-secondary)',
                    border: 'none',
                  }}
                >
                  {meta?.name ?? dk}
                </button>
              );
            })}
          </div>

          {/* Type pills + search */}
          <div className="flex flex-wrap items-center gap-2">
            {CHART_TYPE_OPTIONS.map((opt) => {
              const isActive = typeFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(isActive && opt.value !== 'all' ? 'all' : opt.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: isActive ? 'var(--bg-hover)' : 'var(--bg-raised)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: 'none',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
            <input
              type="text"
              placeholder="Search charts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-auto w-full sm:w-56 rounded-lg px-3 py-1.5 text-xs"
              style={{
                background: 'var(--bg-raised)',
                color: 'var(--text-primary)',
                border: '1px solid var(--bg-hover)',
              }}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {allCharts.length} charts
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ key, entry }) => (
            <ChartGalleryCard key={key} registryKey={key} entry={entry} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm py-16 text-center" style={{ color: 'var(--text-muted)' }}>
            No charts match your filters.
          </p>
        )}
      </div>
    </>
  );
}
