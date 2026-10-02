import i18next from 'i18next'

import { env } from '@/shared/config'
import { toast } from '@/shared/lib'

import { getApiHooks } from './hooks'
import { ApiError, type ApiClient, type ApiRequestConfig, type ApiResponse } from './types'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const REQUEST_TIMEOUT_MS = 15_000
const HTTP_UNAUTHORIZED = 401
const HTTP_NO_CONTENT = 204

function buildUrl(path: string, params: ApiRequestConfig['params']): URL {
  const base = env.apiBaseUrl.replace(/\/$/, '')
  const url = new URL(`${base}${path}`, location.origin)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url
}

function buildHeaders(hasBody: boolean, custom: ApiRequestConfig['headers']): Headers {
  const headers = new Headers({ Accept: 'application/json' })
  if (hasBody) headers.set('Content-Type', 'application/json')

  const token = getApiHooks().getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  for (const [key, value] of Object.entries(custom ?? {})) headers.set(key, value)
  return headers
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === HTTP_NO_CONTENT) return undefined
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function backendMessage(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null || !('message' in body)) return undefined
  return typeof body.message === 'string' && body.message.length > 0 ? body.message : undefined
}

/** Shows the error toast (unless silent), runs the 401 hook and returns the error to throw. */
function reportFailure(error: ApiError, config: ApiRequestConfig): ApiError {
  if (!config.silent) toast.error(config.toast?.error ?? error.message)
  if (error.status === HTTP_UNAUTHORIZED) getApiHooks().onUnauthorized()
  return error
}

interface RequestOptions {
  body?: unknown
  config?: ApiRequestConfig | undefined
}

async function send(
  method: HttpMethod,
  path: string,
  { body, config }: { body: unknown; config: ApiRequestConfig }
) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)

  try {
    return await fetch(buildUrl(path, config.params), {
      method,
      headers: buildHeaders(body !== undefined, config.headers),
      body: body === undefined ? null : JSON.stringify(body),
      signal: config.signal ? AbortSignal.any([config.signal, timeout]) : timeout,
    })
  } catch (error) {
    // Cancelled by the caller (e.g. TanStack Query on unmount) — not a failure to report.
    if (config.signal?.aborted) throw error
    throw reportFailure(new ApiError(i18next.t('errors.network', { ns: 'common' })), config)
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  { body, config = {} }: RequestOptions
): Promise<ApiResponse<T>> {
  const response = await send(method, path, { body, config })
  const data = await parseBody(response)

  if (!response.ok) {
    const message = backendMessage(data) ?? i18next.t('errors.network', { ns: 'common' })
    throw reportFailure(new ApiError(message, response.status), config)
  }

  if (config.toast?.success) toast.success(config.toast.success)
  // The response shape is guaranteed by the OpenAPI contract (see contracts.d.ts).
  return { data: data as T, status: response.status }
}

export const fetchClient: ApiClient = {
  get: (url, config) => request('GET', url, { config }),
  post: (url, body, config) => request('POST', url, { body, config }),
  put: (url, body, config) => request('PUT', url, { body, config }),
  patch: (url, body, config) => request('PATCH', url, { body, config }),
  delete: (url, config) => request('DELETE', url, { config }),
}
