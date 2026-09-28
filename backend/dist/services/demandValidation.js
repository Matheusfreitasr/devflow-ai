import { DEMAND_PRIORITIES, DEMAND_STATUSES } from '../types/demand.js';
import { ApiException } from './apiException.js';
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function parseDemandInput(value) {
    if (!isRecord(value)) {
        throw new ApiException(400, 'VALIDATION_ERROR', 'O corpo da requisição deve ser um objeto.');
    }
    const details = [];
    const title = typeof value.title === 'string' ? value.title.trim() : '';
    const description = typeof value.description === 'string' ? value.description.trim() : '';
    if (!title)
        details.push({ field: 'title', message: 'O título é obrigatório.' });
    if (!description) {
        details.push({ field: 'description', message: 'A descrição é obrigatória.' });
    }
    if (title.length > 120) {
        details.push({ field: 'title', message: 'O título deve ter no máximo 120 caracteres.' });
    }
    if (typeof value.priority !== 'string' || !DEMAND_PRIORITIES.includes(value.priority)) {
        details.push({ field: 'priority', message: 'Informe uma prioridade válida.' });
    }
    if (typeof value.status !== 'string' || !DEMAND_STATUSES.includes(value.status)) {
        details.push({ field: 'status', message: 'Informe um status válido.' });
    }
    if (details.length > 0) {
        throw new ApiException(400, 'VALIDATION_ERROR', 'Verifique os campos informados.', details);
    }
    return {
        title,
        description,
        priority: value.priority,
        status: value.status,
    };
}
