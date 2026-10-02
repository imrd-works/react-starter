import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '@/shared/lib'

import { SpinnerIcon } from '../icons'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 's' | 'm' | 'l'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
}

const sizeClass: Record<ButtonSize, string> = {
  s: styles.sizeS,
  m: styles.sizeM,
  l: styles.sizeL,
}

export function Button({
  variant = 'primary',
  size = 'm',
  loading = false,
  icon,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx(styles.root, variantClass[variant], sizeClass[size], className)}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <SpinnerIcon className={styles.spinner} aria-hidden /> : icon}
      {children}
    </button>
  )
}
