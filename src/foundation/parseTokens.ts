// Разбор src/tokens/*.css в данные для каталога. Значения не дублируются —
// источник один: файлы токенов (зеркало ds/foundation.md).
import primitivesCss from '../tokens/primitives.css?raw'
import semanticsCss from '../tokens/semantics.css?raw'
import typographyCss from '../tokens/typography.css?raw'

export interface Token {
  name: string
  value: string
  /** Для semantic — имя примитива, на который ссылается токен */
  alias?: string
}

export interface TokenGroup {
  title: string
  tokens: Token[]
}

export interface TextStyleToken {
  className: string
  declarations: Array<{ property: string; value: string }>
}

const GROUP_COMMENT = /^\s*\/\*\s*(.+?)\s*\*\/\s*$/
const DECLARATION = /^\s*--([\w-]+)\s*:\s*(.+?);/

/** Только основной блок `:root { … }` — медиа-переопределения (reduced motion) не токены. */
function mainRootBlock(css: string): string {
  const start = css.indexOf(':root')
  const end = css.indexOf('\n}', start)
  return start === -1 || end === -1 ? css : css.slice(start, end)
}

function parseGroups(css: string): TokenGroup[] {
  const groups: TokenGroup[] = []
  let current: TokenGroup | undefined
  for (const line of mainRootBlock(css).split(/\r?\n/)) {
    const comment = line.match(GROUP_COMMENT)
    if (comment) {
      current = { title: comment[1], tokens: [] }
      groups.push(current)
      continue
    }
    const decl = line.match(DECLARATION)
    if (decl) {
      if (!current) {
        current = { title: 'Прочее', tokens: [] }
        groups.push(current)
      }
      const alias = decl[2].match(/^var\(--([\w-]+)\)$/)
      current.tokens.push({ name: decl[1], value: decl[2], alias: alias?.[1] })
    }
  }
  return groups.filter((g) => g.tokens.length > 0)
}

export const primitiveGroups = parseGroups(primitivesCss)
export const semanticGroups = parseGroups(semanticsCss)

export const textStyles: TextStyleToken[] = [...typographyCss.matchAll(/\.(ds-[\w-]+)\s*\{([^}]*)\}/g)].map((m) => ({
  className: m[1],
  declarations: m[2]
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const [property, ...rest] = d.split(':')
      return { property: property.trim(), value: rest.join(':').trim() }
    }),
}))

/** Итоговое значение CSS-переменной в браузере (например, hex у semantic-цвета). */
export function resolveToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}

/** Имя TextStyle в Figma по CSS-классу: ds-body-sm-medium → DS/Body/sm Medium */
export function figmaTextStyleName(className: string): string {
  const [, group, size, ...rest] = className.split('-')
  const cap = group.charAt(0).toUpperCase() + group.slice(1)
  const suffix = rest.map((r) => ' ' + r.charAt(0).toUpperCase() + r.slice(1)).join('')
  return `DS/${cap}/${size}${suffix}`
}
