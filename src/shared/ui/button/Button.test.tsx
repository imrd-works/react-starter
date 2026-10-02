import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('renders a non-submitting button by default', () => {
    render(<Button>Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('root', 'primary', 'sizeM')
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="danger" size="l">
        Delete
      </Button>
    )

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('danger', 'sizeL')
  })

  it('is disabled and busy while loading', async () => {
    const onClick = vi.fn<() => void>()
    render(
      <Button loading onClick={onClick}>
        Send
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Send' })
    await userEvent.click(button)

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(onClick).not.toHaveBeenCalled()
  })
})
