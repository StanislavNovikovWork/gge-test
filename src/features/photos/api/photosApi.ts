import { getAllPages } from '../../../shared/api/getAllPages'
import type { DataRequestContext } from '../../../shared/api/httpClient'
import type { Photo } from '../model/types'

const PHOTOS_PAGE_SIZE = 250
const PHOTOS_PAGE_DELAY_MS = 400

export const getPhotos = (context: DataRequestContext<Photo[]>) =>
  getAllPages<Photo>(
    '/photos',
    { pageSize: PHOTOS_PAGE_SIZE, pageDelayMs: PHOTOS_PAGE_DELAY_MS },
    context,
  )
