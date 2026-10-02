import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'

export interface RenderWithProvidersOptions {
  /** Initial URL. */
  route?: string
  /** Extra routes, e.g. redirect targets to assert navigation. */
  routes?: RouteObject[]
  queryClient?: QueryClient
}

export interface RenderWithProvidersResult extends RenderResult {
  router: ReturnType<typeof createMemoryRouter>
  queryClient: QueryClient
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
  })
}

/** Renders `ui` inside a data router and a fresh QueryClient — same environment as the app. */
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    routes = [],
    queryClient = createTestQueryClient(),
  }: RenderWithProvidersOptions = {}
): RenderWithProvidersResult {
  const router = createMemoryRouter([{ path: '*', element: ui }, ...routes], {
    initialEntries: [route],
  })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  return { ...result, router, queryClient }
}
