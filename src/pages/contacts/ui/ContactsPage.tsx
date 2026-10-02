import { useTranslation } from 'react-i18next'

import { ContactForm } from '@/features/contact-form'
import { Container, Seo, Stack } from '@/shared/ui'

import styles from './ContactsPage.module.scss'

export function ContactsPage() {
  const { t } = useTranslation('contacts')

  return (
    <Container size="narrow" className={styles.root}>
      <Seo title={t('seo.title')} description={t('seo.description')} />
      <Stack gap="xl">
        <Stack gap="s">
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.lead}>{t('lead')}</p>
        </Stack>
        <ContactForm />
      </Stack>
    </Container>
  )
}
