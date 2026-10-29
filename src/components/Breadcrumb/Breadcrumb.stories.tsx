import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Путь по иерархии страниц. Figma: ComponentSet `Breadcrumb` (`63:204`), `State` (2) — один пункт.
 * `Breadcrumb` собирает полный путь; последний пункт — текущая страница, разделитель `/` — `text-disabled`.
 */
const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem },
  tags: ['autodocs'],
  args: { items: [{ label: 'Серверы' }, { label: 'vpn-ams-01' }, { label: 'Управление' }] },
  argTypes: {
    items: { control: 'object', description: 'Пункты пути { label, href? }; последний — текущий' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/** Путь на странице сервера. */
export const Default: Story = {}

/** Короткий путь из двух пунктов. */
export const TwoLevels: Story = { args: { items: [{ label: 'Серверы' }, { label: 'Создать' }] } }

/** Матрица State одного пункта + полный путь. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow title="BreadcrumbItem · State">
        <VariantCell label="State=default">
          <BreadcrumbItem>Серверы</BreadcrumbItem>
        </VariantCell>
        <VariantCell label="State=current">
          <BreadcrumbItem state="current">Создать</BreadcrumbItem>
        </VariantCell>
      </VariantRow>
      <VariantRow title="Breadcrumb · путь">
        <Breadcrumb items={[{ label: 'Серверы' }, { label: 'vpn-ams-01' }, { label: 'Управление' }]} />
      </VariantRow>
    </VariantGrid>
  ),
}
