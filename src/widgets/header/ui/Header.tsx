import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'

import { useIsAuthenticated } from '@/entities/session'
import { useCurrentUser, UserBadge } from '@/entities/user'
import { LogoutButton } from '@/features/auth'
import { LanguageSwitcher } from '@/features/language-switcher'
import { APP_NAME, ROUTES } from '@/shared/config'
import { cx } from '@/shared/lib'
import { Container, Stack } from '@/shared/ui'

import styles from './Header.module.scss'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cx(styles.link, isActive && styles.linkActive)
}

export function Header() {
  const { t } = useTranslation('header')
  const isAuthenticated = useIsAuthenticated()
  const { data: user } = useCurrentUser({ enabled: isAuthenticated })

  return (
    <header className={styles.root}>
      <Container>
        <Stack direction="row" align="center" justify="between" gap="l" wrap>
          <Link to={ROUTES.home} className={styles.logo}>
            {APP_NAME}
          </Link>

          <Stack as="nav" direction="row" align="center" gap="m" aria-label={t('navLabel')}>
            <NavLink to={ROUTES.home} end className={navLinkClass}>
              {t('nav.home')}
            </NavLink>
            <NavLink to={ROUTES.contacts} className={navLinkClass}>
              {t('nav.contacts')}
            </NavLink>
            {isAuthenticated ? (
              <NavLink to={ROUTES.dashboard} className={navLinkClass}>
                {t('nav.dashboard')}
              </NavLink>
            ) : null}
          </Stack>

          <Stack direction="row" align="center" gap="s">
            <LanguageSwitcher />
            {user ? <UserBadge user={user} /> : null}
            {isAuthenticated ? (
              <LogoutButton />
            ) : (
              <NavLink to={ROUTES.login} className={navLinkClass}>
                {t('nav.login')}
              </NavLink>
            )}
          </Stack>
        </Stack>
      </Container>
    </header>
  )
}
