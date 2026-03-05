import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CategoryGroup {
  label: string;
  domainIds: string[];
  accent: string;
}

const CATEGORIES: CategoryGroup[] = [
  { label: 'Money', domainIds: ['budget', 'economy', 'rbi', 'states'], accent: 'var(--saffron)' },
  { label: 'People', domainIds: ['census', 'education', 'employment', 'healthcare'], accent: 'var(--cyan)' },
  { label: 'Society', domainIds: ['environment', 'elections', 'crime'], accent: 'var(--violet)' },
];

const DOMAIN_LABELS: Record<string, string> = {
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

const DOMAIN_ACCENTS: Record<string, string> = {
  budget: 'var(--saffron)',
  economy: 'var(--cyan)',
  rbi: 'var(--gold)',
  states: 'var(--emerald)',
  census: 'var(--violet)',
  education: 'var(--blue)',
  employment: 'var(--amber)',
  healthcare: 'var(--rose)',
  environment: 'var(--teal)',
  elections: 'var(--indigo)',
  crime: 'var(--crimson)',
};

interface CategoryNavProps {
  /** ID of the sentinel element that marks where stickiness begins */
  sentinelId: string;
}

export function CategoryNav({ sentinelId }: CategoryNavProps) {
  const [isStuck, setIsStuck] = useState(false);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Detect when the nav becomes sticky
  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel scrolls out of view, nav is stuck
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' } // offset for header height
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelId]);

  // Track which domain card is in view
  const updateActiveDomain = useCallback(() => {
    const allDomainIds = CATEGORIES.flatMap((c) => c.domainIds);
    const viewportMid = window.innerHeight * 0.4;
    let closest: string | null = null;
    let closestDist = Infinity;

    for (const id of allDomainIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.top - viewportMid);
      if (rect.top < window.innerHeight && rect.bottom > 0 && dist < closestDist) {
        closestDist = dist;
        closest = id;
      }
    }
    // If no domain is in view (scrolled past all), keep the last active domain
    if (closest !== null) {
      setActiveDomain(closest);
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateActiveDomain();
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateActiveDomain]);

  const scrollToDomain = (domainId: string) => {
    const el = document.getElementById(domainId);
    if (el) {
      const headerOffset = 120; // header + sticky nav height
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={navRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="sticky z-40 transition-all duration-300"
      style={{
        top: '56px', // below header
        backdropFilter: isStuck ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isStuck ? 'blur(16px)' : 'none',
        background: isStuck ? 'rgba(6,8,15,0.85)' : 'transparent',
        borderBottom: isStuck ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <nav
          className="flex gap-1 py-2.5 overflow-x-auto hide-scrollbar pr-4"
          aria-label="Domain categories"
        >
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="flex items-center gap-1 shrink-0">
              <span
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 shrink-0"
                style={{ color: 'var(--text-muted)', opacity: 0.6 }}
              >
                {cat.label}
              </span>
              {cat.domainIds.map((domainId) => {
                const isActive = activeDomain === domainId;
                const accent = DOMAIN_ACCENTS[domainId];
                return (
                  <button
                    key={domainId}
                    onClick={() => scrollToDomain(domainId)}
                    className="shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      background: isActive ? `color-mix(in srgb, ${accent} 15%, transparent)` : 'transparent',
                      color: isActive ? accent : 'var(--text-muted)',
                      border: `1px solid ${isActive ? `color-mix(in srgb, ${accent} 25%, transparent)` : 'transparent'}`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg-raised)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    {DOMAIN_LABELS[domainId]}
                  </button>
                );
              })}
              {/* Subtle separator between groups */}
              {cat !== CATEGORIES[CATEGORIES.length - 1] && (
                <div
                  className="w-px h-4 mx-1.5 shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
