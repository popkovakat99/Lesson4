import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Tab, Tabs } from './Tabs'
import type { TabsProps } from './Tabs'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Переключение разделов на одном экране. Figma: ComponentSet `Tabs` (`59:299`), `State` (3) — одна вкладка.
 * `Tabs` — полоса из нескольких `Tab`; подчёркивание `border-action` плавно переезжает на выбранную.
 */
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { Tab },
  tags: ['autodocs'],
  args: { items: ['Обзор', 'Сеть', 'Управление'], value: 'Обзор', onChange: fn() },
  argTypes: {
    items: { control: 'object', description: 'Названия вкладок' },
    value: { control: 'inline-radio', options: ['Обзор', 'Сеть', 'Управление'], description: 'Активная вкладка' },
    onChange: { action: 'change' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/** Живые вкладки — кликайте, активная переключается. */
export const Default: Story = {
  render: function Render(args: TabsProps) {
    const [value, setValue] = useState(args.value)
    return <Tabs {...args} value={value} onChange={(v) => { setValue(v); args.onChange?.(v) }} />
  },
}

/** Активна вкладка «Управление». */
export const ManagementActive: Story = { args: { value: 'Управление' } }

/** Матрица State одной вкладки + полоса. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow title="Tab · State">
        {(['default', 'active', 'hover'] as const).map((s) => (
          <VariantCell key={s} label={`State=${s}`}>
            <Tab state={s}>Обзор</Tab>
          </VariantCell>
        ))}
      </VariantRow>
      <VariantRow title="Tabs · полоса">
        <Tabs items={['Обзор', 'Сеть', 'Управление']} value="Сеть" />
      </VariantRow>
    </VariantGrid>
  ),
}
