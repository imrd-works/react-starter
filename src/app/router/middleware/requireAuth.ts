import { redirect, type MiddlewareFunction } from 'react-router'

import { sessionStore } from '@/entities/session'
import { ROUTES } from '@/shared/config'

/** Guest → `/login?redirect=<current url>`. */
export const requireAuth: MiddlewareFunction = ({ url }) => {
  if (sessionStore.isAuthenticated()) return

  const params = new URLSearchParams({ redirect: `${url.pathname}${url.search}` })
  throw redirect(`${ROUTES.login}?${params.toString()}`)
}
