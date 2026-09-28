import { DEMAND_PRIORITIES, DEMAND_STATUSES, type DemandInput } from '../types/demand.js'
import type { ValidationDetail } from '../types/apiError.js'
import { ApiException } from './apiException.js'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseDemandInput(value: unknown): DemandInput {
  if (!isRecord(value)) {
    throw new ApiException(400, 'VALIDATION_ERROR', 'O corpo da requisição deve ser um objeto.')
  }

  const details: ValidationDetail[] = []
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  const description = typeof value.description === 'string' ? value.description.trim() : ''

  if (!title) details.push({ field: 'title', message: 'O título é obrigatório.' })
  if (!description) {
    details.push({ field: 'description', message: 'A descrição é obrigatória.' })
  }
  if (title.length > 120) {
    details.push({ field: 'title', message: 'O título deve ter no máximo 120 caracteres.' })
  }
  if (typeof value.priority !== 'string' || !DEMAND_PRIORITIES.includes(value.priority as DemandInput['priority'])) {
    details.push({ field: 'priority', message: 'Informe uma prioridade válida.' })
  }
  if (typeof value.status !== 'string' || !DEMAND_STATUSES.includes(value.status as DemandInput['status'])) {
    details.push({ field: 'status', message: 'Informe um status válido.' })
  }

  if (details.length > 0) {
    throw new ApiException(400, 'VALIDATION_ERROR', 'Verifique os campos informados.', details)
  }

  return {
    title,
    description,
    priority: value.priority as DemandInput['priority'],
    status: value.status as DemandInput['status'],
  }
}
