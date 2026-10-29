import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, Card, Dropdown, Input, OptionCard, Select, Toast } from '../components'

/**
 * Песочница «Форма»: Input + Select + Dropdown + OptionCard + кнопки submit/cancel.
 * Нажмите «Создать сервер» с пустыми полями — появятся состояния ошибки.
 */
const meta = {
  title: 'Sandboxes/Форма',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SSH_KEYS = [
  { value: 'laptop', label: 'anton-laptop (Ed25519)' },
  { value: 'work', label: 'work-pc (RSA 4096)' },
]

const PLANS = [
  { id: 'starter', title: 'Starter', subtitle: '1 CPU · 2 GB · $5 / мес' },
  { id: 'standard', title: 'Standard', subtitle: '2 CPU · 4 GB · $10 / мес' },
  { id: 'performance', title: 'Performance', subtitle: '4 CPU · 8 GB · $20 / мес' },
]

/** Создание сервера: валидация имени и SSH-ключа, выбор тарифа, отправка. */
export const ServerCreate: Story = {
  render: function Render() {
    const [name, setName] = useState('')
    const [ssh, setSsh] = useState<string | undefined>()
    const [plan, setPlan] = useState('standard')
    const [submitted, setSubmitted] = useState(false)
    const [sending, setSending] = useState(false)
    const [created, setCreated] = useState(false)

    const nameError = submitted && !/^[a-z0-9-]{3,}$/.test(name)
    const sshError = submitted && !ssh

    const reset = () => {
      setName('')
      setSsh(undefined)
      setPlan('standard')
      setSubmitted(false)
      setCreated(false)
    }

    const submit = () => {
      setSubmitted(true)
      if (!/^[a-z0-9-]{3,}$/.test(name) || !ssh) return
      setSending(true)
      setTimeout(() => { setSending(false); setCreated(true) }, 1200)
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="ds-heading-2xl" style={{ margin: 0, color: 'var(--text-strong)' }}>Создание сервера</h2>
          <Dropdown items={[{ label: 'Заполнить пример', onSelect: () => { setName('ubuntu-ams-03'); setSsh('laptop') } }, { label: 'Очистить форму', destructive: true, onSelect: reset }]} />
        </div>

        <div style={{ width: 360 }}>
          <Input
            label={nameError ? 'Имя сервера — латиница, цифры и дефис, от 3 символов' : 'Имя сервера'}
            placeholder="ubuntu-ams-03"
            value={name}
            state={nameError ? 'error' : 'default'}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minHeight: 170 }}>
          <span className="ds-label-xs" style={{ color: 'var(--text-muted)' }}>SSH-КЛЮЧ</span>
          <Select
            options={SSH_KEYS}
            value={ssh}
            onChange={setSsh}
            placeholder="Выберите SSH-ключ"
            state={sshError ? 'error' : 'default'}
            errorMessage="Без SSH-ключа не получится зайти на сервер"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="ds-label-xs" style={{ color: 'var(--text-muted)' }}>ТАРИФ</span>
          <div role="radiogroup" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {PLANS.map((p) => (
              <OptionCard key={p.id} state={plan === p.id ? 'selected' : 'default'} title={p.title} subtitle={p.subtitle} onClick={() => setPlan(p.id)} />
            ))}
          </div>
        </div>

        <Card title="Итого">
          {PLANS.find((p) => p.id === plan)?.subtitle} · списание с баланса USDT
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button type="secondary" onClick={reset}>Отмена</Button>
          <Button type="primary" state={sending ? 'loading' : 'default'} onClick={submit}>Создать сервер</Button>
        </div>

        {created && (
          <Toast variant="success" title={`Сервер ${name} создаётся`} description="Деплой занимает до 60 секунд" onClose={reset} />
        )}
      </div>
    )
  },
}
