import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { createDemandRoutes } from './routes/demandRoutes.js';
import { DemandService } from './services/demandService.js';
import { OpenAiDemandAnalysisService } from './services/openAiDemandAnalysisService.js';
export function createApp(demandService = new DemandService(), demandAnalysisService = new OpenAiDemandAnalysisService()) {
    const app = express();
    app.disable('x-powered-by');
    app.use(corsMiddleware);
    app.use(express.json({ limit: '64kb' }));
    app.use('/api/demands', createDemandRoutes(demandService, demandAnalysisService));
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
