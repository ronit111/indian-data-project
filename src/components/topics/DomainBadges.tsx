import type { DomainId } from '../../lib/topicConfig.ts';
import { DOMAIN_META } from '../../lib/chartRegistry.ts';

const DOMAIN_LABELS: Record<DomainId, string> = {
  budget: 'Budget',
  economy: 'Economy',
  rbi: 'RBI',
  states: 'States',
  census: 'Census',
  education: 'Education',
  employment: 'Employment',
  healthcare: 'Healthcare',
  environment: 'Environment',
  elections: 'Elections',
  crime: 'Crime',
};

interface DomainBadgesProps {
  domains: DomainId[];
  size?: 'sm' | 'md';
}

export function DomainBadges({ domains, size = 'sm' }: DomainBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {domains.map((d) => {
        const meta = DOMAIN_META[d];
        const accent = meta?.accent ?? '#6B7280';
        return (
          <span
            key={d}
            className={`inline-flex items-center rounded-full font-medium ${
              size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
            }`}
            style={{
              background: `${accent}18`,
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            {DOMAIN_LABELS[d]}
          </span>
        );
      })}
    </div>
  );
}
