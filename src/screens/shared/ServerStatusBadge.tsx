import { Badge } from '../../components'
import type { BadgeVariant } from '../../components'
import type { ServerStatus } from '../../data'

const MAP: Record<ServerStatus, { variant: BadgeVariant; label: string }> = {
  running: { variant: 'success', label: 'Работает' },
  deploying: { variant: 'warning', label: 'Деплой' },
  rebooting: { variant: 'warning', label: 'Перезагрузка' },
  reinstalling: { variant: 'warning', label: 'Переустановка' },
  stopped: { variant: 'neutral', label: 'Остановлен' },
}

/** Статус сервера → базовый Badge с цветной точкой. */
export function ServerStatusBadge({ status }: { status: ServerStatus }) {
  const m = MAP[status]
  return <Badge variant={m.variant}>{m.label}</Badge>
}
