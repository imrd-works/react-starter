import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { sessionStore } from '@/entities/session'
import { renderWithProviders } from '@/shared/testing'

import { Header } from './Header'

describe('Header', () => {
  it('shows the login link for guests', () => {
    renderWithProviders(<Header />)

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument()
  })

  it('shows the user and logout for authenticated users', async () => {
    sessionStore.setToken('demo-token')
    renderWithProviders(<Header />)

    expect(await screen.findByText('Demo User')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
  })

  it('highlights the active link', () => {
    renderWithProviders(<Header />, { route: '/contacts' })

    expect(screen.getByRole('link', { name: 'Contacts' })).toHaveClass('linkActive')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('linkActive')
  })
})
