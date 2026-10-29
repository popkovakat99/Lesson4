import type { ReactNode } from 'react'
import { cx } from '../cx'
import styles from './StepItem.module.css'

export interface StepItemProps {
  number: ReactNode
  title: ReactNode
  description?: ReactNode
  className?: string
}

/** Нумерованный шаг explainer'а: кружок с номером + заголовок + описание. */
export function StepItem({ number, title, description, className }: StepItemProps) {
  return (
    <div className={cx(styles.root, className)}>
      <span className={cx(styles.num, 'ds-body-sm-medium')}>{number}</span>
      <div className={styles.text}>
        <div className={cx(styles.title, 'ds-body-sm-medium')}>{title}</div>
        {description && <div className={cx(styles.description, 'ds-body-xs')}>{description}</div>}
      </div>
    </div>
  )
}
