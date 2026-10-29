import {
  Calendar,
  CircleCheck,
  Copy,
  Hammer,
  HardDrive,
  KeyRound,
  MapPin,
  Play,
  Power,
  RefreshCw,
  RotateCw,
  Server as ServerIcon,
  Square,
  Tag,
  Terminal,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { copyText } from '../../app/clipboard'
import { useToast } from '../../app/toast'
import { Button, Dropdown, Tab } from '../../components'
import { cx } from '../../components/cx'
import { days, daysSince, isTransient, osById, planById, regionById, useApp, when } from '../../data'
import type { Server, ServerEventKind } from '../../data'
import { DeleteDialog } from '../modals/DeleteDialog'
import { RebootDialog } from '../modals/RebootDialog'
import { ReinstallDialog } from '../modals/ReinstallDialog'
import { AppHeader, Banner, EmptyState, EventList, EventRow, PageHeader, ServerStatusBadge } from '../shared'
import type { IconTone } from '../shared'
import { PERIODS, chartShape, currentLoad, delta } from './metrics'
import type { Period } from './metrics'
import { ConfigItem } from './parts/ConfigItem'
import { LoadMeter } from './parts/LoadMeter'
import { MetricChart } from './parts/MetricChart'
import styles from './ServerDetails.module.css'

const TABS = ['Обзор', 'Сеть', 'Управление', 'Снапшоты', 'Логи'] as const
type TabName = (typeof TABS)[number]
type Action = 'reboot' | 'reinstall' | 'delete'

const EVENTS_PREVIEW = 4

const EVENT_ICON: Record<ServerEventKind, { icon: ReactNode; tone: IconTone }> = {
  created: { icon: <CircleCheck size={14} />, tone: 'muted' },
  ready: { icon: <CircleCheck size={14} />, tone: 'success' },
  reboot: { icon: <RefreshCw size={14} />, tone: 'action' },
  reinstall: { icon: <Hammer size={14} />, tone: 'warning' },
  stopped: { icon: <Square size={14} />, tone: 'muted' },
  started: { icon: <Play size={14} />, tone: 'success' },
  ssh: { icon: <KeyRound size={14} />, tone: 'success' },
  update: { icon: <RefreshCw size={14} />, tone: 'action' },
  alert: { icon: <TriangleAlert size={14} />, tone: 'warning' },
}

const TRANSIENT_TEXT: Record<string, string> = {
  deploying: 'Сервер разворачивается — обычно до 60 секунд',
  rebooting: 'Сервер перезагружается — будет доступен через несколько секунд',
  reinstalling: 'Идёт переустановка ОС — около минуты',
}

/** Страница сервера (Figma: `Screen/ServerDetails`). Сервер — по адресу /servers/:id из мок-слоя. */
export function ServerDetails() {
  const { id } = useParams()
  const { data } = useApp()
  const navigate = useNavigate()
  const server = data.servers.find((s) => s.id === id)

  if (!server) {
    return (
      <div className={styles.page}>
        <AppHeader />
        <main className={styles.content}>
          <EmptyState
            icon={<ServerIcon size={18} />}
            title="Сервер не найден"
            action={<Button onClick={() => navigate('/dashboard')}>К списку серверов</Button>}
          >
            Сервера «{id}» нет — возможно, его удалили.
          </EmptyState>
        </main>
      </div>
    )
  }
  return <ServerView key={server.id} server={server} />
}

function ServerView({ server }: { server: Server }) {
  const { actions } = useApp()
  const navigate = useNavigate()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState<TabName>('Обзор')
  const [period, setPeriod] = useState<Period>('24ч')
  const [powerBusy, setPowerBusy] = useState(false)
  const [showAllEvents, setShowAllEvents] = useState(false)

  const action = params.get('action') as Action | null
  const openAction = (a: Action) => setParams({ action: a })
  const closeAction = () => setParams({}, { replace: true })

  const os = osById(server.os)
  const region = regionById(server.region)
  const plan = planById(server.plan)
  const busy = isTransient(server)
  const stopped = server.status === 'stopped'
  const load = currentLoad(server)

  const copyIp = async () => {
    const ok = await copyText(server.ip)
    toast({ variant: ok ? 'info' : 'warning', title: ok ? 'IP скопирован' : 'Не удалось скопировать', description: server.ip })
  }

  const togglePower = async () => {
    setPowerBusy(true)
    await actions.setServerPower(server.id, stopped)
    setPowerBusy(false)
    toast({ variant: stopped ? 'success' : 'info', title: stopped ? `${server.name} запущен` : `${server.name} остановлен`, description: stopped ? undefined : 'Тариф продолжает списываться — ресурсы зарезервированы' })
  }

  const events = showAllEvents ? server.events : server.events.slice(0, EVENTS_PREVIEW)
  const charts = [
    { title: 'CPU', value: load.cpu, label: `${load.cpu}%` },
    { title: 'RAM', value: load.ram, label: `${load.ram}%` },
    { title: 'Диск', value: load.disk, label: `${load.disk}%` },
    { title: 'Сеть', value: load.net, label: `${load.net} Мбит/с` },
  ]

  return (
    <div className={styles.page}>
      <AppHeader />
      <PageHeader
        breadcrumb={[{ label: 'Серверы', href: '/dashboard' }, server.name]}
        title={
          <>
            <h1 className={cx(styles.h1, 'ds-heading-3xl')}>{server.name}</h1>
            <ServerStatusBadge status={server.status} />
          </>
        }
        meta={
          <>
            <span className={cx(styles.metaItem, styles.default, 'ds-body-sm-medium')}>
              {server.ip}
              <button type="button" className={styles.iconBtn} aria-label="Скопировать IP" onClick={copyIp}>
                <Copy size={14} aria-hidden />
              </button>
            </span>
            <span className={cx(styles.sep, 'ds-body-sm')}>·</span>
            <span className={cx(styles.muted, 'ds-body-sm')}>
              {server.status === 'running' ? `uptime ${days(Math.max(1, daysSince(server.createdAt)))}` : stopped ? 'остановлен' : 'запускается'}
            </span>
            <span className={cx(styles.sep, 'ds-body-sm')}>·</span>
            <span className={cx(styles.metaItem, styles.muted, 'ds-body-sm')}>
              <MapPin size={14} aria-hidden /> {region.city}
            </span>
          </>
        }
        actions={
          <>
            <Button type="secondary" state={server.status === 'running' ? 'default' : 'disabled'} onClick={() => toast({ variant: 'info', title: 'Веб-консоль', description: `В мок-версии консоли нет · подключитесь: ssh root@${server.ip}` })}>
              <Terminal size={14} aria-hidden /> Консоль
            </Button>
            <Button type="secondary" state={server.status === 'running' ? 'default' : 'disabled'} onClick={() => openAction('reboot')}>
              <RefreshCw size={14} aria-hidden /> Перезагрузить
            </Button>
            <Button type="secondary" state={powerBusy ? 'loading' : busy ? 'disabled' : 'default'} onClick={togglePower}>
              {stopped ? <Play size={14} aria-hidden /> : <Power size={14} aria-hidden />} {stopped ? 'Запустить' : 'Остановить'}
            </Button>
            <Dropdown
              aria-label="Ещё действия"
              items={[
                { label: 'Переустановить ОС', onSelect: () => openAction('reinstall') },
                { label: 'Удалить сервер', destructive: true, onSelect: () => openAction('delete') },
              ]}
            />
          </>
        }
      />

      <div className={styles.tabsRow} role="tablist">
        {TABS.map((t) => (
          <Tab key={t} state={t === tab ? 'active' : 'default'} onClick={() => setTab(t)}>
            {t}
          </Tab>
        ))}
      </div>

      <main className={styles.content}>
        {busy && <Banner tone="info" title={TRANSIENT_TEXT[server.status]}>Действия с сервером станут доступны, когда он запустится.</Banner>}
        {stopped && (
          <Banner tone="warning" title="Сервер остановлен" action={<Button type="secondary" state={powerBusy ? 'loading' : 'default'} onClick={togglePower}>Запустить</Button>}>
            Тариф продолжает списываться — ресурсы и IP зарезервированы за вами.
          </Banner>
        )}

        {tab === 'Обзор' && (
          <>
            <div className={styles.topRow}>
              <div className={styles.configBlock}>
                <ConfigItem icon={<HardDrive size={14} />} label="ОПЕРАЦИОННАЯ СИСТЕМА" value={`${os.name} ${os.version}`} />
                <ConfigItem icon={<MapPin size={14} />} label="РЕГИОН" value={region.city} />
                <ConfigItem icon={<Tag size={14} />} label="ТАРИФ" value={`${plan.name} · ${plan.cpu} vCPU / ${plan.ram} GB / ${plan.ssd} GB SSD`} />
                <ConfigItem icon={<Calendar size={14} />} label="СОЗДАН" value={when(server.createdAt)} />
              </div>
              <div className={styles.statusPanel}>
                <span className={cx(styles.muted, 'ds-label-xs')}>ТЕКУЩАЯ НАГРУЗКА</span>
                <div className={styles.meters}>
                  <LoadMeter label="CPU" percent={load.cpu} />
                  <LoadMeter label="RAM" percent={load.ram} />
                  <LoadMeter label="Диск" percent={load.disk} />
                  <LoadMeter label="Сеть" percent={load.net} />
                </div>
              </div>
            </div>

            <div className={styles.chartsHead}>
              <h2 className={cx(styles.h2, 'ds-heading-xl')}>Метрики за {period === '1ч' ? 'час' : period === '24ч' ? '24 часа' : period === '7д' ? '7 дней' : '30 дней'}</h2>
              <div className={styles.periods} role="radiogroup" aria-label="Период">
                {PERIODS.map((p) => (
                  <button key={p} type="button" role="radio" aria-checked={p === period} className={cx(styles.period, p === period && styles.periodActive, 'ds-body-xs')} onClick={() => setPeriod(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {server.status === 'running' ? (
              <div className={styles.chartsGrid}>
                {charts.map((c) => {
                  const shape = chartShape(server, c.title, period, c.value)
                  const d = delta(shape)
                  return <MetricChart key={c.title} title={c.title} value={c.label} delta={d.text} deltaTone={d.tone} shape={shape} />
                })}
              </div>
            ) : (
              <EmptyState icon={<RotateCw size={18} />} title="Метрик пока нет" compact>
                Графики появятся, когда сервер будет работать.
              </EmptyState>
            )}

            <section className={styles.events}>
              <div className={styles.chartsHead}>
                <h2 className={cx(styles.h2, 'ds-heading-xl')}>События сервера</h2>
                {server.events.length > EVENTS_PREVIEW && (
                  <button type="button" className={cx(styles.action, 'ds-body-sm-medium')} onClick={() => setShowAllEvents((v) => !v)}>
                    {showAllEvents ? 'Свернуть' : `Все события (${server.events.length}) →`}
                  </button>
                )}
              </div>
              <EventList>
                {events.map((e) => (
                  <EventRow key={e.id} icon={EVENT_ICON[e.kind].icon} iconTone={EVENT_ICON[e.kind].tone} time={when(e.at)} title={e.title} subtitle={e.subtitle} />
                ))}
              </EventList>
            </section>
          </>
        )}

        {tab === 'Управление' && (
          <div className={styles.manage}>
            <ManageCard
              title="Переустановить ОС"
              text={`Сейчас: ${os.name} ${os.version}. Все данные будут удалены.`}
              action={<Button type="secondary" state={busy ? 'disabled' : 'default'} onClick={() => openAction('reinstall')}>Переустановить</Button>}
            />
            <ManageCard
              title="Перезагрузить"
              text="Soft или hard reboot — сервер будет недоступен ~30 секунд."
              action={<Button type="secondary" state={server.status === 'running' ? 'default' : 'disabled'} onClick={() => openAction('reboot')}>Перезагрузить</Button>}
            />
            <ManageCard
              title="Удалить сервер"
              text="Неиспользованные дни вернутся на баланс. Восстановление невозможно."
              action={<Button type="secondary" onClick={() => openAction('delete')}><Trash2 size={14} aria-hidden /> Удалить</Button>}
            />
          </div>
        )}

        {(tab === 'Сеть' || tab === 'Снапшоты' || tab === 'Логи') && (
          <EmptyState icon={<Hammer size={18} />} title={`Раздел «${tab}» в разработке`} action={<Button type="secondary" onClick={() => setTab('Обзор')}>Вернуться к обзору</Button>}>
            В этой версии прототипа доступны «Обзор» и «Управление».
          </EmptyState>
        )}
      </main>

      {action === 'reboot' && <RebootDialog server={server} onClose={closeAction} />}
      {action === 'reinstall' && <ReinstallDialog server={server} onClose={closeAction} />}
      {action === 'delete' && <DeleteDialog server={server} onClose={closeAction} onDeleted={() => navigate('/dashboard', { replace: true })} />}
    </div>
  )
}

function ManageCard({ title, text, action }: { title: string; text: string; action: ReactNode }) {
  return (
    <div className={styles.manageCard}>
      <div className={styles.manageText}>
        <span className={cx(styles.default, 'ds-body-sm-medium')}>{title}</span>
        <span className={cx(styles.muted, 'ds-body-xs')}>{text}</span>
      </div>
      {action}
    </div>
  )
}
