import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { sessionStore } from '@/entities/session'
import { server } from '@/shared/mocks/node'
import { renderWithProviders } from '@/shared/testing'

import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  beforeEach(() => {
    sessionStore.setToken('demo-token')
  })

  it('greets the current user', async () => {
    renderWithProviders(<DashboardPage />)

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(await screen.findByText('Welcome back, Demo User!')).toBeInTheDocument()
  })

  it('shows an error when the profile cannot be loaded', async () => {
    server.use(http.get('/api/user/me', () => HttpResponse.json({}, { status: 403 })))
    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText('Could not load your profile.')).toBeInTheDocument()
  })
})
