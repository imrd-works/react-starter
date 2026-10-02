import { Suspense } from 'react'
import { RouterProvider } from 'react-router'

import { AppProviders } from './providers/AppProviders'
import { router } from './router/router'

export function App() {
  return (
    <AppProviders>
      {/* Suspends only while a lazily loaded language is fetched. */}
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  )
}
