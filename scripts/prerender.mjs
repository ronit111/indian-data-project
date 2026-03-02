/**
 * Post-build prerender script.
 *
 * Spins up a static server on the Vite `dist/` output, visits each route
 * with headless Chromium, captures the fully rendered HTML, and writes it
 * back as the route's index.html. This gives crawlers real content without
 * needing to execute JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 * Runs automatically as part of `npm run build`.
 */

import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = 4173;

const ROUTES = [
  '/',
  '/budget', '/budget/explore', '/budget/calculator', '/budget/methodology', '/budget/glossary',
  '/economy', '/economy/explore', '/economy/calculator', '/economy/methodology', '/economy/glossary',
  '/rbi', '/rbi/explore', '/rbi/calculator', '/rbi/methodology', '/rbi/glossary',
  '/states', '/states/explore', '/states/your-state', '/states/methodology', '/states/glossary',
  '/census', '/census/explore', '/census/methodology', '/census/glossary',
  '/education', '/education/explore', '/education/methodology', '/education/glossary',
  '/employment', '/employment/explore', '/employment/methodology', '/employment/glossary',
  '/healthcare', '/healthcare/explore', '/healthcare/methodology', '/healthcare/glossary',
  '/environment', '/environment/explore', '/environment/methodology', '/environment/glossary',
  '/elections', '/elections/explore', '/elections/methodology', '/elections/glossary',
  // Topics hub + 12 topic detail pages
  '/topics',
  '/topics/women-in-india', '/topics/fiscal-health', '/topics/inflation-cost',
  '/topics/education-employment', '/topics/health-outcomes', '/topics/regional-inequality',
  '/topics/climate-energy', '/topics/youth-jobs', '/topics/urban-rural',
  '/topics/democratic-health', '/topics/agriculture-food', '/topics/water-crisis',
  // Open resources and audience pages
  '/open-data',
  '/for-journalists', '/for-journalists/gallery', '/for-journalists/story-kits', '/for-journalists/embed-builder',
  '/for-teachers', '/for-teachers/lesson-plans',
  '/contribute',
  // Representative embed routes (one per domain)
  '/embed/budget/revenue', '/embed/economy/growth', '/embed/rbi/monetary-policy',
  '/embed/states/gsdp', '/embed/census/population', '/embed/education/enrollment',
  '/embed/employment/participation', '/embed/healthcare/infrastructure', '/embed/environment/air-quality',
  '/embed/elections/turnout',
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.topojson': 'application/json',
};

// Simple static file server with SPA fallback
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = req.url.split('?')[0]; // strip query params
      let filePath = join(DIST, urlPath);

      // If it's a file with an extension that exists, serve it
      if (extname(filePath) && existsSync(filePath) && statSync(filePath).isFile()) {
        const content = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(content);
        return;
      }

      // SPA fallback: serve index.html for all non-file routes
      const indexPath = join(DIST, 'index.html');
      const content = readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });

    server.listen(PORT, () => {
      console.log(`[prerender] Static server on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  const server = await startServer();
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      const url = `http://localhost:${PORT}${route}`;

      // Log console messages from the page for debugging
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          console.log(`[prerender] Page console error: ${msg.text()}`);
        }
      });

      page.on('pageerror', (err) => {
        console.log(`[prerender] Page error on ${route}: ${err.message}`);
      });

      console.log(`[prerender] Rendering ${route}...`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // networkidle0 means no network requests for 500ms — data should be loaded
      // Wait a bit more for React to finish rendering
      await new Promise((r) => setTimeout(r, 2000));

      // Get the full rendered HTML
      const html = await page.content();

      // Determine output path
      const outDir = route === '/' ? DIST : join(DIST, route.slice(1));
      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      const outFile = join(outDir, 'index.html');
      writeFileSync(outFile, html, 'utf-8');

      // Quick verification
      const hasH1 = html.includes('<h1');
      const size = Math.round(html.length / 1024);
      console.log(`[prerender] Wrote ${outFile} (${size}KB, h1: ${hasH1})`);

      await page.close();
    }

    console.log(`[prerender] Done. ${ROUTES.length} routes prerendered.`);
  } finally {
    await browser.close();
    server.close();
  }
}

prerender().catch((err) => {
  console.warn('[prerender] Skipped:', err.message);
  console.warn('[prerender] App will still work as an SPA without prerendered HTML.');
  // Don't exit(1) — let the build succeed without prerendering
  // (Vercel's build env lacks Puppeteer dependencies)
});
