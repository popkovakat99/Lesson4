import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Input } from './Input'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Текстовое поле с лейблом. Figma: ComponentSet `Input` (`43:228`), `State` (4).
 * Фокус срабатывает нативно при клике в поле — обводка плавно меняется на `border-focus-ring`.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Имя сервера', state: 'default', placeholder: 'ubuntu-ams-03', defaultValue: 'ubuntu-ams-03', onChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'Лейбл над полем (DS/Label/xs)' },
    state: { control: 'inline-radio', options: ['default', 'error', 'focus', 'disabled'], description: 'Figma: State' },
    placeholder: { control: 'text' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    onChange: { action: 'change' },
  },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** Обычное поле. */
export const Default: Story = {}

/** Ошибка валидации. */
export const Error: Story = { args: { label: 'Email — неверный формат', state: 'error', defaultValue: 'anton@', type: 'email' } }

/** Фокус, зафиксированный пропом. */
export const Focus: Story = { args: { state: 'focus' } }

/** Недоступно. */
export const Disabled: Story = { args: { label: 'Регион', state: 'disabled', defaultValue: 'Амстердам' } }

/** Матрица State — все 4 состояния. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [(Story) => <Story />],
  render: () => (
    <VariantGrid>
      <VariantRow>
        <VariantCell label="State=default">
          <div style={{ width: 260 }}><Input label="Email" defaultValue="anton@mail.ru" /></div>
        </VariantCell>
        <VariantCell label="State=error">
          <div style={{ width: 260 }}><Input label="Email — invalid" state="error" defaultValue="anton@" /></div>
        </VariantCell>
        <VariantCell label="State=focus">
          <div style={{ width: 260 }}><Input label="Email" state="focus" defaultValue="anton@mail.ru" /></div>
        </VariantCell>
        <VariantCell label="State=disabled">
          <div style={{ width: 260 }}><Input label="Email — недоступно" state="disabled" defaultValue="disabled@example.com" /></div>
        </VariantCell>
      </VariantRow>
    </VariantGrid>
  ),
}
