import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Статус-чип с цветной точкой. Figma: ComponentSet `Badge` (`43:271`), `Variant` (4).
 * Точка — `bg-success` / `bg-warning` / `bg-error` / `text-muted`.
 */
const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { variant: 'success', children: 'Работает' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['success', 'warning', 'error', 'neutral'], description: 'Figma: Variant' },
    children: { control: 'text', description: 'Подпись (DS/Label/xs)' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** Сервер работает. */
export const Success: Story = {}

/** Баланса хватит на 7–14 дней. */
export const Warning: Story = { args: { variant: 'warning', children: 'Внимание' } }

/** Ошибка или баланс меньше 7 дней. */
export const Error: Story = { args: { variant: 'error', children: 'Ошибка' } }

/** Сервер остановлен. */
export const Neutral: Story = { args: { variant: 'neutral', children: 'Остановлен' } }

/** Все 4 варианта. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow>
        <VariantCell label="Variant=success"><Badge variant="success">Работает</Badge></VariantCell>
        <VariantCell label="Variant=warning"><Badge variant="warning">Внимание</Badge></VariantCell>
        <VariantCell label="Variant=error"><Badge variant="error">Ошибка</Badge></VariantCell>
        <VariantCell label="Variant=neutral"><Badge variant="neutral">Остановлен</Badge></VariantCell>
      </VariantRow>
    </VariantGrid>
  ),
}
