import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Button.module.css'

export type ButtonType = 'primary' | 'secondary' | 'ghost'
export type ButtonState = 'default' | 'hover' | 'disabled' | 'loading' | 'focus'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Figma: Type */
  type?: ButtonType
  /** Figma: State. hover/focus/disabled работают и нативно — проп нужен, чтобы показать состояние принудительно. */
  state?: ButtonState
  /** HTML-атрибут type у <button> */
  htmlType?: 'button' | 'submit' | 'reset'
  children?: ReactNode
}

export function Button({
  type = 'primary',
  state = 'default',
  htmlType = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || state === 'disabled'
  const isLoading = state === 'loading'
  return (
    <button
      {...rest}
      type={htmlType}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      data-state={state}
      className={cx(styles.root, styles[type], 'ds-body-sm-medium', className)}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden /> : children}
    </button>
  )
}
