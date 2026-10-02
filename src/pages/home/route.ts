import type { RouteObject } from 'react-router'

export const homeRoute: RouteObject = {
  index: true,
  lazy: async () => ({ Component: (await import('./ui/HomePage')).HomePage }),
}
