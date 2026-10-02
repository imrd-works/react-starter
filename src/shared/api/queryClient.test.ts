import { describe, expect, it } from 'vitest'

import { queryClient } from './queryClient'
import { ApiError } from './types'

const retry = queryClient.getDefaultOptions().queries?.retry

describe('queryClient retry policy', () => {
  it.each([
    { name: 'network error', error: new ApiError('offline'), failureCount: 0, expected: true },
    { name: '5xx', error: new ApiError('down', 503), failureCount: 1, expected: true },
    {
      name: 'too many attempts',
      error: new ApiError('down', 503),
      failureCount: 2,
      expected: false,
    },
    { name: '4xx', error: new ApiError('forbidden', 403), failureCount: 0, expected: false },
  ])('$name → retry is $expected', ({ error, failureCount, expected }) => {
    expect(typeof retry).toBe('function')
    if (typeof retry !== 'function') return

    expect(retry(failureCount, error)).toBe(expected)
  })

  it('never retries mutations', () => {
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false)
  })
})
