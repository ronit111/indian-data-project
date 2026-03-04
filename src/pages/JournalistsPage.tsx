import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { getAllCharts } from '../lib/chartRegistry.ts';

const FEATURE_CARDS = [
  {
    to: '/for-journalists/gallery',
    title: 'Chart Gallery',
    description: 'Browse all charts with domain and type filters. Download CSV, copy embed code, or generate citations.',
    accent: 'var(--saffron)',
    stat: () => `${getAllCharts().size}+ charts`,
  },
  {
    to: '/for-journalists/story-kits',
    title: 'Story Kits',
    description: 'Curated data bundles with editorial context, suggested story angles, and pre-selected charts.',
    accent: 'var(--cyan)',
    stat: () => 'Curated narratives',
  },
  {
    to: '/for-journalists/embed-builder',
    title: 'Embed Builder',
    description: 'Build customizable iframe embeds for any chart. Live preview, copy-paste ready.',
    accent: 'var(--gold)',
    stat: () => 'Any chart, any size',
  },
];

export default function JournalistsPage() {
  return (
    <>
      <SEOHead
        title="For Journalists — Indian Data Project"
        description="Data tools for journalists: chart gallery, story kits, embed builder, and citation generator. Free, open data from 10 government sources."
        path="/for-journalists"
        image="/og-journalists.png"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        {/* Hero */}
        <section className="mb-16">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            For Journalists
          </h1>
          <p
            className="text-lg max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every chart, dataset, and embed on this portal is free to use with attribution.
            Build stories with real government data — no signup, no paywall.
          </p>
        </section>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {FEATURE_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group block rounded-xl overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div className="h-1" style={{ background: card.accent }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2
                    className="text-base font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {card.title}
                  </h2>
                  <span
                    className="text-xs font-mono"
                    style={{ color: card.accent }}
                  >
                    {card.stat()}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <section>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick Access
          </h2>
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)' }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <QuickLink
                to="/open-data"
                label="Open Data API"
                desc="Direct JSON access to all 80 endpoints"
              />
              <QuickLink
                to="/topics"
                label="Cross-Domain Topics"
                desc="12 thematic narratives weaving multiple datasets"
              />
              <QuickLink
                to="/budget"
                label="Union Budget Story"
                desc="Where Rs 50 lakh crore goes, visualized"
              />
              <QuickLink
                to="/elections"
                label="Elections Data"
                desc="Lok Sabha 1962-2024: turnout, parties, representation"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function QuickLink({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 p-3 rounded-lg no-underline transition-colors hover:bg-[var(--bg-raised)]"
    >
      <svg
        className="w-4 h-4 mt-0.5 shrink-0"
        fill="none"
        stroke="var(--text-muted)"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
      <div>
        <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {desc}
        </span>
      </div>
    </Link>
  );
}
