import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Stack } from './Stack'

describe('Stack', () => {
  it('renders a vertical stack with medium gap by default', () => {
    render(<Stack data-testid="stack" />)

    expect(screen.getByTestId('stack')).toHaveClass('root', 'gapM', 'alignStretch')
  })

  it('supports a custom element and row layout', () => {
    render(
      <Stack
        as="nav"
        direction="row"
        gap="xs"
        align="center"
        justify="between"
        wrap
        aria-label="Menu"
      />
    )

    const nav = screen.getByRole('navigation', { name: 'Menu' })
    expect(nav).toHaveClass('row', 'gapXs', 'alignCenter', 'justifyBetween', 'wrap')
  })
})
