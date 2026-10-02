import { delay, http, HttpResponse } from 'msw'

import type { ApiSchemas } from '@/shared/api'
import { env } from '@/shared/config'

const DEMO_TOKEN = 'demo-token'
const RESPONSE_DELAY_MS = 300

export const demoUser: ApiSchemas['User'] = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
}

export const demoCredentials: ApiSchemas['LoginRequest'] = {
  email: demoUser.email,
  password: 'password123',
}

const url = (path: string) => `${env.apiBaseUrl}${path}`

/** Mirrors openapi.json. Used by the dev service worker and by the Vitest server. */
export const handlers = [
  http.post<never, ApiSchemas['LoginRequest']>(url('/auth/login'), async ({ request }) => {
    await delay(RESPONSE_DELAY_MS)
    const body = await request.json()

    if (body.email !== demoCredentials.email || body.password !== demoCredentials.password) {
      return HttpResponse.json<ApiSchemas['ApiError']>(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return HttpResponse.json<ApiSchemas['LoginResponse']>({ token: DEMO_TOKEN, user: demoUser })
  }),

  http.get(url('/user/me'), ({ request }) => {
    if (request.headers.get('Authorization') !== `Bearer ${DEMO_TOKEN}`) {
      return HttpResponse.json<ApiSchemas['ApiError']>({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json(demoUser)
  }),

  http.post<never, ApiSchemas['ContactRequest']>(url('/contacts'), async () => {
    await delay(RESPONSE_DELAY_MS)
    return HttpResponse.json<ApiSchemas['ContactResponse']>(
      { id: crypto.randomUUID() },
      { status: 201 }
    )
  }),

  http.get(url('/demo/error'), () =>
    HttpResponse.json<ApiSchemas['ApiError']>(
      { message: 'Example backend error message' },
      { status: 500 }
    )
  ),
]
