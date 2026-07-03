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

// The service worker uses skipWaiting + clientsClaim, so on a deploy the new
// SW takes control of already-open tabs whose old-hash lazy chunks no longer
// exist. Reload once when an EXISTING controller is replaced (a deploy) so
// those tabs pick up the new shell; first-install claims (no prior
// controller) don't reload.
if ('serviceWorker' in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}
