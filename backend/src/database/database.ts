import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const dataDirectory = path.resolve(
  process.cwd(),
  'data',
)

fs.mkdirSync(dataDirectory, {
  recursive: true,
})

const databasePath = path.join(
  dataDirectory,
  'devflow.db',
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