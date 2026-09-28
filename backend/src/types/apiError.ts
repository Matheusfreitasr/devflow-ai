export interface ValidationDetail {
  field: string
  message: string
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_DEMAND_ID'
  | 'DEMAND_NOT_FOUND'
  | 'INVALID_JSON'
  | 'PAYLOAD_TOO_LARGE'
  | 'CORS_ORIGIN_NOT_ALLOWED'
  | 'ROUTE_NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'AI_NOT_CONFIGURED'
  | 'AI_RATE_LIMITED'
  | 'AI_PROVIDER_ERROR'
  | 'AI_PROVIDER_TIMEOUT'
  | 'AI_INVALID_RESPONSE'

export interface ErrorResponse {
  error: {
    code: ApiErrorCode
    message: string
    details?: ValidationDetail[]
  }
}
