import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/shared/mocks/node'
import { renderWithProviders } from '@/shared/testing'

import { ContactForm } from './ContactForm'

async function submit(email: string, message: string) {
  await userEvent.type(screen.getByLabelText('Your email'), email)
  await userEvent.type(screen.getByLabelText('Message'), message)
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }))
}

describe('ContactForm', () => {
  it('shows validation errors and keeps the input', async () => {
    renderWithProviders(<ContactForm />)

    await submit('wrong', 'short')

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument()
    expect(screen.getByText('Must be at least 10 characters')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toHaveValue('short')
  })

  it('clears the form after a successful submit', async () => {
    renderWithProviders(<ContactForm />)

    await submit('user@example.com', 'Hello, I have a question')

    await vi.waitFor(() => {
      expect(screen.getByLabelText('Message')).toHaveValue('')
    })
  })

  it('keeps the input when the request fails', async () => {
    server.use(http.post('/api/contacts', () => HttpResponse.json({}, { status: 500 })))
    renderWithProviders(<ContactForm />)

    await submit('user@example.com', 'Hello, I have a question')

    expect(await screen.findByRole('button', { name: 'Send message' })).toBeEnabled()
    expect(screen.getByLabelText('Message')).toHaveValue('Hello, I have a question')
  })
})
