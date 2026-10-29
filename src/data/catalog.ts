// Справочники: ОС, регионы, тарифы, сети оплаты. Значения — из макетов Figma.
import type { NetworkId, OsId, PlanId, RegionId } from './types'

export interface OsInfo {
  id: OsId
  name: string
  version: string
  /** Подпись на карточке выбора при создании сервера */
  hint: string
  /** Префикс для автоимени сервера */
  slug: string
}

export const OS_LIST: OsInfo[] = [
  { id: 'ubuntu', name: 'Ubuntu', version: '22.04 LTS', hint: '22.04 LTS · до 2027', slug: 'ubuntu' },
  { id: 'debian', name: 'Debian', version: '12', hint: '12 · стабильный', slug: 'debian' },
  { id: 'alma', name: 'AlmaLinux', version: '9', hint: '9 · enterprise', slug: 'alma' },
  { id: 'centos', name: 'CentOS', version: 'Stream 9', hint: 'Stream 9', slug: 'centos' },
]

export interface RegionInfo {
  id: RegionId
  city: string
  flag: string
  ping: number
  /** Префикс подсети для мок-IP */
  ipPrefix: string
}

export const REGIONS: RegionInfo[] = [
  { id: 'ams', city: 'Амстердам', flag: '🇳🇱', ping: 32, ipPrefix: '185.23' },
  { id: 'fra', city: 'Франкфурт', flag: '🇩🇪', ping: 38, ipPrefix: '94.12' },
  { id: 'hel', city: 'Хельсинки', flag: '🇫🇮', ping: 29, ipPrefix: '65.21' },
]

export interface PlanInfo {
  id: PlanId
  name: string
  cpu: number
  ram: number
  ssd: number
  traffic: number
  /** Цена в USDT за месяц (1 USDT = $1) */
  price: number
  popular?: boolean
}

export const PLANS: PlanInfo[] = [
  { id: 'starter', name: 'Starter', cpu: 1, ram: 2, ssd: 40, traffic: 2, price: 5 },
  { id: 'standard', name: 'Standard', cpu: 2, ram: 4, ssd: 80, traffic: 4, price: 10, popular: true },
  { id: 'performance', name: 'Performance', cpu: 4, ram: 8, ssd: 160, traffic: 6, price: 20 },
]

export interface NetworkInfo {
  id: NetworkId
  name: string
  address: string
  eta: string
  fee: string
  /** Сколько мок-«сеть» подтверждает перевод, мс */
  confirmMs: number
}

export const NETWORKS: NetworkInfo[] = [
  {
    id: 'ton',
    name: 'TON',
    address: 'UQBv8Nk7X9K2jL4mQp3vRtY5wFhC1pZ8sA2dDgKpXe8rWt3mB4qNv',
    eta: '1–2 минуты',
    fee: '~0.1 USDT',
    confirmMs: 3000,
  },
  {
    id: 'trc20',
    name: 'TRC-20',
    address: 'TQrZ9wYb4Lm2Nf7Kx8Pd3Hs6Vt1Rc5Jg3xKp',
    eta: '3–5 минут',
    fee: '~1 USDT',
    confirmMs: 4500,
  },
]

/** Минимальный платёж — из лендинга («Минимальный платёж — 5 USDT») */
export const MIN_TOPUP = 5
export const MAX_TOPUP = 10000
/** Курс фиксируется на 30 минут */
export const RATE_LOCK_SECONDS = 30 * 60

export const osById = (id: OsId) => OS_LIST.find((o) => o.id === id) ?? OS_LIST[0]
export const regionById = (id: RegionId) => REGIONS.find((r) => r.id === id) ?? REGIONS[0]
export const planById = (id: PlanId) => PLANS.find((p) => p.id === id) ?? PLANS[0]
export const networkById = (id: NetworkId) => NETWORKS.find((n) => n.id === id) ?? NETWORKS[0]

export const cheapestPlanPrice = Math.min(...PLANS.map((p) => p.price))

export const planSpecs = (id: PlanId) => {
  const p = planById(id)
  return `${p.cpu} CPU · ${p.ram} GB · ${p.ssd} GB SSD`
}
