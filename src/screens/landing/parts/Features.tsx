import { Coins, Gauge, Mail, Receipt } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const FEATURES: Array<{ icon: ReactNode; title: string; text: string }> = [
  {
    icon: <Coins size={20} />,
    title: 'Оплата USDT — без конвертаций',
    text: 'TON-кошелёк прямо из Telegram или USDT TRC-20. Комиссия меньше доллара, зачисление за 1–5 минут. BTC и SOL — в roadmap.',
  },
  {
    icon: <Gauge size={20} />,
    title: 'Видно, на сколько хватит баланса',
    text: 'Один раз пополнили — дальше списание автоматическое, помесячно. На главном экране всегда виден прогноз: баланс хватит на N дней. Зелёный, жёлтый, красный — без сюрпризов.',
  },
  {
    icon: <Mail size={20} />,
    title: 'Email и пароль — этого достаточно',
    text: 'Никаких документов, телефонов и подтверждений личности. Регистрация и первый сервер — за две минуты. Подходит для приватных проектов и для разработчиков, которым уже отказали в KYC у других хостеров.',
  },
  {
    icon: <Receipt size={20} />,
    title: 'История платежей с хешами транзакций',
    text: 'Каждое пополнение — с хешем в блокчейне и сетью. Каждое списание — с датой, тарифом, сервером. История экспортируется в CSV. Никаких «прочих услуг» в счёте.',
  },
]

/** «Почему CryptoVPS» — 4 карточки преимуществ, сетка 2×2. */
export function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <SectionIntro
          eyebrow="ПОЧЕМУ CRYPTOVPS"
          title="Четыре отличия, которые видно сразу"
          lead="Без хайпа. Каждый пункт можно проверить — открыть панель и посмотреть."
        />
        <div className={styles.grid2}>
          {FEATURES.map((f) => (
            <article key={f.title} className={styles.feature}>
              <span className={styles.iconBox} aria-hidden>
                {f.icon}
              </span>
              <h3 className={cx(styles.h3, styles.strong, 'ds-heading-lg')}>{f.title}</h3>
              <p className={cx(styles.p, styles.muted, 'ds-body-sm')}>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
