import { QueryClient } from '@tanstack/react-query'

import { ApiError } from './types'

const MAX_RETRIES = 2
const HTTP_SERVER_ERROR = 500

/** Retry only network failures and 5xx — never 4xx, they will not fix themselves. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status !== undefined && error.status < HTTP_SERVER_ERROR) {
    return false
  }
  return failureCount < MAX_RETRIES
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  })
}

export const queryClient = createQueryClient()
