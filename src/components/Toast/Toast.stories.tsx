import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Toast } from './Toast'
import { Button } from '../Button'

/**
 * Всплывающее уведомление. Figma: ComponentSet `Toast` (`61:273`), `Variant` (4).
 * Точка слева — `bg-success` / `bg-warning` / `bg-error` / `bg-info`.
 */
const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    variant: 'success',
    title: 'Зачислено 50.00 USDT',
    description: 'Новый баланс: 192.50 USDT',
    onClose: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['success', 'warning', 'error', 'info'], description: 'Figma: Variant' },
    title: { control: 'text', description: 'Заголовок (DS/Body/sm Medium)' },
    description: { control: 'text', description: 'Описание (DS/Body/xs, text-muted)' },
    onClose: { action: 'close' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

/** Пополнение зачислено. */
export const Success: Story = {}

/** Баланс заканчивается. */
export const Warning: Story = {
  args: { variant: 'warning', title: 'Баланс заканчивается', description: 'Серверы остановятся через 6 часов' },
}

/** Транзакция отклонена. */
export const Error: Story = {
  args: { variant: 'error', title: 'Транзакция отклонена', description: 'Попробуйте снова или смените сеть' },
}

/** Информация о курсе. */
export const Info: Story = {
  args: { variant: 'info', title: 'Курс зафиксирован на 30 минут', description: 'После истечения создайте новый запрос' },
}

/** Длинный текст: заголовок и описание переносятся, точка и крестик остаются на месте. */
export const LongContent: Story = {
  args: {
    variant: 'warning',
    title: 'Баланса хватит меньше чем на 6 часов — серверы vpn-ams-01 и bot-fra-01 будут остановлены',
    description:
      'Пополните баланс через TON или TRC-20. После зачисления серверы запустятся автоматически, данные сохранятся. Если не пополнить в течение 6 часов грейс-периода, работа остановится.',
  },
}

/** Крайний случай: только заголовок, без описания. */
export const TitleOnly: Story = { args: { variant: 'info', title: 'Адрес скопирован', description: undefined } }

/** Анимация появления: каждое нажатие добавляет уведомление, через 4 секунды оно исчезает. */
export const Appearance: Story = {
  parameters: { layout: 'padded' },
  render: function Render() {
    const [toasts, setToasts] = useState<Array<{ id: number; args: Story['args'] }>>([])
    const variants = [Success, Warning, Error, Info]
    const push = () => {
      const id = Date.now()
      const args = variants[toasts.length % variants.length].args
      setToasts((t) => [...t, { id, args }])
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start', minHeight: 360 }}>
        <Button type="primary" onClick={push}>Показать уведомление</Button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              {...meta.args}
              {...t.args}
              onClose={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
            />
          ))}
        </div>
      </div>
    )
  },
}

/** Все 4 варианта стопкой. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {[Success, Warning, Error, Info].map((s, i) => (
        <Toast key={i} {...meta.args} {...s.args} />
      ))}
    </div>
  ),
}
