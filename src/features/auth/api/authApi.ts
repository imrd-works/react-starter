import { api, type ApiSchemas } from '@/shared/api'

export type LoginCredentials = ApiSchemas['LoginRequest']
export type LoginResult = ApiSchemas['LoginResponse']

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  // Errors are shown inline in the form, so the global toast is disabled.
  const { data } = await api.post<LoginResult>('/auth/login', credentials, { silent: true })
  return data
}
