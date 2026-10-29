import { ArrowRight } from 'lucide-react'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { useAuthActions } from './useAuthActions'

/** Финальный призыв: синий блок с двумя кнопками на тёмном фоне. */
export function Cta() {
  const { signIn, signUp } = useAuthActions()
  return (
    <section className={styles.ctaWrap}>
      <div className={styles.cta}>
        <h2 className={cx(styles.h2, styles.onDark, 'ds-heading-3xl')}>Готовы поднять первый сервер?</h2>
        <p className={cx(styles.ctaLead, 'ds-body-base')}>
          Регистрация по email — без верификации. Первый сервер — через 5 минут после пополнения.
        </p>
        <div className={styles.ctaButtons}>
          <button type="button" className={cx(styles.ctaPrimary, 'ds-body-sm-medium')} onClick={signUp}>
            Создать аккаунт <ArrowRight size={16} aria-hidden />
          </button>
          <button type="button" className={cx(styles.ctaSecondary, 'ds-body-sm-medium')} onClick={signIn}>
            Войти
          </button>
        </div>
      </div>
    </section>
  )
}
