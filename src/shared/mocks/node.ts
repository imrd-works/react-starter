import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export { demoCredentials, demoUser } from './handlers'
export const server = setupServer(...handlers)
