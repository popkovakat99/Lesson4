import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'
import styles from './IconButton.module.css'

export type IconButtonType = 'primary' | 'secondary'
export type IconButtonState = 'default' | 'hover' | 'disabled'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Figma: Type */
  type?: IconButtonType
  /** Figma: State */
  state?: IconButtonState
  /** Иконка. Без неё — плейсхолдер 14×14, как в Figma. */
  icon?: ReactNode
  /** Обязательная подпись для скринридеров */
  'aria-label': string
}

export function IconButton({
  type = 'primary',
  state = 'default',
  icon,
  disabled,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      disabled={disabled || state === 'disabled'}
      data-state={state}
      className={cx(styles.root, styles[type], className)}
    >
      {icon ?? <span className={styles.placeholder} aria-hidden />}
    </button>
  )
}
