import type { ReactNode } from 'react'
import { cx } from '../../../components/cx'
import styles from './parts.module.css'

/** Секция формы: заголовок + подсказка + содержимое (Figma: `Sec-*` + `SecHead`). */
export function FormSection({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.secHead}>
        <span className={cx(styles.default, 'ds-body-base')}>{title}</span>
        <span className={cx(styles.muted, 'ds-body-xs')}>{hint}</span>
      </div>
      {children}
    </section>
  )
}
