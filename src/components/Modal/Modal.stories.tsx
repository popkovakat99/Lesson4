import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

/**
 * Диалог поверх контента. Figma: Component `Modal` (`43:241`).
 * Действия — настоящие инстансы `Button` (secondary + primary), не inline-копии.
 */
const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    title: 'Перезагрузить сервер?',
    children: 'Soft reboot — корректное завершение процессов. Сервер будет недоступен ~30 секунд.',
    actions: (
      <>
        <Button type="secondary">Отмена</Button>
        <Button type="primary">Перезагрузить</Button>
      </>
    ),
  },
  argTypes: {
    title: { control: 'text', description: 'Заголовок (DS/Heading/xl)' },
    children: { control: 'text', description: 'Описание (DS/Body/sm, text-muted)' },
    actions: { control: false, description: 'Ряд кнопок' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/** Подтверждение перезагрузки. */
export const Default: Story = {}

/** Опасное действие — удаление сервера. */
export const Destructive: Story = {
  args: {
    title: 'Удалить сервер vpn-ams-01?',
    children: 'Сервер и все его данные будут безвозвратно утеряны. Средства за неиспользованный период ($6.80) вернутся на баланс.',
    actions: (
      <>
        <Button type="secondary">Отмена</Button>
        <Button type="primary">Удалить</Button>
      </>
    ),
  },
}

/** Только сообщение, без действий. */
export const WithoutActions: Story = {
  args: { title: 'Сервер перезагружается', children: 'Это займёт около 30 секунд.', actions: undefined },
}

/** Длинный контент: длинный заголовок и большое описание — модалка растёт по высоте, ширина та же. */
export const LongContent: Story = {
  args: {
    title: 'Переустановить операционную систему на сервере vpn-ams-01-production-backup?',
    children:
      'Все данные на сервере будут удалены без возможности восстановления: файлы, базы данных, настройки и установленные пакеты. ' +
      'Снапшоты, созданные ранее, сохранятся и будут доступны в разделе «Управление». ' +
      'Переустановка занимает до 3 минут, в это время сервер недоступен. IP-адрес и SSH-ключи останутся прежними.',
  },
}

/** Анимация появления: кнопка открывает модалку поверх затемнения, «Отмена» закрывает. */
export const Appearance: Story = {
  parameters: { layout: 'fullscreen' },
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ minHeight: 420, padding: 'var(--space-8)' }}>
        <Button type="primary" onClick={() => setOpen(true)}>Перезагрузить сервер</Button>
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'color-mix(in srgb, var(--text-strong) 40%, transparent)',
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Modal
                {...args}
                actions={
                  <>
                    <Button type="secondary" onClick={() => setOpen(false)}>Отмена</Button>
                    <Button type="primary" onClick={() => setOpen(false)}>Перезагрузить</Button>
                  </>
                }
              />
            </div>
          </div>
        )}
      </div>
    )
  },
}

/** Все варианты рядом. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
      <Modal {...args} />
      <Modal {...args} {...Destructive.args} />
      <Modal {...args} {...WithoutActions.args} />
    </div>
  ),
}
