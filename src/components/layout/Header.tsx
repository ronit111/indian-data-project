import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUIStore } from '../../store/uiStore.ts';

export function Header() {
  const location = useLocation();
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.06]);

  const isBudgetSection = location.pathname.startsWith('/budget');
  const isEconomySection = location.pathname.startsWith('/economy');
  const isRBISection = location.pathname.startsWith('/rbi');
  const isStatesSection = location.pathname.startsWith('/states');
  const isCensusSection = location.pathname.startsWith('/census');
  const isEducationSection = location.pathname.startsWith('/education');
  const isEmploymentSection = location.pathname.startsWith('/employment');
  const isHealthcareSection = location.pathname.startsWith('/healthcare');
  const isEnvironmentSection = location.pathname.startsWith('/environment');
  const isElectionsSection = location.pathname.startsWith('/elections');
  const isCrimeSection = location.pathname.startsWith('/crime');
  const isTopicsSection = location.pathname.startsWith('/topics');
  const isOpenDataSection = location.pathname === '/open-data';
  const isJournalistsSection = location.pathname.startsWith('/for-journalists');
  const isTeachersSection = location.pathname.startsWith('/for-teachers');
  const isContributeSection = location.pathname === '/contribute';
  const isMultiplierSection = isOpenDataSection || isJournalistsSection || isTeachersSection || isContributeSection;
  const isDataDomain = isBudgetSection || isEconomySection || isRBISection || isStatesSection || isCensusSection || isEducationSection || isEmploymentSection || isHealthcareSection || isEnvironmentSection || isElectionsSection || isCrimeSection || isTopicsSection || isMultiplierSection;

  // Context-aware title: show story name when inside a data story
  const headerTitle = isBudgetSection
    ? 'Budget 2025-26'
    : isEconomySection
      ? 'Economic Survey 2025-26'
      : isRBISection
        ? 'RBI Data'
        : isStatesSection
          ? 'State Finances'
          : isCensusSection
            ? 'Census & Demographics'
            : isEducationSection
              ? 'Education'
              : isEmploymentSection
                ? 'Employment'
                : isHealthcareSection
                  ? 'Healthcare'
                  : isEnvironmentSection
                    ? 'Environment'
                    : isElectionsSection
                      ? 'Elections'
                      : isCrimeSection
                        ? 'Crime & Safety'
                        : isTopicsSection
                          ? 'Cross-Domain Insights'
                        : isOpenDataSection
                          ? 'Open Data'
                          : isJournalistsSection
                            ? 'For Journalists'
                            : isTeachersSection
                              ? 'For Teachers'
                              : isContributeSection
                                ? 'Contribute'
                  : 'Indian Data Project';
  const headerLink = isBudgetSection
    ? '/budget'
    : isEconomySection
      ? '/economy'
      : isRBISection
        ? '/rbi'
        : isStatesSection
          ? '/states'
          : isCensusSection
            ? '/census'
            : isEducationSection
              ? '/education'
              : isEmploymentSection
                ? '/employment'
                : isHealthcareSection
                  ? '/healthcare'
                  : isEnvironmentSection
                    ? '/environment'
                    : isElectionsSection
                      ? '/elections'
                      : isCrimeSection
                        ? '/crime'
                        : isTopicsSection
                          ? '/topics'
                        : isOpenDataSection
                          ? '/open-data'
                          : isJournalistsSection
                            ? '/for-journalists'
                            : isTeachersSection
                              ? '/for-teachers'
                              : isContributeSection
                                ? '/contribute'
                  : '/';

  // Only show nav links inside a data story (domain sub-pages)
  const navLinks = isBudgetSection
    ? [
        { to: '/budget', label: 'Story' },
        { to: '/budget/explore', label: 'Explore' },
        { to: '/budget/calculator', label: 'Your Share' },
        { to: '/budget/methodology', label: 'Methodology' },
        { to: '/budget/glossary', label: 'Glossary' },
      ]
    : isEconomySection
      ? [
          { to: '/economy', label: 'Story' },
          { to: '/economy/explore', label: 'Explore' },
          { to: '/economy/calculator', label: 'Your Cost' },
          { to: '/economy/methodology', label: 'Methodology' },
          { to: '/economy/glossary', label: 'Glossary' },
        ]
      : isRBISection
        ? [
            { to: '/rbi', label: 'Story' },
            { to: '/rbi/explore', label: 'Explore' },
            { to: '/rbi/calculator', label: 'EMI Calc' },
            { to: '/rbi/methodology', label: 'Methodology' },
            { to: '/rbi/glossary', label: 'Glossary' },
          ]
        : isStatesSection
          ? [
              { to: '/states', label: 'Story' },
              { to: '/states/explore', label: 'Explore' },
              { to: '/states/your-state', label: 'Your State' },
              { to: '/states/methodology', label: 'Methodology' },
              { to: '/states/glossary', label: 'Glossary' },
            ]
          : isCensusSection
            ? [
                { to: '/census', label: 'Story' },
                { to: '/census/explore', label: 'Explore' },
                { to: '/census/methodology', label: 'Methodology' },
                { to: '/census/glossary', label: 'Glossary' },
              ]
            : isEducationSection
              ? [
                  { to: '/education', label: 'Story' },
                  { to: '/education/explore', label: 'Explore' },
                  { to: '/education/methodology', label: 'Methodology' },
                  { to: '/education/glossary', label: 'Glossary' },
                ]
              : isEmploymentSection
                ? [
                    { to: '/employment', label: 'Story' },
                    { to: '/employment/explore', label: 'Explore' },
                    { to: '/employment/methodology', label: 'Methodology' },
                    { to: '/employment/glossary', label: 'Glossary' },
                  ]
                : isHealthcareSection
                  ? [
                      { to: '/healthcare', label: 'Story' },
                      { to: '/healthcare/explore', label: 'Explore' },
                      { to: '/healthcare/methodology', label: 'Methodology' },
                      { to: '/healthcare/glossary', label: 'Glossary' },
                    ]
                  : isEnvironmentSection
                    ? [
                        { to: '/environment', label: 'Story' },
                        { to: '/environment/explore', label: 'Explore' },
                        { to: '/environment/methodology', label: 'Methodology' },
                        { to: '/environment/glossary', label: 'Glossary' },
                      ]
                    : isElectionsSection
                      ? [
                          { to: '/elections', label: 'Story' },
                          { to: '/elections/explore', label: 'Explore' },
                          { to: '/elections/methodology', label: 'Methodology' },
                          { to: '/elections/glossary', label: 'Glossary' },
                        ]
                      : isCrimeSection
                        ? [
                            { to: '/crime', label: 'Story' },
                            { to: '/crime/explore', label: 'Explore' },
                            { to: '/crime/methodology', label: 'Methodology' },
                            { to: '/crime/glossary', label: 'Glossary' },
                          ]
                        : isTopicsSection
                        ? [
                            { to: '/topics', label: 'All Topics' },
                          ]
                        : isJournalistsSection
                          ? [
                              { to: '/for-journalists', label: 'Overview' },
                              { to: '/for-journalists/gallery', label: 'Gallery' },
                              { to: '/for-journalists/story-kits', label: 'Story Kits' },
                              { to: '/for-journalists/embed-builder', label: 'Embed Builder' },
                            ]
                          : isTeachersSection
                            ? [
                                { to: '/for-teachers', label: 'Overview' },
                                { to: '/for-teachers/lesson-plans', label: 'Lesson Plans' },
                              ]
                  : [];

  const isActiveLink = (linkTo: string) => {
    if (linkTo === '/budget') return location.pathname === '/budget';
    if (linkTo === '/economy') return location.pathname === '/economy';
    if (linkTo === '/rbi') return location.pathname === '/rbi';
    if (linkTo === '/states') return location.pathname === '/states';
    if (linkTo === '/census') return location.pathname === '/census';
    if (linkTo === '/education') return location.pathname === '/education';
    if (linkTo === '/employment') return location.pathname === '/employment';
    if (linkTo === '/healthcare') return location.pathname === '/healthcare';
    if (linkTo === '/environment') return location.pathname === '/environment';
    if (linkTo === '/elections') return location.pathname === '/elections';
    if (linkTo === '/crime') return location.pathname === '/crime';
    if (linkTo === '/topics') return location.pathname === '/topics';
    if (linkTo === '/for-journalists') return location.pathname === '/for-journalists';
    if (linkTo === '/for-teachers') return location.pathname === '/for-teachers';
    return location.pathname === linkTo;
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--bg-void)',
          opacity: bgOpacity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          backgroundColor: 'white',
          opacity: borderOpacity,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDataDomain && (
            <Link
              to="/#stories"
              className="flex items-center no-underline p-1.5 -ml-1.5 rounded-md transition-colors hover:bg-[var(--bg-raised)]"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Back to hub"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </Link>
          )}
          <Link to={headerLink} className="flex items-center gap-2 no-underline">
            <span className={`text-lg font-bold ${isDataDomain && !isMultiplierSection ? 'gradient-text-saffron' : 'gradient-text-tricolor'}`}>
              {headerTitle}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-sm font-medium no-underline rounded-lg transition-all duration-150 hover:bg-[var(--bg-raised)]"
                style={{
                  color: isActive
                    ? 'var(--text-primary)'
                    : 'var(--text-secondary)',
                }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--saffron)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {navLinks.length > 0 && (
            <div className="w-px h-5 mx-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
          )}

          <button
            onClick={toggleSearch}
            className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-raised)]"
            style={{
              color: 'var(--text-muted)',
              background: 'transparent',
              border: 'none',
            }}
            aria-label="Search"
            title="Search (Cmd+K)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
