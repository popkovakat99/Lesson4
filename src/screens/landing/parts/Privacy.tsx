import { ShieldCheck } from 'lucide-react'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const POINTS = [
  {
    title: 'Логирования трафика нет.',
    text: 'Мы провайдер инфраструктуры — что вы делаете на сервере, нас не касается, до тех пор пока соблюдаются условия использования.',
  },
  {
    title: 'Минимум персональных данных.',
    text: 'Только email, пароль (в bcrypt) и история операций. Никаких имён, документов или телефонов.',
  },
  {
    title: 'Юрлицо и инфраструктура — отдельно.',
    text: 'Юрлицо в международной юрисдикции. Серверы — в Tier-3 ЦОД Европы. Регуляторные риски проработаны.',
  },
]

/** 60 столбиков uptime за 90 дней — порядок цветов как в макете (статичный рисунок, не данные). */
const UPTIME: Array<'ok' | 'warn' | 'err'> = [
  ...Array<'ok'>(14).fill('ok'),
  'warn',
  ...Array<'ok'>(18).fill('ok'),
  'err',
  ...Array<'ok'>(13).fill('ok'),
  'warn',
  ...Array<'ok'>(12).fill('ok'),
]

/** «Приватность» — принципы слева, карточки «Рынок» и «Статус за 90 дней» справа. */
export function Privacy() {
  return (
    <section className={styles.section}>
      <div className={cx(styles.container, styles.split)}>
        <div className={styles.intro}>
          <SectionIntro
            eyebrow="ПРИВАТНОСТЬ"
            title="Без KYC — это позиция, а не лазейка"
            lead="Сбор паспортов и телефонов ничего не даёт легитимным пользователям. Мы предпочитаем минимум данных и прозрачность инфраструктуры."
          />
          <div className={styles.privacyRows}>
            {POINTS.map((p) => (
              <div key={p.title} className={styles.privacyRow}>
                <span className={styles.iconBoxSuccess} aria-hidden>
                  <ShieldCheck size={18} />
                </span>
                <div className={styles.stepMeta}>
                  <span className={cx(styles.strong, 'ds-body-base')}>
                    <strong>{p.title}</strong>
                  </span>
                  <span className={cx(styles.muted, 'ds-body-sm')}>{p.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statCol}>
          <div className={styles.statCardAlt}>
            <span className={cx(styles.muted, 'ds-label-xs')}>РЫНОК</span>
            <span className={cx(styles.strong, 'ds-heading-4xl')}>34 млн</span>
            <span className={cx(styles.muted, 'ds-body-sm')}>
              владельцев криптовалюты в России. Ни один локальный VPS-провайдер не принимает USDT — кроме нас.
            </span>
          </div>
          <div id="status" className={styles.statCard}>
            <span className={styles.statusHead}>
              <span className={cx(styles.dot, styles.dotSuccess)} aria-hidden />
              <span className={cx(styles.muted, 'ds-label-xs')}>СТАТУС ЗА 90 ДНЕЙ</span>
            </span>
            <span className={cx(styles.strong, 'ds-heading-3xl')}>99.94%</span>
            <div className={styles.uptimeBars} role="presentation">
              {UPTIME.map((s, i) => (
                <span key={i} className={cx(styles.uptimeBar, s === 'warn' && styles.uptimeWarn, s === 'err' && styles.uptimeErr)} />
              ))}
            </div>
            <span className={cx(styles.muted, 'ds-body-xs')}>Реальная история uptime — на публичной статус-странице.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
