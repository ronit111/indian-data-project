import { Link } from 'react-router-dom';
import type { TopicDeepLink } from '../../lib/topicConfig.ts';
import { DOMAIN_META } from '../../lib/chartRegistry.ts';

interface DeepLinksProps {
  links: TopicDeepLink[];
}

export function DeepLinks({ links }: DeepLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {links.map((link) => {
        const accent = DOMAIN_META[link.domain]?.accent ?? '#6B7280';
        return (
          <Link
            key={link.route}
            to={link.route}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium no-underline transition-[filter] duration-150 hover:brightness-125"
            style={{
              background: `${accent}12`,
              color: accent,
              border: `1px solid ${accent}20`,
            }}
          >
            {link.label}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
