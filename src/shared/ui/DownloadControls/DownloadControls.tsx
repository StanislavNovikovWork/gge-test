import type { DataLoaderResult } from '../../hooks/useDataLoader'
import { DownloadProgressBar } from './DownloadProgressBar'

type DownloadControlsProps = Pick<
  DataLoaderResult<unknown>,
  'status' | 'progress' | 'error' | 'start' | 'cancel' | 'reset'
>

export const DownloadControls = ({ status, progress, error, start, cancel, reset }: DownloadControlsProps) => {
  const isLoading = status === 'loading'
  const isIdle = status === 'idle'

  return (
    <div>
      <button onClick={start} disabled={isLoading}>Загрузить</button>{' '}
      <button onClick={cancel} disabled={!isLoading}>Отменить</button>{' '}
      <button onClick={reset} disabled={isLoading || isIdle}>Очистить</button>
      {isLoading && <DownloadProgressBar progress={progress} />}
      {status === 'cancelled' && <p>Загрузка отменена</p>}
      {status === 'error' && <p>Ошибка: {error}</p>}
    </div>
  )
}
