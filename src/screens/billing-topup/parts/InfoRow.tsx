import type { ReactNode } from 'react'
import { cx } from '../../../components/cx'
import { IconBadge } from '../../shared'
import type { IconTone } from '../../shared'
import styles from './parts.module.css'

/** Строка-пояснение: иконка + заголовок + подпись (Figma: `PR` в блоке `Proc`). */
export function InfoRow({ icon, tone, title, text }: { icon: ReactNode; tone: IconTone; title: string; text: string }) {
  return (
    <div className={styles.infoRow}>
      <IconBadge tone={tone}>{icon}</IconBadge>
      <div className={styles.col}>
        <span className={cx(styles.default, 'ds-body-sm-medium')}>{title}</span>
        <span className={cx(styles.muted, 'ds-body-xs')}>{text}</span>
      </div>
    </div>
  )
}
