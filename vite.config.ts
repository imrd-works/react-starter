import { fileURLToPath, URL } from 'node:url'

import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { compression } from 'vite-plugin-compression2'
import sitemap from 'vite-plugin-sitemap'
import svgr from 'vite-plugin-svgr'

const srcDir = fileURLToPath(new URL('src', import.meta.url))

// Public routes for sitemap.xml. Keep in sync with src/shared/config/routes.ts.
const sitemapRoutes = ['/', '/contacts', '/login']

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const analyze = mode === 'analyze'
  // Unit tests run against source semantics; the compiled bundle is covered by e2e.
  // (Compiler memoization adds synthetic branches that distort coverage.)
  const isTest = Boolean(process.env.VITEST)

  return {
    plugins: [
      react(),
      ...(isTest ? [] : [babel({ presets: [reactCompilerPreset()] })]),
      svgr({ svgrOptions: { icon: true, svgo: true } }),
      compression(),
      sitemap({
        hostname: env.VITE_SITE_URL ?? 'https://example.com',
        dynamicRoutes: sitemapRoutes,
        generateRobotsTxt: true,
      }),
      ...(analyze
        ? [
            visualizer({
              open: true,
              gzipSize: true,
              brotliSize: true,
              filename: 'dist/stats.html',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: { '@': srcDir },
    },
    css: {
      modules: {
        // Readable class names in dev, short hashes in production.
        generateScopedName:
          command === 'build' ? '[hash:base64:6]' : '[name]__[local]__[hash:base64:4]',
      },
      preprocessorOptions: {
        scss: { loadPaths: [srcDir] },
      },
    },
    build: {
      target: 'baseline-widely-available',
      sourcemap: true,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'router', test: /node_modules[\\/]react-router[\\/]/ },
              { name: 'query', test: /node_modules[\\/]@tanstack[\\/]/ },
              { name: 'i18n', test: /node_modules[\\/](i18next|react-i18next)[\\/]/ },
            ],
          },
        },
      },
    },
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
  }
})
