import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, Button, Input, Modal, Toast } from '../components'

/**
 * Песочница «Модальное окно»: Modal + Input + Badge + пара Button.
 * Подтверждение удаления: кнопка «Удалить» активна, только когда введено точное имя сервера.
 */
const meta = {
  title: 'Sandboxes/Модальное окно',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SERVER = 'vpn-ams-01'

/** Введите имя сервера — кнопка «Удалить» станет доступной; ошибка при неверном вводе. */
export const DeleteConfirm: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [done, setDone] = useState(false)
    const matches = value === SERVER
    const showError = value.length > 0 && !SERVER.startsWith(value)

    if (done) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <Toast variant="success" title={`Сервер ${SERVER} удалён`} description="$6.80 вернулись на баланс" onClose={() => { setDone(false); setValue('') }} />
          <Button type="secondary" onClick={() => { setDone(false); setValue('') }}>Начать заново</Button>
        </div>
      )
    }

    return (
      <Modal
        style={{ width: 420 }}
        title={`Удалить сервер ${SERVER}?`}
        actions={
          <>
            <Button type="secondary" onClick={() => setValue('')}>Отмена</Button>
            <Button
              type="primary"
              state={deleting ? 'loading' : matches ? 'default' : 'disabled'}
              onClick={() => {
                setDeleting(true)
                setTimeout(() => { setDeleting(false); setDone(true) }, 1200)
              }}
            >
              Удалить
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className="ds-body-sm-medium" style={{ color: 'var(--text-default)' }}>{SERVER}</span>
            <Badge variant="success">Работает</Badge>
          </div>
          <span>Сервер и все его данные будут безвозвратно утеряны. Средства за неиспользованный период ($6.80) вернутся на баланс.</span>
          <Input
            label="Введите имя сервера для подтверждения"
            placeholder={SERVER}
            value={value}
            state={showError ? 'error' : 'default'}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </Modal>
    )
  },
}
