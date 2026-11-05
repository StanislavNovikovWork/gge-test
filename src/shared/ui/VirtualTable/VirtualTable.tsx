import { useRef } from 'react'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import styles from './VirtualTable.module.css'

interface VirtualTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  rowHeight?: number
  emptyMessage?: string
}

const OVERSCAN_ROWS = 10

export const VirtualTable = <TData,>({
  data,
  columns,
  rowHeight = 40,
  emptyMessage,
}: VirtualTableProps<TData>) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })
  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN_ROWS,
  })

  const gridTemplateColumns = table
    .getVisibleLeafColumns()
    .map((column) => `${column.getSize()}fr`)
    .join(' ')

  return (
    <div ref={scrollContainerRef} className={styles.container} role="table">
      <div className={styles.header} role="rowgroup">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className={styles.row} style={{ gridTemplateColumns }} role="row">
            {headerGroup.headers.map((header) => (
              <div key={header.id} className={styles.headerCell} role="columnheader">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
      {rows.length === 0 && emptyMessage && <div className={styles.empty}>{emptyMessage}</div>}
      <div
        className={styles.body}
        style={{ height: rowVirtualizer.getTotalSize() }}
        role="rowgroup"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          return (
            <div
              key={row.id}
              className={styles.row}
              style={{
                gridTemplateColumns,
                height: rowHeight,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              role="row"
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className={styles.cell} role="cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
