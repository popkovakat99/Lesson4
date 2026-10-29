import type { AnchorHTMLAttributes } from 'react'
import { cx } from '../cx'
import styles from './LinkItem.module.css'

export type LinkItemProps = AnchorHTMLAttributes<HTMLAnchorElement>

/** Текстовая ссылка с chevron-right — для FAQ-листов и переходов из заголовков секций. */
export function LinkItem({ className, children, href, ...rest }: LinkItemProps) {
  return (
    <a {...rest} href={href ?? '#'} className={cx(styles.root, 'ds-body-sm-medium', className)}>
      <span>{children}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M5 3.5 8.5 7 5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
