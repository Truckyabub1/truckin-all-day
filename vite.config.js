import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,wav}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MB limit
      },
      manifest: {
        name: 'Truckin All Day',
        short_name: 'Truckin',
        description: 'High-impact roots music and interactive digital arcade.',
        theme_color: '#090a0f',
        background_color: '#090a0f',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        store: resolve(__dirname, 'store.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
});
