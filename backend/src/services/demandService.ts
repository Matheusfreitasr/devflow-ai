import { randomUUID } from 'node:crypto'
import { database } from '../database/database.js'
import type { Demand, DemandInput } from '../types/demand.js'
import type { DemandAnalysisResult } from '../types/demandAnalysis.js'

interface DemandRow {
  id: string
  title: string
  description: string
  priority: Demand['priority']
  status: Demand['status']
  created_at: string
  updated_at: string
  analysis: string | null
}

function rowToDemand(row: DemandRow): Demand {
  let analysis: DemandAnalysisResult | undefined

  if (row.analysis) {
    try {
      analysis = JSON.parse(row.analysis) as DemandAnalysisResult
    } catch {
      throw new Error(`A análise da demanda ${row.id} está corrompida.`)
    }
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(analysis ? { analysis } : {}),
  }
}

export class DemandService {
  list(): Demand[] {
    const rows = database
      .prepare(`
        SELECT
          id,
          title,
          description,
          priority,
          status,
          created_at,
          updated_at,
          analysis
        FROM demands
        ORDER BY datetime(created_at) DESC
      `)
      .all() as DemandRow[]

    return rows.map(rowToDemand)
  }

  getById(id: string): Demand | undefined {
    const row = database
      .prepare(`
        SELECT
          id,
          title,
          description,
          priority,
          status,
          created_at,
          updated_at,
          analysis
        FROM demands
        WHERE id = ?
      `)
      .get(id) as DemandRow | undefined

    return row ? rowToDemand(row) : undefined
  }

  create(input: DemandInput): Demand {
    const now = new Date().toISOString()
    const id = randomUUID()

    database
      .prepare(`
        INSERT INTO demands (
          id,
          title,
          description,
          priority,
          status,
          created_at,
          updated_at,
          analysis
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
      `)
      .run(
        id,
        input.title,
        input.description,
        input.priority,
        input.status,
        now,
        now,
      )

    return {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
    }
  }

  update(id: string, input: DemandInput): Demand | undefined {
    const currentDemand = this.getById(id)

    if (!currentDemand) {
      return undefined
    }

    const updatedAt = new Date().toISOString()

    database
      .prepare(`
        UPDATE demands
        SET
          title = ?,
          description = ?,
          priority = ?,
          status = ?,
          updated_at = ?
        WHERE id = ?
      `)
      .run(
        input.title,
        input.description,
        input.priority,
        input.status,
        updatedAt,
        id,
      )

    return this.getById(id)
  }

  saveAnalysis(
    id: string,
    analysis: DemandAnalysisResult,
  ): Demand | undefined {
    const currentDemand = this.getById(id)

    if (!currentDemand) {
      return undefined
    }

    const updatedAt = new Date().toISOString()

    database
      .prepare(`
        UPDATE demands
        SET
          analysis = ?,
          updated_at = ?
        WHERE id = ?
      `)
      .run(
        JSON.stringify(analysis),
        updatedAt,
        id,
      )

    return this.getById(id)
  }

  delete(id: string): boolean {
    const result = database
      .prepare(`
        DELETE FROM demands
        WHERE id = ?
      `)
      .run(id)

    return result.changes > 0
  }
}