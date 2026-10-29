import { CircleCheck, Clock, Copy, Info, Layers, QrCode, RotateCcw, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { copyText } from '../../app/clipboard'
import { useToast } from '../../app/toast'
import { Badge, Button, Input, Select, StepItem } from '../../components'
import { cx } from '../../components/cx'
import { MIN_TOPUP, NETWORKS, RATE_LOCK_SECONDS, mmss, networkById, parseAmount, usdt, useApp, validateAmount } from '../../data'
import type { NetworkId } from '../../data'
import { AppHeader, Banner, IconBadge, PageHeader } from '../shared'
import { FaqList } from './parts/FaqList'
import { InfoRow } from './parts/InfoRow'
import styles from './BillingTopup.module.css'

type Phase = 'awaiting' | 'confirming' | 'done' | 'expired'

const FAQ = [
  { q: 'Почему только USDT?', a: 'Стейблкоин без волатильности: 1 USDT = $1. Баланс и тарифы не «плывут» вместе с курсом крипты. BTC и SOL — в roadmap.' },
  { q: 'Как работает fund-first биллинг?', a: 'Сначала пополняете баланс, потом из него автоматически списывается оплата серверов — помесячно. Прогноз окончания всегда виден на дашборде.' },
  { q: 'Что если оплата не прошла?', a: 'Если сеть отклонила перевод или вы отправили не ту сумму, деньги не зачислятся — создайте новый запрос. Ошибочные переводы возвращаем через поддержку.' },
  { q: 'Куда уходят деньги при удалении сервера?', a: 'Неиспользованные дни текущего месяца возвращаются на баланс сразу после удаления.' },
]

/** Пополнение баланса (Figma: `Screen/BillingTopup`). Оплата — мок: кнопка «Я оплатил» → подтверждение сети → зачисление. */
export function BillingTopup() {
  const { data, actions } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  // Успех пополнения — отдельный адрес /billing/topup/done (цель сценария в дашборде юзер-тестов)
  const onDonePath = useLocation().pathname.endsWith('/done')
  // ?ttl=10 — короткий таймер для проверки истечения курса
  const ttl = Number(params.get('ttl')) > 0 ? Number(params.get('ttl')) : RATE_LOCK_SECONDS

  const [network, setNetwork] = useState<NetworkId>('ton')
  const [amount, setAmount] = useState(50)
  const [editing, setEditing] = useState(false)
  const [draftNetwork, setDraftNetwork] = useState<NetworkId>('ton')
  const [draftAmount, setDraftAmount] = useState('50.00')
  const [draftTouched, setDraftTouched] = useState(false)
  const [phase, setPhase] = useState<Phase>('awaiting')
  const [deadline, setDeadline] = useState(() => Date.now() + ttl * 1000)
  const [now, setNow] = useState(() => Date.now())

  const net = networkById(network)
  const left = Math.max(0, Math.ceil((deadline - now) / 1000))
  const amountError = validateAmount(draftAmount)

  // Таймер фиксации курса
  useEffect(() => {
    if (phase !== 'awaiting') return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'awaiting' && left === 0) setPhase('expired')
  }, [left, phase])

  // Прямой заход на /done без оплаты (или после перезагрузки) — возвращаем к оплате
  useEffect(() => {
    if (onDonePath && phase !== 'done') navigate('/billing/topup', { replace: true })
  }, [onDonePath, phase, navigate])

  const newRequest = (n: NetworkId = network, a: number = amount) => {
    setNetwork(n)
    setAmount(a)
    setPhase('awaiting')
    setDeadline(Date.now() + ttl * 1000)
    setNow(Date.now())
  }

  const applyDraft = () => {
    setDraftTouched(true)
    if (amountError) return
    newRequest(draftNetwork, parseAmount(draftAmount))
    setEditing(false)
    setDraftTouched(false)
    toast({ variant: 'info', title: 'Новый адрес для оплаты', description: `${networkById(draftNetwork).name} · ${usdt(parseAmount(draftAmount))} · курс зафиксирован на 30 минут` })
  }

  const startEdit = () => {
    setDraftNetwork(network)
    setDraftAmount(amount.toFixed(2))
    setEditing(true)
  }

  const copyAddress = async () => {
    const ok = await copyText(net.address)
    toast({ variant: ok ? 'info' : 'warning', title: ok ? 'Адрес скопирован' : 'Не удалось скопировать', description: `${net.name}: ${net.address.slice(0, 10)}…` })
  }

  const confirmPaid = async () => {
    setPhase('confirming')
    await actions.topup(network, amount)
    setPhase('done')
    navigate('/billing/topup/done')
    toast({ variant: 'success', title: `Зачислено ${usdt(amount)}`, description: `Новый баланс: ${usdt(Math.round((data.balance + amount) * 100) / 100)}` })
  }

  const status =
    phase === 'awaiting' ? <Badge variant="success">Адрес активен</Badge>
    : phase === 'confirming' ? <Badge variant="warning">Ждём подтверждения сети</Badge>
    : phase === 'done' ? <Badge variant="success">Зачислено</Badge>
    : <Badge variant="neutral">Курс истёк</Badge>

  const inactive = phase === 'expired' || phase === 'done'

  return (
    <div className={styles.page}>
      <AppHeader />
      <PageHeader
        breadcrumb={[{ label: 'Биллинг', href: '/dashboard' }, 'Пополнение']}
        title={<h1 className={cx(styles.h1, 'ds-heading-3xl')}>Пополнение баланса</h1>}
        meta={<span className={cx(styles.muted, 'ds-body-sm')}>Текущий баланс: {usdt(data.balance)}</span>}
      />

      <main className={styles.body}>
        <div className={styles.left}>
          {!editing ? (
            <div className={styles.netSummary}>
              <IconBadge surface="action" tone="on-action">
                <Layers size={16} aria-hidden />
              </IconBadge>
              <div className={styles.col}>
                <span className={cx(styles.default, 'ds-body-sm-medium')}>
                  Сеть {net.name} · {usdt(amount)}
                </span>
                <span className={cx(styles.muted, 'ds-body-xs')}>
                  Зачисление {net.eta} · комиссия {net.fee}
                </span>
              </div>
              {phase !== 'confirming' && (
                <button type="button" className={cx(styles.action, 'ds-body-sm-medium')} onClick={startEdit}>
                  Изменить
                </button>
              )}
            </div>
          ) : (
            <form
              className={styles.editor}
              onSubmit={(e) => {
                e.preventDefault()
                applyDraft()
              }}
            >
              <div className={styles.editorFields}>
                <div className={styles.field}>
                  <span className={cx(styles.muted, 'ds-label-xs')}>СЕТЬ</span>
                  <Select options={NETWORKS.map((n) => ({ value: n.id, label: `${n.name} · ${n.eta}` }))} value={draftNetwork} onChange={(v) => setDraftNetwork(v as NetworkId)} />
                </div>
                <div className={styles.field}>
                  <Input
                    label="СУММА, USDT"
                    inputMode="decimal"
                    value={draftAmount}
                    autoFocus
                    state={draftTouched && amountError ? 'error' : 'default'}
                    onChange={(e) => {
                      setDraftAmount(e.target.value)
                      setDraftTouched(true)
                    }}
                  />
                  <span className={cx(draftTouched && amountError ? styles.errorText : styles.muted, 'ds-body-xs')}>
                    {draftTouched && amountError ? amountError : `От ${MIN_TOPUP} до 10 000 USDT`}
                  </span>
                </div>
              </div>
              <div className={styles.editorActions}>
                <Button type="secondary" onClick={() => setEditing(false)}>
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" state={draftTouched && amountError ? 'disabled' : 'default'}>
                  Получить адрес
                </Button>
              </div>
            </form>
          )}

          {phase === 'expired' && (
            <Banner tone="warning" title="Время вышло — курс больше не зафиксирован" action={<Button onClick={() => newRequest()}><RotateCcw size={14} aria-hidden /> Создать новый запрос</Button>}>
              Не отправляйте деньги на этот адрес: создайте новый запрос с актуальным курсом.
            </Banner>
          )}
          {phase === 'done' && (
            <Banner
              tone="success"
              title={`${usdt(amount)} зачислено на баланс`}
              action={
                <>
                  <Button data-track="topup-to-dashboard" onClick={() => navigate('/dashboard')}>На дашборд</Button>
                  <Button
                    type="secondary"
                    onClick={() => {
                      newRequest()
                      navigate('/billing/topup')
                    }}
                  >
                    Пополнить ещё
                  </Button>
                </>
              }
            >
              Баланс: {usdt(data.balance)}. Email о зачислении отправлен на anton@mail.ru.
            </Banner>
          )}

          <section className={cx(styles.payment, inactive && styles.paymentInactive)}>
            <div className={styles.payTop}>
              {status}
              <span className={cx(styles.timer, 'ds-body-sm-medium')}>
                <Clock size={14} className={left < 60 && phase === 'awaiting' ? styles.errorText : styles.warning} aria-hidden />
                {phase === 'awaiting' ? `Курс зафиксирован: ${mmss(left)}` : phase === 'expired' ? 'Время вышло' : phase === 'confirming' ? 'Перевод получен, проверяем' : 'Готово'}
              </span>
            </div>

            <div className={styles.payMain}>
              <div className={styles.qr}>
                <div className={styles.qrBox} aria-label="QR-код для оплаты (плейсхолдер)">
                  <QrCode size={96} aria-hidden />
                </div>
                <span className={cx(styles.muted, 'ds-body-xs')}>Отсканируйте в крипто-кошельке</span>
              </div>

              <div className={styles.details}>
                <div className={styles.addrBlock}>
                  <span className={cx(styles.muted, 'ds-label-xs')}>АДРЕС {net.name}</span>
                  <div className={styles.addrBox}>
                    <span className={cx(styles.addr, 'ds-body-sm-medium')}>{net.address}</span>
                    <Button type="secondary" state={inactive ? 'disabled' : 'default'} onClick={copyAddress}>
                      <Copy size={14} aria-hidden /> Копировать
                    </Button>
                  </div>
                </div>

                <div className={styles.amtRow}>
                  <div className={styles.col}>
                    <span className={cx(styles.muted, 'ds-label-xs')}>ТОЧНАЯ СУММА</span>
                    <span className={cx(styles.strong, 'ds-heading-2xl')}>{usdt(amount)}</span>
                  </div>
                  <div className={styles.col}>
                    <span className={cx(styles.muted, 'ds-label-xs')}>КУРС</span>
                    <span className={cx(styles.strong, 'ds-heading-2xl')}>1 USDT = $1.00</span>
                  </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.proc}>
                  <InfoRow icon={<CircleCheck size={14} />} tone="success" title="Скорость зачисления" text={`Обычно ${net.eta} после подтверждения`} />
                  <InfoRow icon={<Info size={14} />} tone="action" title="Что после оплаты" text="Email об успешном зачислении и обновлённый баланс на дашборде" />
                </div>

                {(phase === 'awaiting' || phase === 'confirming') && (
                  <div className={styles.payActions}>
                    <Button type="primary" data-track="topup-paid" state={phase === 'confirming' ? 'loading' : 'default'} onClick={confirmPaid}>
                      Я оплатил
                    </Button>
                    <span className={cx(styles.muted, 'ds-body-xs')}>
                      {phase === 'confirming' ? `Ждём подтверждения сети ${net.name} — обычно ${net.eta}` : 'Мок: нажмите после «отправки» USDT, чтобы сымитировать зачисление'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button type="button" className={cx(styles.cancel, 'ds-body-sm')} onClick={() => navigate('/dashboard')} disabled={phase === 'confirming'}>
              Отменить и вернуться в кабинет
            </button>
          </section>
        </div>

        <aside className={styles.right}>
          <section className={styles.card}>
            <h2 className={cx(styles.h2, 'ds-heading-lg')}>Как это работает</h2>
            <StepItem number={1} title="Выберите сеть и сумму" description="TON быстрее и дешевле, TRC-20 — проверенный стандарт" />
            <StepItem number={2} title="Отсканируйте QR или скопируйте адрес" description="Откройте крипто-кошелёк и отправьте точную сумму" />
            <StepItem number={3} title="Дождитесь подтверждения" description="TON: 1–2 минуты · TRC-20: 3–5 минут" />
            <StepItem number={4} title="Курс зафиксирован на 30 минут" description="Если не успели — создайте новый запрос" />
          </section>

          <section className={styles.card}>
            <h2 className={cx(styles.h2, 'ds-heading-lg')}>FAQ</h2>
            <FaqList items={FAQ} />
          </section>

          <div className={styles.security}>
            <ShieldCheck size={20} className={styles.success} aria-hidden />
            <div className={styles.col}>
              <span className={cx(styles.default, 'ds-body-sm-medium')}>Без KYC</span>
              <span className={cx(styles.muted, 'ds-body-xs')}>Не храним данные кошельков и не раскрываем третьим сторонам</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
