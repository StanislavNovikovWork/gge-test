import { useMemo, useState } from 'react'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue'
import { HighlightedText } from '../../shared/ui/HighlightedText/HighlightedText'
import { SearchInput } from '../../shared/ui/SearchInput'
import { VirtualTable } from '../../shared/ui/VirtualTable/VirtualTable'
import styles from './DataTable.module.css'
import { filterRows } from './model/filterRows'
import { formatCellValue } from './model/formatCellValue'
import type { ColumnConfig, DataRow } from './model/types'

interface DataTableProps<TRow extends DataRow> {
  rows: TRow[]
  columns: ColumnConfig<TRow>[]
  emptyMessage: string
  totalCount?: number
}

const SEARCH_DEBOUNCE_MS = 300
const NOTHING_FOUND_MESSAGE = 'Ничего не найдено'

export const DataTable = <TRow extends DataRow>({ rows, columns, emptyMessage, totalCount = rows.length }: DataTableProps<TRow>) => {
  const [searchInput, setSearchInput] = useState('')
  const searchQuery = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS)

  const filteredRows = useMemo(
    () => filterRows(rows, columns, searchQuery),
    [rows, columns, searchQuery],
  )

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<TRow>()
    const query = searchQuery.trim()

    return columns.map(({ key, header, size = 1 }) =>
      columnHelper.accessor((row) => formatCellValue(row[key]), {
        id: key,
        header,
        size,
        cell: (info) => <HighlightedText text={info.getValue()} query={query} />,
      }) as ColumnDef<TRow, string>,
    )
  }, [columns, searchQuery])

  return (
    <div className={styles.root}>
      <SearchInput value={searchInput} onChange={setSearchInput} />
      <p className={styles.rowsCount}>Строк: {filteredRows.length} / {totalCount}</p>
      <VirtualTable
        data={filteredRows}
        columns={tableColumns}
        emptyMessage={rows.length === 0 ? emptyMessage : NOTHING_FOUND_MESSAGE}
      />
    </div>
  )
}
