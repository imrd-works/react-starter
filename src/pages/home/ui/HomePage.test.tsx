import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { toast } from '@/shared/lib'
import { renderWithProviders } from '@/shared/testing'

import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the heading and sets the document title', () => {
    renderWithProviders(<HomePage />)

    expect(screen.getByRole('heading', { level: 1, name: 'React Starter' })).toBeInTheDocument()
    expect(document.title).toBe('Home · React Starter')
  })

  it('shows a success toast and a backend error toast', async () => {
    const toastSuccess = vi.spyOn(toast, 'success').mockImplementation(() => undefined)
    const toastError = vi.spyOn(toast, 'error').mockImplementation(() => undefined)
    renderWithProviders(<HomePage />)

    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(toastSuccess).toHaveBeenCalledWith('Everything works!')

    await userEvent.click(screen.getByRole('button', { name: 'Trigger API error' }))
    await vi.waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Example backend error message')
    })
  })
})
