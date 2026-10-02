import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { sessionStore } from '@/entities/session'
import { demoCredentials } from '@/shared/mocks/node'
import { renderWithProviders } from '@/shared/testing'

import { LoginPage } from './LoginPage'

const routes = [
  { path: '/dashboard', element: <p>Dashboard page</p> },
  { path: '/contacts', element: <p>Contacts page</p> },
]

async function signIn() {
  await userEvent.type(screen.getByLabelText('Email'), demoCredentials.email)
  await userEvent.type(screen.getByLabelText('Password'), demoCredentials.password)
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
}

describe('LoginPage', () => {
  beforeEach(() => {
    sessionStore.clear()
  })

  it('redirects to the dashboard by default', async () => {
    renderWithProviders(<LoginPage />, { route: '/login', routes })

    await signIn()

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
  })

  it('returns to the page from the redirect param', async () => {
    renderWithProviders(<LoginPage />, { route: '/login?redirect=%2Fcontacts', routes })

    await signIn()

    expect(await screen.findByText('Contacts page')).toBeInTheDocument()
  })

  it('ignores external redirect targets', async () => {
    renderWithProviders(<LoginPage />, {
      route: '/login?redirect=https%3A%2F%2Fevil.com',
      routes,
    })

    await signIn()

    expect(await screen.findByText('Dashboard page')).toBeInTheDocument()
  })
})
