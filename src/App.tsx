import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageShell } from './components/layout/PageShell.tsx';

// ─── Eager: Hub is the primary landing page ─────────────────────────
import HubPage from './pages/HubPage.tsx';

// ─── Lazy: all other pages load on demand ───────────────────────────
const EmbedPage = lazy(() => import('./pages/EmbedPage.tsx'));

// Budget
const BudgetPage = lazy(() => import('./pages/BudgetPage.tsx'));
const ExplorePage = lazy(() => import('./pages/ExplorePage.tsx'));
const FindYourSharePage = lazy(() => import('./pages/FindYourSharePage.tsx'));
const MethodologyPage = lazy(() => import('./pages/MethodologyPage.tsx'));
const BudgetGlossaryPage = lazy(() => import('./pages/BudgetGlossaryPage.tsx'));

// Economy
const EconomyPage = lazy(() => import('./pages/EconomyPage.tsx'));
const EconomyExplorePage = lazy(() => import('./pages/EconomyExplorePage.tsx'));
const EconomyMethodologyPage = lazy(() => import('./pages/EconomyMethodologyPage.tsx'));
const EconomyGlossaryPage = lazy(() => import('./pages/EconomyGlossaryPage.tsx'));
const CostOfLivingPage = lazy(() => import('./pages/CostOfLivingPage.tsx'));

// RBI
const RBIPage = lazy(() => import('./pages/RBIPage.tsx'));
const RBIExplorePage = lazy(() => import('./pages/RBIExplorePage.tsx'));
const RBIMethodologyPage = lazy(() => import('./pages/RBIMethodologyPage.tsx'));
const RBIGlossaryPage = lazy(() => import('./pages/RBIGlossaryPage.tsx'));
const EMICalculatorPage = lazy(() => import('./pages/EMICalculatorPage.tsx'));

// States
const StatesPage = lazy(() => import('./pages/StatesPage.tsx'));
const StatesExplorePage = lazy(() => import('./pages/StatesExplorePage.tsx'));
const StatesMethodologyPage = lazy(() => import('./pages/StatesMethodologyPage.tsx'));
const StatesGlossaryPage = lazy(() => import('./pages/StatesGlossaryPage.tsx'));
const StateReportCardPage = lazy(() => import('./pages/StateReportCardPage.tsx'));

// Census
const CensusPage = lazy(() => import('./pages/CensusPage.tsx'));
const CensusExplorePage = lazy(() => import('./pages/CensusExplorePage.tsx'));
const CensusMethodologyPage = lazy(() => import('./pages/CensusMethodologyPage.tsx'));
const CensusGlossaryPage = lazy(() => import('./pages/CensusGlossaryPage.tsx'));

// Education
const EducationPage = lazy(() => import('./pages/EducationPage.tsx'));
const EducationExplorePage = lazy(() => import('./pages/EducationExplorePage.tsx'));
const EducationMethodologyPage = lazy(() => import('./pages/EducationMethodologyPage.tsx'));
const EducationGlossaryPage = lazy(() => import('./pages/EducationGlossaryPage.tsx'));

// Employment
const EmploymentPage = lazy(() => import('./pages/EmploymentPage.tsx'));
const EmploymentExplorePage = lazy(() => import('./pages/EmploymentExplorePage.tsx'));
const EmploymentMethodologyPage = lazy(() => import('./pages/EmploymentMethodologyPage.tsx'));
const EmploymentGlossaryPage = lazy(() => import('./pages/EmploymentGlossaryPage.tsx'));

// Healthcare
const HealthcarePage = lazy(() => import('./pages/HealthcarePage.tsx'));
const HealthcareExplorePage = lazy(() => import('./pages/HealthcareExplorePage.tsx'));
const HealthcareMethodologyPage = lazy(() => import('./pages/HealthcareMethodologyPage.tsx'));
const HealthcareGlossaryPage = lazy(() => import('./pages/HealthcareGlossaryPage.tsx'));

// Environment
const EnvironmentPage = lazy(() => import('./pages/EnvironmentPage.tsx'));
const EnvironmentExplorePage = lazy(() => import('./pages/EnvironmentExplorePage.tsx'));
const EnvironmentMethodologyPage = lazy(() => import('./pages/EnvironmentMethodologyPage.tsx'));
const EnvironmentGlossaryPage = lazy(() => import('./pages/EnvironmentGlossaryPage.tsx'));

// Elections
const ElectionsPage = lazy(() => import('./pages/ElectionsPage.tsx'));
const ElectionsExplorePage = lazy(() => import('./pages/ElectionsExplorePage.tsx'));
const ElectionsMethodologyPage = lazy(() => import('./pages/ElectionsMethodologyPage.tsx'));
const ElectionsGlossaryPage = lazy(() => import('./pages/ElectionsGlossaryPage.tsx'));

// Crime
const CrimePage = lazy(() => import('./pages/CrimePage.tsx'));
const CrimeExplorerPage = lazy(() => import('./pages/CrimeExplorerPage.tsx'));
const CrimeMethodologyPage = lazy(() => import('./pages/CrimeMethodologyPage.tsx'));
const CrimeGlossaryPage = lazy(() => import('./pages/CrimeGlossaryPage.tsx'));

// Cross-domain
const TopicsPage = lazy(() => import('./pages/TopicsPage.tsx'));
const TopicDetailPage = lazy(() => import('./pages/TopicDetailPage.tsx'));

// Multiplier pages
const OpenDataPage = lazy(() => import('./pages/OpenDataPage.tsx'));
const JournalistsPage = lazy(() => import('./pages/JournalistsPage.tsx'));
const ChartGalleryPage = lazy(() => import('./pages/ChartGalleryPage.tsx'));
const EmbedBuilderPage = lazy(() => import('./pages/EmbedBuilderPage.tsx'));
const StoryKitsPage = lazy(() => import('./pages/StoryKitsPage.tsx'));
const TeachersPage = lazy(() => import('./pages/TeachersPage.tsx'));
const LessonPlansPage = lazy(() => import('./pages/LessonPlansPage.tsx'));
const ContributePage = lazy(() => import('./pages/ContributePage.tsx'));

// ─── Route prefetch map: path prefix → dynamic import ───────────────
// Used by prefetchRoute() to start chunk downloads on link hover.
const PREFETCH_MAP: Record<string, () => Promise<unknown>> = {
  '/budget': () => import('./pages/BudgetPage.tsx'),
  '/economy': () => import('./pages/EconomyPage.tsx'),
  '/rbi': () => import('./pages/RBIPage.tsx'),
  '/states': () => import('./pages/StatesPage.tsx'),
  '/census': () => import('./pages/CensusPage.tsx'),
  '/education': () => import('./pages/EducationPage.tsx'),
  '/employment': () => import('./pages/EmploymentPage.tsx'),
  '/healthcare': () => import('./pages/HealthcarePage.tsx'),
  '/environment': () => import('./pages/EnvironmentPage.tsx'),
  '/elections': () => import('./pages/ElectionsPage.tsx'),
  '/crime': () => import('./pages/CrimePage.tsx'),
  '/topics': () => import('./pages/TopicsPage.tsx'),
  '/open-data': () => import('./pages/OpenDataPage.tsx'),
  '/for-journalists': () => import('./pages/JournalistsPage.tsx'),
  '/for-teachers': () => import('./pages/TeachersPage.tsx'),
  '/contribute': () => import('./pages/ContributePage.tsx'),
};

const prefetched = new Set<string>();

/** Prefetch a route's chunk on hover. Call with the link's href. */
function prefetchRoute(path: string) {
  // Find the matching prefix
  const prefix = Object.keys(PREFETCH_MAP).find((p) => path === p || path.startsWith(p + '/'));
  if (!prefix || prefetched.has(prefix)) return;
  prefetched.add(prefix);
  PREFETCH_MAP[prefix]();
}

// ─── Suspense fallback (matches dark theme) ──────────────────────────
const PageFallback = () => (
  <div style={{ background: '#06080f', minHeight: '100vh' }} />
);

// ─── Route table ─────────────────────────────────────────────────────
const PAGE_ROUTES = [
  { path: '/', element: <HubPage /> },
  { path: '/budget', element: <BudgetPage /> },
  { path: '/budget/explore', element: <ExplorePage /> },
  { path: '/budget/calculator', element: <FindYourSharePage /> },
  { path: '/budget/methodology', element: <MethodologyPage /> },
  { path: '/budget/glossary', element: <BudgetGlossaryPage /> },
  { path: '/economy', element: <EconomyPage /> },
  { path: '/economy/explore', element: <EconomyExplorePage /> },
  { path: '/economy/calculator', element: <CostOfLivingPage /> },
  { path: '/economy/methodology', element: <EconomyMethodologyPage /> },
  { path: '/economy/glossary', element: <EconomyGlossaryPage /> },
  { path: '/rbi', element: <RBIPage /> },
  { path: '/rbi/explore', element: <RBIExplorePage /> },
  { path: '/rbi/calculator', element: <EMICalculatorPage /> },
  { path: '/rbi/methodology', element: <RBIMethodologyPage /> },
  { path: '/rbi/glossary', element: <RBIGlossaryPage /> },
  { path: '/states', element: <StatesPage /> },
  { path: '/states/explore', element: <StatesExplorePage /> },
  { path: '/states/your-state', element: <StateReportCardPage /> },
  { path: '/states/methodology', element: <StatesMethodologyPage /> },
  { path: '/states/glossary', element: <StatesGlossaryPage /> },
  { path: '/census', element: <CensusPage /> },
  { path: '/census/explore', element: <CensusExplorePage /> },
  { path: '/census/methodology', element: <CensusMethodologyPage /> },
  { path: '/census/glossary', element: <CensusGlossaryPage /> },
  { path: '/education', element: <EducationPage /> },
  { path: '/education/explore', element: <EducationExplorePage /> },
  { path: '/education/methodology', element: <EducationMethodologyPage /> },
  { path: '/education/glossary', element: <EducationGlossaryPage /> },
  { path: '/employment', element: <EmploymentPage /> },
  { path: '/employment/explore', element: <EmploymentExplorePage /> },
  { path: '/employment/methodology', element: <EmploymentMethodologyPage /> },
  { path: '/employment/glossary', element: <EmploymentGlossaryPage /> },
  { path: '/healthcare', element: <HealthcarePage /> },
  { path: '/healthcare/explore', element: <HealthcareExplorePage /> },
  { path: '/healthcare/methodology', element: <HealthcareMethodologyPage /> },
  { path: '/healthcare/glossary', element: <HealthcareGlossaryPage /> },
  { path: '/environment', element: <EnvironmentPage /> },
  { path: '/environment/explore', element: <EnvironmentExplorePage /> },
  { path: '/environment/methodology', element: <EnvironmentMethodologyPage /> },
  { path: '/environment/glossary', element: <EnvironmentGlossaryPage /> },
  { path: '/elections', element: <ElectionsPage /> },
  { path: '/elections/explore', element: <ElectionsExplorePage /> },
  { path: '/elections/methodology', element: <ElectionsMethodologyPage /> },
  { path: '/elections/glossary', element: <ElectionsGlossaryPage /> },
  { path: '/crime', element: <CrimePage /> },
  { path: '/crime/explore', element: <CrimeExplorerPage /> },
  { path: '/crime/methodology', element: <CrimeMethodologyPage /> },
  { path: '/crime/glossary', element: <CrimeGlossaryPage /> },
  { path: '/topics', element: <TopicsPage /> },
  { path: '/topics/:topicId', element: <TopicDetailPage /> },
  { path: '/open-data', element: <OpenDataPage /> },
  { path: '/for-journalists', element: <JournalistsPage /> },
  { path: '/for-journalists/gallery', element: <ChartGalleryPage /> },
  { path: '/for-journalists/embed-builder', element: <EmbedBuilderPage /> },
  { path: '/for-journalists/story-kits', element: <StoryKitsPage /> },
  { path: '/for-teachers', element: <TeachersPage /> },
  { path: '/for-teachers/lesson-plans', element: <LessonPlansPage /> },
  { path: '/contribute', element: <ContributePage /> },
] as const;

// Old routes redirect to new /budget/* paths
const REDIRECTS = [
  { from: '/explore', to: '/budget/explore' },
  { from: '/calculator', to: '/budget/calculator' },
  { from: '/methodology', to: '/budget/methodology' },
] as const;

export default function App() {
  const location = useLocation();

  // Global hover prefetch: start loading route chunks when the user hovers a link
  useEffect(() => {
    function handleHover(e: Event) {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        prefetchRoute(href);
      }
    }
    document.addEventListener('pointerenter', handleHover, true);
    return () => document.removeEventListener('pointerenter', handleHover, true);
  }, []);

  // Scroll to top on route change (unless navigating to a hash anchor)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Scroll to hash anchor after React renders (SPA deep link support)
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
    return () => clearTimeout(timer);
  }, [location.hash, location.pathname]);

  // Embed routes render outside PageShell (no header/footer/nav)
  if (location.pathname.startsWith('/embed/')) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          <Route path="/embed/:domain/:section" element={<EmbedPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <PageShell>
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Main routes */}
            {PAGE_ROUTES.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

            {/* Backward-compatible redirects */}
            {REDIRECTS.map((r) => (
              <Route
                key={r.from}
                path={r.from}
                element={<Navigate to={r.to} replace />}
              />
            ))}
          </Routes>
        </AnimatePresence>
      </Suspense>
    </PageShell>
  );
}
