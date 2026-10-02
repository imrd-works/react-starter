import { redirect, type MiddlewareFunction } from 'react-router'

import { sessionStore } from '@/entities/session'
import { ROUTES } from '@/shared/config'

/** Signed-in users have nothing to do on guest-only pages (login, sign up). */
export const guestOnly: MiddlewareFunction = () => {
  if (sessionStore.isAuthenticated()) throw redirect(ROUTES.dashboard)
}
