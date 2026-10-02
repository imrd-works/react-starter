import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sessionStore } from '@/entities/session'
import { userQueries } from '@/entities/user'
import { demoCredentials, demoUser } from '@/shared/mocks/node'
import { renderWithProviders } from '@/shared/testing'

import { LoginForm } from './LoginForm'

async function fillForm(email: string, password: string) {
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    sessionStore.clear()
  })

  it('validates fields before sending a request', async () => {
    const onSuccess = vi.fn<() => void>()
    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await fillForm('not-an-email', '123')

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument()
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('stores the session and seeds the user cache on success', async () => {
    const onSuccess = vi.fn<() => void>()
    const { queryClient } = renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await fillForm(demoCredentials.email, demoCredentials.password)

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce()
    })
    expect(sessionStore.getToken()).toBe('demo-token')
    expect(queryClient.getQueryData(userQueries.me().queryKey)).toEqual(demoUser)
  })

  it('shows the backend error inline for wrong credentials', async () => {
    renderWithProviders(<LoginForm onSuccess={vi.fn<() => void>()} />)

    await fillForm(demoCredentials.email, 'wrong-password')

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
    expect(sessionStore.isAuthenticated()).toBe(false)
  })
})
