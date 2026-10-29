import type { ReactNode } from 'react'
import { cx } from '../../../components/cx'
import { IconBadge } from '../../shared'
import type { IconTone } from '../../shared'
import styles from './parts.module.css'

export interface StatCardProps {
  icon: ReactNode
  iconTone: IconTone
  label: string
  value: string
  sub: ReactNode
}

/** Карточка показателя: иконка + метка, крупное значение, подпись (Figma: `StatCard-*`). */
export function StatCard({ icon, iconTone, label, value, sub }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHead}>
        <IconBadge tone={iconTone}>{icon}</IconBadge>
        <span className={cx(styles.muted, 'ds-label-xs')}>{label}</span>
      </div>
      <span className={cx(styles.strong, 'ds-heading-2xl')}>{value}</span>
      <div className={cx(styles.statSub, 'ds-body-xs')}>{sub}</div>
    </div>
  )
}
