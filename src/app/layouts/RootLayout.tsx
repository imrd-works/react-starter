import { useTranslation } from 'react-i18next'
import { Outlet, ScrollRestoration, useNavigation } from 'react-router'

import { APP_NAME } from '@/shared/config'
import { Container } from '@/shared/ui'
import { Header } from '@/widgets/header'

import styles from './RootLayout.module.scss'

const CURRENT_YEAR = new Date().getFullYear()

export function RootLayout() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const isNavigating = navigation.state !== 'idle'

  return (
    <div className={styles.root}>
      {isNavigating ? (
        <div className={styles.progress} role="progressbar" aria-label={t('status.loading')} />
      ) : null}
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <Container>
          <small>{`© ${String(CURRENT_YEAR)} ${APP_NAME}`}</small>
        </Container>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
