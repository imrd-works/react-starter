import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'
import { toast } from '@/shared/lib'
import { Button, Container, Seo, Stack } from '@/shared/ui'

import styles from './HomePage.module.scss'
import { fetchDemoError } from '../api/demoApi'

/** The API client already showed a toast — nothing else to do here. */
function ignoreHandledError(): void {
  // noop
}

export function HomePage() {
  const { t } = useTranslation('home')

  return (
    <Container className={styles.root}>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <Stack gap="xl">
        <Stack gap="s">
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.lead}>{t('lead')}</p>
        </Stack>
        <Stack direction="row" gap="s" wrap>
          <Button
            onClick={() => {
              toast.success(t('toastSuccess'))
            }}
          >
            {t('actions.toast')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => void fetchDemoError().catch(ignoreHandledError)}
          >
            {t('actions.apiError')}
          </Button>
          {import.meta.env.DEV ? (
            <Link to={ROUTES.uiKit} className={styles.link}>
              {t('actions.uiKit')}
            </Link>
          ) : null}
        </Stack>
      </Stack>
    </Container>
  )
}
