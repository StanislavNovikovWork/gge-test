import type { DownloadProgress } from '../../api/httpClient'

interface DownloadProgressBarProps {
  progress: DownloadProgress
}

export const DownloadProgressBar = ({ progress }: DownloadProgressBarProps) => {
  const { loaded, total } = progress
  const percent = total ? Math.min(100, Math.round((loaded / total) * 100)) : null

  return (
    <div>
      <progress max={100} value={percent ?? undefined} />
      {percent !== null && <span> {percent}%</span>}
    </div>
  )
}
