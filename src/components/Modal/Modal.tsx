import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Modal.module.css'

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  children?: ReactNode
  /** Ряд действий — сюда ставятся настоящие <Button>, не inline-копии (ds/components.md). */
  actions?: ReactNode
}

export function Modal({ title, children, actions, className, ...rest }: ModalProps) {
  return (
    <div {...rest} role="dialog" aria-modal="true" className={cx(styles.root, className)}>
      <div className={cx(styles.title, 'ds-heading-xl')}>{title}</div>
      {children && <div className={cx(styles.body, 'ds-body-sm')}>{children}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
