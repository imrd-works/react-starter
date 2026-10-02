import type { ReactNode } from 'react'

import styles from './Field.module.scss'

export interface FieldProps {
  id: string
  label: string
  error?: string | undefined
  hint?: string | undefined
  children: ReactNode
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className={styles.root}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
