import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SessionState {
  token: string | null
  setToken: (token: string) => void
  clear: () => void
}

/**
 * Client state only: the access token. User data is server state and lives in
 * TanStack Query (entities/user).
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        set({ token })
      },
      clear: () => {
        set({ token: null })
      },
    }),
    {
      name: 'app.session',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token }) => ({ token }),
    }
  )
)

export const useIsAuthenticated = (): boolean => useSessionStore((state) => state.token !== null)

/** Non-React access for router middleware and the API client. */
export const sessionStore = {
  getToken: (): string | null => useSessionStore.getState().token,
  isAuthenticated: (): boolean => useSessionStore.getState().token !== null,
  setToken: (token: string): void => {
    useSessionStore.getState().setToken(token)
  },
  clear: (): void => {
    useSessionStore.getState().clear()
  },
}
