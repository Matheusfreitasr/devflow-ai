import type { Demand } from '../types/demand.js'
import type { DemandAnalysisResult } from '../types/demandAnalysis.js'

/** Provider-agnostic contract for a future demand analysis implementation. */
export interface DemandAnalysisService {
  analyze(demand: Demand): Promise<DemandAnalysisResult>
}
