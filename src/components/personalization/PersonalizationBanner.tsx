import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalizationStore } from '../../store/personalizationStore.ts';

/**
 * Domain-specific stat messages shown in the banner.
 * Kept as static placeholder text since we don't load domain data
 * in the banner (too expensive). The state name is the value.
 */
function getDomainContext(pathname: string): string | null {
  if (pathname.startsWith('/budget')) return 'budget';
  if (pathname.startsWith('/economy')) return 'economy';
  if (pathname.startsWith('/rbi')) return 'rbi';
  if (pathname.startsWith('/states')) return 'states';
  if (pathname.startsWith('/census')) return 'census';
  if (pathname.startsWith('/education')) return 'education';
  if (pathname.startsWith('/employment')) return 'employment';
  if (pathname.startsWith('/healthcare')) return 'healthcare';
  if (pathname.startsWith('/environment')) return 'environment';
  if (pathname.startsWith('/elections')) return 'elections';
  if (pathname.startsWith('/crime')) return 'crime';
  return null;
}

const DOMAIN_LABELS: Record<string, string> = {
  budget: 'Viewing budget data',
  economy: 'Viewing economic indicators',
  rbi: 'National data (no state breakdown)',
  states: 'Viewing state finances',
  census: 'Viewing census data',
  education: 'Viewing education data',
  employment: 'Viewing employment data',
  healthcare: 'Viewing healthcare data',
  environment: 'Viewing environment data',
  elections: 'Viewing election data',
  crime: 'Viewing crime & safety data',
};

export function PersonalizationBanner() {
  const { selectedStateId, selectedStateName, bannerDismissed, dismissBanner } =
    usePersonalizationStore();
  const location = useLocation();

  const domain = getDomainContext(location.pathname);

  // Don't show on hub page, or if no state selected, or if this domain is dismissed
  if (!domain || !selectedStateId || !selectedStateName) return null;
  if (bannerDismissed[domain]) return null;
  // Don't show on calculator pages (they have their own state selectors)
  if (location.pathname.includes('/calculator') || location.pathname.includes('/your-state')) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
        style={{ background: 'var(--bg-raised)', borderBottom: 'var(--border-subtle)' }}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 flex items-center justify-between h-10">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--cyan)' }}
            />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {selectedStateName}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              · {DOMAIN_LABELS[domain] ?? ''}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/states/your-state"
              className="text-[10px] font-medium px-2 py-0.5 rounded"
              style={{ background: 'var(--bg-surface)', color: 'var(--cyan)' }}
            >
              Full report →
            </a>
            <button
              onClick={() => dismissBanner(domain)}
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Dismiss banner"
            >
              ×
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
