import type { DemandAnalysisResult } from '../types/demandAnalysis'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '')

type DemandAnalysisErrorCode =
  | 'DEMAND_NOT_FOUND'
  | 'AI_NOT_CONFIGURED'
  | 'AI_RATE_LIMITED'
  | 'AI_PROVIDER_TIMEOUT'
  | 'AI_PROVIDER_ERROR'
  | 'AI_AUTHENTICATION_FAILED'
  | 'AI_INVALID_RESPONSE'

interface ApiErrorPayload {
  error?: {
    code?: unknown
  }
}

const errorMessages: Record<DemandAnalysisErrorCode, string> = {
  DEMAND_NOT_FOUND: 'Esta demanda não foi encontrada. Atualize a lista e tente novamente.',
  AI_NOT_CONFIGURED: 'A análise com IA está temporariamente indisponível.',
  AI_RATE_LIMITED: 'O limite de análises foi atingido. Aguarde um pouco e tente novamente.',
  AI_PROVIDER_TIMEOUT: 'A análise demorou mais que o esperado. Tente novamente em instantes.',
  AI_PROVIDER_ERROR: 'O serviço de análise está temporariamente indisponível.',
  AI_AUTHENTICATION_FAILED: 'O serviço de análise está temporariamente indisponível.',
  AI_INVALID_RESPONSE: 'Não foi possível concluir a análise. Tente novamente.',
}

function isAnalysisErrorCode(value: unknown): value is DemandAnalysisErrorCode {
  return typeof value === 'string' && value in errorMessages
}

function getFriendlyError(payload: unknown): string {
  if (typeof payload !== 'object' || payload === null || !('error' in payload)) {
    return 'Não foi possível concluir a análise. Tente novamente.'
  }

  const error = (payload as ApiErrorPayload).error
  return isAnalysisErrorCode(error?.code)
    ? errorMessages[error.code]
    : 'Não foi possível concluir a análise. Tente novamente.'
}

export const demandAnalysisApi = {
  async analyze(demandId: string): Promise<DemandAnalysisResult> {
    let response: Response
    try {
      response = await fetch(
        `${API_BASE_URL}/api/demands/${encodeURIComponent(demandId)}/analyze`,
        { method: 'POST' },
      )
    } catch {
      throw new Error('Não foi possível conectar ao serviço de análise. Verifique sua conexão e tente novamente.')
    }

    if (!response.ok) {
      const payload: unknown = await response.json().catch(() => undefined)
      throw new Error(getFriendlyError(payload))
    }

    try {
      return await response.json() as DemandAnalysisResult
    } catch {
      throw new Error('O resultado da análise veio em um formato inesperado. Tente novamente.')
    }
  },
}
