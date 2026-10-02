import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, describe, expect, it } from 'vitest'

import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  afterEach(async () => {
    await i18next.changeLanguage('en')
  })

  it('switches the language and loads its translations lazily', async () => {
    render(<LanguageSwitcher />)

    await userEvent.selectOptions(screen.getByLabelText('Language'), 'ru')

    await waitFor(() => {
      expect(i18next.resolvedLanguage).toBe('ru')
    })
    expect(
      screen.getByLabelText(i18next.t('label', { ns: 'language-switcher', lng: 'ru' }))
    ).toHaveValue('ru')
  })
})
