import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// SVG path data for tab icons
const ICONS = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  budget: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  economy: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  rbi: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  explore: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  calculator: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  methodology: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  glossary: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  states: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  census: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  education: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  employment: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M3 8a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z',
  healthcare: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  environment: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  elections: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  crime: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  topics: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  reportCard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
};

export function MobileNav() {
  const location = useLocation();
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

  const hubTabs = [
    { to: '/', label: 'Home', icon: ICONS.home },
    { to: '/budget', label: 'Budget', icon: ICONS.budget },
    { to: '/economy', label: 'Economy', icon: ICONS.economy },
    { to: '/rbi', label: 'RBI', icon: ICONS.rbi },
    { to: '/states', label: 'States', icon: ICONS.states },
    { to: '/census', label: 'Census', icon: ICONS.census },
    { to: '/education', label: 'Education', icon: ICONS.education },
    { to: '/employment', label: 'Jobs', icon: ICONS.employment },
    { to: '/healthcare', label: 'Health', icon: ICONS.healthcare },
    { to: '/environment', label: 'Environ.', icon: ICONS.environment },
    { to: '/elections', label: 'Elections', icon: ICONS.elections },
    { to: '/crime', label: 'Crime', icon: ICONS.crime },
    { to: '/topics', label: 'Topics', icon: ICONS.topics },
  ];

  const topicsTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/topics', label: 'Topics', icon: ICONS.topics },
  ];

  const budgetTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/budget', label: 'Story', icon: ICONS.budget },
    { to: '/budget/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/budget/calculator', label: 'Your Share', icon: ICONS.calculator },
    { to: '/budget/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/budget/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const economyTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/economy', label: 'Story', icon: ICONS.economy },
    { to: '/economy/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/economy/calculator', label: 'Your Cost', icon: ICONS.calculator },
    { to: '/economy/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/economy/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const rbiTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/rbi', label: 'Story', icon: ICONS.rbi },
    { to: '/rbi/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/rbi/calculator', label: 'EMI Calc', icon: ICONS.calculator },
    { to: '/rbi/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/rbi/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const statesTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/states', label: 'Story', icon: ICONS.states },
    { to: '/states/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/states/your-state', label: 'Your State', icon: ICONS.reportCard },
    { to: '/states/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/states/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const censusTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/census', label: 'Story', icon: ICONS.census },
    { to: '/census/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/census/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/census/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const educationTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/education', label: 'Story', icon: ICONS.education },
    { to: '/education/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/education/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/education/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const employmentTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/employment', label: 'Story', icon: ICONS.employment },
    { to: '/employment/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/employment/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/employment/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const healthcareTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/healthcare', label: 'Story', icon: ICONS.healthcare },
    { to: '/healthcare/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/healthcare/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/healthcare/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const environmentTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/environment', label: 'Story', icon: ICONS.environment },
    { to: '/environment/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/environment/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/environment/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const electionsTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/elections', label: 'Story', icon: ICONS.elections },
    { to: '/elections/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/elections/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/elections/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const crimeTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/crime', label: 'Story', icon: ICONS.crime },
    { to: '/crime/explore', label: 'Explore', icon: ICONS.explore },
    { to: '/crime/methodology', label: 'Methods', icon: ICONS.methodology },
    { to: '/crime/glossary', label: 'Glossary', icon: ICONS.glossary },
  ];

  const journalistsTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/for-journalists', label: 'Overview', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { to: '/for-journalists/gallery', label: 'Gallery', icon: ICONS.explore },
    { to: '/for-journalists/story-kits', label: 'Kits', icon: ICONS.glossary },
    { to: '/for-journalists/embed-builder', label: 'Embed', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ];

  const teachersTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/for-teachers', label: 'Overview', icon: ICONS.education },
    { to: '/for-teachers/lesson-plans', label: 'Plans', icon: ICONS.glossary },
  ];

  const multiplierTabs = [
    { to: '/', label: 'Hub', icon: ICONS.home },
    { to: '/open-data', label: 'Data', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
  ];

  const tabs = isBudgetSection
    ? budgetTabs
    : isEconomySection
      ? economyTabs
      : isRBISection
        ? rbiTabs
        : isStatesSection
          ? statesTabs
          : isCensusSection
            ? censusTabs
            : isEducationSection
              ? educationTabs
              : isEmploymentSection
                ? employmentTabs
                : isHealthcareSection
                  ? healthcareTabs
                  : isEnvironmentSection
                    ? environmentTabs
                    : isElectionsSection
                      ? electionsTabs
                      : isCrimeSection
                        ? crimeTabs
                        : isTopicsSection
                          ? topicsTabs
                          : isJournalistsSection
                          ? journalistsTabs
                          : isTeachersSection
                            ? teachersTabs
                            : isMultiplierSection
                              ? multiplierTabs
                    : hubTabs;

  const isActiveTab = (tabTo: string) => {
    if (tabTo === '/') return location.pathname === '/';
    if (tabTo === '/budget') return location.pathname === '/budget';
    if (tabTo === '/economy') return location.pathname === '/economy';
    if (tabTo === '/rbi') return location.pathname === '/rbi';
    if (tabTo === '/states') return location.pathname === '/states';
    if (tabTo === '/census') return location.pathname === '/census';
    if (tabTo === '/education') return location.pathname === '/education';
    if (tabTo === '/employment') return location.pathname === '/employment';
    if (tabTo === '/healthcare') return location.pathname === '/healthcare';
    if (tabTo === '/environment') return location.pathname === '/environment';
    if (tabTo === '/elections') return location.pathname === '/elections';
    if (tabTo === '/crime') return location.pathname === '/crime';
    if (tabTo === '/topics') return location.pathname === '/topics';
    if (tabTo === '/open-data') return location.pathname === '/open-data';
    if (tabTo === '/for-journalists') return location.pathname === '/for-journalists';
    if (tabTo === '/for-teachers') return location.pathname === '/for-teachers';
    if (tabTo === '/contribute') return location.pathname === '/contribute';
    return location.pathname === tabTo;
  };

  // Hub has 12 tabs — needs horizontal scroll. Domain sub-tabs (3-6 items) fit fine.
  const needsScroll = tabs.length > 6;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass mobile-nav-safe">
      <div className="relative">
        {/* Scroll affordance — right edge gradient */}
        {needsScroll && (
          <div
            className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, transparent, var(--bg-void))' }}
          />
        )}
        <div
          className={`flex items-center h-14 ${needsScroll ? 'overflow-x-auto scrollbar-hide gap-0 px-1' : 'justify-around'}`}
        >
          {tabs.map((tab) => {
            const isActive = isActiveTab(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`relative flex flex-col items-center gap-0.5 py-1 no-underline transition-colors ${needsScroll ? 'min-w-[52px] px-2' : 'px-3'}`}
                style={{
                  color: isActive ? 'var(--saffron)' : 'var(--text-muted)',
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={isActive ? 2 : 1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span className="text-[9px] font-medium leading-tight">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute bottom-0 w-1 h-1 rounded-full"
                    style={{ backgroundColor: 'var(--saffron)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
