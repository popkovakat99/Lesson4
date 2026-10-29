import type { Meta, StoryObj } from '@storybook/react-vite'
import { figmaTextStyleName, textStyles } from './parseTokens'
import styles from './Foundation.module.css'

/**
 * TextStyles — служебные классы из `src/tokens/typography.css` (зеркало `DS/Heading/*`, `DS/Body/*`, `DS/Label/*`).
 * Цвет в стиль не входит: как и в Figma, он задаётся отдельной семантикой.
 */
const meta = {
  title: 'Foundation/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SAMPLES: Record<string, string> = {
  'ds-heading-4xl': 'VPS с оплатой USDT',
  'ds-heading-3xl': 'Создание сервера',
  'ds-heading-2xl': 'Мои серверы',
  'ds-heading-xl': 'Перезагрузить сервер?',
  'ds-heading-lg': 'vpn-ams-01',
  'ds-body-base': 'Заведите аккаунт по email и пополните баланс через TON или TRC-20.',
  'ds-body-sm': 'Ubuntu 22.04 LTS · Амстердам · 2 CPU / 4 GB',
  'ds-body-sm-medium': 'Создать сервер',
  'ds-body-xs': 'Деплой занимает до 60 секунд',
  'ds-label-xs': 'БАЛАНС · ПРОГНОЗ ОКОНЧАНИЯ',
}

/** Каждый TextStyle строкой-примером с параметрами из токенов. */
export const AllStyles: Story = {
  render: () => (
    <div className={styles.page}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="ds-label-xs">СТИЛЬ (FIGMA)</th>
              <th className="ds-label-xs">ПРИМЕР</th>
              <th className="ds-label-xs">ПАРАМЕТРЫ</th>
            </tr>
          </thead>
          <tbody>
            {textStyles.map((s) => (
              <tr key={s.className}>
                <td>
                  <div className="ds-body-sm-medium">{figmaTextStyleName(s.className)}</div>
                  <code className={`${styles.tokenMeta} ds-body-xs`}>.{s.className}</code>
                </td>
                <td className={s.className}>{SAMPLES[s.className] ?? 'Пример текста'}</td>
                <td className={`${styles.tokenMeta} ds-body-xs ${styles.mono}`}>
                  {s.declarations
                    .filter((d) => d.property !== 'font-family')
                    .map((d) => (
                      <div key={d.property}>
                        {d.property}: {d.value}
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
}
