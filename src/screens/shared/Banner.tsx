import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../../components/cx'
import styles from './Banner.module.css'

export type BannerTone = 'error' | 'warning' | 'info' | 'success'

const ICONS: Record<BannerTone, ReactNode> = {
  error: <CircleAlert size={18} />,
  warning: <TriangleAlert size={18} />,
  info: <Info size={18} />,
  success: <CircleCheck size={18} />,
}

export interface BannerProps {
  tone: BannerTone
  title: string
  children?: ReactNode
  /** Кнопки/ссылки справа */
  action?: ReactNode
  className?: string
}

/** Баннер состояния: низкий баланс, ошибка действия, информация. Кандидат на вынос в базу (в ds нет компонента). */
export function Banner({ tone, title, children, action, className }: BannerProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx(styles.root, styles[tone], className)}>
      <span className={styles.icon} aria-hidden>
        {ICONS[tone]}
      </span>
      <div className={styles.text}>
        <span className={cx(styles.title, 'ds-body-sm-medium')}>{title}</span>
        {children && <span className={cx(styles.body, 'ds-body-xs')}>{children}</span>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
