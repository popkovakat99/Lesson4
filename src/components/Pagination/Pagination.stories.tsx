import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { PageButton, Pagination } from './Pagination'
import type { PaginationProps } from './Pagination'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

/**
 * Постраничная навигация. Figma: ComponentSet `Pagination` (`63:217`), `State` (3) — одна кнопка страницы.
 * `Pagination` собирает строку «‹ 1 2 3 … 12 ›».
 */
const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  subcomponents: { PageButton },
  tags: ['autodocs'],
  args: { page: 2, total: 12, onChange: fn() },
  argTypes: {
    page: { control: { type: 'number', min: 1 }, description: 'Текущая страница' },
    total: { control: { type: 'number', min: 1 }, description: 'Всего страниц' },
    onChange: { action: 'change' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** Живая пагинация — переключайте страницы. */
export const Default: Story = {
  render: function Render(args: PaginationProps) {
    const [page, setPage] = useState(args.page)
    return <Pagination {...args} page={page} onChange={(p) => { setPage(p); args.onChange?.(p) }} />
  },
}

/** Первая страница — «‹» недоступна. */
export const FirstPage: Story = { args: { page: 1 } }

/** Мало страниц — без многоточия. */
export const FewPages: Story = { args: { page: 2, total: 4 } }

/** Матрица State одной кнопки + строка. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow title="PageButton · State">
        <VariantCell label="State=default">
          <PageButton>1</PageButton>
        </VariantCell>
        <VariantCell label="State=active">
          <PageButton state="active">2</PageButton>
        </VariantCell>
        <VariantCell label="State=hover">
          <PageButton state="hover">3</PageButton>
        </VariantCell>
      </VariantRow>
      <VariantRow title="Pagination · строка">
        <Pagination page={2} total={12} />
      </VariantRow>
    </VariantGrid>
  ),
}
