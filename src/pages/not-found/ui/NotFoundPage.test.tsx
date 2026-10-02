import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/shared/testing'

import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('explains the error and links back home', () => {
    renderWithProviders(<NotFoundPage />, { route: '/missing' })

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to home page' })).toHaveAttribute('href', '/')
  })
})
