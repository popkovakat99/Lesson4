import { Server } from 'lucide-react'
import { Button } from '../../../components'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { useAuthActions } from './useAuthActions'

/** Пункты меню → якоря секций лендинга */
const NAV: Array<[string, string]> = [
  ['Возможности', '#features'],
  ['Тарифы', '#pricing'],
  ['Регионы', '#regions'],
  ['Документация', '#how'],
  ['Статус', '#status'],
]

/** Шапка лендинга: логотип, якорная навигация, язык, вход/регистрация. */
export function LandingHeader() {
  const { signIn, signUp } = useAuthActions()
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a href="#top" className={styles.logo}>
          <Server size={20} className={styles.action} aria-hidden />
          <span className="ds-heading-lg">CryptoVPS</span>
        </a>
        <nav className={cx(styles.nav, 'ds-body-sm')}>
          {NAV.map(([label, href]) => (
            <a key={label} href={href} className={styles.navLink}>
              {label}
            </a>
          ))}
        </nav>
        <LangSwitch />
        <div className={styles.headerActions}>
          <Button type="ghost" onClick={signIn}>
            Войти
          </Button>
          <Button type="primary" onClick={signUp}>
            Создать аккаунт
          </Button>
        </div>
      </div>
    </header>
  )
}

/** Переключатель языка: EN пока нет — показываем как недоступный */
export function LangSwitch() {
  return (
    <span className={cx(styles.lang, 'ds-body-sm')}>
      <span className={cx(styles.default, 'ds-body-sm-medium')}>RU</span>
      <span className={styles.langSep}>/</span>
      <span className={styles.muted} title="Английская версия — скоро">
        EN
      </span>
    </span>
  )
}
