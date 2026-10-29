import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'
import { Table } from './Table'
import type { TableColumn, TableProps } from './Table'
import { Badge } from '../Badge'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

interface Payment {
  date: string
  amount: string
  kind: string
  status: 'Зачислено' | 'Готово' | 'Ожидает'
  hash: string
}

const PAYMENTS: Payment[] = [
  { date: '12 апр', amount: '+50.00', kind: 'Пополнение TON', status: 'Зачислено', hash: '5FHn2x...kL3M' },
  { date: '01 апр', amount: '−10.00', kind: 'Списание (vpn-ams-01)', status: 'Готово', hash: '—' },
  { date: '23 мар', amount: '+100.00', kind: 'Пополнение TRC-20', status: 'Зачислено', hash: '8HKp3w...rT9Q' },
]

const COLUMNS: Array<TableColumn<Payment>> = [
  { key: 'date', header: 'ДАТА', width: 120, render: (r) => r.date },
  { key: 'amount', header: 'СУММА', width: 100, render: (r) => r.amount },
  { key: 'kind', header: 'ТИП', width: 200, render: (r) => r.kind },
  { key: 'status', header: 'СТАТУС', width: 130, render: (r) => r.status },
  { key: 'hash', header: 'ХЕШ', width: 120, render: (r) => r.hash },
]

type PaymentTableProps = TableProps<Payment>
const PaymentTable = Table as ComponentType<PaymentTableProps>

/**
 * Табличный список: шапка + строки. Figma: ComponentSet `Table` (`59:290`), `Density` (2).
 * Строки подсвечиваются `surface-subtle` при наведении. Пример — история платежей из BillingHistory.
 */
const meta = {
  title: 'Components/Table',
  component: PaymentTable,
  tags: ['autodocs'],
  args: { density: 'default', columns: COLUMNS, rows: PAYMENTS, rowKey: (r: Payment) => r.date },
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'default'], description: 'Figma: Density — строка 36 / 48' },
    columns: { control: 'object', description: 'Колонки { key, header, render, width? }' },
    rows: { control: 'object', description: 'Данные строк' },
    rowKey: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 720 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PaymentTable>

export default meta
type Story = StoryObj<typeof meta>

/** Обычная плотность — строка 48. */
export const Default: Story = {}

/** Компактная плотность — строка 36. */
export const Compact: Story = { args: { density: 'compact' } }

/** Статус как Badge внутри ячейки. */
export const WithBadges: Story = {
  args: {
    columns: COLUMNS.map((c) =>
      c.key === 'status'
        ? { ...c, render: (r: Payment) => <Badge variant={r.status === 'Ожидает' ? 'warning' : 'success'}>{r.status}</Badge> }
        : c,
    ),
  },
}

/** Крайний случай: платежей ещё нет — видна только шапка (отдельного пустого состояния в ДС пока нет). */
export const Empty: Story = { args: { rows: [] } }

/** Длинный контент: длинный тип операции и полный хеш транзакции не ломают раскладку. */
export const LongContent: Story = {
  args: {
    rows: [
      {
        date: '12 апр',
        amount: '+1 250 000.00',
        kind: 'Пополнение TON через Telegram-кошелёк (Wallet) с комментарием к переводу',
        status: 'Зачислено',
        hash: '5FHn2xQp9vRtY5wFhC1pZ8sA2dDgKpXe8rWt3mB4qNvkL3M',
      },
      ...PAYMENTS.slice(1),
    ],
  },
}

/** Много строк — история за несколько месяцев, наведение подсвечивает строку. */
export const ManyRows: Story = {
  args: {
    density: 'compact',
    rows: Array.from({ length: 20 }, (_, i) => ({
      ...PAYMENTS[i % PAYMENTS.length],
      date: `${String(28 - i).padStart(2, '0')} мар`,
    })),
    rowKey: (r: Payment, i?: number) => `${r.date}-${i}`,
  },
}

/** Обе плотности рядом. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [(Story) => <Story />],
  render: () => (
    <VariantGrid>
      {(['compact', 'default'] as const).map((d) => (
        <VariantRow key={d}>
          <VariantCell label={`Density=${d}`}>
            <div style={{ width: 720 }}>
              <PaymentTable density={d} columns={COLUMNS} rows={PAYMENTS} rowKey={(r) => r.date} />
            </div>
          </VariantCell>
        </VariantRow>
      ))}
    </VariantGrid>
  ),
}
