import { Link } from 'react-router-dom';
import type { StoryKitDef } from '../../lib/multiplierTypes.ts';

interface StoryKitCardProps {
  kit: StoryKitDef;
}

export function StoryKitCard({ kit }: StoryKitCardProps) {
  return (
    <Link
      to={`/for-journalists/story-kits#${kit.id}`}
      className="group block rounded-xl overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="h-0.5" style={{ background: kit.accent }} />
      <div className="p-6">
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {kit.title}
        </h3>
        <p className="text-xs mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {kit.subtitle}
        </p>
        <div className="flex items-center gap-3">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: `${kit.accent}20`, color: kit.accent }}
          >
            {kit.charts.length} charts
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: 'var(--bg-raised)', color: 'var(--text-muted)' }}
          >
            {kit.suggestedAngles.length} story angles
          </span>
        </div>
      </div>
    </Link>
  );
}
