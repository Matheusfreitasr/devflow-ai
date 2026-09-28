import { ApiException } from '../services/apiException.js';
export const notFoundHandler = (request, _response, next) => {
    next(new ApiException(404, 'ROUTE_NOT_FOUND', 'Rota não encontrada.'));
};
