import { Router } from 'express'
import { createDemandController } from '../controllers/demandController.js'
import type { DemandService } from '../services/demandService.js'
import type { DemandAnalysisService } from '../services/demandAnalysisService.js'

export function createDemandRoutes(
  demandService: DemandService,
  demandAnalysisService: DemandAnalysisService,
): Router {
  const router = Router()
  const controller = createDemandController(demandService, demandAnalysisService)

  router.get('/', controller.list)
  router.get('/:id', controller.getById)
  router.post('/', controller.create)
  router.put('/:id', controller.update)
  router.delete('/:id', controller.remove)
  router.post('/:id/analyze', controller.analyze)

  return router
}
