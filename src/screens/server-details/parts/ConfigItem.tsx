import type { ReactNode } from 'react'
import { cx } from '../../../components/cx'
import styles from './parts.module.css'

/** Пункт конфигурации: иконка + метка, значение (Figma: `Cfg-*` в `ConfigBlock`). */
export function ConfigItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className={styles.cfg}>
      <span className={cx(styles.cfgHead, 'ds-label-xs')}>
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
        {label}
      </span>
      <span className={cx(styles.default, 'ds-body-base')}>{value}</span>
    </div>
  )
}
