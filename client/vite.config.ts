import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Nova Identity Cloud 2026',
        short_name: 'Nova Cloud',
        description: '2026 High-performance recruitment platform for Malta. Neural Matching and Compliance Vault integrated.',
        theme_color: '#0F1114',
        background_color: '#0F1114',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^\/api\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'nova-api-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'lucide-react': ['lucide-react'],
          'supabase': ['@supabase/supabase-js'],
          'react-router': ['react-router-dom']
        }
      }
    },
    // Minify assets
    minify: 'esbuild',
    // Generate manifest for preloading
    manifest: true,
    // Report compressed size
    reportCompressedSize: true,
    // Asset cleanup
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
