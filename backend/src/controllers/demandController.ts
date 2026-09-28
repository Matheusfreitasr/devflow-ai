import type { RequestHandler } from 'express'
import { ApiException } from '../services/apiException.js'
import { parseDemandInput } from '../services/demandValidation.js'
import type { DemandService } from '../services/demandService.js'

function getDemandId(request: Parameters<RequestHandler>[0]): string {
  const id: unknown = request.params.id
  if (typeof id !== 'string' || !id.trim()) {
    throw new ApiException(400, 'INVALID_DEMAND_ID', 'O identificador da demanda é inválido.')
  }
  return id
}

export function createDemandController(demandService: DemandService) {
  const list: RequestHandler = (_request, response) => {
    response.json(demandService.list())
  }

  const getById: RequestHandler = (request, response) => {
    const demand = demandService.getById(getDemandId(request))
    if (!demand) throw new ApiException(404, 'DEMAND_NOT_FOUND', 'Demanda não encontrada.')
    response.json(demand)
  }

  const create: RequestHandler = (request, response) => {
    const body: unknown = request.body
    const demand = demandService.create(parseDemandInput(body))
    response.status(201).json(demand)
  }

  const update: RequestHandler = (request, response) => {
    const body: unknown = request.body
    const demand = demandService.update(getDemandId(request), parseDemandInput(body))
    if (!demand) throw new ApiException(404, 'DEMAND_NOT_FOUND', 'Demanda não encontrada.')
    response.json(demand)
  }

  const remove: RequestHandler = (request, response) => {
    const deleted = demandService.delete(getDemandId(request))
    if (!deleted) throw new ApiException(404, 'DEMAND_NOT_FOUND', 'Demanda não encontrada.')
    response.status(204).end()
  }

  return { list, getById, create, update, remove }
}
