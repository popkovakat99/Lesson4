import type { ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Toast.module.css'

export type ToastVariant = 'success' | 'warning' | 'error' | 'info'

export interface ToastProps {
  /** Figma: Variant — цвет точки слева */
  variant?: ToastVariant
  title: ReactNode
  description?: ReactNode
  onClose?: () => void
  className?: string
}

export function Toast({ variant = 'info', title, description, onClose, className }: ToastProps) {
  return (
    <div role="status" className={cx(styles.root, className)}>
      <span className={cx(styles.dot, styles[variant])} aria-hidden />
      <div className={styles.body}>
        <div className={cx(styles.title, 'ds-body-sm-medium')}>{title}</div>
        {description && <div className={cx(styles.description, 'ds-body-xs')}>{description}</div>}
      </div>
      <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>
        <span className={styles.closeIcon} aria-hidden />
      </button>
    </div>
  )
}
