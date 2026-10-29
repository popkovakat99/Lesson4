import type { ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Tooltip.module.css'

export type TooltipPlacement = 'top' | 'bottom'

export interface TooltipProps {
  /** Figma: Placement — где стоит подсказка относительно элемента (стрелка смотрит на него) */
  placement?: TooltipPlacement
  children: ReactNode
  className?: string
}

export function Tooltip({ placement = 'top', children, className }: TooltipProps) {
  return (
    <span role="tooltip" className={cx(styles.root, styles[placement], className)}>
      <span className={cx(styles.box, 'ds-body-xs')}>{children}</span>
      <span className={styles.arrow} aria-hidden />
    </span>
  )
}
