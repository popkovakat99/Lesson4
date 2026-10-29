import { Fragment } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { cx } from '../cx'
import styles from './Breadcrumb.module.css'

export type BreadcrumbState = 'default' | 'current'

export interface BreadcrumbItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Figma: State (один пункт из ComponentSet `Breadcrumb`) */
  state?: BreadcrumbState
}

/** Один пункт пути — вариант ComponentSet `Breadcrumb` в Figma. */
export function BreadcrumbItem({ state = 'default', className, children, href, ...rest }: BreadcrumbItemProps) {
  if (state === 'current') {
    return (
      <span aria-current="page" className={cx(styles.current, 'ds-body-sm-medium', className)}>
        {children}
      </span>
    )
  }
  return (
    <a {...rest} href={href ?? '#'} className={cx(styles.item, 'ds-body-sm', className)}>
      {children}
    </a>
  )
}

export interface BreadcrumbProps {
  /** Пункты пути; последний — текущая страница */
  items: Array<{ label: string; href?: string }>
  className?: string
}

/** Полный путь «Серверы / vpn-ams-01 / Управление» — как демо-фрейм `Breadcrumb / demo path`. */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Навигационная цепочка" className={cx(styles.root, className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={item.label + i}>
            <BreadcrumbItem state={last ? 'current' : 'default'} href={item.href}>
              {item.label}
            </BreadcrumbItem>
            {!last && (
              <span className={cx(styles.separator, 'ds-body-sm')} aria-hidden>
                /
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
