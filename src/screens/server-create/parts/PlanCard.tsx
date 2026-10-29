import { cx } from '../../../components/cx'
import styles from './parts.module.css'

export interface PlanCardProps {
  name: string
  specs: Array<[label: string, value: string]>
  price: string
  perDay: string
  popular?: boolean
  selected?: boolean
  /** Тариф дороже баланса — показываем подсказку, выбрать всё равно можно */
  unaffordable?: boolean
  onSelect?: () => void
}

/** Карточка тарифа: характеристики + цена (Figma: `PlanCard-*`) — радио-кнопка. */
export function PlanCard({ name, specs, price, perDay, popular, selected, unaffordable, onSelect }: PlanCardProps) {
  return (
    <button type="button" role="radio" aria-checked={!!selected} onClick={onSelect} className={cx(styles.planCard, selected && styles.selected)}>
      <span className={styles.planHead}>
        <span className={cx(styles.default, 'ds-heading-lg')}>{name}</span>
        {popular && <span className={cx(styles.popular, 'ds-label-xs')}>Популярный</span>}
      </span>
      <span className={styles.specs}>
        {specs.map(([label, value]) => (
          <span key={label} className={styles.spec}>
            <span className={cx(styles.muted, 'ds-body-xs')}>{label}</span>
            <span className={cx(styles.default, 'ds-body-sm-medium')}>{value}</span>
          </span>
        ))}
      </span>
      <hr className={styles.divider} />
      <span className={styles.price}>
        <span className={styles.priceRow}>
          <span className={cx(styles.strong, 'ds-heading-2xl')}>{price}</span>
          <span className={cx(styles.muted, 'ds-body-sm')}>/ мес</span>
        </span>
        <span className={cx(unaffordable ? styles.errorText : styles.muted, 'ds-body-xs')}>{unaffordable ? 'Не хватает баланса' : perDay}</span>
      </span>
    </button>
  )
}
