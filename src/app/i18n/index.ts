import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type Language,
} from '@/shared/config'

import { lazyBackend } from './lazyBackend'
import { defaultResources } from './resources'

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    return null
  }
}

function detectLanguage(): Language {
  const stored = readStoredLanguage()
  if (isSupportedLanguage(stored)) return stored

  const browser = navigator.language.split('-', 1)[0]
  return isSupportedLanguage(browser) ? browser : DEFAULT_LANGUAGE
}

void i18next
  .use(lazyBackend)
  .use(initReactI18next)
  .init({
    lng: detectLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: Object.keys(defaultResources),
    defaultNS: 'common',
    resources: { [DEFAULT_LANGUAGE]: defaultResources },
    // Default language is bundled, others are fetched by the lazy backend.
    partialBundledLanguages: true,
    interpolation: { escapeValue: false },
    returnNull: false,
  })

i18next.on('languageChanged', (language) => {
  document.documentElement.lang = language
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Storage can be unavailable (private mode) — language just will not persist.
  }
})

export { i18next }
