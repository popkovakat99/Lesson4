import { ArrowRight, BookOpen, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '../components'
import { cx } from '../components/cx'
import { screens } from './registry'
import type { ScreenEntry } from './registry'
import styles from './ScreensIndex.module.css'

const STORYBOOK_URL = 'http://localhost:6006'

/** Навигационная страница-индекс на `/`: плитки всех экранов из реестра. */
export function ScreensIndex() {
  const groups = screens.reduce<Record<string, ScreenEntry[]>>((acc, s) => {
    ;(acc[s.group] ??= []).push(s)
    return acc
  }, {})

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={cx(styles.title, 'ds-heading-3xl')}>CryptoVPS — экраны</h1>
        <p className={cx(styles.subtitle, 'ds-body-base')}>
          Статичные экраны, собранные из дизайн-системы. Логика и данные — отдельный шаг.
        </p>
        <Badge variant="neutral">{`${screens.length} экранов`}</Badge>
      </header>

      {Object.entries(groups).map(([group, items]) => (
        <section key={group} className={styles.group}>
          <h2 className={cx(styles.groupTitle, 'ds-label-xs')}>{group.toUpperCase()}</h2>
          <div className={styles.grid}>
            {items.map((s) => (
              <Link key={s.id} to={s.route} className={styles.tile}>
                <Card title={s.name}>
                  <span className={styles.desc}>{s.description}</span>
                  <span className={cx(styles.route, 'ds-body-xs')}>
                    <code>{s.route}</code>
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className={styles.footer}>
        <span className={cx(styles.muted, 'ds-body-sm')}>Дизайн-система:</span>
        {/* Storybook поднимается только локально — на опубликованном сайте ссылку не показываем */}
        {import.meta.env.DEV && (
          <a className={cx(styles.dsLink, 'ds-body-sm-medium')} href={STORYBOOK_URL} target="_blank" rel="noreferrer">
            <BookOpen size={16} aria-hidden /> Storybook (npm run storybook)
          </a>
        )}
        <Link className={cx(styles.dsLink, 'ds-body-sm-medium')} to="/showcase">
          <LayoutGrid size={16} aria-hidden /> Showcase
        </Link>
      </footer>
    </div>
  )
}
