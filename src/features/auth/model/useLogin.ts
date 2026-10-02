import { useMutation, useQueryClient } from '@tanstack/react-query'

import { sessionStore } from '@/entities/session'
import { userQueries } from '@/entities/user'

import { login } from '../api/authApi'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      sessionStore.setToken(token)
      // Seed the cache: the header shows the user without an extra request.
      queryClient.setQueryData(userQueries.me().queryKey, user)
    },
  })
}
