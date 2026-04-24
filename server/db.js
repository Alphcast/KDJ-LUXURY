import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbDir = join(__dirname)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(join(dbDir, 'kdj.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cat TEXT NOT NULL,
    price TEXT NOT NULL,
    oldPrice TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    img TEXT NOT NULL,
    imgType TEXT DEFAULT 'url',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    phone TEXT,
    name TEXT,
    greeting TEXT
  )
`)

export default db