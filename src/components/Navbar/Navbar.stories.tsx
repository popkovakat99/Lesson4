import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar } from './Navbar'

/**
 * Горизонтальная панель навигации: логотип + пункты. Figma: Component `Navbar` (`43:247`).
 * Активный пункт — DS/Body/sm Medium + `text-default`, остальные — DS/Body/sm + `text-muted`.
 */
const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: {
    logo: 'CryptoVPS',
    items: [{ label: 'Серверы', active: true }, { label: 'Биллинг' }, { label: 'Статус' }],
  },
  argTypes: {
    logo: { control: 'text', description: 'Логотип (DS/Heading/lg)' },
    items: { control: 'object', description: 'Пункты { label, href?, active? }' },
  },
  decorators: [(Story) => <div style={{ width: 440 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

/** Раздел «Серверы» активен. */
export const Default: Story = {}

/** Раздел «Биллинг» активен. */
export const BillingActive: Story = {
  args: { items: [{ label: 'Серверы' }, { label: 'Биллинг', active: true }, { label: 'Статус' }] },
}

/** Все варианты активного пункта. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: 440 }}>
      {['Серверы', 'Биллинг', 'Статус'].map((active) => (
        <Navbar
          key={active}
          items={['Серверы', 'Биллинг', 'Статус'].map((label) => ({ label, active: label === active }))}
        />
      ))}
    </div>
  ),
}
