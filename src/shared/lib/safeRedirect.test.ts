import { describe, expect, it } from 'vitest'

import { getSafeRedirect } from './safeRedirect'

describe('getSafeRedirect', () => {
  it.each([
    ['/dashboard?tab=1', '/dashboard?tab=1'],
    [null, '/fallback'],
    [undefined, '/fallback'],
    ['', '/fallback'],
    ['https://evil.com', '/fallback'],
    ['//evil.com', '/fallback'],
    [String.raw`/\evil.com`, '/fallback'],
    ['javascript:alert(1)', '/fallback'],
  ])('maps %s to %s', (target, expected) => {
    expect(getSafeRedirect(target, '/fallback')).toBe(expected)
  })
})
