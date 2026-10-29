// Раскладка для stories AllVariants: матрица вариантов × состояний с подписями. Только для Storybook.
import type { CSSProperties, ReactNode } from 'react'

const gridStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-6)',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 'var(--space-6)',
}

const cellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--space-2)',
}

const labelStyle: CSSProperties = { color: 'var(--text-muted)' }

export function VariantGrid({ children }: { children: ReactNode }) {
  return <div style={gridStyle}>{children}</div>
}

export function VariantRow({ title, children, minHeight }: { title?: string; children: ReactNode; minHeight?: number }) {
  return (
    <div style={cellStyle}>
      {title && (
        <span className="ds-label-xs" style={labelStyle}>
          {title}
        </span>
      )}
      <div style={{ ...rowStyle, minHeight }}>{children}</div>
    </div>
  )
}

export function VariantCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={cellStyle}>
      {children}
      <span className="ds-body-xs" style={labelStyle}>
        {label}
      </span>
    </div>
  )
}
