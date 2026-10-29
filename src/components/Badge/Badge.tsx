import type { ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Badge.module.css'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral'

export interface BadgeProps {
  /** Figma: Variant — цвет точки */
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={cx(styles.root, className)}>
      <span className={cx(styles.dot, styles[variant])} aria-hidden />
      <span className={cx(styles.label, 'ds-label-xs')}>{children}</span>
    </span>
  )
}
