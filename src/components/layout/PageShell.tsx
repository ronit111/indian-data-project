import { type ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Header } from './Header.tsx';
import { MobileNav } from './MobileNav.tsx';
import { Footer } from './Footer.tsx';
import { SearchOverlay } from '../ui/SearchOverlay.tsx';
import { FeedbackButton } from '../ui/FeedbackButton.tsx';
import { PersonalizationBanner } from '../personalization/PersonalizationBanner.tsx';
import { usePersonalizationStore } from '../../store/personalizationStore.ts';

export function PageShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const classroomMode = usePersonalizationStore((s) => s.classroomMode);
  const setClassroomMode = usePersonalizationStore((s) => s.setClassroomMode);

  // Sync ?classroom=true URL param to store
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('classroom') === 'true' && !classroomMode) {
      setClassroomMode(true);
    }
  }, [location.search, classroomMode, setClassroomMode]);

  // Classroom mode: scale root font-size so ALL rem-based sizes grow proportionally
  useEffect(() => {
    if (classroomMode) {
      document.documentElement.style.fontSize = '19px';
    } else {
      document.documentElement.style.fontSize = '';
    }
    return () => { document.documentElement.style.fontSize = ''; };
  }, [classroomMode]);
  const isBudgetStory = location.pathname === '/budget';
  const isEconomyStory = location.pathname === '/economy';
  const isRBIStory = location.pathname === '/rbi';
  const showScrollProgress = isBudgetStory || isEconomyStory || isRBIStory;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className={`min-h-screen flex flex-col${classroomMode ? ' classroom-mode' : ''}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded"
        style={{ background: 'var(--saffron)', color: 'var(--bg-void)' }}
      >
        Skip to main content
      </a>
      <Header />
      <SearchOverlay />

      {showScrollProgress && (
        <motion.div
          className="fixed top-16 left-0 right-0 h-0.5 z-40 origin-left"
          style={{
            scaleX,
            backgroundColor: isRBIStory ? 'var(--gold)' : isEconomyStory ? 'var(--cyan)' : 'var(--saffron)',
          }}
        />
      )}

      <PersonalizationBanner />
      <main id="main-content" className="flex-1 pt-16 overflow-y-auto">{children}</main>
      <Footer />
      <FeedbackButton />
      <MobileNav />
    </div>
  );
}
