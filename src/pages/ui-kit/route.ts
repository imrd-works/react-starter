import type { RouteObject } from 'react-router'

import { ROUTES } from '@/shared/config'

export const uiKitRoute: RouteObject = {
  path: ROUTES.uiKit,
  lazy: async () => ({ Component: (await import('./ui/UiKitPage')).UiKitPage }),
}
