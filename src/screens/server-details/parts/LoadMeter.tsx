import { cx } from '../../../components/cx'
import styles from './parts.module.css'

/** Полоса текущей нагрузки (Figma: `Load-*`). Значение — статикой из макета. */
export function LoadMeter({ label, percent }: { label: string; percent: number }) {
  return (
    <div className={styles.load}>
      <div className={styles.loadHead}>
        <span className={cx(styles.default, 'ds-body-sm')}>{label}</span>
        <span className={cx(styles.default, 'ds-body-sm-medium')}>{percent}%</span>
      </div>
      <div className={styles.bar} role="presentation">
        <div className={styles.barFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
