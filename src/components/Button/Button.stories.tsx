import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { fn } from 'storybook/test'
import { Button } from './Button'
import type { ButtonState, ButtonType } from './Button'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Основная кнопка действия. Figma: ComponentSet `Button` (`43:217`), матрица `Type` × `State` (3 × 5).
 * Наведение и фокус работают нативно — проп `state` нужен, чтобы зафиксировать состояние для сверки.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { type: 'primary', state: 'default', children: 'Создать сервер', onClick: fn() },
  argTypes: {
    type: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'], description: 'Figma: Type' },
    state: {
      control: 'inline-radio',
      options: ['default', 'hover', 'disabled', 'loading', 'focus'],
      description: 'Figma: State',
    },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    children: { control: 'text', description: 'Подпись кнопки' },
    onClick: { action: 'click' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Главное действие экрана: «Создать сервер», «Пополнить». */
export const Primary: Story = { args: { type: 'primary' } }

/** Второстепенное действие: «Отмена», «Консоль». */
export const Secondary: Story = { args: { type: 'secondary', children: 'Консоль' } }

/** Третичное действие без фона. */
export const Ghost: Story = { args: { type: 'ghost', children: 'Подробнее' } }

/** Наведение, зафиксированное пропом. */
export const Hover: Story = { args: { state: 'hover' } }

/** Фокус с клавиатуры — кольцо `border-focus-ring`. */
export const Focus: Story = { args: { state: 'focus' } }

/** Недоступно — 40% прозрачности. */
export const Disabled: Story = { args: { state: 'disabled' } }

/** Идёт действие — вместо подписи индикатор. */
export const Loading: Story = { args: { state: 'loading' } }

/** С иконкой Lucide перед подписью. */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus size={16} aria-hidden /> Создать сервер
      </>
    ),
  },
}

const TYPES: ButtonType[] = ['primary', 'secondary', 'ghost']
const STATES: ButtonState[] = ['default', 'hover', 'disabled', 'loading', 'focus']
const LABELS: Record<ButtonType, string> = { primary: 'Пополнить', secondary: 'Отмена', ghost: 'Подробнее' }

/** Матрица Type × State — все 15 вариантов рядом. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      {TYPES.map((t) => (
        <VariantRow key={t} title={`Type=${t}`}>
          {STATES.map((s) => (
            <VariantCell key={s} label={`State=${s}`}>
              <Button type={t} state={s}>
                {LABELS[t]}
              </Button>
            </VariantCell>
          ))}
        </VariantRow>
      ))}
    </VariantGrid>
  ),
}
