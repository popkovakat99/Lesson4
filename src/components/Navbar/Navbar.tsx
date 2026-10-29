import type { ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Navbar.module.css'

export interface NavbarItem {
  label: string
  href?: string
  active?: boolean
}

export interface NavbarProps {
  logo?: ReactNode
  items: NavbarItem[]
  className?: string
}

export function Navbar({ logo = 'CryptoVPS', items, className }: NavbarProps) {
  return (
    <nav className={cx(styles.root, className)}>
      <span className={cx(styles.logo, 'ds-heading-lg')}>{logo}</span>
      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href ?? '#'}
              aria-current={item.active ? 'page' : undefined}
              className={cx(
                styles.item,
                item.active ? styles.active : styles.inactive,
                item.active ? 'ds-body-sm-medium' : 'ds-body-sm',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
