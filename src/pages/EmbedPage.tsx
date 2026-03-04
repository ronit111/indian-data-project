/**
 * Embed route: /embed/:domain/:section
 * Renders a standalone chart with minimal chrome for iframe embedding.
 * Loads only the specific data files listed in the registry entry.
 */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getChartEntry, DOMAIN_META } from '../lib/chartRegistry.ts';
import { EmbedShell } from '../components/embed/EmbedShell.tsx';
import { ChartRenderer } from '../components/embed/ChartRenderer.tsx';

export default function EmbedPage() {
  const { domain, section } = useParams<{ domain: string; section: string }>();
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const registryKey = `${domain}/${section}`;
  const entry = getChartEntry(registryKey);
  const meta = domain ? DOMAIN_META[domain] : undefined;

  // Handle missing entry during render (setState during render pattern)
  const [prevEntry, setPrevEntry] = useState(entry);
  if (prevEntry !== entry) {
    setPrevEntry(entry);
    if (!entry) {
      setError('Chart not found');
      setLoading(false);
    } else {
      setLoading(true);
      setError(null);
    }
  }

  useEffect(() => {
    if (!entry) return;

    // Load all data files for this chart
    Promise.all(entry.dataFiles.map((f) => fetch(f).then((r) => r.json())))
      .then((results) => {
        // If single file, use the data directly; if multiple, merge into object
        setData(results.length === 1 ? results[0] : results);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load chart data');
        setLoading(false);
      });
  }, [entry]);

  if (!entry || !meta) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#5c6a7e', background: '#06080f', minHeight: '100vh' }}>
        <h1 style={{ color: '#f0ece6', fontSize: '1.25rem' }}>Chart not found</h1>
        <p>The requested chart embed does not exist.</p>
        <a href="https://indiandataproject.org" style={{ color: '#4AEADC' }}>
          Visit Indian Data Project
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#5c6a7e', background: '#06080f', minHeight: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#f87171', background: '#06080f', minHeight: '100vh' }}>
        {error}
      </div>
    );
  }

  return (
    <EmbedShell
      title={entry.title}
      source={entry.source}
      accentColor={entry.accentColor}
      domainPath={meta.basePath}
      sectionId={entry.sectionId}
    >
      <ChartRenderer
        chartType={entry.chartType}
        data={data}
        domain={entry.domain}
        sectionId={entry.sectionId}
      />
    </EmbedShell>
  );
}
