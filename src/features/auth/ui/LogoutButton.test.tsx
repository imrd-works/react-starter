import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { sessionStore } from '@/entities/session'
import { renderWithProviders } from '@/shared/testing'

import { LogoutButton } from './LogoutButton'

describe('LogoutButton', () => {
  it('clears the session and the cache, then goes home', async () => {
    sessionStore.setToken('demo-token')
    const { router, queryClient } = renderWithProviders(<LogoutButton />, { route: '/dashboard' })
    queryClient.setQueryData(['user', 'me'], { id: '1' })

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))

    expect(sessionStore.isAuthenticated()).toBe(false)
    expect(queryClient.getQueryData(['user', 'me'])).toBeUndefined()
    expect(router.state.location.pathname).toBe('/')
  })
})
