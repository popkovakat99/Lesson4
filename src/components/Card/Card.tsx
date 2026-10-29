import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Card.module.css'

export type CardType = 'static' | 'interactive'
export type CardState = 'default' | 'hover'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma: Type. interactive реагирует на наведение и клик. */
  type?: CardType
  /** Figma: State */
  state?: CardState
  title: ReactNode
  children?: ReactNode
}

export function Card({ type = 'static', state = 'default', title, children, className, ...rest }: CardProps) {
  const interactive = type === 'interactive'
  return (
    <div
      {...rest}
      role={interactive ? 'button' : rest.role}
      tabIndex={interactive ? 0 : rest.tabIndex}
      data-state={state}
      className={cx(styles.root, styles[type], className)}
    >
      <div className={cx(styles.title, 'ds-heading-lg')}>{title}</div>
      {children && <div className={cx(styles.body, 'ds-body-xs')}>{children}</div>}
    </div>
  )
}
