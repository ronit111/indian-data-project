import { SEOHead } from '../components/seo/SEOHead.tsx';
import { EmbedConfigurator } from '../components/multiplier/EmbedConfigurator.tsx';

export default function EmbedBuilderPage() {
  return (
    <>
      <SEOHead
        title="Embed Builder — For Journalists — Indian Data Project"
        description="Build customizable embed codes for any chart on the Indian Data Project. Copy iframe snippets with live preview."
        path="/for-journalists/embed-builder"
        image="/og-journalists.png"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        <div className="mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Embed Builder
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Select any chart, customize the dimensions, and copy the embed code.
            Charts are responsive and work in any CMS or HTML page.
          </p>
        </div>

        <EmbedConfigurator />
      </div>
    </>
  );
}
