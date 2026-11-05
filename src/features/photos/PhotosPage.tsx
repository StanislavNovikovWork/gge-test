import { DataTable } from '../data-table'
import { DownloadControls } from '../../shared/ui/DownloadControls/DownloadControls'
import styles from './PhotosPage.module.css'
import type { Photo } from './model/types'
import { photosColumns } from './model/photosColumns'
import { usePhotos } from './hooks/usePhotos'

const NO_PHOTOS: Photo[] = []
const EMPTY_MESSAGE = 'Нет данных. Нажмите кнопку «Загрузить»'

export const PhotosPage = () => {
  const { data: photos, ...loader } = usePhotos()

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Фотографии</h1>
      <DownloadControls {...loader} />
      <DataTable
        rows={photos ?? NO_PHOTOS}
        columns={photosColumns}
        emptyMessage={EMPTY_MESSAGE}
        totalCount={loader.progress.total ?? undefined}
      />
    </main>
  )
}
