import type { ReactNode } from 'react'
import { cx } from '../../components/cx'
import { IconBadge } from './IconBadge'
import type { IconTone } from './IconBadge'
import styles from './EventRow.module.css'

export interface EventRowProps {
  icon: ReactNode
  iconTone: IconTone
  time: string
  title: string
  subtitle: string
  /** Сумма справа (операции на Dashboard); у событий сервера её нет */
  value?: string
  valueTone?: 'success' | 'error' | 'default'
}

/** Строка ленты событий/операций (Figma: `ActivityRow` на Dashboard и `Ev` на ServerDetails). */
export function EventRow({ icon, iconTone, time, title, subtitle, value, valueTone = 'default' }: EventRowProps) {
  return (
    <div className={styles.root}>
      <IconBadge tone={iconTone}>{icon}</IconBadge>
      <span className={cx(styles.time, 'ds-body-xs')}>{time}</span>
      <div className={styles.middle}>
        <span className={cx(styles.title, 'ds-body-sm-medium')}>{title}</span>
        <span className={cx(styles.subtitle, 'ds-body-xs')}>{subtitle}</span>
      </div>
      {value && <span className={cx(styles.value, styles[valueTone], 'ds-body-sm-medium')}>{value}</span>}
    </div>
  )
}

/** Карточка-список для EventRow с разделителями между строками. */
export function EventList({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>
}
