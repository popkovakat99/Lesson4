import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../cx'
import styles from './Pagination.module.css'

export type PageButtonState = 'default' | 'active' | 'hover'

export interface PageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma: State (одна кнопка из ComponentSet `Pagination`) */
  state?: PageButtonState
}

/** Одна кнопка страницы — вариант ComponentSet `Pagination` в Figma. */
export function PageButton({ state = 'default', className, ...rest }: PageButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      aria-current={state === 'active' ? 'page' : undefined}
      data-state={state}
      className={cx(styles.page, 'ds-body-sm-medium', className)}
    />
  )
}

export interface PaginationProps {
  page: number
  total: number
  onChange?: (page: number) => void
  className?: string
}

function pageList(page: number, total: number): Array<number | 'gap'> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, page - 1, page, page + 1, total].filter((p) => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  const out: Array<number | 'gap'> = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap')
    out.push(p)
  })
  return out
}

/** Полная строка «‹ 1 2 3 … 12 ›» — как демо-фрейм `Pagination / demo row`. */
export function Pagination({ page, total, onChange, className }: PaginationProps) {
  return (
    <nav aria-label="Страницы" className={cx(styles.root, className)}>
      <PageButton aria-label="Предыдущая" disabled={page <= 1} onClick={() => onChange?.(page - 1)}>
        ‹
      </PageButton>
      {pageList(page, total).map((p, i) =>
        p === 'gap' ? (
          <span key={'gap' + i} className={cx(styles.ellipsis, 'ds-body-sm')}>
            …
          </span>
        ) : (
          <PageButton key={p} state={p === page ? 'active' : 'default'} onClick={() => onChange?.(p)}>
            {p}
          </PageButton>
        ),
      )}
      <PageButton aria-label="Следующая" disabled={page >= total} onClick={() => onChange?.(page + 1)}>
        ›
      </PageButton>
    </nav>
  )
}
