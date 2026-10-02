import type { RouteObject } from 'react-router'

import { contactsRoute } from '@/pages/contacts'
import { dashboardRoute } from '@/pages/dashboard'
import { homeRoute } from '@/pages/home'
import { loginRoute } from '@/pages/login'
import { notFoundRoute } from '@/pages/not-found'
import { uiKitRoute } from '@/pages/ui-kit'

import { guestOnly, requireAuth } from './middleware'
import { RouteErrorBoundary } from './RouteErrorBoundary'
import { RootLayout } from '../layouts/RootLayout'

export const routes: RouteObject[] = [
  {
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      homeRoute,
      contactsRoute,
      { middleware: [guestOnly], children: [loginRoute] },
      { middleware: [requireAuth], children: [dashboardRoute] },
      // `import.meta.env.DEV` is a build-time constant: the UI kit chunk is dropped from production.
      ...(import.meta.env.DEV ? [uiKitRoute] : []),
      notFoundRoute,
    ],
  },
]
