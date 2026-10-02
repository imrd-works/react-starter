import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { toast } from '@/shared/lib'

import { LazyToaster } from './LazyToaster'

describe('LazyToaster', () => {
  it('renders nothing until the first toast and then shows it', async () => {
    const { container } = render(<LazyToaster />)
    expect(container).toBeEmptyDOMElement()

    toast.success('Saved', 'All changes are stored')

    expect(await screen.findByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('All changes are stored')).toBeInTheDocument()
  })
})
