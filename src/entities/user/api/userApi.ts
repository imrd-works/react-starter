import { api } from '@/shared/api'

import type { User } from '../model/types'

export async function fetchCurrentUser(signal?: AbortSignal): Promise<User> {
  const { data } = await api.get<User>('/user/me', signal ? { signal } : {})
  return data
}
