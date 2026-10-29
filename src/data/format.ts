// Форматирование денег и дат для экранов.

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const MONTHS_LONG = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

const DAY = 24 * 60 * 60 * 1000

/** 142.5 → «142.50 USDT» */
export const usdt = (n: number) => `${n.toFixed(2)} USDT`

/** 50 → «+50.00 USDT», −10 → «−10.00 USDT» (типографский минус) */
export const signedUsdt = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)} USDT`

const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

/** «Сегодня, 14:32» / «Вчера, 00:00» / «23 марта, 19:14» */
export function when(iso: string): string {
  const d = new Date(iso)
  const diff = Math.round((startOfDay(new Date()) - startOfDay(d)) / DAY)
  if (diff === 0) return `Сегодня, ${hhmm(d)}`
  if (diff === 1) return `Вчера, ${hhmm(d)}`
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]}, ${hhmm(d)}`
}

/** «12 апр» */
export const shortDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`
}

/** «12 апреля» */
export const longDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`
}

/** Полных дней с даты */
export const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY))

/** 1 день, 2 дня, 5 дней */
export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export const days = (n: number) => `${n} ${plural(n, 'день', 'дня', 'дней')}`

/** 1785 секунд → «29:45» */
export const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

/** Короткий хеш транзакции: «5FHn2x...kL3M» */
export const shortHash = (h: string) => (h.length > 12 ? `${h.slice(0, 6)}...${h.slice(-4)}` : h)
