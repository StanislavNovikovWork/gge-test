import { useCallback, useEffect, useRef, useState } from 'react'
import type { DataRequestContext, DownloadProgress } from '../api/httpClient'

export type DataFetcher<TData> = (context: DataRequestContext<TData>) => Promise<TData>

export type LoaderStatus = 'idle' | 'loading' | 'success' | 'error' | 'cancelled'

export interface DataLoaderResult<TData> {
  status: LoaderStatus
  data: TData | null
  progress: DownloadProgress
  error: string | null
  start: () => Promise<void>
  cancel: () => void
  reset: () => void
}

interface LoaderState<TData> {
  status: LoaderStatus
  data: TData | null
  progress: DownloadProgress
  error: string | null
}

const createInitialState = <TData,>(): LoaderState<TData> => ({
  status: 'idle',
  data: null,
  progress: { loaded: 0, total: null },
  error: null,
})

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError'

export const useDataLoader = <TData,>(fetcher: DataFetcher<TData>): DataLoaderResult<TData> => {
  const [state, setState] = useState<LoaderState<TData>>(createInitialState)
  const abortControllerRef = useRef<AbortController | null>(null)

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    setState(createInitialState<TData>())
  }, [])

  const start = useCallback(async () => {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState({ ...createInitialState<TData>(), status: 'loading' })

    try {
      const data = await fetcher({
        signal: controller.signal,
        onProgress: (progress) => setState((prev) => ({ ...prev, progress })),
        onPartialData: (data) => setState((prev) => ({ ...prev, data })),
      })
      setState((prev) => ({ ...prev, status: 'success', data }))
    } catch (error) {
      if (isAbortError(error)) {
        setState((prev) => ({ ...prev, status: 'cancelled' }))
        return
      }
      const message = error instanceof Error ? error.message : 'Unknown error'
      setState((prev) => ({ ...prev, status: 'error', error: message }))
    }
  }, [fetcher])

  useEffect(() => () => abortControllerRef.current?.abort(), [])

  return { ...state, start, cancel, reset }
}
