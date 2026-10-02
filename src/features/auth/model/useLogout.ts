import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { sessionStore } from '@/entities/session'
import { ROUTES } from '@/shared/config'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return async () => {
    sessionStore.clear()
    queryClient.clear()
    await navigate(ROUTES.home)
  }
}
