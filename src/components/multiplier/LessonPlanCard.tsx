import { Link } from 'react-router-dom';
import type { LessonPlanDef } from '../../lib/multiplierTypes.ts';

interface LessonPlanCardProps {
  plan: LessonPlanDef;
}

const SUBJECT_LABELS: Record<string, string> = {
  economics: 'Economics',
  'political-science': 'Political Science',
  geography: 'Geography',
};

export function LessonPlanCard({ plan }: LessonPlanCardProps) {
  return (
    <Link
      to={`/for-teachers/lesson-plans#${plan.id}`}
      className="group block rounded-xl overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="h-0.5" style={{ background: plan.accent }} />
      <div className="p-6">
        {/* Class + subject badges */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: `${plan.accent}20`, color: plan.accent }}
          >
            Class {plan.class}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
          >
            {SUBJECT_LABELS[plan.subject] ?? plan.subject}
          </span>
        </div>

        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {plan.title}
        </h3>
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {plan.subtitle}
        </p>
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {plan.charts.length} visualizations · {plan.chapter}
        </p>
      </div>
    </Link>
  );
}
