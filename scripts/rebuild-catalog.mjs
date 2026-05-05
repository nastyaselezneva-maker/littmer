// Перестраивает src/data/catalog.js по содержимому public/content/*.json
// Запускается после добавления/изменения JSON-файлов с текстами.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.resolve(root, 'public', 'content')
const catalogPath = path.resolve(root, 'src', 'data', 'catalog.js')

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.json'))
const META_FIELDS = ['id', 'title', 'titleNo', 'level', 'category', 'topic', 'length', 'description']

const entries = []
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'))
  const meta = {}
  for (const f of META_FIELDS) {
    if (data[f] !== undefined) meta[f] = data[f]
  }
  entries.push(meta)
}

// Стабильная сортировка по id
entries.sort((a, b) => a.id.localeCompare(b.id))

const out = `const catalog = ${JSON.stringify(entries, null, 2)}\n\nexport default catalog\n`
fs.writeFileSync(catalogPath, out, 'utf8')

console.log(`Catalog rebuilt: ${entries.length} entries → src/data/catalog.js`)
