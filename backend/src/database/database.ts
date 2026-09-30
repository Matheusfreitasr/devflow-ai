import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFilePath)

const databasePath = path.resolve(
  currentDirectory,
  '../../data/devflow.db',
)

export const database = new Database(databasePath)

database.pragma('journal_mode = WAL')

database.exec(`
  CREATE TABLE IF NOT EXISTS demands (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    analysis TEXT
  )
`)