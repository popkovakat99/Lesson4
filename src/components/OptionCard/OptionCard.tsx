import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'
import styles from './OptionCard.module.css'

export type OptionCardState = 'default' | 'selected'

export interface OptionCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  /** Figma: State */
  state?: OptionCardState
  title: ReactNode
  subtitle?: ReactNode
  /** Иконка 18×18. Без неё — плейсхолдер. */
  icon?: ReactNode
}

function PlaceholderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1.5" y="3" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M1.5 7h15" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/** Карточка опции «выбери один из»: ОС, тариф и т. п. */
export function OptionCard({ state = 'default', title, subtitle, icon, className, ...rest }: OptionCardProps) {
  const selected = state === 'selected'
  return (
    <button
      {...rest}
      type="button"
      role="radio"
      aria-checked={selected}
      data-state={state}
      className={cx(styles.root, className)}
    >
      <span className={styles.iconBadge}>{icon ?? <PlaceholderIcon />}</span>
      <span className={cx(styles.title, 'ds-body-sm-medium')}>{title}</span>
      {subtitle && <span className={cx(styles.subtitle, 'ds-body-xs')}>{subtitle}</span>}
    </button>
  )
}
