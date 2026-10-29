// Вычисляемые показатели: расход, прогноз баланса, возврат при удалении.
import { cheapestPlanPrice, planById } from './catalog'
import type { AppData, Server } from './types'

export type ForecastTone = 'success' | 'warning' | 'error' | 'neutral'

/** Расход в месяц — по всем серверам (остановленные тоже оплачиваются: ресурсы зарезервированы) */
export const monthlyCost = (servers: Server[]) => servers.reduce((sum, s) => sum + planById(s.plan).price, 0)

/** На сколько дней хватит баланса; null — серверов нет, списаний нет */
export function forecastDays(data: AppData): number | null {
  const perDay = monthlyCost(data.servers) / 30
  if (perDay === 0) return null
  return Math.max(0, Math.floor(data.balance / perDay))
}

/** Пороги прогноза из ds/foundation.md: > 14 дней — зелёный, 7–14 — жёлтый, < 7 — красный */
export function forecastTone(days: number | null): ForecastTone {
  if (days === null) return 'neutral'
  if (days > 14) return 'success'
  if (days >= 7) return 'warning'
  return 'error'
}

/** Прогноз, если добавить расход ещё одного тарифа */
export function forecastWithExtra(data: AppData, extraMonthly: number): number {
  const perDay = (monthlyCost(data.servers) + extraMonthly) / 30
  return Math.max(0, Math.floor((data.balance - extraMonthly) / perDay))
}

/** Возврат за неиспользованные дни текущего месяца работы сервера */
export function refundFor(server: Server): number {
  const price = planById(server.plan).price
  const usedDays = Math.floor((Date.now() - new Date(server.createdAt).getTime()) / 86_400_000) % 30
  return Math.round(price * ((30 - usedDays) / 30) * 100) / 100
}

/** Хватает ли денег хотя бы на самый дешёвый тариф */
export const canAffordAnyPlan = (balance: number) => balance >= cheapestPlanPrice

export const isTransient = (s: Server) => s.status === 'deploying' || s.status === 'rebooting' || s.status === 'reinstalling'
