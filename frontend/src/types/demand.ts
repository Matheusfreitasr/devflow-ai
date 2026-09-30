import type { DemandAnalysisResult } from './demandAnalysis.js'

export type DemandPriority = 'Baixa' | 'Média' | 'Alta'

export type DemandStatus =
  | 'Backlog'
  | 'Em desenvolvimento'
  | 'Em revisão'
  | 'Concluído'

export interface Demand {
  id: string
  title: string
  description: string
  priority: DemandPriority
  status: DemandStatus
  createdAt: string
  analysis?: DemandAnalysisResult
}

export type NewDemandInput = Pick<
  Demand,
  'title' | 'description' | 'priority' | 'status'
>