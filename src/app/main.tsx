import './i18n'
import './styles/index.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { env } from '@/shared/config'

import { App } from './App'
import { configureApp } from './setup/configureApp'

async function enableApiMocking(): Promise<void> {
  // `import.meta.env.DEV` is statically replaced, so MSW is tree-shaken from production builds.
  if (!import.meta.env.DEV || !env.apiMocking) return

  try {
    const { worker } = await import('@/shared/mocks/browser')
    await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
  } catch (error) {
    // Dev mocks must never block the app (e.g. Service Workers disabled in the browser).
    console.warn('[msw] API mocking is disabled: the Service Worker failed to start.', error)
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root is missing in index.html')

configureApp()
await enableApiMocking()

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
