import { useState } from 'react'
import { cx } from '../cx'
import styles from './Select.module.css'

export type SelectState = 'default' | 'open' | 'error' | 'hover' | 'disabled'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Figma: State. open/hover можно показать принудительно; без пропа работают от клика и наведения. */
  state?: SelectState
  /** Текст ошибки под полем (State=error) */
  errorMessage?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Выберите значение',
  state = 'default',
  errorMessage,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const open = state === 'open' || isOpen
  const disabled = state === 'disabled'
  const selected = options.find((o) => o.value === value)

  return (
    <div className={cx(styles.root, className)} data-state={state}>
      <button
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className={cx(styles.value, 'ds-body-sm', !selected && styles.placeholder)}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.caret} aria-hidden />
      </button>

      {open && (
        <ul className={styles.panel} role="listbox">
          {options.map((o) => {
            const isSelected = o.value === value
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                className={cx(styles.option, isSelected && styles.optionSelected)}
                onClick={() => {
                  onChange?.(o.value)
                  setIsOpen(false)
                }}
              >
                <span className={cx(styles.optionLabel, 'ds-body-sm')}>{o.label}</span>
                {isSelected && <span className={styles.check} aria-hidden />}
              </li>
            )
          })}
        </ul>
      )}

      {state === 'error' && errorMessage && (
        <span className={cx(styles.error, 'ds-body-xs')}>{errorMessage}</span>
      )}
    </div>
  )
}
