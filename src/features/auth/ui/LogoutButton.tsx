import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui'

import { useLogout } from '../model/useLogout'

export function LogoutButton() {
  const { t } = useTranslation('auth')
  const logout = useLogout()

  return (
    <Button variant="ghost" size="s" onClick={() => void logout()}>
      {t('logout')}
    </Button>
  )
}
