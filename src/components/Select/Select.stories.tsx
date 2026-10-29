import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { fn } from 'storybook/test'
import { Select } from './Select'
import type { SelectProps } from './Select'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

const SSH_KEYS = [
  { value: 'laptop', label: 'anton-laptop (Ed25519)' },
  { value: 'work', label: 'work-pc (RSA 4096)' },
  { value: 'ci', label: 'ci-runner (Ed25519)' },
]

/**
 * Выбор одного значения из списка. Figma: ComponentSet `Select` (`61:244`), `State` (5).
 * В состоянии `default` открывается кликом — панель и выбор работают живьём.
 */
const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options: SSH_KEYS, value: 'laptop', state: 'default', placeholder: 'Выберите SSH-ключ', onChange: fn() },
  argTypes: {
    options: { control: 'object', description: 'Список вариантов { value, label }' },
    value: { control: 'select', options: SSH_KEYS.map((k) => k.value) },
    state: {
      control: 'inline-radio',
      options: ['default', 'open', 'error', 'hover', 'disabled'],
      description: 'Figma: State',
    },
    placeholder: { control: 'text' },
    errorMessage: { control: 'text', description: 'Текст под полем при State=error' },
    onChange: { action: 'change' },
  },
  decorators: [(Story) => <div style={{ minHeight: 200 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Живой Select: клик открывает список, выбор меняет значение. */
export const Default: Story = {
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState(args.value)
    return <Select {...args} value={value} onChange={(v) => { setValue(v); args.onChange?.(v) }} />
  },
}

/** Список раскрыт. */
export const Open: Story = { args: { state: 'open' } }

/** Ошибка: ключ не выбран. */
export const Error: Story = { args: { state: 'error', value: undefined, errorMessage: 'Выберите SSH-ключ' } }

/** Наведение. */
export const Hover: Story = { args: { state: 'hover' } }

/** Недоступно. */
export const Disabled: Story = { args: { state: 'disabled', value: undefined, placeholder: 'недоступно' } }

const REGIONS = [
  'Амстердам', 'Франкфурт', 'Хельсинки', 'Лондон', 'Париж', 'Стокгольм', 'Варшава', 'Цюрих',
  'Нью-Йорк', 'Майами', 'Даллас', 'Лос-Анджелес', 'Торонто', 'Сингапур', 'Токио',
].map((r) => ({ value: r, label: r }))

/** Длинные названия: в поле обрезаются многоточием, в списке переносятся. */
export const LongLabels: Story = {
  args: {
    options: [
      { value: 'laptop', label: 'anton-laptop-macbook-pro-16-2023 (Ed25519, добавлен 12 апреля)' },
      { value: 'work', label: 'work-pc-office-moscow-2nd-floor (RSA 4096)' },
      { value: 'ci', label: 'ci-runner (Ed25519)' },
    ],
  },
  render: Default.render,
}

/** Много вариантов: 15 регионов — список прокручивается внутри панели. */
export const ManyOptions: Story = {
  args: { options: REGIONS, value: 'Амстердам', placeholder: 'Выберите регион' },
  decorators: [(Story) => <div style={{ minHeight: 320 }}><Story /></div>],
  render: Default.render,
}

/** Крайний случай: SSH-ключей ещё нет — пустой список. */
export const NoOptions: Story = { args: { options: [], value: undefined, placeholder: 'Нет SSH-ключей', state: 'open' } }

/** Анимация появления панели: нажимайте «Открыть / закрыть». */
export const Appearance: Story = {
  render: function Render(args: SelectProps) {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <Button type="secondary" onClick={() => setOpen((v) => !v)}>
          {open ? 'Закрыть' : 'Открыть'}
        </Button>
        <Select {...args} state={open ? 'open' : 'default'} />
      </div>
    )
  },
}

/** Матрица State — все 5 состояний. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow minHeight={200}>
        <VariantCell label="State=default">
          <Select options={SSH_KEYS} value="laptop" />
        </VariantCell>
        <VariantCell label="State=open">
          <Select options={SSH_KEYS} value="laptop" state="open" />
        </VariantCell>
        <VariantCell label="State=error">
          <Select options={SSH_KEYS} placeholder="Ошибка валидации" state="error" errorMessage="Выберите SSH-ключ" />
        </VariantCell>
        <VariantCell label="State=hover">
          <Select options={SSH_KEYS} value="laptop" state="hover" />
        </VariantCell>
        <VariantCell label="State=disabled">
          <Select options={SSH_KEYS} placeholder="недоступно" state="disabled" />
        </VariantCell>
      </VariantRow>
    </VariantGrid>
  ),
}
