import { randomUUID } from 'node:crypto';
export class DemandService {
    demands = new Map();
    list() {
        return [...this.demands.values()].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
    }
    getById(id) {
        return this.demands.get(id);
    }
    create(input) {
        const now = new Date().toISOString();
        const demand = {
            ...input,
            id: randomUUID(),
            createdAt: now,
            updatedAt: now,
        };
        this.demands.set(demand.id, demand);
        return demand;
    }
    update(id, input) {
        const currentDemand = this.demands.get(id);
        if (!currentDemand)
            return undefined;
        const updatedDemand = {
            ...currentDemand,
            ...input,
            updatedAt: new Date().toISOString(),
        };
        this.demands.set(id, updatedDemand);
        return updatedDemand;
    }
    delete(id) {
        return this.demands.delete(id);
    }
}
