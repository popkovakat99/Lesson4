import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cpu, HardDrive, Server } from 'lucide-react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { OptionCard } from './OptionCard'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Карточка опции «выбери один из»: ОС, тариф. Figma: ComponentSet `OptionCard` (`111:212`), `State` (2).
 * Выбранная — фон `surface-subtle`, обводка 2px `border-action`, иконка `text-action`.
 */
const meta = {
  title: 'Components/OptionCard',
  component: OptionCard,
  tags: ['autodocs'],
  args: { state: 'default', title: 'Ubuntu', subtitle: '22.04 LTS', icon: <Server size={18} />, onClick: fn() },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'selected'], description: 'Figma: State' },
    title: { control: 'text', description: 'Название (DS/Body/sm Medium)' },
    subtitle: { control: 'text', description: 'Подпись (DS/Body/xs, text-muted)' },
    icon: { control: false, description: 'Иконка 18×18 (Lucide); без неё — плейсхолдер' },
    onClick: { action: 'click' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof OptionCard>

export default meta
type Story = StoryObj<typeof meta>

/** Не выбрана. */
export const Default: Story = {}

/** Выбрана. */
export const Selected: Story = { args: { state: 'selected' } }

/** Живой выбор ОС — кликайте по карточкам. */
export const Group: Story = {
  render: function Render() {
    const [os, setOs] = useState('ubuntu')
    const items = [
      { id: 'ubuntu', title: 'Ubuntu', subtitle: '22.04 LTS', icon: <Server size={18} /> },
      { id: 'debian', title: 'Debian', subtitle: '12', icon: <HardDrive size={18} /> },
      { id: 'alma', title: 'AlmaLinux', subtitle: '9', icon: <Cpu size={18} /> },
    ]
    return (
      <div role="radiogroup" style={{ display: 'flex', gap: 'var(--space-4)' }}>
        {items.map((i) => (
          <OptionCard
            key={i.id}
            state={os === i.id ? 'selected' : 'default'}
            title={i.title}
            subtitle={i.subtitle}
            icon={i.icon}
            onClick={() => setOs(i.id)}
          />
        ))}
      </div>
    )
  },
}

/** Матрица State — 2 варианта. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow>
        <VariantCell label="State=default">
          <OptionCard title="Ubuntu" subtitle="22.04 LTS" />
        </VariantCell>
        <VariantCell label="State=selected">
          <OptionCard state="selected" title="Ubuntu" subtitle="22.04 LTS" />
        </VariantCell>
      </VariantRow>
    </VariantGrid>
  ),
}
