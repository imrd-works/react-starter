import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import { sessionStore } from '@/entities/session'

import { guestOnly } from './guestOnly'
import { requireAuth } from './requireAuth'

function navigateTo(path: string) {
  const router = createMemoryRouter(
    [
      { path: '/login', middleware: [guestOnly], element: <p>Login</p> },
      { path: '/dashboard', middleware: [requireAuth], element: <p>Dashboard</p> },
    ],
    { initialEntries: [path] }
  )
  render(<RouterProvider router={router} />)
  return router
}

describe('router middleware', () => {
  beforeEach(() => {
    sessionStore.clear()
  })

  it('redirects guests to login and preserves the target url', async () => {
    const router = navigateTo('/dashboard?tab=profile')

    expect(await screen.findByText('Login')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?redirect=%2Fdashboard%3Ftab%3Dprofile')
  })

  it('lets authenticated users into protected pages', async () => {
    sessionStore.setToken('token')
    navigateTo('/dashboard')

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })

  it('redirects authenticated users away from guest-only pages', async () => {
    sessionStore.setToken('token')
    navigateTo('/login')

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })
})
