import { describe, expect, it } from 'vitest'

import { cx } from './cx'

describe('cx', () => {
  it('joins only truthy class names', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cx(false, undefined)).toBe('')
  })
})
