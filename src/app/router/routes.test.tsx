import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { sessionStore } from '@/entities/session'
import { createTestQueryClient } from '@/shared/testing'

import { routes } from './routes'

function openApp(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  return router
}

describe('app routes', () => {
  it('renders the home page inside the root layout', async () => {
    openApp('/')

    expect(await screen.findByRole('heading', { level: 1, name: 'React Starter' })).toBeVisible()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('React Starter')
  })

  it('navigates between lazy pages', async () => {
    const router = openApp('/')
    await screen.findByRole('heading', { level: 1, name: 'React Starter' })

    await userEvent.click(screen.getByRole('link', { name: 'Contacts' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Contact us' })).toBeVisible()
    expect(router.state.location.pathname).toBe('/contacts')
  })

  it('protects the dashboard and lets authenticated users in', async () => {
    const guestRouter = openApp('/dashboard')
    expect(await screen.findByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible()
    expect(guestRouter.state.location.search).toBe('?redirect=%2Fdashboard')
  })

  it('opens the dashboard for an authenticated user', async () => {
    sessionStore.setToken('demo-token')
    openApp('/dashboard')

    expect(await screen.findByText('Welcome back, Demo User!')).toBeVisible()
  })

  it('shows the not found page for unknown urls', async () => {
    openApp('/unknown')

    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  })
})
