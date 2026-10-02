import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { configureApi } from '@/shared/api'
import { createTestQueryClient } from '@/shared/testing'

import { useCurrentUser } from './userQueries'

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
}

describe('useCurrentUser', () => {
  it('does not fetch while disabled', () => {
    const { result } = renderHook(() => useCurrentUser({ enabled: false }), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches the current user when enabled', async () => {
    configureApi({ getAccessToken: () => 'demo-token' })
    const { result } = renderHook(() => useCurrentUser({ enabled: true }), { wrapper })

    await waitFor(() => {
      expect(result.current.data?.email).toBe('demo@example.com')
    })
  })
})
