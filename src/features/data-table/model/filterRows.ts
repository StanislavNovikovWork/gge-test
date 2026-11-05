import { formatCellValue } from './formatCellValue'
import type { ColumnConfig, DataRow } from './types'

export const filterRows = <TRow extends DataRow>(
  rows: TRow[],
  columns: ColumnConfig<TRow>[],
  query: string,
): TRow[] => {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return rows

  return rows.filter((row) =>
    columns.some((column) => formatCellValue(row[column.key]).toLowerCase().includes(normalizedQuery)),
  )
}
