import { Button } from '../../../components'
import { cx } from '../../../components/cx'
import { days } from '../../../data'
import { Banner } from '../../shared'
import styles from './parts.module.css'

export interface SummaryPanelProps {
  items: Array<[string, string]>
  price: number
  /** Прогноз сейчас; null — серверов нет */
  forecastNow: number | null
  forecastAfter: number
  /** Сколько USDT не хватает; 0 — хватает */
  shortfall: number
  status: 'idle' | 'loading' | 'error'
  error?: string
  onSubmit: () => void
  onTopup: () => void
}

const dotClass = (d: number | null) => (d === null || d > 14 ? styles.dotSuccess : d >= 7 ? styles.dotWarning : styles.dotError)

/** Итоговая панель «Ваш сервер» справа от формы (Figma: `Summary`). */
export function SummaryPanel({ items, price, forecastNow, forecastAfter, shortfall, status, error, onSubmit, onTopup }: SummaryPanelProps) {
  return (
    <aside className={styles.summary}>
      <span className={cx(styles.default, 'ds-heading-lg')}>Ваш сервер</span>
      <div className={styles.items}>
        {items.map(([label, value]) => (
          <div key={label} className={styles.row}>
            <span className={cx(styles.muted, 'ds-body-sm')}>{label}</span>
            <span className={cx(styles.default, styles.ellipsis, 'ds-body-sm-medium')} title={value}>
              {value || '—'}
            </span>
          </div>
        ))}
      </div>
      <hr className={styles.divider} />
      <div className={styles.price}>
        <div className={styles.priceRow}>
          <span className={cx(styles.strong, 'ds-heading-3xl')}>${price}</span>
          <span className={cx(styles.muted, 'ds-body-sm')}>/ месяц</span>
        </div>
        <span className={cx(styles.muted, 'ds-body-xs')}>
          ≈ {(price / 720).toFixed(3)} $/час · {price.toFixed(2)} USDT с баланса
        </span>
      </div>
      <hr className={styles.divider} />
      <div className={styles.forecast}>
        <span className={cx(styles.muted, 'ds-label-xs')}>ВЛИЯНИЕ НА ПРОГНОЗ</span>
        <span className={cx(styles.fcRow, 'ds-body-sm')}>
          <span className={cx(styles.dot, dotClass(forecastNow))} aria-hidden /> Сейчас: {forecastNow === null ? 'нет списаний' : days(forecastNow)}
        </span>
        {shortfall === 0 && (
          <span className={cx(styles.fcRow, 'ds-body-sm-medium')}>
            <span className={cx(styles.dot, dotClass(forecastAfter))} aria-hidden /> После создания: {days(forecastAfter)}
          </span>
        )}
      </div>

      {shortfall > 0 && (
        <Banner tone="error" title={`Не хватает ${shortfall.toFixed(2)} USDT`} action={<Button type="secondary" onClick={onTopup}>Пополнить</Button>}>
          Первый месяц списывается сразу при создании.
        </Banner>
      )}
      {status === 'error' && error && (
        <Banner tone="error" title="Сервер не создан" action={<Button type="secondary" onClick={onSubmit}>Повторить</Button>}>
          {error}
        </Banner>
      )}

      <Button
        type="primary"
        data-track="create-server-submit"
        className={styles.fullWidth}
        state={status === 'loading' ? 'loading' : shortfall > 0 ? 'disabled' : 'default'}
        onClick={onSubmit}
      >
        Создать сервер
      </Button>
      <span className={cx(styles.muted, 'ds-body-xs')}>{status === 'loading' ? 'Создаём сервер…' : 'Деплой обычно занимает до 60 секунд'}</span>
    </aside>
  )
}
