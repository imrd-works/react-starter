import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

import { toast } from '@/shared/lib'
import { server } from '@/shared/mocks/node'

import { api } from '.'
import { configureApi } from './hooks'
import { ApiError } from './types'

describe('api client', () => {
  const onUnauthorized = vi.fn<() => void>()
  let toastError: MockInstance<typeof toast.error>
  let toastSuccess: MockInstance<typeof toast.success>

  beforeEach(() => {
    configureApi({ getAccessToken: () => null, onUnauthorized })
    toastError = vi.spyOn(toast, 'error').mockImplementation(() => undefined)
    toastSuccess = vi.spyOn(toast, 'success').mockImplementation(() => undefined)
  })

  it('sends the access token and returns data with status', async () => {
    configureApi({ getAccessToken: () => 'demo-token' })

    const response = await api.get<{ name: string }>('/user/me')

    expect(response.status).toBe(200)
    expect(response.data.name).toBe('Demo User')
  })

  it('shows the backend message in an error toast and rejects with ApiError', async () => {
    const request = api.get('/demo/error')

    await expect(request).rejects.toEqual(new ApiError('Example backend error message', 500))
    expect(toastError).toHaveBeenCalledWith('Example backend error message')
  })

  it('does not toast silent requests and supports custom messages', async () => {
    await expect(api.get('/demo/error', { silent: true })).rejects.toBeInstanceOf(ApiError)
    expect(toastError).not.toHaveBeenCalled()

    await api.post('/contacts', { email: 'a@b.co', message: 'Hi' }, { toast: { success: 'Sent' } })
    expect(toastSuccess).toHaveBeenCalledWith('Sent')
  })

  it('calls the unauthorized hook on 401', async () => {
    await expect(api.get('/user/me')).rejects.toMatchObject({ status: 401 })
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('serializes query params and skips undefined values', async () => {
    let receivedUrl = ''
    server.use(
      http.get('/api/search', ({ request }) => {
        receivedUrl = request.url
        return HttpResponse.json([])
      })
    )

    await api.get('/search', { params: { q: 'react', page: 2, filter: undefined } })

    expect(new URL(receivedUrl).search).toBe('?q=react&page=2')
  })

  it('reports network failures but not caller cancellations', async () => {
    server.use(http.get('/api/offline', () => HttpResponse.error()))
    await expect(api.get('/offline')).rejects.toBeInstanceOf(ApiError)
    expect(toastError).toHaveBeenCalledWith('Request failed. Please try again.')

    toastError.mockClear()
    const controller = new AbortController()
    controller.abort()
    await expect(api.get('/user/me', { signal: controller.signal })).rejects.toThrow()
    expect(toastError).not.toHaveBeenCalled()
  })

  it('returns undefined data for empty responses', async () => {
    server.use(http.delete('/api/items/1', () => new HttpResponse(null, { status: 204 })))

    await expect(api.delete('/items/1')).resolves.toEqual({ data: undefined, status: 204 })
  })

  it('falls back to a generic message when backend sends none', async () => {
    server.use(http.get('/api/empty-error', () => new HttpResponse(null, { status: 502 })))

    await expect(api.get('/empty-error')).rejects.toMatchObject({ status: 502 })
    expect(toastError).toHaveBeenCalledWith('Request failed. Please try again.')
  })
})
