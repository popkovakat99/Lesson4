// Стартовые мок-данные для трёх сценариев. Даты считаются от «сейчас», чтобы «Сегодня/Вчера» были честными.
import type { AppData, Operation, Scenario, Server, ServerEvent, SshKey } from './types'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/** Момент «n дней назад в hh:mm» */
const at = (daysAgo: number, hh: number, mm: number) => {
  const d = new Date(Date.now() - daysAgo * DAY)
  d.setHours(hh, mm, 0, 0)
  return d.toISOString()
}

let seq = 0
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`

const SSH_KEYS: SshKey[] = [
  { id: 'anton-laptop', name: 'anton-laptop', type: 'Ed25519' },
  { id: 'work-pc', name: 'work-pc', type: 'RSA 4096' },
]

const createdEvent = (iso: string, os: string): ServerEvent => ({
  id: uid('ev'),
  at: iso,
  kind: 'created',
  title: 'Сервер создан',
  subtitle: `Создание заняло 47 сек · из шаблона ${os}`,
})

function demoServers(): Server[] {
  return [
    {
      id: 'vpn-ams-01',
      name: 'vpn-ams-01',
      status: 'running',
      ip: '185.23.45.67',
      os: 'ubuntu',
      region: 'ams',
      plan: 'standard',
      sshKey: 'anton-laptop',
      createdAt: at(12, 14, 32),
      events: [
        { id: uid('ev'), at: at(0, 3, 0), kind: 'update', title: 'Автоматическое обновление пакетов', subtitle: 'apt update; apt upgrade · 47 пакетов' },
        { id: uid('ev'), at: at(1, 16, 42), kind: 'ssh', title: 'Входящее SSH-подключение', subtitle: '185.143.xxx.42 · anton-laptop key · успех' },
        { id: uid('ev'), at: at(1, 12, 8), kind: 'alert', title: 'Превышен порог трафика', subtitle: '12 Мбит/с в течение 4 минут — alert приостановлен' },
        createdEvent(at(12, 14, 32), 'Ubuntu 22.04'),
      ],
    },
    {
      id: 'bot-fra-01',
      name: 'bot-fra-01',
      status: 'running',
      ip: '94.12.78.34',
      os: 'debian',
      region: 'fra',
      plan: 'starter',
      sshKey: 'anton-laptop',
      createdAt: at(42, 10, 15),
      events: [createdEvent(at(42, 10, 15), 'Debian 12')],
    },
    {
      id: 'staging-hel-01',
      name: 'staging-hel-01',
      status: 'deploying',
      ip: '65.21.89.142',
      os: 'alma',
      region: 'hel',
      plan: 'performance',
      sshKey: 'work-pc',
      createdAt: at(0, 11, 8),
      // Деплой из макета «доезжает» через 15 секунд после первого открытия
      readyAt: new Date(Date.now() + 15_000).toISOString(),
      events: [createdEvent(at(0, 11, 8), 'AlmaLinux 9')],
    },
  ]
}

function demoOperations(): Operation[] {
  return [
    { id: uid('op'), at: at(0, 14, 32), kind: 'topup', title: 'Пополнение TON', subtitle: '5FHn2x...kL3M', amount: 50 },
    { id: uid('op'), at: at(0, 11, 8), kind: 'server', title: 'Создан сервер staging-hel-01', subtitle: 'AlmaLinux 9 · 4 CPU / 8 GB · Хельсинки' },
    { id: uid('op'), at: at(1, 0, 0), kind: 'charge', title: 'Списание · vpn-ams-01', subtitle: 'За месяц использования', amount: -10 },
    { id: uid('op'), at: at(35, 19, 14), kind: 'topup', title: 'Пополнение TRC-20', subtitle: '8HKp3w...rT9Q', amount: 100 },
  ]
}

export function seed(scenario: Scenario): AppData {
  if (scenario === 'empty') {
    return { scenario, balance: 0, servers: [], operations: [], sshKeys: [SSH_KEYS[0]] }
  }
  if (scenario === 'low') {
    // Два сервера и 3.20 USDT: хватит на ~6 дней — красный прогноз, создавать новый нельзя
    const servers = demoServers().slice(0, 2)
    return {
      scenario,
      balance: 3.2,
      servers,
      operations: [
        { id: uid('op'), at: at(2, 0, 0), kind: 'charge', title: 'Списание · vpn-ams-01', subtitle: 'За месяц использования', amount: -10 },
        ...demoOperations().slice(3),
      ],
      sshKeys: SSH_KEYS,
    }
  }
  return { scenario, balance: 142.5, servers: demoServers(), operations: demoOperations(), sshKeys: SSH_KEYS }
}
