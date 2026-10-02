import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Input } from './Input'
import { Textarea } from './Textarea'

describe('Input', () => {
  it('is accessible by its label and accepts typing', async () => {
    render(<Input label="Email" />)

    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'hello')

    expect(input).toHaveValue('hello')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('links the error message and marks the field invalid', () => {
    render(<Input label="Email" error="Required" hint="We never share it" />)

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Required')
    expect(screen.queryByText('We never share it')).not.toBeInTheDocument()
  })

  it('shows the hint when there is no error', () => {
    render(<Textarea label="Message" hint="Max 500 characters" />)

    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('Max 500 characters')
  })
})
