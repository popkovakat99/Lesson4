import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../cx'
import styles from './Tabs.module.css'

export type TabState = 'default' | 'active' | 'hover'

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma: State (одна вкладка из ComponentSet `Tabs`) */
  state?: TabState
}

/** Одна вкладка — вариант ComponentSet `Tabs` в Figma. */
export function Tab({ state = 'default', className, children, ...rest }: TabProps) {
  const active = state === 'active'
  return (
    <button
      {...rest}
      type="button"
      role="tab"
      aria-selected={active}
      data-state={state}
      className={cx(styles.tab, active || state === 'hover' ? 'ds-body-sm-medium' : 'ds-body-sm', className)}
    >
      <span>{children}</span>
      <span className={styles.underline} aria-hidden />
    </button>
  )
}

export interface TabsProps {
  items: string[]
  value: string
  onChange?: (value: string) => void
  className?: string
}

/** Полоса вкладок: сборка из нескольких <Tab>. */
export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cx(styles.list, className)}>
      {items.map((item) => (
        <Tab key={item} state={item === value ? 'active' : 'default'} onClick={() => onChange?.(item)}>
          {item}
        </Tab>
      ))}
    </div>
  )
}
