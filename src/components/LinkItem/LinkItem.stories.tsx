import type { Meta, StoryObj } from '@storybook/react-vite'
import { LinkItem } from './LinkItem'

/**
 * Текстовая ссылка с chevron-right. Figma: Component `LinkItem` (`111:219`).
 * Для FAQ-листов и переходов из заголовков секций; при наведении — подчёркивание.
 */
const meta = {
  title: 'Components/LinkItem',
  component: LinkItem,
  tags: ['autodocs'],
  args: { children: 'Почему только USDT?', href: '#' },
  argTypes: {
    children: { control: 'text', description: 'Текст ссылки (DS/Body/sm Medium, text-action)' },
    href: { control: 'text' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LinkItem>

export default meta
type Story = StoryObj<typeof meta>

/** Ссылка из FAQ. */
export const Default: Story = {}

/** FAQ-список из нескольких ссылок. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <LinkItem>Почему только USDT?</LinkItem>
      <LinkItem>Как работает fund-first биллинг?</LinkItem>
      <LinkItem>Куда уходят деньги, если удалить сервер?</LinkItem>
    </div>
  ),
}
