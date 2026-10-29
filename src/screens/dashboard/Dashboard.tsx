import { Activity, ArrowDown, ArrowUp, ArrowUpRight, Clock, Plus, Receipt, RefreshCw, RotateCcw, Search, Server, Undo2, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../app/toast'
import { Button, Input } from '../../components'
import { cx } from '../../components/cx'
import {
  canAffordAnyPlan,
  cheapestPlanPrice,
  days,
  forecastDays,
  forecastTone,
  osById,
  plural,
  regionById,
  signedUsdt,
  usdt,
  useApp,
  when,
} from '../../data'
import type { Operation } from '../../data'
import { AppHeader, Banner, EmptyState, EventList, EventRow } from '../shared'
import { ServerCard } from './parts/ServerCard'
import { StatCard } from './parts/StatCard'
import styles from './Dashboard.module.css'

const OPS_PREVIEW = 4

function opIcon(op: Operation) {
  if (op.kind === 'topup') return { icon: <ArrowUp size={16} />, tone: 'success' as const }
  if (op.kind === 'refund') return { icon: <Undo2 size={16} />, tone: 'success' as const }
  if (op.kind === 'charge') return { icon: <ArrowDown size={16} />, tone: 'error' as const }
  return { icon: <Server size={16} />, tone: 'action' as const }
}

/** Главный экран кабинета (Figma: `Screen/Dashboard`). Данные — из мок-слоя `src/data`. */
export function Dashboard() {
  const { data, actions } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [showAllOps, setShowAllOps] = useState(false)
  const [rebooting, setRebooting] = useState(false)

  const forecast = forecastDays(data)
  const tone = forecastTone(forecast)
  const running = data.servers.filter((s) => s.status === 'running').length
  const addedThisMonth = data.servers.filter((s) => Date.now() - new Date(s.createdAt).getTime() < 30 * 86_400_000).length
  const canCreate = canAffordAnyPlan(data.balance)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data.servers
    return data.servers.filter((s) =>
      [s.name, s.ip, regionById(s.region).city, osById(s.os).name].some((v) => v.toLowerCase().includes(q)),
    )
  }, [data.servers, query])

  const ops = showAllOps ? data.operations : data.operations.slice(0, OPS_PREVIEW)

  const rebootAll = async () => {
    setRebooting(true)
    const n = await actions.rebootAll()
    setRebooting(false)
    toast({ variant: 'info', title: `Перезагрузка: ${n} ${plural(n, 'сервер', 'сервера', 'серверов')}`, description: 'Каждый будет недоступен около 30 секунд' })
  }

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.body}>
        {/* Доменные края: нулевой / низкий баланс */}
        {!canCreate && data.servers.length === 0 && (
          <Banner
            tone="info"
            title="Пополните баланс, чтобы создать первый сервер"
            action={<Button onClick={() => navigate('/billing/topup')}>Пополнить</Button>}
          >
            Минимальный тариф — {usdt(cheapestPlanPrice)} в месяц. Оплата в USDT через TON или TRC-20.
          </Banner>
        )}
        {tone === 'error' && (
          <Banner
            tone="error"
            title={forecast === 0 ? 'Баланс закончился — серверы будут остановлены' : `Баланса хватит на ${days(forecast ?? 0)}`}
            action={<Button onClick={() => navigate('/billing/topup')}>Пополнить баланс</Button>}
          >
            При нуле серверы уходят на grace period и останавливаются, но не удаляются. Создание новых серверов недоступно.
          </Banner>
        )}
        {tone === 'warning' && (
          <Banner tone="warning" title={`Баланса хватит на ${days(forecast ?? 0)}`} action={<Button type="secondary" onClick={() => navigate('/billing/topup')}>Пополнить</Button>}>
            Пришлём email за 7, 3 и 1 день до остановки.
          </Banner>
        )}

        <section className={styles.stats}>
          <StatCard icon={<Wallet size={18} />} iconTone="action" label="БАЛАНС" value={usdt(data.balance)} sub={`≈ $${data.balance.toFixed(2)}`} />
          <StatCard
            icon={<Server size={18} />}
            iconTone="action"
            label="АКТИВНЫХ СЕРВЕРОВ"
            value={String(running)}
            sub={
              addedThisMonth > 0 ? (
                <span className={styles.success}>
                  <ArrowUp size={12} aria-hidden /> +{addedThisMonth} за месяц
                </span>
              ) : (
                `всего ${data.servers.length}`
              )
            }
          />
          <StatCard
            icon={<Clock size={18} />}
            iconTone={tone === 'success' ? 'success' : tone === 'neutral' ? 'muted' : tone}
            label="ПРОГНОЗ ОКОНЧАНИЯ"
            value={forecast === null ? '—' : days(forecast)}
            sub={forecast === null ? 'нет серверов — нет списаний' : 'при текущей нагрузке'}
          />
        </section>

        <section className={styles.actions}>
          <Button type="primary" state={canCreate ? 'default' : 'disabled'} onClick={() => navigate('/servers/create')} title={canCreate ? undefined : 'Недостаточно средств на балансе'}>
            <Plus size={16} aria-hidden /> Создать сервер
          </Button>
          <Button type="secondary" onClick={() => navigate('/billing/topup')}>
            <ArrowUpRight size={16} aria-hidden /> Пополнить баланс
          </Button>
          <Button type="secondary" state={rebooting ? 'loading' : running === 0 ? 'disabled' : 'default'} onClick={rebootAll}>
            <RefreshCw size={16} aria-hidden /> Перезагрузить все
          </Button>
          <Button type="secondary" onClick={() => navigate('/landing#status')}>
            <Activity size={16} aria-hidden /> Статус сервиса
          </Button>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={cx(styles.sectionTitle, 'ds-heading-2xl')}>Мои серверы</h2>
            <span className={cx(styles.count, 'ds-body-xs')}>{data.servers.length}</span>
            {data.servers.length > 0 && (
              <div className={styles.search}>
                <Input
                  aria-label="Поиск серверов"
                  placeholder="Поиск: имя, IP, регион, ОС"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {data.servers.length === 0 ? (
            <EmptyState
              icon={<Server size={18} />}
              title="У вас пока нет серверов"
              action={
                canCreate ? (
                  <Button onClick={() => navigate('/servers/create')}>
                    <Plus size={16} aria-hidden /> Создать первый сервер
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/billing/topup')}>Пополнить баланс</Button>
                )
              }
            >
              {canCreate ? 'Сервер поднимается меньше чем за минуту: выберите ОС, регион и тариф.' : `Сначала пополните баланс — минимум ${usdt(cheapestPlanPrice)}.`}
            </EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={18} />}
              title={`Ничего не найдено по «${query.trim()}»`}
              action={
                <Button type="secondary" onClick={() => setQuery('')}>
                  <RotateCcw size={14} aria-hidden /> Сбросить поиск
                </Button>
              }
            >
              Ищем по имени, IP-адресу, региону и ОС.
            </EmptyState>
          ) : (
            <div className={styles.serversGrid}>
              {filtered.map((s) => (
                <ServerCard key={s.id} server={s} />
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={cx(styles.sectionTitle, 'ds-heading-2xl')}>Последние операции</h2>
            {data.operations.length > OPS_PREVIEW && (
              <button type="button" className={cx(styles.link, 'ds-body-sm-medium')} onClick={() => setShowAllOps((v) => !v)}>
                {showAllOps ? 'Свернуть' : `История платежей · все ${data.operations.length}`}
              </button>
            )}
          </div>
          {data.operations.length === 0 ? (
            <EmptyState icon={<Receipt size={18} />} title="Операций пока нет">
              Здесь появятся пополнения, списания и создание серверов.
            </EmptyState>
          ) : (
            <EventList>
              {ops.map((op) => {
                const { icon, tone: t } = opIcon(op)
                return (
                  <EventRow
                    key={op.id}
                    icon={icon}
                    iconTone={t}
                    time={when(op.at)}
                    title={op.title}
                    subtitle={op.subtitle}
                    value={op.amount === undefined ? '—' : signedUsdt(op.amount)}
                    valueTone={op.amount === undefined ? 'default' : op.amount > 0 ? 'success' : 'error'}
                  />
                )
              })}
            </EventList>
          )}
        </section>
      </main>
    </div>
  )
}
