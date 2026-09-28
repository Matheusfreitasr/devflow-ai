import type { ValidationDetail } from '../types/apiError.js'

export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: ValidationDetail[],
  ) {
    super(message)
    this.name = 'ApiException'
  }
}
