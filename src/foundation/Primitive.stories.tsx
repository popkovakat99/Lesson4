import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { primitiveGroups } from './parseTokens'
import type { Token, TokenGroup } from './parseTokens'
import styles from './Foundation.module.css'

/**
 * Слой 1 — Primitive (глобальные переменные). Значения читаются прямо из `src/tokens/primitives.css`
 * — зеркала коллекции `Primitive` в Figma. В компонентах и на экранах напрямую не используются.
 */
const meta = {
  title: 'Foundation/Primitive',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const isColor = (t: Token) => /^(#|rgb)/.test(t.value)

/** Превью значения под тип токена */
function Preview({ token }: { token: Token }): ReactNode {
  const v = `var(--${token.name})`
  if (token.name.startsWith('space-')) return <div className={styles.bar} style={{ width: v }} />
  if (token.name.startsWith('radius-')) return <div className={styles.radiusBox} style={{ borderRadius: v }} />
  if (token.name.startsWith('shadow-')) return <div className={styles.shadowBox} style={{ boxShadow: v }} />
  if (token.name.startsWith('size-')) return <span style={{ fontSize: v, fontWeight: 'var(--weight-medium)' }}>Аа Aa</span>
  if (token.name.startsWith('weight-')) return <span className="ds-body-base" style={{ fontWeight: v }}>Баланс 142.50 USDT</span>
  if (token.name.startsWith('tracking-'))
    return <span className="ds-label-xs" style={{ letterSpacing: v }}>БАЛАНС · СОЗДАН</span>
  if (token.name.startsWith('line-height-'))
    return (
      <span className="ds-body-sm" style={{ lineHeight: v, display: 'block', maxWidth: 260 }}>
        Пополните баланс — серверы продолжат работу без остановки.
      </span>
    )
  if (token.name.startsWith('font-')) return <span className="ds-heading-lg" style={{ fontFamily: v }}>Inter — Аа Бб Вв</span>
  return null
}

function ColorGroup({ group }: { group: TokenGroup }) {
  return (
    <section>
      <h3 className={`${styles.groupTitle} ds-heading-lg`}>{group.title}</h3>
      <div className={styles.swatches}>
        {group.tokens.map((t) => (
          <div key={t.name} className={styles.swatch}>
            <div className={styles.swatchColor} style={{ background: `var(--${t.name})` }} />
            <code className={`${styles.tokenName} ds-body-sm-medium`}>--{t.name}</code>
            <code className={`${styles.tokenMeta} ds-body-xs ${styles.mono}`}>{t.value}</code>
          </div>
        ))}
      </div>
    </section>
  )
}

function ValueGroup({ group }: { group: TokenGroup }) {
  return (
    <section>
      <h3 className={`${styles.groupTitle} ds-heading-lg`}>{group.title}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="ds-label-xs">ТОКЕН</th>
              <th className="ds-label-xs">ЗНАЧЕНИЕ</th>
              <th className="ds-label-xs">ПРЕВЬЮ</th>
            </tr>
          </thead>
          <tbody>
            {group.tokens.map((t) => (
              <tr key={t.name}>
                <td className="ds-body-sm-medium">
                  <code>--{t.name}</code>
                </td>
                <td className={`ds-body-sm ${styles.mono} ${styles.tokenMeta}`}>{t.value}</td>
                <td>
                  <Preview token={t} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Groups({ filter }: { filter: (g: TokenGroup) => boolean }) {
  return (
    <div className={styles.page}>
      {primitiveGroups.filter(filter).map((g) =>
        g.tokens.every(isColor) ? <ColorGroup key={g.title} group={g} /> : <ValueGroup key={g.title} group={g} />,
      )}
    </div>
  )
}

/** Все примитивы на одной странице: палитра, типографика, радиусы, отступы, тени. */
export const All: Story = { render: () => <Groups filter={() => true} /> }

/** Палитра: акцент, нейтралы, функциональные и альфа-варианты. */
export const Colors: Story = { render: () => <Groups filter={(g) => g.tokens.every(isColor)} /> }

/** Шрифт, размеры, веса, межстрочный и межбуквенный интервалы. */
export const Typography: Story = { render: () => <Groups filter={(g) => g.title === 'Типографика'} /> }

/** Радиусы, отступы и тени. */
export const RadiiSpacingShadows: Story = {
  name: 'Radii · Spacing · Shadows',
  render: () => <Groups filter={(g) => ['Радиусы', 'Тени'].includes(g.title) || g.title.startsWith('Отступы')} />,
}
