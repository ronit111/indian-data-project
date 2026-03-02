import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { LessonPlanCard } from '../components/multiplier/LessonPlanCard.tsx';
import { ALL_LESSON_PLANS } from '../lib/lessonPlanConfigs/index.ts';
import { getChartEntry, getEmbedUrl, getPermalink } from '../lib/chartRegistry.ts';
import type { NCERTSubject, NCERTClass } from '../lib/multiplierTypes.ts';

const CLASS_OPTIONS: NCERTClass[] = [10, 11, 12];
const SUBJECT_OPTIONS: { value: NCERTSubject; label: string }[] = [
  { value: 'economics', label: 'Economics' },
  { value: 'political-science', label: 'Political Science' },
  { value: 'geography', label: 'Geography' },
];

export default function LessonPlansPage() {
  const location = useLocation();
  const detailRef = useRef<HTMLDivElement>(null);

  const [classFilter, setClassFilter] = useState<NCERTClass | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<NCERTSubject | null>(null);

  const activeId = location.hash ? location.hash.slice(1) : null;
  const activePlan = activeId
    ? ALL_LESSON_PLANS.find((p) => p.id === activeId)
    : null;

  useEffect(() => {
    if (activeId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeId]);

  const filtered = useMemo(() => {
    return ALL_LESSON_PLANS.filter((p) => {
      if (classFilter && p.class !== classFilter) return false;
      if (subjectFilter && p.subject !== subjectFilter) return false;
      return true;
    });
  }, [classFilter, subjectFilter]);

  return (
    <>
      <SEOHead
        title="Lesson Plans — For Teachers — Indian Data Project"
        description="NCERT-mapped lesson plans using real Indian government data. Economics, Political Science, and Geography for Class 10-12."
        path="/for-teachers/lesson-plans"
        image="/og-teachers.png"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12">
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Lesson Plans
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            NCERT-mapped plans using real government data. Each plan includes teaching notes,
            discussion questions, and interactive chart references.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider mr-2" style={{ color: 'var(--text-muted)' }}>
            Class
          </span>
          <button
            onClick={() => setClassFilter(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
            style={{
              background: !classFilter ? 'var(--saffron)' : 'var(--bg-raised)',
              color: !classFilter ? 'var(--bg-void)' : 'var(--text-secondary)',
              border: 'none',
            }}
          >
            All
          </button>
          {CLASS_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setClassFilter(classFilter === c ? null : c)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
              style={{
                background: classFilter === c ? 'var(--saffron)' : 'var(--bg-raised)',
                color: classFilter === c ? 'var(--bg-void)' : 'var(--text-secondary)',
                border: 'none',
              }}
            >
              Class {c}
            </button>
          ))}

          <div className="w-px h-5 mx-2" style={{ background: 'var(--bg-raised)' }} />

          <span className="text-xs font-bold uppercase tracking-wider mr-2" style={{ color: 'var(--text-muted)' }}>
            Subject
          </span>
          <button
            onClick={() => setSubjectFilter(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
            style={{
              background: !subjectFilter ? 'var(--cyan)' : 'var(--bg-raised)',
              color: !subjectFilter ? 'var(--bg-void)' : 'var(--text-secondary)',
              border: 'none',
            }}
          >
            All
          </button>
          {SUBJECT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSubjectFilter(subjectFilter === s.value ? null : s.value)}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
              style={{
                background: subjectFilter === s.value ? 'var(--cyan)' : 'var(--bg-raised)',
                color: subjectFilter === s.value ? 'var(--bg-void)' : 'var(--text-secondary)',
                border: 'none',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filtered.map((plan) => (
            <LessonPlanCard key={plan.id} plan={plan} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm col-span-full text-center py-8" style={{ color: 'var(--text-muted)' }}>
              No lesson plans match your filters.
            </p>
          )}
        </div>

        {/* Expanded detail */}
        {activePlan && (
          <div ref={detailRef} className="scroll-mt-24">
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
              <div className="h-1" style={{ background: activePlan.accent }} />
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: `${activePlan.accent}20`, color: activePlan.accent }}
                  >
                    Class {activePlan.class}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
                  >
                    {SUBJECT_OPTIONS.find((s) => s.value === activePlan.subject)?.label ?? activePlan.subject}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {activePlan.title}
                </h2>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  {activePlan.chapter}
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {activePlan.subtitle}
                </p>

                {/* Learning objectives */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Learning Objectives
                  </h3>
                  <ul className="space-y-1">
                    {activePlan.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="text-[10px] mt-0.5" style={{ color: activePlan.accent }}>●</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Charts with teaching notes */}
                <div className="space-y-6 mb-8">
                  {activePlan.charts.map((chart, i) => {
                    const entry = getChartEntry(chart.registryKey);
                    if (!entry) return null;
                    const parts = chart.registryKey.split('/');
                    return (
                      <div key={chart.registryKey} className="rounded-lg p-5" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {i + 1}. {entry.title}
                          </h3>
                          <a
                            href={getEmbedUrl(parts[0], parts.slice(1).join('/'))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] px-2 py-1 rounded"
                            style={{ background: 'var(--bg-hover)', color: 'var(--cyan)' }}
                          >
                            Open chart
                          </a>
                        </div>

                        {/* Teaching note */}
                        <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(74,234,220,0.05)', border: '1px solid rgba(74,234,220,0.1)' }}>
                          <p className="text-xs font-medium mb-1" style={{ color: 'var(--cyan)' }}>Teaching Note</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{chart.teachingNote}</p>
                        </div>

                        {/* Discussion questions */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                            Discussion Questions
                          </p>
                          <ul className="space-y-1">
                            {chart.discussionQuestions.map((q, j) => (
                              <li key={j} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <span className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Q{j + 1}</span>
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Permalink for embedding in class */}
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--bg-hover)' }}>
                          <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            Link: indiandataproject.org{getPermalink(parts[0], parts.slice(1).join('/'))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Wrap-up questions */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Wrap-Up Questions
                  </h3>
                  <ul className="space-y-2">
                    {activePlan.wrapUpQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span
                          className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                          style={{ background: `${activePlan.accent}20`, color: activePlan.accent }}
                        >
                          {i + 1}
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Further reading */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Further Reading
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activePlan.furtherReading.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium no-underline transition-colors"
                        style={{ background: 'var(--bg-hover)', color: 'var(--cyan)' }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
