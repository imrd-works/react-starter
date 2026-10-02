import { afterEach, describe, expect, it, vi } from 'vitest'

async function loadEnv() {
  vi.resetModules()
  const { env } = await import('./env')
  return env
}

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('falls back to safe defaults', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('VITE_SITE_URL', '')
    vi.stubEnv('VITE_API_MOCKING', '')

    await expect(loadEnv()).resolves.toEqual({
      apiBaseUrl: '/api',
      siteUrl: 'https://example.com',
      apiMocking: false,
    })
  })

  it('reads configured values', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com')
    vi.stubEnv('VITE_SITE_URL', 'https://my.site')
    vi.stubEnv('VITE_API_MOCKING', 'true')

    await expect(loadEnv()).resolves.toMatchObject({
      apiBaseUrl: 'https://api.example.com',
      siteUrl: 'https://my.site',
      apiMocking: true,
    })
  })

  it.each([
    ['VITE_API_MOCKING', 'yes'],
    ['VITE_SITE_URL', 'not a url'],
  ])('fails fast on invalid %s', async (name, value) => {
    vi.stubEnv(name, value)

    await expect(loadEnv()).rejects.toThrow(name)
  })
})
