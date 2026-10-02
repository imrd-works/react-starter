import type { BackendModule, ReadCallback } from 'i18next'

interface LocaleModule {
  default: Record<string, unknown>
}

// The default language (en) is bundled eagerly in resources.ts, so it is excluded here.
const loaders = import.meta.glob<LocaleModule>([
  '/src/*/locales/*.json',
  '/src/*/*/locales/*.json',
  '!/src/**/locales/en.json',
])

/** `/src/pages/not-found/locales/ru.json` → `ru:not-found`; `/src/shared/locales/…` → `common`. */
function toKey(path: string): string | undefined {
  const match = /^\/src\/(?:shared|[\w-]+\/([\w-]+))\/locales\/([\w-]+)\.json$/.exec(path)
  if (!match) return undefined
  const [, slice, language] = match
  return `${language ?? ''}:${slice ?? 'common'}`
}

const loadersByKey = new Map(
  Object.entries(loaders).flatMap(([path, load]) => {
    const key = toKey(path)
    return key ? [[key, load] as const] : []
  })
)

export const lazyBackend: BackendModule = {
  type: 'backend',
  init: () => undefined,
  read(language: string, namespace: string, callback: ReadCallback) {
    const load = loadersByKey.get(`${language}:${namespace}`)
    if (!load) {
      // Missing file is not an error: i18next falls back to the default language.
      callback(null, {})
      return
    }
    void (async () => {
      try {
        const module = await load()
        callback(null, module.default)
      } catch (error) {
        callback(error instanceof Error ? error : new Error(String(error)), false)
      }
    })()
  },
}
