import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Короткая подсказка. Figma: ComponentSet `Tooltip` (`59:310`), `Placement` (2).
 * Тёмная инверсия: фон `text-strong`, текст `text-on-action`.
 */
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { placement: 'top', children: 'Скопировать IP' },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom'], description: 'Figma: Placement' },
    children: { control: 'text', description: 'Текст подсказки (DS/Body/xs)' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** Подсказка над элементом. */
export const Top: Story = {}

/** Подсказка под элементом. */
export const Bottom: Story = { args: { placement: 'bottom', children: 'Курс зафиксирован на 30 минут' } }

/** Оба варианта. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow>
        <VariantCell label="Placement=top"><Tooltip placement="top">Подсказка</Tooltip></VariantCell>
        <VariantCell label="Placement=bottom"><Tooltip placement="bottom">Подсказка</Tooltip></VariantCell>
      </VariantRow>
    </VariantGrid>
  ),
}
