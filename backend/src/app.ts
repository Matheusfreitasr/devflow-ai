import express, { type Express } from 'express'
import { corsMiddleware } from './middleware/cors.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'
import { createDemandRoutes } from './routes/demandRoutes.js'
import { DemandService } from './services/demandService.js'

export function createApp(demandService = new DemandService()): Express {
  const app = express()

  app.disable('x-powered-by')
  app.use(corsMiddleware)
  app.use(express.json({ limit: '64kb' }))
  app.use('/api/demands', createDemandRoutes(demandService))
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
