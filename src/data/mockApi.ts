// Имитация сети: задержка и случайный сбой. Настоящего бэкенда нет.

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export class MockNetworkError extends Error {}

/** Создание сервера иногда «падает» — проверка состояния ошибки (edge-case «Сбой при создании») */
export const CREATE_FAILURE_RATE = 0.25

export function maybeFail(rate: number, message: string) {
  if (Math.random() < rate) throw new MockNetworkError(message)
}

/** Мок-хеш транзакции */
export const fakeHash = () =>
  Array.from({ length: 44 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[Math.floor(Math.random() * 57)]).join('')

/** Мок-IP в подсети региона */
export const fakeIp = (prefix: string) => `${prefix}.${10 + Math.floor(Math.random() * 240)}.${2 + Math.floor(Math.random() * 250)}`
