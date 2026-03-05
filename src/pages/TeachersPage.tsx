import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { ClassroomModeToggle } from '../components/multiplier/ClassroomModeToggle.tsx';
import { ALL_LESSON_PLANS } from '../lib/lessonPlanConfigs/index.ts';

export default function TeachersPage() {
  const subjectCounts = ALL_LESSON_PLANS.reduce(
    (acc, p) => {
      acc[p.subject] = (acc[p.subject] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <SEOHead
        title="For Teachers — Indian Data Project"
        description="NCERT-mapped lesson plans and classroom mode for teaching with real Indian government data. Economics, Political Science, and Geography."
        path="/for-teachers"
        image="/og-teachers.png"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        {/* Hero */}
        <section className="mb-12">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            For Teachers
          </h1>
          <p
            className="text-lg max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Turn textbook chapters into data-driven classroom sessions.
            Real government data, mapped to NCERT syllabi, with teaching notes and discussion questions.
          </p>
        </section>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <Link
            to="/for-teachers/lesson-plans"
            className="group block h-full rounded-xl overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1"
            style={{ background: 'var(--bg-surface)' }}
          >
            <div className="h-1" style={{ background: 'var(--saffron)' }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-base font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Lesson Plans
                </h2>
                <span className="text-xs font-mono" style={{ color: 'var(--saffron)' }}>
                  {ALL_LESSON_PLANS.length} plans
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                NCERT-mapped plans for Class 10-12. Each plan includes interactive charts,
                teaching notes, and discussion questions.
              </p>
              <div className="flex items-center gap-2">
                {Object.entries(subjectCounts).map(([subject, count]) => (
                  <span
                    key={subject}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
                  >
                    {subject === 'economics'
                      ? 'Economics'
                      : subject === 'political-science'
                        ? 'Pol. Science'
                        : 'Geography'}{' '}
                    ({count})
                  </span>
                ))}
              </div>
            </div>
          </Link>

          <div
            className="h-full rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-surface)' }}
          >
            <div className="h-1" style={{ background: 'var(--positive)' }} />
            <div className="p-6">
              <h2
                className="text-base font-bold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Classroom Mode
              </h2>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                Enable larger fonts and higher contrast for projecting charts
                in the classroom. Works on all pages.
              </p>
              <ClassroomModeToggle />
            </div>
          </div>
        </div>

        {/* How to use */}
        <section>
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            How to Use
          </h2>
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-raised)' }}
          >
            <Step n={1} title="Pick a plan" desc="Choose a lesson plan that matches your NCERT chapter. Each plan has 3-4 charts with teaching notes." />
            <Step n={2} title="Enable classroom mode" desc="Toggle classroom mode for larger fonts. Or add ?classroom=true to any URL when sharing with students." />
            <Step n={3} title="Project the charts" desc="Open chart links directly in the browser. Each chart is interactive — students can hover for details." />
            <Step n={4} title="Run the discussion" desc="Use the teaching notes and discussion questions. Each question is designed to connect data to textbook concepts." />
          </div>
        </section>
      </div>
    </>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ background: 'var(--bg-raised)', color: 'var(--saffron)' }}
      >
        {n}
      </span>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
