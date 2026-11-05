export type DataRow = Record<string, unknown>

export interface ColumnConfig<TRow extends DataRow> {
  key: keyof TRow & string
  header: string
  size?: number
}
