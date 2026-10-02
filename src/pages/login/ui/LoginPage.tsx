import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { LoginForm } from '@/features/auth'
import { env, ROUTES } from '@/shared/config'
import { getSafeRedirect } from '@/shared/lib'
import { Container, Seo, Stack } from '@/shared/ui'

import styles from './LoginPage.module.scss'

export function LoginPage() {
  const { t } = useTranslation('login')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  function handleSuccess() {
    const target = getSafeRedirect(searchParams.get('redirect'), ROUTES.dashboard)
    void navigate(target, { replace: true })
  }

  return (
    <Container size="narrow" className={styles.root}>
      <Seo title={t('seo.title')} noIndex />
      <Stack gap="xl">
        <Stack gap="s">
          <h1 className={styles.title}>{t('title')}</h1>
          {env.apiMocking ? <p className={styles.lead}>{t('demoHint')}</p> : null}
        </Stack>
        <LoginForm onSuccess={handleSuccess} />
      </Stack>
    </Container>
  )
}
