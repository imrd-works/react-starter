import auth from '@/features/auth/locales/en.json'
import contactForm from '@/features/contact-form/locales/en.json'
import languageSwitcher from '@/features/language-switcher/locales/en.json'
import contacts from '@/pages/contacts/locales/en.json'
import dashboard from '@/pages/dashboard/locales/en.json'
import home from '@/pages/home/locales/en.json'
import login from '@/pages/login/locales/en.json'
import notFound from '@/pages/not-found/locales/en.json'
import common from '@/shared/locales/en.json'
import header from '@/widgets/header/locales/en.json'

/**
 * Default-language resources: bundled eagerly and used as the source of truth
 * for translation key types. Namespace = slice folder name (`shared` → `common`).
 * Other languages are lazy-loaded from `<slice>/locales/<lang>.json`.
 */
export const defaultResources = {
  common,
  header,
  auth,
  'contact-form': contactForm,
  'language-switcher': languageSwitcher,
  home,
  contacts,
  login,
  dashboard,
  'not-found': notFound,
} as const
