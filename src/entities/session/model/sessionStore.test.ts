import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { sessionStore, useIsAuthenticated } from './sessionStore'

describe('sessionStore', () => {
  beforeEach(() => {
    sessionStore.clear()
  })

  it('stores the token and exposes the authenticated state', () => {
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(false)

    act(() => {
      sessionStore.setToken('token-123')
    })

    expect(result.current).toBe(true)
    expect(sessionStore.getToken()).toBe('token-123')
    expect(sessionStore.isAuthenticated()).toBe(true)
  })

  it('persists the token to localStorage and clears it', () => {
    sessionStore.setToken('token-123')
    expect(localStorage.getItem('app.session')).toContain('token-123')

    sessionStore.clear()
    expect(sessionStore.getToken()).toBeNull()
  })
})
