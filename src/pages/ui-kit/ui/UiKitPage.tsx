import { useState } from 'react'

import { Button, Container, Input, Modal, Seo, Stack, Textarea } from '@/shared/ui'

import styles from './UiKitPage.module.scss'

/** Dev-only showcase of shared/ui. Not translated on purpose: it is a developer tool. */
export function UiKitPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Container className={styles.root}>
      <Seo title="UI kit" noIndex />
      <Stack gap="2xl">
        <h1 className={styles.title}>UI kit</h1>

        <Stack as="section" gap="s" aria-labelledby="ui-kit-buttons">
          <h2 id="ui-kit-buttons" className={styles.section}>
            Button
          </h2>
          <Stack direction="row" gap="s" align="center" wrap>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button size="s">Small</Button>
            <Button size="l">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Stack>
        </Stack>

        <Stack as="section" gap="s" aria-labelledby="ui-kit-inputs" className={styles.form}>
          <h2 id="ui-kit-inputs" className={styles.section}>
            Input
          </h2>
          <Input label="Default" placeholder="Type something" />
          <Input label="With hint" hint="Helpful description" />
          <Input label="With error" error="Something is wrong" defaultValue="Invalid value" />
          <Input label="Disabled" disabled defaultValue="Read only" />
          <Textarea label="Textarea" hint="Multiline input" />
        </Stack>

        <Stack as="section" gap="s" align="start" aria-labelledby="ui-kit-modal">
          <h2 id="ui-kit-modal" className={styles.section}>
            Modal
          </h2>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            Open modal
          </Button>
          <Modal
            open={isModalOpen}
            title="Native dialog"
            onClose={() => {
              setIsModalOpen(false)
            }}
            footer={
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                }}
              >
                Got it
              </Button>
            }
          >
            Focus trap, Esc and backdrop are handled by the browser.
          </Modal>
        </Stack>
      </Stack>
    </Container>
  )
}
