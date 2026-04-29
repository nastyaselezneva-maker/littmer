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

// Стоп-слова: предлоги, артикли, союзы, частицы — не получают тултипа в Reader,
// но переводы в Vocabulary всё равно показываем
const STOP_WORD_TRANSLATIONS = {
  // предлоги
  'på': { translation: 'на', transcription: 'по', pos: 'prep' },
  'til': { translation: 'к / до', transcription: 'тиль', pos: 'prep' },
  'for': { translation: 'для / за', transcription: 'фор', pos: 'prep' },
  'med': { translation: 'с', transcription: 'мэ', pos: 'prep' },
  'av': { translation: 'от / из', transcription: 'ав', pos: 'prep' },
  'om': { translation: 'о / если', transcription: 'ом', pos: 'prep' },
  'ved': { translation: 'у / при', transcription: 'вэ', pos: 'prep' },
  'etter': { translation: 'после', transcription: 'эттэр', pos: 'prep' },
  'før': { translation: 'до / раньше', transcription: 'фёр', pos: 'prep' },
  'i': { translation: 'в', transcription: 'и', pos: 'prep' },
  'fra': { translation: 'от / из', transcription: 'фра', pos: 'prep' },
  'mot': { translation: 'против / к', transcription: 'мут', pos: 'prep' },
  'mellom': { translation: 'между', transcription: 'мэллом', pos: 'prep' },
  'uten': { translation: 'без', transcription: 'ютэн', pos: 'prep' },
  'gjennom': { translation: 'через', transcription: 'йенном', pos: 'prep' },
  'under': { translation: 'под / во время', transcription: 'юннэр', pos: 'prep' },
  'over': { translation: 'над / больше', transcription: 'овэр', pos: 'prep' },
  'rundt': { translation: 'вокруг', transcription: 'рюнт', pos: 'prep' },
  'hos': { translation: 'у (кого-то)', transcription: 'хус', pos: 'prep' },
  'blant': { translation: 'среди', transcription: 'блант', pos: 'prep' },
  'innen': { translation: 'до / внутри', transcription: 'иннэн', pos: 'prep' },
  'inni': { translation: 'внутри', transcription: 'инни', pos: 'prep' },
  'utenfor': { translation: 'снаружи / за', transcription: 'ютэнфор', pos: 'prep' },
  'innenfor': { translation: 'внутри', transcription: 'иннэнфор', pos: 'prep' },
  'opp': { translation: 'вверх', transcription: 'опп', pos: 'adv' },
  'ned': { translation: 'вниз', transcription: 'нэ', pos: 'adv' },
  'inn': { translation: 'внутрь', transcription: 'инн', pos: 'adv' },
  'ut': { translation: 'наружу', transcription: 'ют', pos: 'adv' },
  // артикли
  'en': { translation: 'один (м.р.) / артикль', transcription: 'эн', pos: 'num' },
  'et': { translation: 'одно (ср.р.) / артикль', transcription: 'эт', pos: 'num' },
  'ei': { translation: 'одна (ж.р.) / артикль', transcription: 'эй', pos: 'num' },
  'den': { translation: 'тот / артикль', transcription: 'дэн', pos: 'pronoun' },
  'det': { translation: 'это / то / артикль', transcription: 'дэ', pos: 'pronoun' },
  'de': { translation: 'они / те', transcription: 'ди', pos: 'pronoun' },
  // союзы
  'og': { translation: 'и', transcription: 'о', pos: 'conj' },
  'eller': { translation: 'или', transcription: 'эллэр', pos: 'conj' },
  'men': { translation: 'но', transcription: 'мэн', pos: 'conj' },
  'så': { translation: 'так / затем', transcription: 'со', pos: 'conj' },
  'hvis': { translation: 'если', transcription: 'вис', pos: 'conj' },
  'når': { translation: 'когда', transcription: 'нор', pos: 'conj' },
  'mens': { translation: 'пока / в то время как', transcription: 'мэнс', pos: 'conj' },
  'at': { translation: 'что', transcription: 'ат', pos: 'conj' },
  'som': { translation: 'как / который', transcription: 'сом', pos: 'conj' },
  // частицы
  'ikke': { translation: 'не', transcription: 'икке', pos: 'adv' },
  'jo': { translation: 'же / ведь', transcription: 'ю', pos: 'adv' },
  'vel': { translation: 'хорошо / ну', transcription: 'вэль', pos: 'adv' },
  'da': { translation: 'тогда / ведь', transcription: 'да', pos: 'adv' },
  'nå': { translation: 'сейчас', transcription: 'но', pos: 'adv' },
}
const STOP_WORDS = new Set(Object.keys(STOP_WORD_TRANSLATIONS))

// Возвращает массив {raw, key, capitalized, atSentenceStart}
function tokenize(text) {
  if (!text) return []
  const out = []
  const wordRegex = /[a-zæøåäöA-ZÆØÅÄÖ]+(?:-[a-zæøåäöA-ZÆØÅÄÖ]+)*/g
  let m
  while ((m = wordRegex.exec(text)) !== null) {
    const raw = m[0]
    const first = raw[0]
    const capitalized = first === first.toUpperCase() && first !== first.toLowerCase()
    let atSentenceStart = m.index === 0
    if (!atSentenceStart) {
      let i = m.index - 1
      while (i >= 0 && /\s/.test(text[i])) i--
      if (i < 0 || /[.!?…]/.test(text[i])) atSentenceStart = true
    }
    out.push({ raw, key: raw.toLowerCase(), capitalized, atSentenceStart })
  }
  return out
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
    const stopTr = STOP_WORD_TRANSLATIONS[key]
    entry = {
      word,
      translation: stopTr ? stopTr.translation : '',
      transcription: stopTr ? stopTr.transcription : '',
      dict: '',
      pos: stopTr ? stopTr.pos : '',
      forms: new Set(),
      count: 0,
      levels: { A2: 0, B1: 0, B2: 0 },
      categories: {},
      texts: [],
      textsSet: new Set(),
      sourceTypes: new Set(),
      isStopWord: STOP_WORDS.has(key),
      seenLowercase: false,
      seenCapMidSentence: false,
      seenCapInNoSeg: false,
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
      // Проверка капитализации первого слова сегмента
      const first = text[0]
      const firstIsCap = first === first.toUpperCase() && first !== first.toLowerCase()
      if (firstIsCap) entry.seenCapInNoSeg = true
      else entry.seenLowercase = true
      if (entry.levels[meta.level] !== undefined) entry.levels[meta.level]++
      entry.categories[meta.category] = (entry.categories[meta.category] || 0) + 1
      if (!entry.textsSet.has(meta.id)) {
        entry.textsSet.add(meta.id)
        entry.texts.push({ id: meta.id, title: meta.title, level: meta.level })
      }
    } else if (seg.type === 'ru' && seg.no) {
      // Связка — токенизируем норвежский вариант
      for (const tok of tokenize(seg.no)) {
        const entry = getEntry(tok.key, tok.raw)
        // Перевод подтянем из glosses.json, если есть
        if (!entry.translation && existingGlosses[tok.key]) {
          entry.translation = existingGlosses[tok.key].translation || ''
          entry.pos = entry.pos || existingGlosses[tok.key].pos || ''
          entry.transcription = entry.transcription || existingGlosses[tok.key].transcription || ''
          entry.dict = entry.dict || existingGlosses[tok.key].dict || ''
        }
        entry.count++
        entry.forms.add(tok.raw)
        entry.sourceTypes.add('ru-derived')
        // Капитализация: только мид-сентенс окрашивает; начало предложения игнорируем
        if (tok.capitalized && !tok.atSentenceStart) entry.seenCapMidSentence = true
        if (!tok.capitalized) entry.seenLowercase = true
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
const missing = [] // слова без перевода (не стоп-слова, не имена собственные)
let totalOccurrences = 0
let properNounCount = 0

for (const [key, entry] of vocab.entries()) {
  // Имя собственное: видели заглавную (мид-сентенс или в no-сегменте) и НИ РАЗУ не видели строчной формы
  entry.isProperNoun = !entry.seenLowercase &&
    (entry.seenCapMidSentence || entry.seenCapInNoSeg)
  // У стоп-слов не должно быть капитализации, но если случайно сработало — снимаем
  if (entry.isStopWord) entry.isProperNoun = false
  // Очень короткие токены (1 буква) — не считаем именами собственными
  if (entry.word.length <= 1) entry.isProperNoun = false

  if (entry.isProperNoun) {
    properNounCount++
    continue // не добавляем в Лексику
  }

  entry.forms = Array.from(entry.forms)
  entry.sourceTypes = Array.from(entry.sourceTypes)
  delete entry.textsSet
  // Эти служебные поля больше не нужны — удаляем перед сериализацией
  delete entry.seenLowercase
  delete entry.seenCapMidSentence
  delete entry.seenCapInNoSeg
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
console.log(`Stop-words: ${words.filter((e) => e.isStopWord).length}`)
console.log(`Proper nouns excluded: ${properNounCount}`)
console.log(`With translation: ${words.filter((e) => e.translation).length}`)
console.log(`Missing translation (need agent): ${missing.length}`)
console.log(`Written:`)
console.log(`  → public/vocabulary.json (${vocabKb} KB)`)
console.log(`  → public/lookup.json (${lookupKb} KB) — для тултипов в Reader`)
if (missing.length > 0) {
  console.log(`  → scripts/glosses-missing.json — ${missing.length} слов без перевода`)
}
