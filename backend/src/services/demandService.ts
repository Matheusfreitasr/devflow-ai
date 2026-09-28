import { randomUUID } from 'node:crypto'
import type { Demand, DemandInput } from '../types/demand.js'

export class DemandService {
  private readonly demands = new Map<string, Demand>()

  list(): Demand[] {
    return [...this.demands.values()].sort(
      (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
    )
  }

  getById(id: string): Demand | undefined {
    return this.demands.get(id)
  }

  create(input: DemandInput): Demand {
    const now = new Date().toISOString()
    const demand: Demand = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    }

    this.demands.set(demand.id, demand)
    return demand
  }

  update(id: string, input: DemandInput): Demand | undefined {
    const currentDemand = this.demands.get(id)
    if (!currentDemand) return undefined

    const updatedDemand: Demand = {
      ...currentDemand,
      ...input,
      updatedAt: new Date().toISOString(),
    }

    this.demands.set(id, updatedDemand)
    return updatedDemand
  }

  delete(id: string): boolean {
    return this.demands.delete(id)
  }
}
