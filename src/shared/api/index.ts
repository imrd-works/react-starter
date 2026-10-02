import { fetchClient } from './fetchClient'

/** The only HTTP client slices may use. Swap the adapter here (fetch → axios/ky) if needed. */
export const api = fetchClient

export { configureApi } from './hooks'
export { queryClient } from './queryClient'
export type { ApiSchemas } from './types'
