import { cx } from '../../../components/cx'
import styles from './parts.module.css'

export interface MetricChartProps {
  title: string
  value: string
  delta: string
  deltaTone: 'success' | 'warning' | 'muted' | 'action'
  /** Форма линии — точки 0–1 по высоте (плейсхолдер графика, не данные) */
  shape: number[]
}

/** Карточка метрики с графиком-плейсхолдером (Figma: `Chart-*`). */
export function MetricChart({ title, value, delta, deltaTone, shape }: MetricChartProps) {
  const step = 100 / (shape.length - 1)
  const line = shape.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(2)},${(1 - y) * 100}`).join(' ')
  return (
    <div className={styles.chart}>
      <div className={styles.chartHead}>
        <span className={cx(styles.default, 'ds-body-sm-medium')}>{title}</span>
        <span className={styles.chartValue}>
          <span className={cx(styles.strong, 'ds-heading-xl')}>{value}</span>
          <span className={cx(styles[deltaTone], 'ds-body-sm-medium')}>{delta}</span>
        </span>
      </div>
      <svg className={styles.chartSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path className={styles.area} d={`${line} L100,100 L0,100 Z`} />
        <path className={styles.line} d={line} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={cx(styles.axis, 'ds-body-xs')}>
        {['00:00', '06:00', '12:00', '18:00', '24:00'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}
