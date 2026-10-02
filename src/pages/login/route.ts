import type { RouteObject } from 'react-router'

import { ROUTES } from '@/shared/config'

export const loginRoute: RouteObject = {
  path: ROUTES.login,
  lazy: async () => ({ Component: (await import('./ui/LoginPage')).LoginPage }),
}
