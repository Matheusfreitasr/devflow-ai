import type { ErrorRequestHandler } from 'express'

import { ApiException } from '../services/apiException.js'

import type { ErrorResponse } from '../types/apiError.js'

function bodyParserError(error: unknown): ApiException | undefined {
  if (typeof error !== 'object' || error === null || !('type' in error)) return undefined

  if (error.type === 'entity.parse.failed') {
    return new ApiException(400, 'INVALID_JSON', 'O corpo da requisição contém JSON inválido.')
  }

  if (error.type === 'entity.too.large') {
    return new ApiException(413, 'PAYLOAD_TOO_LARGE', 'O corpo da requisição excede o limite permitido.')
  }

  return undefined
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  console.error('DevFlow AI - erro da API:', error)

  if (response.headersSent) {
    next(error)
    return
  }

  const apiError = error instanceof ApiException ? error : bodyParserError(error)

  const statusCode = apiError?.statusCode ?? 500

  const body: ErrorResponse = {
    error: {
      code: apiError?.code ?? 'INTERNAL_SERVER_ERROR',
      message: apiError?.message ?? 'Ocorreu um erro interno.',
      ...(apiError?.details ? { details: apiError.details } : {}),
    },
  }

  response.status(statusCode).json(body)
}