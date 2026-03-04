/**
 * Cross-domain link pills — appear in scrollytelling sections to connect
 * related stories across data domains. Same visual family as RelatedTopics
 * but uses the target domain's accent color and a domain name prefix.
 */

import { Link } from 'react-router-dom';
import type { DomainId } from '../../lib/topicConfig.ts';
import { getCrossDomainLinks, DOMAIN_META } from '../../lib/crossDomainLinks.ts';

interface CrossDomainLinkProps {
  domain: DomainId;
  sectionId: string;
}

export function CrossDomainLink({ domain, sectionId }: CrossDomainLinkProps) {
  const links = getCrossDomainLinks(domain, sectionId);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {links.map((link) => {
        const meta = DOMAIN_META[link.toDomain];
        return (
          <Link
            key={`${link.toDomain}-${link.toSection}`}
            to={`${meta.route}#${link.toSection}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline transition-all duration-150 hover:brightness-125"
            style={{
              background: `${meta.accent}12`,
              color: meta.accent,
              border: `1px solid ${meta.accent}25`,
            }}
          >
            <span style={{ opacity: 0.7 }}>{meta.name}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{link.label}</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
