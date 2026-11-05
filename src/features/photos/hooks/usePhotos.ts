import { useDataLoader } from '../../../shared/hooks/useDataLoader'
import { getPhotos } from '../api/photosApi'

export const usePhotos = () => useDataLoader(getPhotos)
