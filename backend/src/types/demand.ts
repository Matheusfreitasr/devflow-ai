export const DEMAND_PRIORITIES = ['Baixa', 'Média', 'Alta'] as const

export const DEMAND_STATUSES = [
  'Backlog',
  'Em desenvolvimento',
  'Em revisão',
  'Concluído',
] as const

export type DemandPriority = (typeof DEMAND_PRIORITIES)[number]
export type DemandStatus = (typeof DEMAND_STATUSES)[number]

export interface DemandInput {
  title: string
  description: string
  priority: DemandPriority
  status: DemandStatus
}

export interface Demand extends DemandInput {
  id: string
  createdAt: string
  updatedAt: string
}
