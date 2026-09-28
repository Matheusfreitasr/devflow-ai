import { ApiException } from '../services/apiException.js';
function bodyParserError(error) {
    if (typeof error !== 'object' || error === null || !('type' in error))
        return undefined;
    if (error.type === 'entity.parse.failed') {
        return new ApiException(400, 'INVALID_JSON', 'O corpo da requisição contém JSON inválido.');
    }
    if (error.type === 'entity.too.large') {
        return new ApiException(413, 'PAYLOAD_TOO_LARGE', 'O corpo da requisição excede o limite permitido.');
    }
    return undefined;
}
export const errorHandler = (error, _request, response, next) => {
    if (response.headersSent) {
        next(error);
        return;
    }
    const apiError = error instanceof ApiException ? error : bodyParserError(error);
    const statusCode = apiError?.statusCode ?? 500;
    const body = {
        error: {
            code: apiError?.code ?? 'INTERNAL_SERVER_ERROR',
            message: apiError?.message ?? 'Ocorreu um erro interno.',
            ...(apiError?.details ? { details: apiError.details } : {}),
        },
    };
    response.status(statusCode).json(body);
};
