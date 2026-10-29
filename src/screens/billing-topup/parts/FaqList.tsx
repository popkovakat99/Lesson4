import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cx } from '../../../components/cx'
import styles from './parts.module.css'

export interface FaqItem {
  q: string
  a: string
}

/** Список вопросов (Figma: `FaqRow`) — раскрывается по клику, открыт один за раз. */
export function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className={styles.faq}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={styles.faqItem}>
            <button type="button" className={styles.faqRow} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span className={cx(styles.default, 'ds-body-sm')}>{item.q}</span>
              <ChevronDown size={14} className={cx(styles.muted, styles.chevron, isOpen && styles.chevronOpen)} aria-hidden />
            </button>
            {isOpen && <p className={cx(styles.answer, 'ds-body-xs')}>{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}
