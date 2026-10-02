import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Seo } from './Seo'

describe('Seo', () => {
  it('sets the document title and meta tags', () => {
    render(<Seo title="Home" description="Welcome" noIndex />)

    expect(document.title).toBe('Home · React Starter')
    expect(document.head).toContainHTML('<meta name="description" content="Welcome">')
    expect(document.head).toContainHTML('<meta name="robots" content="noindex">')
  })
})
