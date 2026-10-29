import { Activity } from 'lucide-react'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const REGIONS = [
  { flag: '🇳🇱', code: 'NL', city: 'Амстердам', country: 'Нидерланды', ping: '~25 ms' },
  { flag: '🇩🇪', code: 'DE', city: 'Франкфурт', country: 'Германия', ping: '~30 ms' },
  { flag: '🇫🇮', code: 'FI', city: 'Хельсинки', country: 'Финляндия', ping: '~35 ms' },
  { flag: '🇺🇸', code: 'US', city: 'Нью-Йорк', country: 'США', ping: '~110 ms' },
]

/** «Регионы» — 4 карточки дата-центров. */
export function Regions() {
  return (
    <section id="regions" className={styles.sectionAlt}>
      <div className={styles.container}>
        <SectionIntro
          eyebrow="РЕГИОНЫ"
          title="Серверы в Европе и США"
          lead="Подключение по IPv4. Пинг отображается при создании сервера. Дополнительные регионы — в roadmap."
        />
        <div className={styles.regionsGrid}>
          {REGIONS.map((r) => (
            <article key={r.code} className={styles.region}>
              <div className={styles.regionTop}>
                <span className={styles.flag} aria-hidden>
                  {r.flag}
                </span>
                <span className={cx(styles.chip, 'ds-body-xs')}>{r.code}</span>
              </div>
              <div className={styles.stepMeta}>
                <span className={cx(styles.strong, 'ds-heading-lg')}>{r.city}</span>
                <span className={cx(styles.muted, 'ds-body-xs')}>{r.country}</span>
              </div>
              <span className={cx(styles.ping, styles.muted, 'ds-body-xs')}>
                <Activity size={12} className={styles.action} aria-hidden /> пинг из Москвы · {r.ping}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
