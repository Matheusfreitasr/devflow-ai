import type { Demand, NewDemandInput } from '../types/demand'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '')

interface ApiErrorPayload {
  error?: {
    message?: unknown
  }
}

function getApiErrorMessage(payload: unknown): string | undefined {
  if (typeof payload !== 'object' || payload === null || !('error' in payload)) {
    return undefined
  }

  const error = (payload as ApiErrorPayload).error
  return typeof error?.message === 'string' ? error.message : undefined
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body) headers.set('Content-Type', 'application/json')

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está iniciado.')
  }

  if (!response.ok) {
    const errorPayload: unknown = await response.json().catch(() => undefined)
    throw new Error(getApiErrorMessage(errorPayload) ?? 'A API não conseguiu concluir a solicitação.')
  }

  if (response.status === 204) return undefined as T
  const payload: unknown = await response.json()
  return payload as T
}

export const demandsApi = {
  list: () => request<Demand[]>('/api/demands'),
  get: (id: string) => request<Demand>(`/api/demands/${encodeURIComponent(id)}`),
  create: (input: NewDemandInput) => request<Demand>('/api/demands', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
  update: (id: string, input: NewDemandInput) => request<Demand>(
    `/api/demands/${encodeURIComponent(id)}`,
    { method: 'PUT', body: JSON.stringify(input) },
  ),
  remove: (id: string) => request<void>(`/api/demands/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
}
