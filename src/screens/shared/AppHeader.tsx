import { Check, ChevronDown, LogOut, Server } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '../../app/toast'
import { cx } from '../../components/cx'
import { useApp } from '../../data'
import type { Scenario } from '../../data'
import styles from './AppHeader.module.css'

const NAV = [
  { label: 'Серверы', href: '/dashboard', match: ['/dashboard', '/servers'] },
  { label: 'Биллинг', href: '/billing/topup', match: ['/billing'] },
  // Отдельного экрана статуса нет — ведём на публичный блок статуса лендинга
  { label: 'Статус', href: '/landing#status', match: [] as string[] },
]

const SCENARIOS: Array<{ id: Scenario; label: string; hint: string }> = [
  { id: 'demo', label: 'Демо-данные', hint: '3 сервера, 142.50 USDT' },
  { id: 'empty', label: 'Новый пользователь', hint: 'нет серверов, баланс 0' },
  { id: 'low', label: 'Низкий баланс', hint: 'хватит меньше чем на неделю' },
]

/** Шапка приложения (Figma: фрейм `Header`). Активный пункт — по текущему адресу. */
export function AppHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const { data, actions } = useApp()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const switchScenario = (s: (typeof SCENARIOS)[number]) => {
    actions.setScenario(s.id)
    setOpen(false)
    toast({ variant: 'info', title: `Режим: ${s.label}`, description: s.hint })
    navigate('/dashboard')
  }

  return (
    <header className={styles.root}>
      <a href="/dashboard" className={styles.logo}>
        <Server size={18} className={styles.logoIcon} aria-hidden />
        <span className="ds-heading-lg">CryptoVPS</span>
      </a>
      <nav className={styles.nav}>
        {NAV.map((item) => {
          const active = item.match.some((m) => pathname.startsWith(m))
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cx(styles.navItem, active ? styles.active : styles.inactive, active ? 'ds-body-sm-medium' : 'ds-body-sm')}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
      <div className={styles.userWrap} ref={menuRef}>
        <button type="button" className={styles.user} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className={cx(styles.avatar, 'ds-body-sm-medium')}>A</span>
          <span className={cx(styles.email, 'ds-body-sm')}>anton@mail.ru</span>
          <ChevronDown size={12} className={cx(styles.muted, open && styles.flip)} aria-hidden />
        </button>
        {open && (
          <div className={styles.menu} role="menu">
            <span className={cx(styles.menuLabel, 'ds-label-xs')}>ДЕМО-РЕЖИМ</span>
            {SCENARIOS.map((s) => (
              <button key={s.id} type="button" role="menuitemradio" aria-checked={data.scenario === s.id} className={styles.menuItem} onClick={() => switchScenario(s)}>
                <span className={styles.menuCheck}>{data.scenario === s.id && <Check size={14} aria-hidden />}</span>
                <span className={styles.menuText}>
                  <span className="ds-body-sm-medium">{s.label}</span>
                  <span className={cx(styles.muted, 'ds-body-xs')}>{s.hint}</span>
                </span>
              </button>
            ))}
            <hr className={styles.menuDivider} />
            <button type="button" role="menuitem" className={styles.menuItem} onClick={() => navigate('/landing')}>
              <span className={styles.menuCheck}>
                <LogOut size={14} aria-hidden />
              </span>
              <span className="ds-body-sm">Выйти</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
