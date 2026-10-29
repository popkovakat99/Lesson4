import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { resolveToken, semanticGroups } from './parseTokens'
import styles from './Foundation.module.css'

/**
 * Слой 2 — Semantic (смысловые переменные). Читаются из `src/tokens/semantics.css` — зеркала коллекции
 * `Semantic` в Figma. Каждый токен ссылается на примитив; компоненты и экраны используют только этот слой.
 */
const meta = {
  title: 'Foundation/Semantic',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function useResolved(): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    const out: Record<string, string> = {}
    semanticGroups.forEach((g) => g.tokens.forEach((t) => (out[t.name] = resolveToken(t.name))))
    setValues(out)
  }, [])
  return values
}

/** Все семантические токены: свотч, имя, ссылка на примитив и итоговое значение. */
export const All: Story = {
  render: function Render() {
    const resolved = useResolved()
    return (
      <div className={styles.page}>
        <p className={`${styles.intro} ds-body-sm`}>
          Формат: <code>--семантика</code> <span className={styles.arrow}>→</span> <code>--примитив</code> · итоговое значение
        </p>
        {semanticGroups.map((g) => (
          <section key={g.title}>
            <h3 className={`${styles.groupTitle} ds-heading-lg`}>{g.title}</h3>
            <div className={styles.swatches}>
              {g.tokens.map((t) => (
                <div key={t.name} className={styles.swatch}>
                  <div className={styles.swatchColor} style={{ background: `var(--${t.name})` }} />
                  <code className={`${styles.tokenName} ds-body-sm-medium`}>--{t.name}</code>
                  <code className={`${styles.tokenMeta} ds-body-xs ${styles.mono}`}>
                    → --{t.alias ?? t.value} · {resolved[t.name] ?? ''}
                  </code>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  },
}
