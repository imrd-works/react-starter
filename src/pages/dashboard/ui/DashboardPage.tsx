import { useTranslation } from 'react-i18next'

import { useCurrentUser } from '@/entities/user'
import { Container, Seo, Stack } from '@/shared/ui'

import styles from './DashboardPage.module.scss'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  // The route is protected by the `requireAuth` middleware, so the user is signed in.
  const { data: user, isPending, isError } = useCurrentUser({ enabled: true })

  return (
    <Container className={styles.root}>
      <Seo title={t('seo.title')} noIndex />
      <Stack gap="s">
        <h1 className={styles.title}>{t('title')}</h1>
        {isPending ? <p className={styles.lead}>{t('status.loading', { ns: 'common' })}</p> : null}
        {isError ? <p className={styles.lead}>{t('error')}</p> : null}
        {user ? <p className={styles.lead}>{t('greeting', { name: user.name })}</p> : null}
      </Stack>
    </Container>
  )
}
