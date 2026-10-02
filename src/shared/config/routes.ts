/** Single source of truth for URLs. Slices link to each other only through these constants. */
export const ROUTES = {
  home: '/',
  contacts: '/contacts',
  login: '/login',
  dashboard: '/dashboard',
  uiKit: '/ui-kit',
} as const
