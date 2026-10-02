import type { RouteObject } from 'react-router'

import { ROUTES } from '@/shared/config'

export const contactsRoute: RouteObject = {
  path: ROUTES.contacts,
  lazy: async () => ({ Component: (await import('./ui/ContactsPage')).ContactsPage }),
}
