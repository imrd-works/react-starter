import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { NotFoundPage } from '@/pages/not-found'
import { Button, Container, Seo, Stack } from '@/shared/ui'

import styles from './RouteErrorBoundary.module.scss'

const HTTP_NOT_FOUND = 404

/** Catches render/loader errors of every route. Report `error` to Sentry etc. here. */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const { t } = useTranslation()

  if (isRouteErrorResponse(error) && error.status === HTTP_NOT_FOUND) {
    return <NotFoundPage />
  }

  return (
    <Container className={styles.root}>
      <Seo title={t('errors.unexpectedTitle')} noIndex />
      <Stack gap="m" align="start" role="alert">
        <h1 className={styles.title}>{t('errors.unexpectedTitle')}</h1>
        <p className={styles.text}>{t('errors.unexpectedText')}</p>
        <Button
          onClick={() => {
            location.reload()
          }}
        >
          {t('actions.reload')}
        </Button>
      </Stack>
    </Container>
  )
}
