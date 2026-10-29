import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cx } from '../../../components/cx'
import styles from '../Landing.module.css'
import { SectionIntro } from './SectionIntro'

const FAQ: Array<[string, string]> = [
  [
    'Почему без KYC, и легально ли это?',
    'Юрлицо за пределами РФ, услуга — международная инфраструктура. К российским резидентам она применяется так же, как у любого иностранного провайдера. Подробности — в условиях использования.',
  ],
  [
    'Что будет, если я забуду пополнить баланс?',
    'Пришлём email за 7, 3 и 1 день и за 6 часов до остановки. При нуле серверы уходят на grace period и останавливаются, но не удаляются — пополнили, и они снова работают.',
  ],
  [
    'Как именно работает оплата USDT?',
    'Выбираете сеть (TON или TRC-20) и сумму, получаете адрес и QR. Курс фиксируется на 30 минут. После подтверждения сети деньги зачисляются на баланс автоматически.',
  ],
  ['Можно ли вывести USDT обратно?', 'Остаток баланса можно вернуть по запросу в поддержку на кошелёк в той же сети, комиссия сети — за ваш счёт.'],
  ['Какой минимальный платёж?', '5 USDT — этого хватает на месяц самого простого тарифа.'],
  ['Можно ли использовать сервер для VPN-сервиса?', 'Да, если соблюдаются условия использования: без спама, атак и незаконного контента.'],
  ['Есть ли API или CLI?', 'Публичный API и CLI — в roadmap. Пока управление серверами — через панель.'],
  ['Что с резервными копиями?', 'Снапшоты по запросу появятся во вкладке «Снапшоты» страницы сервера. Автоматические бэкапы — в roadmap.'],
]

/** «Частые вопросы» — аккордеон; по умолчанию раскрыт первый вопрос, как в макете. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className={styles.section}>
      <div className={cx(styles.container, styles.narrow)}>
        <SectionIntro
          center
          eyebrow="ВОПРОСЫ"
          title="Частые вопросы"
          lead="Если ответа здесь нет — пишите в поддержку, отвечаем на email."
        />
        <div className={styles.faqList}>
          {FAQ.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <div key={q} className={cx(styles.faqItem, isOpen && styles.faqOpen)}>
                <button type="button" className={styles.faqQ} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="ds-body-base">
                    <strong>{q}</strong>
                  </span>
                  <ChevronDown size={18} className={cx(styles.muted, styles.chevron, isOpen && styles.chevronOpen)} aria-hidden />
                </button>
                {isOpen && <p className={cx(styles.faqA, 'ds-body-sm')}>{a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
