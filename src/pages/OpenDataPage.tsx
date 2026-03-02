import { useState, useMemo } from 'react';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { CodeBlock } from '../components/multiplier/CodeBlock.tsx';
import { DataEndpointRow } from '../components/multiplier/DataEndpointRow.tsx';
import { DATA_ENDPOINTS } from '../lib/dataEndpoints.ts';
import { DOMAIN_META } from '../lib/chartRegistry.ts';

const DOMAIN_KEYS = [...new Set(DATA_ENDPOINTS.map((e) => e.domain))].filter(
  (d) => d !== 'all'
);

const CURL_EXAMPLE = `curl -s https://indiandataproject.org/data/budget/2025-26/summary.json | jq .`;

const PYTHON_EXAMPLE = `import requests

url = "https://indiandataproject.org/data/budget/2025-26/summary.json"
data = requests.get(url).json()
print(f"Total Expenditure: ₹{data['totalExpenditure']} lakh crore")`;

const JS_EXAMPLE = `const res = await fetch(
  "https://indiandataproject.org/data/budget/2025-26/summary.json"
);
const data = await res.json();
console.log(\`Total Expenditure: ₹\${data.totalExpenditure} lakh crore\`);`;

export default function OpenDataPage() {
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return DATA_ENDPOINTS.filter((ep) => {
      if (domainFilter && ep.domain !== domainFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          ep.file.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q) ||
          ep.domain.toLowerCase().includes(q) ||
          ep.schema.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [domainFilter, search]);

  return (
    <>
      <SEOHead
        title="Open Data API — Indian Data Project"
        description="Free, open JSON API for Indian government data. 71 endpoints across 10 domains — budget, economy, RBI, states, census, education, employment, healthcare, environment, and elections."
        path="/open-data"
        image="/og-open-data.png"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        {/* Hero */}
        <section className="mb-16">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Open Data
          </h1>
          <p
            className="text-lg max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every dataset on this portal is a static JSON file with CORS enabled.
            No API key. No rate limit. No signup. Just fetch and build.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--bg-raised)', color: 'var(--cyan)' }}
            >
              {DATA_ENDPOINTS.length} endpoints
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--bg-raised)', color: 'var(--saffron)' }}
            >
              10 domains
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--bg-raised)', color: 'var(--positive)' }}
            >
              CORS enabled
            </span>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-16">
          <h2
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick Start
          </h2>
          <div className="grid gap-4">
            <CodeBlock code={CURL_EXAMPLE} language="bash" />
            <CodeBlock code={PYTHON_EXAMPLE} language="python" />
            <CodeBlock code={JS_EXAMPLE} language="javascript" />
          </div>
        </section>

        {/* Data Browser */}
        <section className="mb-16">
          <h2
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Data Browser
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setDomainFilter(null)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
              style={{
                background: !domainFilter ? 'var(--saffron)' : 'var(--bg-raised)',
                color: !domainFilter ? 'var(--bg-void)' : 'var(--text-secondary)',
                border: 'none',
              }}
            >
              All ({DATA_ENDPOINTS.length})
            </button>
            {DOMAIN_KEYS.map((dk) => {
              const count = DATA_ENDPOINTS.filter((e) => e.domain === dk).length;
              const meta = DOMAIN_META[dk];
              const isActive = domainFilter === dk;
              return (
                <button
                  key={dk}
                  onClick={() => setDomainFilter(isActive ? null : dk)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: isActive
                      ? (meta?.accent ?? 'var(--saffron)')
                      : 'var(--bg-raised)',
                    color: isActive ? 'var(--bg-void)' : 'var(--text-secondary)',
                    border: 'none',
                  }}
                >
                  {meta?.name ?? dk} ({count})
                </button>
              );
            })}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 rounded-lg px-4 py-2.5 text-sm mb-6"
            style={{
              background: 'var(--bg-raised)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-hover)',
            }}
          />

          {/* Results */}
          <div className="space-y-3">
            {filtered.map((ep) => (
              <DataEndpointRow key={ep.path} endpoint={ep} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                No endpoints match your search.
              </p>
            )}
          </div>
        </section>

        {/* Usage & Attribution */}
        <section>
          <h2
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Usage & Attribution
          </h2>
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)' }}
          >
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                CORS
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                All endpoints serve <code className="font-mono">Access-Control-Allow-Origin: *</code>.
                Fetch from any origin, including localhost.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Caching
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Files are served from Vercel's CDN with immutable hashing. Data updates
                propagate within minutes of a pipeline run. No cache-busting needed on your end.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Attribution
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Please credit the original data source (listed per endpoint above) and
                link back to <code className="font-mono">indiandataproject.org</code>. This is open data
                assembled from government sources — not our proprietary dataset.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                License
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Portal code is{' '}
                <a
                  href="https://github.com/ronit111/indian-data-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--cyan)' }}
                >
                  AGPL-3.0
                </a>
                . Underlying data follows its original government license (typically GODL or public domain).
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
