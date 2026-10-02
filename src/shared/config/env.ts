/**
 * Validated, typed environment. Never read `import.meta.env.VITE_*` outside this file
 * (enforced by ESLint). Deliberately dependency-free: it is part of the initial bundle.
 */
type EnvName = 'VITE_API_BASE_URL' | 'VITE_SITE_URL' | 'VITE_API_MOCKING'

function readRaw(name: EnvName): string | undefined {
  const value: unknown = import.meta.env[name]
  return typeof value === 'string' && value !== '' ? value : undefined
}

function readString(name: EnvName, fallback: string): string {
  return readRaw(name) ?? fallback
}

function readBoolean(name: EnvName, fallback: boolean): boolean {
  const value = readRaw(name)
  if (value === undefined) return fallback
  if (value === 'true' || value === 'false') return value === 'true'
  throw new Error(`Invalid env ${name}="${value}": expected "true" or "false"`)
}

function readUrl(name: EnvName, fallback: string): string {
  const value = readString(name, fallback)
  if (!URL.canParse(value))
    throw new Error(`Invalid env ${name}="${value}": expected an absolute URL`)
  return value
}

export const env = {
  apiBaseUrl: readString('VITE_API_BASE_URL', '/api'),
  siteUrl: readUrl('VITE_SITE_URL', 'https://example.com'),
  apiMocking: readBoolean('VITE_API_MOCKING', false),
} as const
