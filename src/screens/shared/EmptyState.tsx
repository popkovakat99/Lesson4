import type { ReactNode } from 'react'
import { cx } from '../../components/cx'
import { IconBadge } from './IconBadge'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  children?: ReactNode
  action?: ReactNode
  /** compact — внутри карточки/списка, без рамки */
  compact?: boolean
}

/** Пустое состояние: «нет серверов», «ничего не найдено», «раздел в разработке». Кандидат на вынос в базу. */
export function EmptyState({ icon, title, children, action, compact }: EmptyStateProps) {
  return (
    <div className={cx(styles.root, compact && styles.compact)}>
      <IconBadge tone="muted">{icon}</IconBadge>
      <span className={cx(styles.title, 'ds-heading-lg')}>{title}</span>
      {children && <span className={cx(styles.text, 'ds-body-sm')}>{children}</span>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
