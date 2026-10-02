import type { RouteObject } from 'react-router'

import { ROUTES } from '@/shared/config'

export const dashboardRoute: RouteObject = {
  path: ROUTES.dashboard,
  lazy: async () => ({ Component: (await import('./ui/DashboardPage')).DashboardPage }),
}
