import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.resolve(__dirname, '..', 'public', 'content')
const outPath = path.resolve(__dirname, '..', 'public', 'vocabulary.json')

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.json'))

const vocab = new Map()

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'))
  const meta = {
    id: data.id,
    title: data.title,
    level: data.level,
    category: data.category,
  }

  for (const seg of data.segments || []) {
    if (seg.type !== 'no') continue
    const text = (seg.text || '').trim()
    if (!text) continue
    const key = text.toLowerCase()

    let entry = vocab.get(key)
    if (!entry) {
      entry = {
        word: text,
        translation: seg.translation || '',
        pos: seg.pos || '',
        forms: new Set(),
        count: 0,
        levels: { A2: 0, B1: 0, B2: 0 },
        categories: {},
        texts: [],
        textsSet: new Set(),
      }
      vocab.set(key, entry)
    }

    entry.count++
    entry.forms.add(text)
    if (entry.levels[meta.level] !== undefined) entry.levels[meta.level]++
    entry.categories[meta.category] = (entry.categories[meta.category] || 0) + 1
    if (!entry.textsSet.has(meta.id)) {
      entry.textsSet.add(meta.id)
      entry.texts.push({ id: meta.id, title: meta.title, level: meta.level })
    }
  }
}

const words = []
let totalOccurrences = 0
for (const entry of vocab.values()) {
  entry.forms = Array.from(entry.forms)
  delete entry.textsSet
  totalOccurrences += entry.count
  words.push(entry)
}

words.sort((a, b) => b.count - a.count)

const result = {
  generatedAt: new Date().toISOString(),
  totalUnique: words.length,
  totalOccurrences,
  totalTexts: files.length,
  words,
}

fs.writeFileSync(outPath, JSON.stringify(result), 'utf8')

const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1)
console.log(`Vocabulary: ${result.totalUnique} unique words, ${result.totalOccurrences} occurrences across ${result.totalTexts} texts`)
console.log(`Written → public/vocabulary.json (${sizeKb} KB)`)
