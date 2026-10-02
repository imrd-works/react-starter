import { queryOptions, useQuery } from '@tanstack/react-query'

import { fetchCurrentUser } from '../api/userApi'

/** Query key factory: every cache key for this entity is defined here. */
export const userQueries = {
  all: () => ['user'] as const,
  me: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'me'] as const,
      queryFn: ({ signal }) => fetchCurrentUser(signal),
    }),
}

/** `enabled` comes from the caller: entities must not import other entities (session). */
export function useCurrentUser({ enabled }: { enabled: boolean }) {
  return useQuery({ ...userQueries.me(), enabled })
}
