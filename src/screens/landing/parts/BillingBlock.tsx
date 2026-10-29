import { ArrowRight, Bell, CircleCheck, Coins, PauseCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../../../components'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const BULLETS: Array<{ icon: ReactNode; tone: string; text: string }> = [
  { icon: <Coins size={16} />, tone: styles.action, text: 'Один баланс, одна валюта — USDT.' },
  { icon: <Bell size={16} />, tone: styles.warning, text: 'Email-уведомления за 7 / 3 / 1 день и за 6 часов до остановки.' },
  {
    icon: <PauseCircle size={16} />,
    tone: styles.muted,
    text: 'При нуле баланса серверы останавливаются на grace period, не удаляются. Пополнили — снова работают.',
  },
]

/** «Биллинг» — пояснения слева и карточка прогноза баланса справа. */
export function BillingBlock() {
  return (
    <section id="billing" className={styles.section}>
      <div className={cx(styles.container, styles.split)}>
        <div className={styles.intro}>
          <SectionIntro eyebrow="БИЛЛИНГ" title="Видно, когда серверы остановятся. Заранее." />
          <div className={styles.bullets}>
            {BULLETS.map((b) => (
              <div key={b.text} className={styles.bullet}>
                <span className={cx(styles.iconBoxSm, b.tone)} aria-hidden>
                  {b.icon}
                </span>
                <span className={cx(styles.default, 'ds-body-base')}>{b.text}</span>
              </div>
            ))}
          </div>
          <div>
            <Button type="secondary" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
              Как устроен биллинг <ArrowRight size={14} aria-hidden />
            </Button>
          </div>
        </div>

        <div className={styles.statCol}>
          <div className={styles.forecastCard}>
            <span className={cx(styles.muted, 'ds-label-xs')}>ПРОГНОЗ ОКОНЧАНИЯ БАЛАНСА</span>
            <span className={cx(styles.strong, 'ds-heading-4xl')}>18 дней</span>
            <span className={cx(styles.check, styles.muted, 'ds-body-sm')}>
              <span className={cx(styles.dot, styles.dotSuccess)} aria-hidden /> Хватит надолго · 142.50 USDT
            </span>
            <svg className={styles.spark} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
              <path className={styles.sparkArea} d="M0,8 L25,14 L50,20 L75,27 L100,34 L100,40 L0,40 Z" />
              <path className={styles.sparkLine} d="M0,8 L25,14 L50,20 L75,27 L100,34" vectorEffect="non-scaling-stroke" />
            </svg>
            <hr className={styles.divider} />
            <span className={cx(styles.muted, 'ds-body-sm')}>При текущей нагрузке: 2 сервера × ~7.90 USDT / месяц</span>
            <span className={cx(styles.okNote, 'ds-body-xs')}>
              <CircleCheck size={14} aria-hidden /> Серверы будут работать без перебоев.
            </span>
          </div>
          <div className={cx(styles.legend, 'ds-body-xs')}>
            <span className={cx(styles.legendPill, styles.legendActive)}>
              <span className={cx(styles.dot, styles.dotSuccess)} aria-hidden /> &gt; 14 дней
            </span>
            <span className={styles.legendPill}>
              <span className={cx(styles.dot, styles.dotWarning)} aria-hidden /> 7–14 дней
            </span>
            <span className={styles.legendPill}>
              <span className={cx(styles.dot, styles.dotError)} aria-hidden /> &lt; 7 дней
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
