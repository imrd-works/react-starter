import { sessionStore } from '@/entities/session'
import { configureApi, queryClient } from '@/shared/api'

/** Wires lower layers together. Runs once before the first render (and before each test). */
export function configureApp(): void {
  configureApi({
    getAccessToken: sessionStore.getToken,
    onUnauthorized: () => {
      sessionStore.clear()
      queryClient.clear()
    },
  })
}
