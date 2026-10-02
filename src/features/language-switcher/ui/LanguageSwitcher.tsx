import { useId, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { isSupportedLanguage, SUPPORTED_LANGUAGES } from '@/shared/config'

import styles from './LanguageSwitcher.module.scss'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation('language-switcher')
  const id = useId()

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    if (isSupportedLanguage(value)) void i18n.changeLanguage(value)
  }

  return (
    <span className={styles.root}>
      <label htmlFor={id} className={styles.label}>
        {t('label')}
      </label>
      <select
        id={id}
        className={styles.select}
        value={i18n.resolvedLanguage}
        onChange={handleChange}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`languages.${language}`)}
          </option>
        ))}
      </select>
    </span>
  )
}
