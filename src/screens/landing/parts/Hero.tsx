import { ArrowRight, Check, QrCode } from 'lucide-react'
import { Button } from '../../../components'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { useAuthActions } from './useAuthActions'

const CHECKS = ['Деплой за 60 секунд', 'Списание из баланса, не с карты', 'Без верификации']

/** Первый экран. Фото справа в макете заменено плейсхолдером (визуал — не задача директивы). */
export function Hero() {
  const { signUp } = useAuthActions()
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <h1 className={cx(styles.heroTitle, 'ds-heading-4xl')}>
            VPS с оплатой USDT.
            <br />
            Без KYC, без карт,
            <br />
            без сюрпризов
          </h1>
          <p className={cx(styles.heroLead, 'ds-body-base')}>
            Заведите аккаунт по email, пополните баланс через TON или TRC-20 и поднимите сервер за минуту. Списание автоматическое,
            прогноз окончания баланса виден всегда.
          </p>
          <div className={styles.heroButtons}>
            <Button type="primary" onClick={signUp}>
              Создать аккаунт <ArrowRight size={16} aria-hidden />
            </Button>
            <Button
              type="ghost"
              className={styles.onDark}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Посмотреть тарифы
            </Button>
          </div>
          <div className={cx(styles.heroChecks, 'ds-body-sm')}>
            {CHECKS.map((c) => (
              <span key={c} className={styles.check}>
                <Check size={14} className={styles.checkIcon} aria-hidden /> {c}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.heroImage} aria-label="Иллюстрация (плейсхолдер фото из макета)">
          <QrCode size={120} aria-hidden />
        </div>
      </div>
    </section>
  )
}
