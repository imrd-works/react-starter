import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UserBadge } from './UserBadge'

describe('UserBadge', () => {
  it('shows the name and the initial', () => {
    render(<UserBadge user={{ name: 'jane Doe', email: 'jane@example.com' }} />)

    expect(screen.getByText('jane Doe')).toBeInTheDocument()
    expect(screen.getByText('J')).toBeInTheDocument()
    expect(screen.getByTitle('jane@example.com')).toBeInTheDocument()
  })
})
