import type { components } from './contracts'

/** Backend DTOs generated from openapi.json (`npm run generate:api`). */
export type ApiSchemas = components['schemas']

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
  signal?: AbortSignal
  /** Do not show the automatic error toast — handle the error at the call site. */
  silent?: boolean
  /** Override toast messages. Success toast is shown only when `success` is set. */
  toast?: { success?: string; error?: string }
}

export interface ApiResponse<T> {
  data: T
  status: number
}

/** Transport-agnostic client. Swap the adapter without touching slices. */
export interface ApiClient {
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  post<T>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  put<T>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  patch<T>(url: string, body?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
}

/** Every failed request is normalized into this error, so slices never depend on the transport. */
export class ApiError extends Error {
  readonly status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
