import type { ReactNode } from 'react'
import { Breadcrumb } from '../../components'
import styles from './PageHeader.module.css'

export interface PageHeaderProps {
  /** Путь; последний пункт — текущая страница. У пунктов с href — переход (через LinkInterceptor) */
  breadcrumb: Array<string | { label: string; href: string }>
  title: ReactNode
  /** Строка под заголовком (IP, uptime, регион) */
  meta?: ReactNode
  /** Действия справа */
  actions?: ReactNode
}

/** Шапка страницы: хлебные крошки + H1 (Figma: `PageHeader`). */
export function PageHeader({ breadcrumb, title, meta, actions }: PageHeaderProps) {
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Breadcrumb items={breadcrumb.map((b) => (typeof b === 'string' ? { label: b } : b))} />
        <div className={styles.title}>{title}</div>
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
