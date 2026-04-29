import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.resolve(root, 'public', 'content')
const vocabPath = path.resolve(root, 'public', 'vocabulary.json')
const lookupPath = path.resolve(root, 'public', 'lookup.json')
const missingPath = path.resolve(root, 'scripts', 'glosses-missing.json')
const glossesPath = path.resolve(root, 'public', 'glosses.json')

// Стоп-слова: предлоги, артикли, союзы, частицы — не получают тултипа, но считаются
const STOP_WORDS = new Set([
  // предлоги
  'på', 'til', 'for', 'med', 'av', 'om', 'ved', 'etter', 'før', 'i', 'fra',
  'mot', 'mellom', 'uten', 'gjennom', 'under', 'over', 'rundt', 'hos', 'blant',
  'innen', 'inni', 'utenfor', 'innenfor', 'opp', 'ned', 'inn', 'ut',
  // артикли
  'en', 'et', 'ei', 'den', 'det', 'de',
  // союзы
  'og', 'eller', 'men', 'så', 'hvis', 'når', 'mens', 'at', 'som',
  // частицы
  'ikke', 'jo', 'vel', 'da', 'nå',
])

function tokenize(text) {
  if (!text) return []
  return text.toLowerCase().match(/[a-zæøåäö]+(?:-[a-zæøåäö]+)*/g) || []
}

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.json'))

const vocab = new Map()

// Загружаем уже сгенерированные глоссы, если они есть
let existingGlosses = {}
if (fs.existsSync(glossesPath)) {
  try {
    existingGlosses = JSON.parse(fs.readFileSync(glossesPath, 'utf8'))
  } catch (e) {
    existingGlosses = {}
  }
}

function getEntry(key, word) {
  let entry = vocab.get(key)
  if (!entry) {
    entry = {
      word,
      translation: '',
      transcription: '',
      dict: '',
      pos: '',
      forms: new Set(),
      count: 0,
      levels: { A2: 0, B1: 0, B2: 0 },
      categories: {},
      texts: [],
      textsSet: new Set(),
      sourceTypes: new Set(),
      isStopWord: STOP_WORDS.has(key),
    }
    vocab.set(key, entry)
  }
  return entry
}

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'))
  const meta = {
    id: data.id,
    title: data.title,
    level: data.level,
    category: data.category,
  }

  for (const seg of data.segments || []) {
    if (seg.type === 'no') {
      // Норвежский сегмент — есть полная информация
      const text = (seg.text || '').trim()
      if (!text) continue
      const key = text.toLowerCase()
      const entry = getEntry(key, text)
      // Заполняем перевод/pos/transcription/dict из первого встреченного no-сегмента
      if (!entry.translation) entry.translation = seg.translation || ''
      if (!entry.pos) entry.pos = seg.pos || ''
      if (!entry.transcription) entry.transcription = seg.transcription || ''
      if (!entry.dict) entry.dict = seg.dict || ''
      entry.count++
      entry.forms.add(text)
      entry.sourceTypes.add('no')
      if (entry.levels[meta.level] !== undefined) entry.levels[meta.level]++
      entry.categories[meta.category] = (entry.categories[meta.category] || 0) + 1
      if (!entry.textsSet.has(meta.id)) {
        entry.textsSet.add(meta.id)
        entry.texts.push({ id: meta.id, title: meta.title, level: meta.level })
      }
    } else if (seg.type === 'ru' && seg.no) {
      // Связка — токенизируем норвежский вариант
      for (const token of tokenize(seg.no)) {
        const entry = getEntry(token, token)
        // Перевод подтянем из glosses.json, если есть
        if (!entry.translation && existingGlosses[token]) {
          entry.translation = existingGlosses[token].translation || ''
          entry.pos = entry.pos || existingGlosses[token].pos || ''
          entry.transcription = entry.transcription || existingGlosses[token].transcription || ''
          entry.dict = entry.dict || existingGlosses[token].dict || ''
        }
        entry.count++
        entry.forms.add(token)
        entry.sourceTypes.add('ru-derived')
        if (entry.levels[meta.level] !== undefined) entry.levels[meta.level]++
        entry.categories[meta.category] = (entry.categories[meta.category] || 0) + 1
        if (!entry.textsSet.has(meta.id)) {
          entry.textsSet.add(meta.id)
          entry.texts.push({ id: meta.id, title: meta.title, level: meta.level })
        }
      }
    }
  }
}

const words = []
const lookup = {} // компактный словарь для тултипов: { key: {tr, pos} }
const missing = [] // слова без перевода (не стоп-слова)
let totalOccurrences = 0

for (const [key, entry] of vocab.entries()) {
  entry.forms = Array.from(entry.forms)
  entry.sourceTypes = Array.from(entry.sourceTypes)
  delete entry.textsSet
  totalOccurrences += entry.count
  words.push(entry)

  // В lookup: только не стоп-слова с переводом — для тултипов
  if (!entry.isStopWord && entry.translation) {
    lookup[key] = {
      tr: entry.translation,
      pos: entry.pos || '',
      ts: entry.transcription || '',
      dict: entry.dict || '',
    }
  }

  // Missing: не стоп-слово, нет перевода, есть ru-derived источник
  if (!entry.isStopWord && !entry.translation && entry.sourceTypes.includes('ru-derived')) {
    missing.push(key)
  }
}

words.sort((a, b) => b.count - a.count)
missing.sort()

const result = {
  generatedAt: new Date().toISOString(),
  totalUnique: words.length,
  totalOccurrences,
  totalTexts: files.length,
  words,
}

fs.writeFileSync(vocabPath, JSON.stringify(result), 'utf8')
fs.writeFileSync(lookupPath, JSON.stringify(lookup), 'utf8')
if (missing.length > 0) {
  fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2), 'utf8')
} else if (fs.existsSync(missingPath)) {
  fs.unlinkSync(missingPath)
}

const vocabKb = (fs.statSync(vocabPath).size / 1024).toFixed(1)
const lookupKb = (fs.statSync(lookupPath).size / 1024).toFixed(1)

console.log(`Vocabulary: ${result.totalUnique} unique words, ${result.totalOccurrences} occurrences across ${result.totalTexts} texts`)
console.log(`Stop-words: ${[...vocab.values()].filter((e) => e.isStopWord).length}`)
console.log(`With translation: ${[...vocab.values()].filter((e) => e.translation).length}`)
console.log(`Missing translation (need agent): ${missing.length}`)
console.log(`Written:`)
console.log(`  → public/vocabulary.json (${vocabKb} KB)`)
console.log(`  → public/lookup.json (${lookupKb} KB) — для тултипов в Reader`)
console.log(`  → scripts/glosses-missing.json — список слов без перевода`)
