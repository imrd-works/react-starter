import { QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, type ReactNode } from 'react'

import { queryClient } from '@/shared/api'
import { LazyToaster } from '@/shared/ui'

// Devtools are loaded only in development and never reach the production bundle.
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(async () => ({
      default: (await import('@tanstack/react-query-devtools')).ReactQueryDevtools,
    }))
  : () => null

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <LazyToaster />
      <Suspense fallback={null}>
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </Suspense>
    </QueryClientProvider>
  )
}
