import { SEOHead } from '../components/seo/SEOHead.tsx';
import { CodeBlock } from '../components/multiplier/CodeBlock.tsx';

const FORK_EXAMPLE = `# Clone the repo
git clone https://github.com/ronit111/indian-data-project.git
cd indian-data-project

# Install and run
npm install
npm run dev`;

export default function ContributePage() {
  return (
    <>
      <SEOHead
        title="Contribute — Indian Data Project"
        description="How to use the data, report issues, contribute datasets, and improve the Indian Data Project."
        path="/contribute"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Contribute
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>
          Indian Data Project is open source under AGPL-3.0. Here's how you can help.
        </p>

        <div className="space-y-10">
          <Section title="Use the Data">
            <p>
              Every dataset is a static JSON file with CORS enabled. No API key, no rate limit.
              See the <a href="/open-data" style={{ color: 'var(--cyan)' }}>Open Data page</a> for
              the full endpoint catalog and code examples.
            </p>
            <p>
              Attribution is appreciated: credit the original data source and link
              to <code className="font-mono">indiandataproject.org</code>.
            </p>
          </Section>

          <Section title="Report Issues">
            <p>
              Found a bug, stale data, or incorrect number? Open an issue on GitHub:
            </p>
            <a
              href="https://github.com/ronit111/indian-data-project/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors"
              style={{ background: 'var(--bg-raised)', color: 'var(--text-primary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Open an Issue
            </a>
          </Section>

          <Section title="Contribute Code">
            <p>
              The portal is React 19 + TypeScript + Vite + Tailwind v4 with D3 visualizations.
              Fork the repo and submit a pull request:
            </p>
            <CodeBlock code={FORK_EXAMPLE} language="bash" />
            <p className="mt-4">
              The data pipeline is in <code className="font-mono">pipeline/</code> (Python + Pydantic).
              Each domain has its own pipeline that fetches from authoritative sources.
            </p>
          </Section>

          <Section title="Contribute Datasets">
            <p>
              We're always looking for new data domains. If you have access to clean,
              authoritative Indian government data that would benefit citizens, open
              a discussion:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Data must come from an authoritative government source</li>
              <li>No mock, fake, or scraped data — we verify every number</li>
              <li>Include source URLs and methodology</li>
              <li>Prefer machine-readable formats (JSON, CSV, API)</li>
            </ul>
          </Section>

          <Section title="License">
            <p>
              Code:{' '}
              <a
                href="https://www.gnu.org/licenses/agpl-3.0.en.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--cyan)' }}
              >
                AGPL-3.0
              </a>
              . Data: follows original government source licenses (typically GODL or public domain).
            </p>
            <p>
              This means you can freely use, modify, and distribute the code and data,
              as long as derivative works are also open source.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-lg font-bold mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      <div className="text-sm space-y-3" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </section>
  );
}
