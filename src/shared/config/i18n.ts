export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'en'
export const LANGUAGE_STORAGE_KEY = 'app.language'

export function isSupportedLanguage(value: unknown): value is Language {
  return (SUPPORTED_LANGUAGES as readonly unknown[]).includes(value)
}
