import type { ElementType, HTMLAttributes } from 'react'

import { cx } from '@/shared/lib'

import styles from './Stack.module.scss'

type Gap = 'none' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl'

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  direction?: 'column' | 'row'
  gap?: Gap
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
}

const gapClass: Record<Gap, string> = {
  none: styles.gapNone,
  xs: styles.gapXs,
  s: styles.gapS,
  m: styles.gapM,
  l: styles.gapL,
  xl: styles.gapXl,
  '2xl': styles.gap2xl,
}

const alignClass = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
}

const justifyClass = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
}

/** Flex layout primitive. Replaces ad-hoc utility classes like `.flex .gap-m`. */
export function Stack({
  as: Component = 'div',
  direction = 'column',
  gap = 'm',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  ...rest
}: StackProps) {
  return (
    <Component
      {...rest}
      className={cx(
        styles.root,
        direction === 'row' && styles.row,
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        wrap && styles.wrap,
        className
      )}
    />
  )
}
