import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { cx } from '@/shared/lib'

import { CloseIcon } from '../icons'
import styles from './Modal.module.scss'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: 's' | 'm' | 'l'
  footer?: ReactNode
  children: ReactNode
}

const sizeClass = { s: styles.sizeS, m: styles.sizeM, l: styles.sizeL }

/**
 * Built on the native `<dialog>`: focus trap, `Esc`, top layer and inert
 * background come from the browser — no portal or focus-lock library needed.
 */
export function Modal({ open, onClose, title, size = 'm', footer, children }: ModalProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    // eslint-disable-next-line jsx-a11y-x/click-events-have-key-events, jsx-a11y-x/no-noninteractive-element-interactions -- backdrop click is a mouse shortcut; keyboard users close the dialog with Esc natively
    <dialog
      ref={dialogRef}
      className={cx(styles.root, sizeClass[size])}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={t('actions.close')}
            onClick={onClose}
          >
            <CloseIcon aria-hidden />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </dialog>
  )
}
