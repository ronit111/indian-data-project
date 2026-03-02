import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageShell } from './components/layout/PageShell.tsx';
import { LanguageProvider } from './components/i18n/LanguageProvider.tsx';
import HubPage from './pages/HubPage.tsx';

const EmbedPage = lazy(() => import('./pages/EmbedPage.tsx'));
import BudgetPage from './pages/BudgetPage.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import FindYourSharePage from './pages/FindYourSharePage.tsx';
import MethodologyPage from './pages/MethodologyPage.tsx';
import EconomyPage from './pages/EconomyPage.tsx';
import EconomyExplorePage from './pages/EconomyExplorePage.tsx';
import EconomyMethodologyPage from './pages/EconomyMethodologyPage.tsx';
import RBIPage from './pages/RBIPage.tsx';
import RBIExplorePage from './pages/RBIExplorePage.tsx';
import RBIMethodologyPage from './pages/RBIMethodologyPage.tsx';
import BudgetGlossaryPage from './pages/BudgetGlossaryPage.tsx';
import EconomyGlossaryPage from './pages/EconomyGlossaryPage.tsx';
import RBIGlossaryPage from './pages/RBIGlossaryPage.tsx';
import StatesPage from './pages/StatesPage.tsx';
import StatesExplorePage from './pages/StatesExplorePage.tsx';
import StatesMethodologyPage from './pages/StatesMethodologyPage.tsx';
import StatesGlossaryPage from './pages/StatesGlossaryPage.tsx';
import CensusPage from './pages/CensusPage.tsx';
import CensusExplorePage from './pages/CensusExplorePage.tsx';
import CensusMethodologyPage from './pages/CensusMethodologyPage.tsx';
import CensusGlossaryPage from './pages/CensusGlossaryPage.tsx';
import EducationPage from './pages/EducationPage.tsx';
import EducationExplorePage from './pages/EducationExplorePage.tsx';
import EducationMethodologyPage from './pages/EducationMethodologyPage.tsx';
import EducationGlossaryPage from './pages/EducationGlossaryPage.tsx';
import EmploymentPage from './pages/EmploymentPage.tsx';
import EmploymentExplorePage from './pages/EmploymentExplorePage.tsx';
import EmploymentMethodologyPage from './pages/EmploymentMethodologyPage.tsx';
import EmploymentGlossaryPage from './pages/EmploymentGlossaryPage.tsx';
import HealthcarePage from './pages/HealthcarePage.tsx';
import HealthcareExplorePage from './pages/HealthcareExplorePage.tsx';
import HealthcareMethodologyPage from './pages/HealthcareMethodologyPage.tsx';
import HealthcareGlossaryPage from './pages/HealthcareGlossaryPage.tsx';
import EnvironmentPage from './pages/EnvironmentPage.tsx';
import EnvironmentExplorePage from './pages/EnvironmentExplorePage.tsx';
import EnvironmentMethodologyPage from './pages/EnvironmentMethodologyPage.tsx';
import EnvironmentGlossaryPage from './pages/EnvironmentGlossaryPage.tsx';
import ElectionsPage from './pages/ElectionsPage.tsx';
import ElectionsExplorePage from './pages/ElectionsExplorePage.tsx';
import ElectionsMethodologyPage from './pages/ElectionsMethodologyPage.tsx';
import ElectionsGlossaryPage from './pages/ElectionsGlossaryPage.tsx';
import EMICalculatorPage from './pages/EMICalculatorPage.tsx';
import CostOfLivingPage from './pages/CostOfLivingPage.tsx';
import StateReportCardPage from './pages/StateReportCardPage.tsx';
import TopicsPage from './pages/TopicsPage.tsx';
import TopicDetailPage from './pages/TopicDetailPage.tsx';
import OpenDataPage from './pages/OpenDataPage.tsx';
import JournalistsPage from './pages/JournalistsPage.tsx';
import ChartGalleryPage from './pages/ChartGalleryPage.tsx';
import EmbedBuilderPage from './pages/EmbedBuilderPage.tsx';
import StoryKitsPage from './pages/StoryKitsPage.tsx';
import TeachersPage from './pages/TeachersPage.tsx';
import LessonPlansPage from './pages/LessonPlansPage.tsx';
import ContributePage from './pages/ContributePage.tsx';

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
      <Suspense fallback={<div style={{ background: '#06080f', minHeight: '100vh' }} />}>
        <Routes location={location}>
          <Route path="/embed/:domain/:section" element={<EmbedPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <PageShell>
      <LanguageProvider>
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

            {/* Language-prefixed routes: /hi/budget, /te/budget/explore, etc. */}
            {PAGE_ROUTES.map((r) => (
              <Route
                key={`lang-${r.path}`}
                path={`/:lang${r.path === '/' ? '' : r.path}`}
                element={r.element}
              />
            ))}
          </Routes>
        </AnimatePresence>
      </LanguageProvider>
    </PageShell>
  );
}
