import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'

export interface SectionIntroProps {
  eyebrow: string
  title: string
  lead?: string
  center?: boolean
}

/** Заголовок секции лендинга: надзаголовок + H2 + лид. */
export function SectionIntro({ eyebrow, title, lead, center }: SectionIntroProps) {
  return (
    <div className={center ? styles.introCenter : styles.intro}>
      <span className={cx(styles.eyebrow, 'ds-label-xs')}>{eyebrow}</span>
      <h2 className={cx(styles.h2, 'ds-heading-3xl')}>{title}</h2>
      {lead && <p className={cx(styles.p, styles.lead, 'ds-body-base')}>{lead}</p>}
    </div>
  )
}
