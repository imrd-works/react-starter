import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'
import { Container, Seo, Stack } from '@/shared/ui'

import styles from './NotFoundPage.module.scss'

export function NotFoundPage() {
  const { t } = useTranslation('not-found')

  return (
    <Container className={styles.root}>
      <Seo title={t('title')} noIndex />
      <Stack gap="m" align="start">
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lead}>{t('text')}</p>
        <Link to={ROUTES.home}>{t('actions.goHome', { ns: 'common' })}</Link>
      </Stack>
    </Container>
  )
}
