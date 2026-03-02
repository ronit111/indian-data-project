import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Only precache the app shell — data JSON is runtime-cached
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,ico,png,svg}'],
        // Don't precache data files or OG images (too large, updated by pipelines)
        globIgnores: ['**/data/**', '**/og-*.png', '**/llms.txt', '**/sitemap.xml'],
        // Navigation fallback for SPA
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/data\//],
        runtimeCaching: [
          {
            // Data JSON — always wait for network (no timeout = no stale on slow 3G).
            // Cache is offline-only fallback with 1h TTL to prevent serving stale pipeline data.
            urlPattern: /\/data\/.*\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'data-json',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60, // 1 hour — stale civic data is worse than a cache miss
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Font files — cache-first, these rarely change
            urlPattern: /\.woff2$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Images — show cached, update in background
            urlPattern: /\.(png|jpg|jpeg|svg|webp|gif|ico)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                purgeOnQuotaError: true,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'India Data Portal',
        short_name: 'India Data',
        description: 'Open data platform for Indian citizens — budget, economy, RBI, states, census, and more.',
        theme_color: '#06080f',
        background_color: '#06080f',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo-256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'd3-vendor': ['d3', 'd3-geo', 'd3-hierarchy', 'd3-sankey', 'd3-scale', 'd3-shape'],
          'motion-vendor': ['framer-motion'],
          'zustand-vendor': ['zustand'],
        },
      },
    },
  },
})
