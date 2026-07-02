/**
 * Cross-link pills that appear in existing domain sections,
 * pointing users to relevant cross-domain topics.
 */

import { Link } from 'react-router-dom';
import { ALL_TOPICS } from '../../lib/topicConfigs/index.ts';
import type { DomainId } from '../../lib/topicConfig.ts';

interface RelatedTopicsProps {
  /** Section ID in the current domain (e.g. 'representation') */
  sectionId: string;
  /** Domain path prefix (e.g. 'elections') */
  domain: DomainId;
}

export function RelatedTopics({ sectionId, domain }: RelatedTopicsProps) {
  // Find topics whose crossLinks match this domain + sectionId
  const matches = ALL_TOPICS.filter((topic) =>
    topic.crossLinks.some(
      (cl) => cl.domain === domain && cl.sectionId === sectionId
    )
  ).slice(0, 2); // Max 2 pills to avoid clutter

  if (matches.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {matches.map((topic) => (
        <Link
          key={topic.id}
          to={`/topics/${topic.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline transition-[filter] duration-150 hover:brightness-125"
          style={{
            background: `${topic.accent}12`,
            color: topic.accent,
            border: `1px solid ${topic.accent}25`,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3H3v4M13 13H9V9M3 7l4-4M13 9l-4 4" />
          </svg>
          {topic.title}
        </Link>
      ))}
    </div>
  );
}
