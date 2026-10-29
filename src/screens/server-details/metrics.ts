// Мок-метрики сервера: детерминированные по id и периоду, чтобы графики не «прыгали» между рендерами.
import type { Server } from '../../data'

export type Period = '1ч' | '24ч' | '7д' | '30д'
export const PERIODS: Period[] = ['1ч', '24ч', '7д', '30д']

/** Простой генератор псевдослучайных чисел от строки */
function seeded(key: string) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export interface Load {
  cpu: number
  ram: number
  disk: number
  net: number
}

/** Текущая нагрузка; у неработающего сервера — нули */
export function currentLoad(server: Server): Load {
  if (server.status !== 'running') return { cpu: 0, ram: 0, disk: 0, net: 0 }
  if (server.id === 'vpn-ams-01') return { cpu: 34, ram: 62, disk: 18, net: 12 } // значения из макета
  const r = seeded(server.id)
  return { cpu: Math.round(10 + r() * 60), ram: Math.round(20 + r() * 60), disk: Math.round(5 + r() * 40), net: Math.round(2 + r() * 30) }
}

/** Форма линии графика (0–1) около текущего значения */
export function chartShape(server: Server, metric: string, period: Period, value: number): number[] {
  const r = seeded(`${server.id}:${metric}:${period}`)
  const base = value / 100
  const spread = period === '1ч' ? 0.06 : period === '24ч' ? 0.15 : period === '7д' ? 0.22 : 0.28
  return Array.from({ length: 9 }, (_, i) => (i === 8 ? base : Math.min(0.95, Math.max(0.03, base + (r() - 0.5) * 2 * spread))))
}

/** Изменение за период — подпись рядом со значением */
export function delta(shape: number[]) {
  const d = Math.round((shape[shape.length - 1] - shape[0]) * 100)
  if (d === 0) return { text: '→ 0%', tone: 'muted' as const }
  return d > 0 ? { text: `↑ +${d}%`, tone: d > 10 ? ('warning' as const) : ('action' as const) } : { text: `↓ −${-d}%`, tone: 'success' as const }
}
