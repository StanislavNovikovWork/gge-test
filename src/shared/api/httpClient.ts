import { API_BASE_URL } from './config'

export interface DownloadProgress {
  loaded: number
  total: number | null
}

export interface RequestContext {
  signal?: AbortSignal
  onProgress?: (progress: DownloadProgress) => void
}

export interface DataRequestContext<TData> extends RequestContext {
  onPartialData?: (data: TData) => void
}

interface RequestOptions extends RequestContext {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: HeadersInit
  body?: unknown
}

const parseContentLength = (headers: Headers): number | null => {
  const value = Number(headers.get('content-length'))
  return Number.isFinite(value) && value > 0 ? value : null
}

const concatChunks = (chunks: Uint8Array[], totalLength: number): Uint8Array => {
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

const readBodyWithProgress = async (
  response: Response,
  onProgress?: RequestContext['onProgress'],
): Promise<Uint8Array> => {
  const total = parseContentLength(response.headers)
  const reader = response.body!.getReader()
  const chunks: Uint8Array[] = []
  let loaded = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    loaded += value.length
    onProgress?.({ loaded, total })
  }

  return concatChunks(chunks, loaded)
}

export interface HttpResponse<TData> {
  data: TData
  headers: Headers
}

const send = async <TResponse>(
  path: string,
  { method = 'GET', headers, body, signal, onProgress }: RequestOptions = {},
): Promise<HttpResponse<TResponse>> => {
  const hasBody = body !== undefined
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: hasBody ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: hasBody ? JSON.stringify(body) : undefined,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  const bytes = await readBodyWithProgress(response, onProgress)
  return { data: JSON.parse(new TextDecoder().decode(bytes)) as TResponse, headers: response.headers }
}

const request = async <TResponse>(path: string, options?: RequestOptions): Promise<TResponse> =>
  (await send<TResponse>(path, options)).data

export const httpClient = {
  getResponse: <TResponse>(path: string, context?: RequestContext) =>
    send<TResponse>(path, { ...context, method: 'GET' }),
  get: <TResponse>(path: string, context?: RequestContext) =>
    request<TResponse>(path, { ...context, method: 'GET' }),
  post: <TResponse>(path: string, body: unknown, context?: RequestContext) =>
    request<TResponse>(path, { ...context, method: 'POST', body }),
}
