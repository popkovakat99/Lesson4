// Правила валидации форм. Возвращают текст ошибки или null.
import { MAX_TOPUP, MIN_TOPUP } from './catalog'
import type { Server } from './types'

export const SERVER_NAME_MAX = 32

export function validateServerName(name: string, servers: Server[]): string | null {
  const v = name.trim()
  if (!v) return 'Введите имя сервера'
  if (v.length < 3) return 'Минимум 3 символа'
  if (v.length > SERVER_NAME_MAX) return `Максимум ${SERVER_NAME_MAX} символа`
  if (!/^[a-z0-9-]+$/.test(v)) return 'Только латиница в нижнем регистре, цифры и дефис'
  if (v.startsWith('-') || v.endsWith('-')) return 'Имя не может начинаться или заканчиваться дефисом'
  if (servers.some((s) => s.name === v)) return `Сервер «${v}» уже есть — выберите другое имя`
  return null
}

/** Сумма пополнения: число, минимум 5, максимум 10 000, не больше 2 знаков после точки */
export function validateAmount(raw: string): string | null {
  const v = raw.trim().replace(',', '.')
  if (!v) return 'Введите сумму'
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return 'Только число, до 2 знаков после точки'
  const n = Number(v)
  if (n <= 0) return 'Сумма должна быть больше нуля'
  if (n < MIN_TOPUP) return `Минимальный платёж — ${MIN_TOPUP} USDT`
  if (n > MAX_TOPUP) return `Максимум ${MAX_TOPUP.toLocaleString('ru-RU')} USDT за один платёж`
  return null
}

export const parseAmount = (raw: string) => Number(raw.trim().replace(',', '.'))
