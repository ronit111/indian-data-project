import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

import './lib/registry/index.ts'; // Register all chart entries for sharing/embedding
import './index.css';
import App from './App.tsx';
import { initWebVitals } from './lib/perf/webVitals.ts';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <Analytics />
        </BrowserRouter>
      </HelmetProvider>
    </MotionConfig>
  </StrictMode>
);

// If prerendered HTML exists, hydrate instead of full render
if (container.children.length > 0) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// Core Web Vitals — measure-only, privacy-preserving (no third-party beacon).
// Pass a first-party reporter to initWebVitals(...) to collect field data later.
initWebVitals();
