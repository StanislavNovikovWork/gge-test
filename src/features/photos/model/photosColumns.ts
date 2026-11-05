import type { ColumnConfig } from '../../data-table'
import type { Photo } from './types'

export const photosColumns: ColumnConfig<Photo>[] = [
  { key: 'id', header: 'ID', size: 1 },
  { key: 'albumId', header: 'Album', size: 1 },
  { key: 'title', header: 'Title', size: 5 },
  { key: 'url', header: 'URL', size: 3 },
]
