import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, Breadcrumb, Card, Navbar, Pagination, Tabs } from '../components'

/**
 * Песочница «Навигация»: Navbar + Breadcrumb + Tabs + Pagination в одном контексте.
 * Переключение вкладки меняет хлебные крошки и содержимое; пагинация листает список событий.
 */
const meta = {
  title: 'Sandboxes/Навигация',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const TABS = ['Обзор', 'Сеть', 'Управление']

const EVENTS = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  title: ['Перезагрузка', 'Снапшот создан', 'Вход по SSH', 'Обновление ядра'][i % 4],
  time: `${12 - Math.floor(i / 6)} апр, ${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
}))

const PER_PAGE = 3

/** Страница сервера vpn-ams-01: шапка, путь, вкладки и постраничный журнал событий. */
export const ServerDetails: Story = {
  render: function Render() {
    const [tab, setTab] = useState('Обзор')
    const [page, setPage] = useState(1)
    const total = Math.ceil(EVENTS.length / PER_PAGE)
    const visible = EVENTS.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 900 }}>
        <Navbar items={[{ label: 'Серверы', active: true }, { label: 'Биллинг' }, { label: 'Статус' }]} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Breadcrumb items={[{ label: 'Серверы' }, { label: 'vpn-ams-01' }, { label: tab }]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h2 className="ds-heading-3xl" style={{ margin: 0, color: 'var(--text-strong)' }}>vpn-ams-01</h2>
            <Badge variant="success">Работает</Badge>
          </div>
        </div>

        <Tabs items={TABS} value={tab} onChange={(t) => { setTab(t); setPage(1) }} />

        {tab === 'Обзор' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {visible.map((e) => (
              <Card key={e.id} title={e.title}>{e.time}</Card>
            ))}
            <Pagination page={page} total={total} onChange={setPage} />
          </div>
        )}
        {tab === 'Сеть' && <Card title="IPv4: 185.23.45.67">Трафик за месяц: 312 GB из 4 TB</Card>}
        {tab === 'Управление' && <Card title="Переустановка ОС">Текущая система: Ubuntu 22.04 LTS</Card>}
      </div>
    )
  },
}
