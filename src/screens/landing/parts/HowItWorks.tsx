import { Check, CircleCheck, Pause, Play, QrCode, Rocket, Server, UserPlus, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Button } from '../../../components'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const STEPS: Array<{ num: string; label: string; time: string; icon: ReactNode; text: string; fill: number }> = [
  { num: '01', label: 'Регистрация по email', time: '≈ 1 минута', icon: <UserPlus size={18} />, fill: 20, text: 'Только email и пароль — без документов, телефона и подтверждения личности.' },
  { num: '02', label: 'Пополнение баланса', time: '1–5 минут', icon: <Wallet size={18} />, fill: 39, text: 'Выбираете сеть (TON или TRC-20) и сумму, отправляете USDT по QR-коду или адресу. Курс зафиксирован на 30 минут.' },
  { num: '03', label: 'Создание сервера', time: '< 1 минута', icon: <Server size={18} />, fill: 72, text: 'ОС, регион, тариф и SSH-ключ — и сервер разворачивается меньше чем за минуту.' },
  { num: '04', label: 'Работа', time: 'сразу', icon: <Rocket size={18} />, fill: 100, text: 'Сервер работает, оплата списывается из баланса помесячно, прогноз окончания всегда на виду.' },
]

const PAY_CHECKS = ['Транзакция отправлена', 'Подтверждение в сети', 'Зачисление на баланс']

/** «Как это работает» — шаги переключаются сами (каждые 3 с), пауза и клик по шагу. */
export function HowItWorks() {
  const [active, setActive] = useState(1)
  const [playing, setPlaying] = useState(true)
  const step = STEPS[active]

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 3000)
    return () => clearInterval(t)
  }, [playing])

  return (
    <section id="how" className={styles.sectionAlt}>
      <div className={styles.container}>
        <SectionIntro
          eyebrow="КАК ЭТО РАБОТАЕТ"
          title="От регистрации до сервера — 4 шага"
          lead="Весь путь — меньше пяти минут. Полоса ниже показывает реальное соотношение времени между этапами."
        />

        <div className={styles.howCard}>
          <div key={active} className={cx(styles.howText, styles.stepFade)}>
            <div className={styles.stepPill}>
              <span className={styles.iconBox} aria-hidden>
                {step.icon}
              </span>
              <span className={styles.stepMeta}>
                <span className={cx(styles.muted, 'ds-body-xs')}>Шаг {step.num}</span>
                <span className={cx(styles.action, 'ds-body-xs')}>{step.time}</span>
              </span>
            </div>
            <h3 className={cx(styles.h3, styles.strong, 'ds-heading-2xl')}>{step.label}</h3>
            <p className={cx(styles.p, styles.muted, 'ds-body-sm')}>{step.text}</p>
          </div>

          <div className={styles.howPreview}>
            <div className={styles.payCard}>
              <div className={styles.payHead}>
                <span className={cx(styles.muted, 'ds-body-xs')}>Пополнение</span>
                <span className={cx(styles.chip, 'ds-body-xs')}>TRC-20</span>
              </div>
              <div className={styles.payBody}>
                <span className={styles.qrMini} aria-hidden>
                  <QrCode size={64} />
                </span>
                <div className={styles.stepMeta}>
                  <span className={cx(styles.muted, 'ds-body-xs')}>Сумма</span>
                  <span className={cx(styles.strong, 'ds-heading-2xl')}>50.00 USDT</span>
                  <span className={cx(styles.muted, 'ds-body-xs')}>TQrZ9wY…3xKp</span>
                </div>
              </div>
              <div className={cx(styles.payChecks, 'ds-body-xs')}>
                {PAY_CHECKS.map((c, i) => (
                  <span key={c} className={cx(styles.check, i < active ? styles.default : styles.muted)}>
                    <CircleCheck size={12} className={i < active ? styles.success : styles.muted} aria-hidden /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.timeline}>
          <div className={cx(styles.timelineRow, 'ds-body-xs')}>
            {STEPS.map((s, i) => (
              <span key={s.num} className={i === active ? cx(styles.action, 'ds-body-xs') : styles.muted}>
                {s.time}
              </span>
            ))}
          </div>
          <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={step.fill}>
            <div className={styles.trackFill} style={{ width: `${step.fill}%` }} />
          </div>
          <div className={styles.timelineRow} role="tablist">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={styles.stepBtn}
                onClick={() => {
                  setActive(i)
                  setPlaying(false)
                }}
              >
                <span className={cx(styles.stepNum, i <= active && styles.stepNumActive, 'ds-body-xs')}>{i < active ? <Check size={14} aria-hidden /> : s.num}</span>
                <span className={cx(i <= active ? styles.strong : styles.muted, i === active ? 'ds-body-sm-medium' : 'ds-body-sm')}>{s.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.timelineFoot}>
            <span className={cx(styles.muted, 'ds-body-xs')}>Полная длительность ≈ 5 минут · полоса ускорена в 33× для наглядности</span>
            <Button type="secondary" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />} {playing ? 'Пауза' : 'Продолжить'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
