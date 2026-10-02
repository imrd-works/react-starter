import type { HTMLAttributes } from 'react'

import { cx } from '@/shared/lib'

import styles from './Container.module.scss'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'narrow' | 'default' | 'wide'
}

const sizeClass = { narrow: styles.narrow, default: styles.default, wide: styles.wide }

export function Container({ size = 'default', className, ...rest }: ContainerProps) {
  return <div {...rest} className={cx(styles.root, sizeClass[size], className)} />
}
