import { cx } from '../../../components/cx'
import styles from './parts.module.css'

export interface RegionChipProps {
  flag: string
  city: string
  ping: string
  selected?: boolean
  onSelect?: () => void
}

/** Плашка региона с флагом и пингом (Figma: `RegChip`) — радио-кнопка. */
export function RegionChip({ flag, city, ping, selected, onSelect }: RegionChipProps) {
  return (
    <button type="button" role="radio" aria-checked={!!selected} onClick={onSelect} className={cx(styles.regChip, selected && styles.selected)}>
      <span className="ds-heading-lg" aria-hidden>
        {flag}
      </span>
      <span className={styles.txtCol}>
        <span className={cx(styles.default, 'ds-body-sm-medium')}>{city}</span>
        <span className={cx(styles.muted, 'ds-body-xs')}>{ping}</span>
      </span>
    </button>
  )
}
