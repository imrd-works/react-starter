import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { RouteErrorBoundary } from './RouteErrorBoundary'

function Broken(): never {
  throw new Error('Boom')
}

describe('RouteErrorBoundary', () => {
  it('shows a recoverable error screen when a route crashes', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const router = createMemoryRouter([
      { path: '/', Component: Broken, ErrorBoundary: RouteErrorBoundary },
    ])

    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Unexpected error' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
  })

  it('renders the not found page for 404 responses', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        loader: () => {
          throw new Response(null, { status: 404 })
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ])

    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
