import type { ReactNode } from 'react'
import { cx } from '../../components/cx'
import styles from './IconBadge.module.css'

export type IconTone = 'action' | 'success' | 'warning' | 'error' | 'muted' | 'default' | 'on-action'

export interface IconBadgeProps {
  children: ReactNode
  /** Цвет иконки (семантика текста) */
  tone?: IconTone
  /** Фон плашки: subtle (по умолчанию), error-subtle или action (акцентный) */
  surface?: 'subtle' | 'error' | 'action'
  className?: string
}

/** Квадратная плашка под иконку (Figma: `IconBadge` / `Ico` на экранах). */
export function IconBadge({ children, tone = 'action', surface = 'subtle', className }: IconBadgeProps) {
  return <span className={cx(styles.root, styles[`surface-${surface}`], styles[`tone-${tone}`], className)}>{children}</span>
}
