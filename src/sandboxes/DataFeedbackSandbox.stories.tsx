import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, IconButton, Table, Toast, Tooltip } from '../components'
import type { TableColumn, ToastVariant } from '../components'

/**
 * Песочница «Данные и обратная связь»: Table + Toast + Tooltip.
 * Копирование хеша показывает подсказку и уведомление; «Пополнить» добавляет строку в таблицу.
 */
const meta = {
  title: 'Sandboxes/Данные и обратная связь',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

interface Payment {
  id: number
  date: string
  amount: string
  kind: string
  status: 'Зачислено' | 'Ожидает'
  hash: string
}

const INITIAL: Payment[] = [
  { id: 1, date: '12 апр', amount: '+50.00', kind: 'Пополнение TON', status: 'Зачислено', hash: '5FHn2x...kL3M' },
  { id: 2, date: '01 апр', amount: '−10.00', kind: 'Списание (vpn-ams-01)', status: 'Зачислено', hash: '—' },
  { id: 3, date: '23 мар', amount: '+100.00', kind: 'Пополнение TRC-20', status: 'Зачислено', hash: '8HKp3w...rT9Q' },
]

/** История платежей: живые уведомления и подсказки поверх таблицы. */
export const BillingHistory: Story = {
  render: function Render() {
    const [rows, setRows] = useState(INITIAL)
    const [copied, setCopied] = useState<number | null>(null)
    const [toast, setToast] = useState<{ variant: ToastVariant; title: string; description: string } | null>(null)

    const copyHash = (p: Payment) => {
      setCopied(p.id)
      setToast({ variant: 'info', title: 'Хеш скопирован', description: p.hash })
      setTimeout(() => setCopied(null), 1500)
    }

    const topUp = () => {
      const id = Date.now()
      setRows((r) => [{ id, date: '28 окт', amount: '+25.00', kind: 'Пополнение TON', status: 'Ожидает', hash: 'Q7aW1z...pN4K' }, ...r])
      setToast({ variant: 'warning', title: 'Ждём подтверждения сети', description: 'TON: обычно 1–2 минуты' })
      setTimeout(() => {
        setRows((r) => r.map((row) => (row.id === id ? { ...row, status: 'Зачислено' } : row)))
        setToast({ variant: 'success', title: 'Зачислено 25.00 USDT', description: 'Новый баланс: 167.50 USDT' })
      }, 2500)
    }

    const columns: Array<TableColumn<Payment>> = [
      { key: 'date', header: 'ДАТА', width: 100, render: (r) => r.date },
      { key: 'amount', header: 'СУММА', width: 100, render: (r) => r.amount },
      { key: 'kind', header: 'ТИП', width: 200, render: (r) => r.kind },
      {
        key: 'status',
        header: 'СТАТУС',
        width: 140,
        render: (r) => <Badge variant={r.status === 'Ожидает' ? 'warning' : 'success'}>{r.status}</Badge>,
      },
      {
        key: 'hash',
        header: 'ХЕШ',
        render: (r) =>
          r.hash === '—' ? (
            '—'
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', position: 'relative' }}>
              {r.hash}
              <IconButton type="secondary" aria-label="Скопировать хеш" icon={<Copy size={14} />} onClick={() => copyHash(r)} />
              {copied === r.id && (
                <span style={{ position: 'absolute', left: '100%', marginLeft: 'var(--space-2)' }}>
                  <Tooltip placement="top">Скопировано</Tooltip>
                </span>
              )}
            </span>
          ),
      },
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="ds-heading-2xl" style={{ margin: 0, color: 'var(--text-strong)' }}>История платежей</h2>
          <Button type="primary" onClick={topUp}>Пополнить на 25 USDT</Button>
        </div>
        <Table density="default" columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </div>
    )
  },
}
