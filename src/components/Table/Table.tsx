import type { ReactNode } from 'react'
import { cx } from '../cx'
import styles from './Table.module.css'

export type TableDensity = 'compact' | 'default'

export interface TableColumn<Row> {
  key: string
  header: string
  render: (row: Row) => ReactNode
  width?: number | string
}

export interface TableProps<Row> {
  /** Figma: Density — высота строки 36 (compact) / 48 (default) */
  density?: TableDensity
  columns: Array<TableColumn<Row>>
  rows: Row[]
  rowKey: (row: Row, index: number) => string
  className?: string
}

export function Table<Row>({ density = 'default', columns, rows, rowKey, className }: TableProps<Row>) {
  return (
    <div className={cx(styles.root, className)}>
      <table className={cx(styles.table, styles[density])}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="ds-label-xs" style={{ width: c.width }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)}>
              {columns.map((c) => (
                <td key={c.key} className="ds-body-sm">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
