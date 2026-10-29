import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Card } from './Card'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Карточка-поверхность с заголовком и телом. Figma: ComponentSet `Card` (`75:210`), `Type` × `State` (2 × 2).
 * `interactive` плавно реагирует на наведение: фон `surface-subtle`, обводка `border-strong`.
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    type: 'static',
    state: 'default',
    title: 'vpn-ams-01',
    children: '185.23.45.67 · Ubuntu 22.04 · 2 CPU / 4 GB',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['static', 'interactive'], description: 'Figma: Type' },
    state: { control: 'inline-radio', options: ['default', 'hover'], description: 'Figma: State' },
    title: { control: 'text', description: 'Заголовок (DS/Heading/lg)' },
    children: { control: 'text', description: 'Тело (DS/Body/xs, text-muted)' },
    onClick: { action: 'click' },
  },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Статичная карточка — информационный блок. */
export const Static: Story = {}

/** Кликабельная карточка — наведите курсор. */
export const Interactive: Story = { args: { type: 'interactive', onClick: fn() } }

/** Кликабельная карточка в состоянии наведения. */
export const InteractiveHover: Story = { args: { type: 'interactive', state: 'hover' } }

/** Матрица Type × State — все 4 варианта. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  decorators: [(Story) => <Story />],
  render: () => (
    <VariantGrid>
      {(['static', 'interactive'] as const).map((t) => (
        <VariantRow key={t} title={`Type=${t}`}>
          {(['default', 'hover'] as const).map((s) => (
            <VariantCell key={s} label={`State=${s}`}>
              <div style={{ width: 280 }}>
                <Card type={t} state={s} title="vpn-ams-01">
                  185.23.45.67 · Ubuntu 22.04 · 2 CPU / 4 GB
                </Card>
              </div>
            </VariantCell>
          ))}
        </VariantRow>
      ))}
    </VariantGrid>
  ),
}
