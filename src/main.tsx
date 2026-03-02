import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';

import './lib/registry/index.ts'; // Register all chart entries for sharing/embedding
import './index.css';
import App from './App.tsx';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        <BrowserRouter>
          <App />
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
