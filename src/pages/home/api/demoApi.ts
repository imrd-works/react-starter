import { api } from '@/shared/api'

/** Demo: the endpoint always fails, the API client shows the backend message in a toast. */
export async function fetchDemoError(): Promise<void> {
  await api.get('/demo/error')
}
