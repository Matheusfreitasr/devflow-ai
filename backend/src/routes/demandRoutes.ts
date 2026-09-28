import { Router } from 'express'
import { createDemandController } from '../controllers/demandController.js'
import type { DemandService } from '../services/demandService.js'

export function createDemandRoutes(demandService: DemandService): Router {
  const router = Router()
  const controller = createDemandController(demandService)

  router.get('/', controller.list)
  router.get('/:id', controller.getById)
  router.post('/', controller.create)
  router.put('/:id', controller.update)
  router.delete('/:id', controller.remove)

  return router
}
