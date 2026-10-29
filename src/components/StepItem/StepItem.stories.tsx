import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepItem } from './StepItem'

/**
 * Нумерованный шаг explainer'а: кружок с номером + заголовок + описание. Figma: Component `StepItem` (`111:213`).
 * Используется в блоке «Как это работает» на экране пополнения.
 */
const meta = {
  title: 'Components/StepItem',
  component: StepItem,
  tags: ['autodocs'],
  args: {
    number: 1,
    title: 'Выберите сеть и сумму',
    description: 'TON быстрее и дешевле, TRC-20 — проверенный стандарт.',
  },
  argTypes: {
    number: { control: 'number', description: 'Номер шага' },
    title: { control: 'text', description: 'Заголовок (DS/Body/sm Medium)' },
    description: { control: 'text', description: 'Описание (DS/Body/xs, text-muted)' },
  },
  decorators: [(Story) => <div style={{ width: 440 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StepItem>

export default meta
type Story = StoryObj<typeof meta>

/** Один шаг. */
export const Default: Story = {}

/** Шаг без описания. */
export const TitleOnly: Story = { args: { number: 4, title: 'Курс зафиксирован на 30 минут', description: undefined } }

/** Весь explainer из 4 шагов. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: 440 }}>
      <StepItem number={1} title="Выберите сеть и сумму" description="TON быстрее и дешевле, TRC-20 — проверенный стандарт." />
      <StepItem number={2} title="Отсканируйте QR или скопируйте адрес" description="Откройте крипто-кошелёк и отправьте точную сумму на полученный адрес." />
      <StepItem number={3} title="Дождитесь подтверждения" description="TON: 1–2 минуты · TRC-20: 3–5 минут. Мы пришлём email, как только деньги зачислятся." />
      <StepItem number={4} title="Курс зафиксирован на 30 минут" description="Если не успели — просто создайте новый запрос." />
    </div>
  ),
}
