// Единый слой мок-данных: состояние приложения + действия. Экраны читают через useApp() и меняют только через actions.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { networkById, osById, planById, planSpecs, regionById } from './catalog'
import { refundFor } from './derive'
import { CREATE_FAILURE_RATE, delay, fakeHash, fakeIp, maybeFail } from './mockApi'
import { seed, uid } from './seed'
import type { AppData, NetworkId, OsId, PlanId, RegionId, Scenario, Server, ServerEvent, SshKey } from './types'
import { shortHash } from './format'

const STORAGE_KEY = 'cryptovps-demo-v1'

export interface CreateServerInput {
  name: string
  os: OsId
  region: RegionId
  plan: PlanId
  sshKey: string
}

export interface AppActions {
  createServer: (input: CreateServerInput) => Promise<Server>
  deleteServer: (id: string) => Promise<number>
  rebootServer: (id: string, mode: 'soft' | 'hard') => Promise<void>
  reinstallServer: (id: string, os: OsId) => Promise<void>
  setServerPower: (id: string, on: boolean) => Promise<void>
  rebootAll: () => Promise<number>
  addSshKey: () => SshKey
  topup: (network: NetworkId, amount: number) => Promise<void>
  setScenario: (scenario: Scenario) => void
}

interface AppContextValue {
  data: AppData
  actions: AppActions
}

const AppContext = createContext<AppContextValue | null>(null)

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (Array.isArray(parsed.servers) && typeof parsed.balance === 'number') return parsed
    }
  } catch {
    // нет доступа к хранилищу или битые данные — начинаем с демо
  }
  return seed('demo')
}

const now = () => new Date().toISOString()
const event = (kind: ServerEvent['kind'], title: string, subtitle: string): ServerEvent => ({ id: uid('ev'), at: now(), kind, title, subtitle })
const later = (ms: number) => new Date(Date.now() + ms).toISOString()

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(load)
  const dataRef = useRef(data)
  dataRef.current = data

  // Сохраняем в браузере, чтобы обновление страницы не сбрасывало демо
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // приватный режим — живём без сохранения
    }
  }, [data])

  // Временные состояния (деплой, перезагрузка, переустановка) сами завершаются к readyAt
  useEffect(() => {
    const timer = setInterval(() => {
      const t = Date.now()
      const due = dataRef.current.servers.some((s) => s.readyAt && new Date(s.readyAt).getTime() <= t)
      if (!due) return
      setData((d) => ({
        ...d,
        servers: d.servers.map((s) => {
          if (!s.readyAt || new Date(s.readyAt).getTime() > t) return s
          const title = s.status === 'deploying' ? 'Сервер готов к работе' : s.status === 'reinstalling' ? 'ОС переустановлена' : 'Перезагрузка завершена'
          return { ...s, status: 'running', readyAt: undefined, events: [event('ready', title, `${osById(s.os).name} ${osById(s.os).version} · ${s.ip}`), ...s.events] }
        }),
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const updateServer = useCallback((id: string, fn: (s: Server) => Server) => {
    setData((d) => ({ ...d, servers: d.servers.map((s) => (s.id === id ? fn(s) : s)) }))
  }, [])

  const actions = useMemo<AppActions>(
    () => ({
      async createServer(input) {
        await delay(1500)
        maybeFail(CREATE_FAILURE_RATE, 'Дата-центр не ответил вовремя. Деньги не списаны — попробуйте ещё раз.')
        const plan = planById(input.plan)
        const os = osById(input.os)
        const region = regionById(input.region)
        const server: Server = {
          id: input.name,
          name: input.name,
          status: 'deploying',
          ip: fakeIp(region.ipPrefix),
          os: input.os,
          region: input.region,
          plan: input.plan,
          sshKey: input.sshKey,
          createdAt: now(),
          readyAt: later(8000),
          events: [event('created', 'Сервер создан', `Деплой из шаблона ${os.name} ${os.version} · ${region.city}`)],
        }
        setData((d) => ({
          ...d,
          balance: Math.round((d.balance - plan.price) * 100) / 100,
          servers: [server, ...d.servers],
          operations: [
            { id: uid('op'), at: now(), kind: 'charge', title: `Списание · ${server.name}`, subtitle: `Первый месяц · ${plan.name}`, amount: -plan.price },
            { id: uid('op'), at: now(), kind: 'server', title: `Создан сервер ${server.name}`, subtitle: `${os.name} ${os.version} · ${planSpecs(input.plan)} · ${region.city}` },
            ...d.operations,
          ],
        }))
        return server
      },

      async deleteServer(id) {
        const server = dataRef.current.servers.find((s) => s.id === id)
        if (!server) throw new Error('Сервер не найден')
        await delay(1200)
        const refund = refundFor(server)
        setData((d) => ({
          ...d,
          balance: Math.round((d.balance + refund) * 100) / 100,
          servers: d.servers.filter((s) => s.id !== id),
          operations: [
            { id: uid('op'), at: now(), kind: 'refund', title: `Возврат · ${server.name}`, subtitle: 'Неиспользованные дни после удаления сервера', amount: refund },
            ...d.operations,
          ],
        }))
        return refund
      },

      async rebootServer(id, mode) {
        await delay(600)
        updateServer(id, (s) => ({
          ...s,
          status: 'rebooting',
          readyAt: later(mode === 'soft' ? 5000 : 2500),
          events: [event('reboot', mode === 'soft' ? 'Soft reboot' : 'Hard reboot', mode === 'soft' ? 'Корректное завершение процессов' : 'Принудительная перезагрузка'), ...s.events],
        }))
      },

      async reinstallServer(id, osId) {
        await delay(1000)
        const os = osById(osId)
        updateServer(id, (s) => ({
          ...s,
          os: osId,
          status: 'reinstalling',
          readyAt: later(7000),
          events: [event('reinstall', 'Переустановка ОС', `${osById(s.os).name} → ${os.name} ${os.version} · данные удалены`), ...s.events],
        }))
      },

      async setServerPower(id, on) {
        await delay(900)
        updateServer(id, (s) => ({
          ...s,
          status: on ? 'running' : 'stopped',
          readyAt: undefined,
          events: [on ? event('started', 'Сервер запущен', 'Запуск по команде из панели') : event('stopped', 'Сервер остановлен', 'Остановка по команде из панели'), ...s.events],
        }))
      },

      async rebootAll() {
        const running = dataRef.current.servers.filter((s) => s.status === 'running')
        await delay(800)
        running.forEach((s) =>
          updateServer(s.id, (x) => ({ ...x, status: 'rebooting', readyAt: later(5000), events: [event('reboot', 'Soft reboot', 'Перезагрузка всех серверов из дашборда'), ...x.events] })),
        )
        return running.length
      },

      addSshKey() {
        const n = dataRef.current.sshKeys.length + 1
        const key: SshKey = { id: uid('key'), name: `new-key-${n}`, type: 'Ed25519' }
        setData((d) => ({ ...d, sshKeys: [...d.sshKeys, key] }))
        return key
      },

      async topup(networkId, amount) {
        const network = networkById(networkId)
        await delay(network.confirmMs)
        setData((d) => ({
          ...d,
          balance: Math.round((d.balance + amount) * 100) / 100,
          operations: [
            { id: uid('op'), at: now(), kind: 'topup', title: `Пополнение ${network.name}`, subtitle: shortHash(fakeHash()), amount },
            ...d.operations,
          ],
        }))
      },

      setScenario(scenario) {
        setData(seed(scenario))
      },
    }),
    [updateServer],
  )

  const value = useMemo(() => ({ data, actions }), [data, actions])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp вне AppDataProvider')
  return ctx
}
