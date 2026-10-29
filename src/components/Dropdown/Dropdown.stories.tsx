import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './Dropdown'
import { VariantCell, VariantGrid, VariantRow } from '../storyHelpers'

const SERVER_ACTIONS = [
  { label: 'Перезагрузить' },
  { label: 'Консоль' },
  { label: 'Удалить', destructive: true },
]

/**
 * Контекстное меню: kebab-триггер «•••» + панель действий. Figma: ComponentSet `Dropdown` (`61:213`), `State` (3).
 * В состоянии `closed` открывается кликом.
 */
const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { items: SERVER_ACTIONS, state: 'closed', 'aria-label': 'Действия с сервером' },
  argTypes: {
    items: { control: 'object', description: 'Пункты меню { label, destructive? }' },
    state: { control: 'inline-radio', options: ['closed', 'open', 'hover'], description: 'Figma: State' },
    'aria-label': { control: 'text' },
  },
  decorators: [(Story) => <div style={{ minHeight: 180, minWidth: 220 }}><Story /></div>],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

/** Закрыто — кликните по «•••». */
export const Closed: Story = {}

/** Меню открыто: обычный пункт, пункт при наведении и опасное действие. */
export const Open: Story = { args: { state: 'open' } }

/** Наведение на триггер. */
export const Hover: Story = { args: { state: 'hover' } }

/** Длинные пункты меню переносятся на вторую строку внутри панели 200px. */
export const LongLabels: Story = {
  args: {
    state: 'open',
    items: [
      { label: 'Перезагрузить с принудительным завершением процессов' },
      { label: 'Открыть веб-консоль в новой вкладке' },
      { label: 'Удалить сервер и все снапшоты без возможности восстановления', destructive: true },
    ],
  },
}

/** Много пунктов — панель прокручивается. */
export const ManyItems: Story = {
  args: {
    state: 'open',
    items: [
      'Перезагрузить', 'Консоль', 'Снапшот', 'Сменить тариф', 'Переименовать', 'Сменить SSH-ключ',
      'Сетевые настройки', 'Журнал событий', 'Переустановить ОС',
    ]
      .map((label) => ({ label }))
      .concat({ label: 'Удалить', destructive: true } as { label: string; destructive: boolean }),
  },
  decorators: [(Story) => <div style={{ minHeight: 320 }}><Story /></div>],
}

/** Крайний случай: единственное действие — опасное. */
export const DestructiveOnly: Story = { args: { state: 'open', items: [{ label: 'Удалить', destructive: true }] } }

/** Анимация появления панели: кликайте по «•••» несколько раз. */
export const Appearance: Story = { args: { state: 'closed' } }

/** Матрица State — все 3 состояния. */
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <VariantGrid>
      <VariantRow minHeight={180}>
        {(['closed', 'open', 'hover'] as const).map((s) => (
          <VariantCell key={s} label={`State=${s}`}>
            <div style={{ width: 220 }}>
              <Dropdown items={SERVER_ACTIONS} state={s} />
            </div>
          </VariantCell>
        ))}
      </VariantRow>
    </VariantGrid>
  ),
}
