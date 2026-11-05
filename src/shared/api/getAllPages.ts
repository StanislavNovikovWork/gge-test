import { sleep } from '../lib/sleep'
import { httpClient, type DataRequestContext } from './httpClient'

interface GetAllPagesOptions {
  pageSize: number
  pageDelayMs?: number
}

const TOTAL_COUNT_HEADER = 'x-total-count'

export const getAllPages = async <TItem>(
  path: string,
  { pageSize, pageDelayMs = 0 }: GetAllPagesOptions,
  { signal, onProgress, onPartialData }: DataRequestContext<TItem[]> = {},
): Promise<TItem[]> => {
  let items: TItem[] = []
  let total: number | null = null

  for (let page = 1; total === null || items.length < total; page++) {
    const { data, headers } = await httpClient.getResponse<TItem[]>(
      `${path}?_page=${page}&_limit=${pageSize}`,
      { signal },
    )
    items = items.concat(data)
    onPartialData?.(items)
    total ??= Number(headers.get(TOTAL_COUNT_HEADER)) || items.length
    onProgress?.({ loaded: items.length, total })

    if (data.length < pageSize) break
    if (pageDelayMs > 0) await sleep(pageDelayMs, signal)
  }

  return items
}
