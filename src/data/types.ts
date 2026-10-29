// Типы мок-данных CryptoVPS. Это не бэкенд — только форма данных, с которой работают экраны.

export type OsId = 'ubuntu' | 'debian' | 'alma' | 'centos'
export type RegionId = 'ams' | 'fra' | 'hel'
export type PlanId = 'starter' | 'standard' | 'performance'
export type NetworkId = 'ton' | 'trc20'

/** running — работает; deploying/rebooting/reinstalling — временные состояния; stopped — остановлен */
export type ServerStatus = 'running' | 'deploying' | 'rebooting' | 'reinstalling' | 'stopped'

export type ServerEventKind = 'created' | 'ready' | 'reboot' | 'reinstall' | 'stopped' | 'started' | 'ssh' | 'update' | 'alert'

export interface ServerEvent {
  id: string
  at: string
  kind: ServerEventKind
  title: string
  subtitle: string
}

export interface Server {
  /** Совпадает с именем — имя уникально (см. validation.ts) */
  id: string
  name: string
  status: ServerStatus
  ip: string
  os: OsId
  region: RegionId
  plan: PlanId
  sshKey: string
  createdAt: string
  /** Когда временное состояние (деплой, перезагрузка, переустановка) закончится */
  readyAt?: string
  events: ServerEvent[]
}

export type OperationKind = 'topup' | 'charge' | 'refund' | 'server'

export interface Operation {
  id: string
  at: string
  kind: OperationKind
  title: string
  subtitle: string
  /** Плюс — зачисление, минус — списание; нет — событие без денег */
  amount?: number
}

export interface SshKey {
  id: string
  name: string
  type: 'Ed25519' | 'RSA 4096'
}

/** demo — данные из макетов; empty — новый пользователь; low — баланс почти закончился */
export type Scenario = 'demo' | 'empty' | 'low'

export interface AppData {
  scenario: Scenario
  balance: number
  servers: Server[]
  operations: Operation[]
  sshKeys: SshKey[]
}
