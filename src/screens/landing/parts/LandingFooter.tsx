import { Server } from 'lucide-react'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { LangSwitch } from './LandingHeader'

/** Ссылка → куда ведёт; без href — страницы ещё нет, показываем текстом */
const COLUMNS: Array<[string, Array<[string, string?]>]> = [
  ['Продукт', [['Возможности', '#features'], ['Тарифы', '#pricing'], ['Регионы', '#regions'], ['Документация', '#how'], ['Changelog']]],
  ['Аккаунт', [['Войти', '/dashboard'], ['Создать аккаунт', '/dashboard'], ['Восстановление пароля']]],
  ['Сервис', [['Статус', '#status'], ['Поддержка'], ['Контакты']]],
  ['Юридическое', [['Условия использования'], ['Политика конфиденциальности'], ['Юрлицо']]],
]

/** Подвал: бренд + 4 колонки ссылок, нижняя полоса с копирайтом и языком. */
export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <a href="#top" className={styles.logo}>
            <Server size={20} className={styles.action} aria-hidden />
            <span className="ds-heading-lg">CryptoVPS</span>
          </a>
          <span className={cx(styles.muted, 'ds-body-sm')}>
            VPS с криптооплатой для тех, кому нужно
            <br />
            быстро, прозрачно и без бюрократии.
          </span>
        </div>
        {COLUMNS.map(([title, links]) => (
          <div key={title} className={styles.footerCol}>
            <span className={cx(styles.strong, 'ds-body-xs')}>
              <strong>{title}</strong>
            </span>
            <div className={cx(styles.footerLinks, 'ds-body-sm')}>
              {links.map(([label, href]) =>
                href ? (
                  <a key={label} href={href} className={styles.navLink}>
                    {label}
                  </a>
                ) : (
                  <span key={label} title="Страница появится позже">
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomInner}>
          <span className={cx(styles.muted, 'ds-body-xs')}>© 2026 CryptoVPS. Все права защищены.</span>
          <LangSwitch />
        </div>
      </div>
    </footer>
  )
}
