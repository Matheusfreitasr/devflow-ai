import { ApiException } from '../services/apiException.js';
const configuredOrigins = process.env.FRONTEND_ORIGINS ??
    'http://localhost:5173,http://127.0.0.1:5173';
const allowedOrigins = new Set(configuredOrigins.split(',').map((origin) => origin.trim()).filter(Boolean));
export const corsMiddleware = (request, response, next) => {
    const origin = request.get('origin');
    if (origin && !allowedOrigins.has(origin)) {
        next(new ApiException(403, 'CORS_ORIGIN_NOT_ALLOWED', 'Origem não permitida.'));
        return;
    }
    if (origin) {
        response.setHeader('Access-Control-Allow-Origin', origin);
        response.vary('Origin');
    }
    response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
    }
    next();
};
