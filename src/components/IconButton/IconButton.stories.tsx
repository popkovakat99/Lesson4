import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy, RotateCw, Settings, Terminal } from 'lucide-react'
import { fn } from 'storybook/test'
import { IconButton } from './IconButton'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Квадратная кнопка 36×36 под иконку. Figma: ComponentSet `IconButton` (`43:254`), `Type` × `State` (2 × 3).
 * Без `icon` показывает плейсхолдер 14×14, как в Figma.
 */
const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    type: 'secondary',
    state: 'default',
    'aria-label': 'Скопировать IP',
    icon: <Copy size={16} />,
    onClick: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['primary', 'secondary'], description: 'Figma: Type' },
    state: { control: 'inline-radio', options: ['default', 'hover', 'disabled'], description: 'Figma: State' },
    'aria-label': { control: 'text', description: 'Подпись для скринридеров (обязательна)' },
    icon: { control: false, description: 'Иконка (Lucide)' },
    disabled: { control: 'boolean' },
    onClick: { action: 'click' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/** Акцентная иконка-кнопка. */
export const Primary: Story = { args: { type: 'primary', icon: <RotateCw size={16} />, 'aria-label': 'Перезагрузить' } }

/** Нейтральная иконка-кнопка с обводкой. */
export const Secondary: Story = { args: { type: 'secondary' } }

/** Наведение. */
export const Hover: Story = { args: { state: 'hover' } }

/** Недоступно. */
export const Disabled: Story = { args: { state: 'disabled' } }

/** Без иконки — плейсхолдер из Figma. */
export const Placeholder: Story = { args: { icon: undefined } }

const ICONS = { primary: <Terminal size={16} />, secondary: <Settings size={16} /> }

/** Матрица Type × State — все 6 вариантов. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      {(['primary', 'secondary'] as const).map((t) => (
        <VariantRow key={t} title={`Type=${t}`}>
          {(['default', 'hover', 'disabled'] as const).map((s) => (
            <VariantCell key={s} label={`State=${s}`}>
              <IconButton type={t} state={s} icon={ICONS[t]} aria-label="Действие" />
            </VariantCell>
          ))}
        </VariantRow>
      ))}
    </VariantGrid>
  ),
}
