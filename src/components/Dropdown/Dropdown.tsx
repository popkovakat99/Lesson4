import { useState } from 'react'
import { cx } from '../cx'
import styles from './Dropdown.module.css'

export type DropdownState = 'closed' | 'open' | 'hover'

export interface DropdownItem {
  label: string
  onSelect?: () => void
  /** Опасное действие — красный текст (text-error) */
  destructive?: boolean
}

export interface DropdownProps {
  items: DropdownItem[]
  /** Figma: State. Без пропа открывается кликом по триггеру. */
  state?: DropdownState
  'aria-label'?: string
  className?: string
}

export function Dropdown({ items, state = 'closed', className, ...rest }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const open = state === 'open' || isOpen

  return (
    <div className={cx(styles.root, className)} data-state={state}>
      <button
        type="button"
        className={cx(styles.trigger, 'ds-body-sm-medium')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={rest['aria-label'] ?? 'Действия'}
        onClick={() => setIsOpen((v) => !v)}
      >
        •••
      </button>

      {open && (
        <ul className={styles.panel} role="menu">
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={cx(styles.item, 'ds-body-sm', item.destructive && styles.destructive)}
                onClick={() => {
                  item.onSelect?.()
                  setIsOpen(false)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
