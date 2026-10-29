import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cx } from '../cx'
import styles from './Input.module.css'

export type InputState = 'default' | 'error' | 'focus' | 'disabled'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Лейбл над полем (DS/Label/xs) */
  label?: string
  /** Figma: State */
  state?: InputState
}

export function Input({ label, state = 'default', disabled, id, className, ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const isDisabled = disabled || state === 'disabled'
  return (
    <div className={cx(styles.root, className)} data-state={isDisabled ? 'disabled' : state}>
      {label && (
        <label htmlFor={inputId} className={cx(styles.label, 'ds-label-xs')}>
          {label}
        </label>
      )}
      <div className={styles.field}>
        <input
          {...rest}
          id={inputId}
          disabled={isDisabled}
          aria-invalid={state === 'error' || undefined}
          className={cx(styles.control, 'ds-body-sm')}
        />
      </div>
    </div>
  )
}
