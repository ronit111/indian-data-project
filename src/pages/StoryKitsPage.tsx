import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { StoryKitCard } from '../components/multiplier/StoryKitCard.tsx';
import { ALL_STORY_KITS } from '../lib/storyKitConfigs/index.ts';
import { getChartEntry, getEmbedUrl, getPermalink } from '../lib/chartRegistry.ts';

export default function StoryKitsPage() {
  const location = useLocation();
  const detailRef = useRef<HTMLDivElement>(null);

  // Hash-based deep linking for individual kit
  const activeKitId = location.hash ? location.hash.slice(1) : null;
  const activeKit = activeKitId
    ? ALL_STORY_KITS.find((k) => k.id === activeKitId)
    : null;

  useEffect(() => {
    if (activeKitId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeKitId]);

  return (
    <>
      <SEOHead
        title="Story Kits — For Journalists — Indian Data Project"
        description="Curated data bundles with editorial context and story angles. Each kit combines charts from multiple domains into a ready-to-use narrative framework."
        path="/for-journalists/story-kits"
        image="/og-journalists.png"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        <div className="mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Story Kits
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Pre-assembled data bundles with editorial context and suggested story angles.
            Each kit combines charts from multiple domains into a coherent narrative.
          </p>
        </div>

        {/* Kit grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {ALL_STORY_KITS.map((kit) => (
            <StoryKitCard key={kit.id} kit={kit} />
          ))}
        </div>

        {/* Expanded kit detail */}
        {activeKit && (
          <div ref={detailRef} className="scroll-mt-24">
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-surface)' }}
            >
              {/* Kit header */}
              <div className="h-1" style={{ background: activeKit.accent }} />
              <div className="p-8">
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {activeKit.title}
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {activeKit.narrativeContext}
                </p>

                {/* Charts */}
                <div className="space-y-6 mb-8">
                  {activeKit.charts.map((chart, i) => {
                    const entry = getChartEntry(chart.registryKey);
                    if (!entry) return null;
                    const parts = chart.registryKey.split('/');
                    return (
                      <div
                        key={chart.registryKey}
                        className="rounded-lg p-5"
                        style={{ background: 'var(--bg-raised)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className="text-sm font-bold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {i + 1}. {entry.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <a
                              href={getEmbedUrl(parts[0], parts.slice(1).join('/'))}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] px-2 py-1 rounded"
                              style={{ background: 'var(--bg-hover)', color: 'var(--cyan)' }}
                            >
                              Preview
                            </a>
                            <a
                              href={getPermalink(parts[0], parts.slice(1).join('/'))}
                              className="text-[10px] px-2 py-1 rounded"
                              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
                            >
                              Permalink
                            </a>
                          </div>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {chart.caption}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Story angles */}
                <div className="mb-8">
                  <h3
                    className="text-sm font-bold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Suggested Story Angles
                  </h3>
                  <ul className="space-y-2">
                    {activeKit.suggestedAngles.map((angle, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span
                          className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                          style={{ background: `${activeKit.accent}20`, color: activeKit.accent }}
                        >
                          {i + 1}
                        </span>
                        {angle}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sources */}
                <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold uppercase tracking-wider">Sources:</span>
                  {activeKit.dataSources.join(' · ')}
                  <span className="ml-auto">Updated {activeKit.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
