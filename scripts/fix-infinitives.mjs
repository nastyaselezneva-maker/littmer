// Fix Norwegian infinitives: combine å + verb into single pos:"verb" segments
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.resolve(root, 'public', 'content')

const DRY_RUN = process.argv.includes('--dry-run')
const VERBOSE = process.argv.includes('--verbose')

// Russian infinitive translations for common Norwegian verbs.
// If verb's existing translation is a personal form, we look up the infinitive here.
const VERB_INFINITIVE_RU = {
  'snakke': 'говорить',
  'spise': 'есть',
  'lese': 'читать',
  'skrive': 'писать',
  'gå': 'идти',
  'se': 'видеть',
  'ta': 'брать',
  'få': 'получить',
  'ha': 'иметь',
  'bli': 'стать',
  'gi': 'давать',
  'slå': 'бить',
  'be': 'просить',
  'dø': 'умереть',
  'være': 'быть',
  'gjøre': 'делать',
  'synes': 'считать',
  'drikke': 'пить',
  'sove': 'спать',
  'finne': 'найти',
  'bo': 'жить',
  'høre': 'слышать',
  'tenke': 'думать',
  'vite': 'знать',
  'lære': 'учить',
  'jobbe': 'работать',
  'arbeide': 'работать',
  'kjøre': 'ехать',
  'reise': 'путешествовать',
  'komme': 'приходить',
  'gjøre': 'делать',
  'kjøpe': 'покупать',
  'selge': 'продавать',
  'lage': 'делать',
  'bygge': 'строить',
  'fjerne': 'удалять',
  'huske': 'помнить',
  'glemme': 'забывать',
  'starte': 'начинать',
  'slutte': 'заканчивать',
  'møte': 'встречать',
  'vente': 'ждать',
  'hjelpe': 'помогать',
  'snakke': 'говорить',
  'leve': 'жить',
  'spille': 'играть',
  'leke': 'играть',
  'svømme': 'плавать',
  'bade': 'плавать',
  'løpe': 'бежать',
  'gå tur': 'гулять',
  'sykle': 'ездить на велосипеде',
  'løse': 'решать',
  'forstå': 'понимать',
  'lese': 'читать',
  'skrive': 'писать',
  'tegne': 'рисовать',
  'male': 'красить',
  'synge': 'петь',
  'danse': 'танцевать',
  'lytte': 'слушать',
  'høre på': 'слушать',
  'hjelpe': 'помогать',
  'oppleve': 'переживать',
  'føle': 'чувствовать',
  'kjenne': 'знать',
  'merke': 'замечать',
  'oppdage': 'обнаруживать',
  'lete': 'искать',
  'søke': 'искать',
  'finne': 'найти',
  'møte': 'встречать',
  'treffe': 'встретить',
  'besøke': 'посещать',
  'reise': 'путешествовать',
  'fly': 'летать',
  'kjøre': 'ехать',
  'gå': 'идти',
  'komme': 'приходить',
  'dra': 'ехать',
  'forlate': 'покидать',
  'returnere': 'возвращаться',
  'vende tilbake': 'возвращаться',
  'sitte': 'сидеть',
  'stå': 'стоять',
  'ligge': 'лежать',
  'legge': 'класть',
  'sette': 'ставить',
  'reise seg': 'вставать',
  'falle': 'падать',
  'kaste': 'бросать',
  'fange': 'ловить',
  'plukke': 'собирать',
  'samle': 'собирать',
  'dele': 'делить',
  'gi': 'давать',
  'motta': 'получать',
  'sende': 'посылать',
  'bringe': 'приносить',
  'hente': 'забирать',
  'få': 'получить',
  'miste': 'терять',
  'tape': 'проигрывать',
  'vinne': 'выигрывать',
  'lykkes': 'успешно',
  'mislykkes': 'не получаться',
  'prøve': 'пробовать',
  'forsøke': 'пытаться',
  'fortsette': 'продолжать',
  'avslutte': 'завершать',
  'avbryte': 'прерывать',
  'pause': 'делать паузу',
  'hvile': 'отдыхать',
  'slappe av': 'расслабляться',
  'jobbe': 'работать',
  'studere': 'учиться',
  'undervise': 'учить',
  'forklare': 'объяснять',
  'fortelle': 'рассказывать',
  'si': 'сказать',
  'spørre': 'спрашивать',
  'svare': 'отвечать',
  'snakke': 'говорить',
  'prate': 'болтать',
  'rope': 'кричать',
  'hviske': 'шептать',
  'tie': 'молчать',
  'le': 'смеяться',
  'gråte': 'плакать',
  'smile': 'улыбаться',
  'klage': 'жаловаться',
  'rose': 'хвалить',
  'kritisere': 'критиковать',
  'takke': 'благодарить',
  'be om unnskyldning': 'извиняться',
  'forlate': 'покидать',
  'invitere': 'приглашать',
  'akseptere': 'принимать',
  'avslå': 'отклонять',
  'velge': 'выбирать',
  'bestemme': 'решать',
  'planlegge': 'планировать',
  'arrangere': 'организовывать',
  'organisere': 'организовывать',
  'forberede': 'готовить',
  'forberede seg': 'готовиться',
  'lære': 'учить',
  'undervise': 'преподавать',
  'huske': 'помнить',
  'glemme': 'забывать',
  'vite': 'знать',
  'forstå': 'понимать',
  'tenke': 'думать',
  'tro': 'верить',
  'mene': 'считать',
  'føle': 'чувствовать',
  'oppleve': 'переживать',
  'drømme': 'мечтать',
  'håpe': 'надеяться',
  'ønske': 'желать',
  'ville': 'хотеть',
  'kunne': 'мочь',
  'måtte': 'должен',
  'skulle': 'должен',
  'tør': 'сметь',
  'tørre': 'сметь',
  'orke': 'мочь',
  'klare': 'справляться',
  'greie': 'справляться',
  'rekke': 'успевать',
  'huske': 'помнить',
  'velge': 'выбирать',
  'bestemme': 'решать',
  'tenke seg': 'воображать',
  'forestille seg': 'представлять',
  'beskrive': 'описывать',
  'definere': 'определять',
  'sammenligne': 'сравнивать',
  'kontrastere': 'противопоставлять',
  'analysere': 'анализировать',
  'evaluere': 'оценивать',
  'bedømme': 'оценивать',
  'dømme': 'судить',
  'straffe': 'наказывать',
  'belønne': 'награждать',
  'nyte': 'наслаждаться',
  'kose seg': 'наслаждаться',
  'ferdes': 'передвигаться',
  'oppholde seg': 'находиться',
  'overnatte': 'ночевать',
  'sove': 'спать',
  'våkne': 'просыпаться',
  'stå opp': 'вставать',
  'legge seg': 'ложиться спать',
  'kle på seg': 'одеваться',
  'kle av seg': 'раздеваться',
  'vaske': 'мыть',
  'pusse': 'чистить',
  'rydde': 'убирать',
  'bli': 'стать',
  'forandre': 'менять',
  'forandre seg': 'меняться',
  'utvikle': 'развивать',
  'utvikle seg': 'развиваться',
  'vokse': 'расти',
  'minke': 'уменьшаться',
  'øke': 'увеличиваться',
  'redusere': 'уменьшать',
  'skape': 'создавать',
  'lage': 'делать',
  'produsere': 'производить',
  'bygge': 'строить',
  'rive': 'разрушать',
  'ødelegge': 'разрушать',
  'reparere': 'ремонтировать',
  'fikse': 'чинить',
  'forbedre': 'улучшать',
  'forverre': 'ухудшать',
  'beskytte': 'защищать',
  'forsvare': 'защищать',
  'angripe': 'нападать',
  'flykte': 'убегать',
  'gjemme seg': 'прятаться',
  'søke': 'искать',
  'huske på': 'помнить',
}

// Map of common verbs to (infinitive Russian, Cyrillic transcription of "å + verb")
// transcription rules: å→о, ø→ё, æ→э, e at end→э
function transcribeAaVerb(verbText, existingVerbTranscription) {
  // build "о " + transcription_of_verb
  if (existingVerbTranscription) {
    return 'о ' + existingVerbTranscription
  }
  // fallback: simple mapping
  let s = verbText.toLowerCase()
  s = s.replace(/å/g, 'о').replace(/ø/g, 'ё').replace(/æ/g, 'э')
  // very rough cyrillic transliteration if no transcription was given
  const map = { a: 'а', b: 'б', c: 'к', d: 'д', e: 'э', f: 'ф', g: 'г', h: 'х', i: 'и', j: 'й', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'к', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'кс', y: 'ю', z: 'з' }
  return 'о ' + s.split('').map(ch => map[ch] || ch).join('')
}

// Norwegian verb infinitive detection
function looksLikeInfinitive(word) {
  if (!word) return false
  // Take only the first token if multi-word
  const first = word.trim().split(/\s+/)[0]
  const w = first.toLowerCase().replace(/[.,!?;:"]/g, '')
  if (w.length < 2) return false
  // ends in -e (regular infinitive)
  if (/^[a-zæøå]+e$/i.test(w)) return true
  // ends in -es (passive infinitive)
  if (/^[a-zæøå]+es$/i.test(w)) return true
  // short irregular infinitives
  const irregular = new Set(['gå','se','ta','få','ha','bli','gi','slå','be','dø','bo','tro','så','snu','dra','si','le','snø','få','ses','fås','tas','bli','dra'])
  if (irregular.has(w)) return true
  // ends in -re for some
  if (/^[a-zæøå]+re$/i.test(w)) return true
  return false
}

// Whether a word is likely a noun/non-verb (we shouldn't combine å with these)
// Many phrase segments begin with a noun. Check by looking at segment's pos.
function isVerbLikeFirstWord(text) {
  return looksLikeInfinitive(text)
}

// Get Russian infinitive translation from the verb's existing translation
// If existing translation is already infinitive (ending with ть/ться/чь), keep it
// Otherwise look up the verb in our map
function getInfinitiveTranslation(verb, existingTranslation, existingDict) {
  // Strip trailing "(прош./наст.)" markers
  const trans = (existingTranslation || '').trim()
  // Already infinitive?
  if (/(ть|ться|чь|чься)$/i.test(trans)) return trans
  // dict already has infinitive
  if (existingDict && /(ть|ться|чь|чься)$/i.test(existingDict.trim())) return existingDict.trim()
  // lookup
  const verbKey = verb.toLowerCase().replace(/[.,!?;:"]/g, '')
  if (VERB_INFINITIVE_RU[verbKey]) return VERB_INFINITIVE_RU[verbKey]
  // try to use dict as-is
  if (existingDict) return existingDict.trim()
  // fallback: keep existing translation but mark
  return trans
}

const stats = {
  filesScanned: 0,
  filesChanged: 0,
  joins: 0,
  perVerb: {},
  skipped: [],
  errors: [],
}

function processSegments(segments, fileName) {
  const out = []
  let changed = false

  let i = 0
  while (i < segments.length) {
    const seg = segments[i]
    const next = segments[i + 1]

    if (seg.type === 'ru' && typeof seg.no === 'string') {
      const noField = seg.no
      // Find pattern: ends with "å " (with optional ru text before, but the å must be at the very end as a whole word)
      // We want å as separate word: preceded by space or start, followed by space at end
      const trailingAaMatch = noField.match(/^(.*?)(\s|^)å\s+$/)
      const trailingAaInsideMatch = !trailingAaMatch ? noField.match(/^(.*?)(\s)å\s$/) : null

      if (trailingAaMatch && next && next.type === 'no' && isVerbLikeFirstWord(next.text)) {
        // Case 1: ru.no ends with " å " followed by no segment whose first word is a verb infinitive
        const verbSegText = next.text.trim()
        const isPhrase = next.pos === 'phrase' || /\s/.test(verbSegText)
        // Remove trailing " å " from no field; keep one trailing space so concatenation works
        const newNoField = noField.replace(/å\s+$/, '')
        const newRuSeg = { ...seg, no: newNoField }
        // Build combined segment
        const combinedText = 'å ' + verbSegText
        let translation = next.translation || ''
        let dict = next.dict || ''
        // For pure verbs, ensure infinitive Russian translation
        if (!isPhrase) {
          translation = getInfinitiveTranslation(verbSegText, next.translation, next.dict)
          dict = translation
        } else {
          // For phrases, leave translation as-is (phrase translations are usually already in infinitive or imperative form)
          // but if dict was missing, leave it
        }
        const transcription = 'о ' + (next.transcription || transcribeAaVerb(verbSegText, null).slice(2))
        const newVerbSeg = {
          type: 'no',
          text: combinedText,
          translation: translation,
          transcription: transcription,
          pos: isPhrase ? 'phrase' : 'verb',
        }
        if (dict) newVerbSeg.dict = dict
        // Preserve any other fields from original
        for (const k of Object.keys(next)) {
          if (!['type','text','translation','dict','transcription','pos'].includes(k)) {
            newVerbSeg[k] = next[k]
          }
        }
        out.push(newRuSeg)
        out.push(newVerbSeg)
        changed = true
        stats.joins++
        stats.perVerb[combinedText] = (stats.perVerb[combinedText] || 0) + 1
        if (VERBOSE) console.log(`  [${fileName}] join: "${combinedText}"`)
        i += 2
        continue
      }
    }

    out.push(seg)
    i++
  }

  // Second pass: handle case where å + verb is entirely inside ru.no field as bare text.
  // Pattern: " å verb " or "å verb " at start, where verb is an infinitive followed by space/punct/end.
  const out2 = []
  for (let j = 0; j < out.length; j++) {
    const seg = out[j]
    if (seg.type !== 'ru' || typeof seg.no !== 'string') {
      out2.push(seg)
      continue
    }
    const noField = seg.no
    // Find å + word patterns where word looks like infinitive
    // Use a regex that captures "å " followed by a Norwegian word
    const pattern = /(^|\s)å\s+([a-zæøåA-ZÆØÅ]+)(?=[\s.,!?;:"]|$)/
    const m = noField.match(pattern)
    if (!m) {
      out2.push(seg)
      continue
    }
    const verb = m[2]
    if (!looksLikeInfinitive(verb)) {
      out2.push(seg)
      continue
    }
    // Need to find corresponding russian text — this is hard to extract automatically.
    // Skip and report.
    stats.skipped.push({ file: fileName, reason: 'å+verb embedded in ru.no field — manual review needed', no: noField, verb })
    out2.push(seg)
  }

  return { segments: out2, changed }
}

function processFile(filePath) {
  stats.filesScanned++
  const fileName = path.basename(filePath)
  let raw, json
  try {
    raw = fs.readFileSync(filePath, 'utf-8')
    json = JSON.parse(raw)
  } catch (e) {
    stats.errors.push({ file: fileName, error: e.message })
    return
  }

  if (!Array.isArray(json.segments)) return

  // Capture original Norwegian text for verification
  const origNo = json.segments.map(s => {
    if (s.type === 'ru') return s.no || ''
    if (s.type === 'no') return s.text || ''
    return ''
  }).join('')

  const { segments: newSegs, changed } = processSegments(json.segments, fileName)

  if (!changed) return

  const newNo = newSegs.map(s => {
    if (s.type === 'ru') return s.no || ''
    if (s.type === 'no') return s.text || ''
    return ''
  }).join('')

  if (newNo !== origNo) {
    stats.errors.push({
      file: fileName,
      error: `Norwegian text changed after refactor!`,
      orig: origNo.slice(0, 200),
      new: newNo.slice(0, 200),
    })
    return
  }

  json.segments = newSegs
  if (!DRY_RUN) {
    fs.writeFileSync(filePath, JSON.stringify(json), 'utf-8')
  }
  stats.filesChanged++
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json')).map(f => path.join(contentDir, f))

for (const f of files) processFile(f)

console.log('\n=== Report ===')
console.log(`Files scanned: ${stats.filesScanned}`)
console.log(`Files changed: ${stats.filesChanged}`)
console.log(`Joins applied: ${stats.joins}`)

const top = Object.entries(stats.perVerb).sort((a, b) => b[1] - a[1]).slice(0, 10)
console.log('\nTop infinitives joined:')
for (const [v, c] of top) console.log(`  ${c.toString().padStart(4)}  ${v}`)

if (stats.skipped.length > 0) {
  console.log(`\nSkipped (need manual review): ${stats.skipped.length}`)
  for (const s of stats.skipped.slice(0, 20)) {
    console.log(`  [${s.file}] ${s.reason}: "${s.no.trim().slice(0, 80)}" verb="${s.verb}"`)
  }
}

if (stats.errors.length > 0) {
  console.log(`\nErrors: ${stats.errors.length}`)
  for (const e of stats.errors) {
    console.log(`  [${e.file}] ${e.error}`)
    if (e.orig) console.log(`    orig: ${e.orig}`)
    if (e.new) console.log(`    new : ${e.new}`)
  }
}

// Save skipped report
fs.writeFileSync(path.resolve(__dirname, '_infinitive_skipped.json'), JSON.stringify(stats.skipped, null, 2), 'utf-8')
fs.writeFileSync(path.resolve(__dirname, '_infinitive_report.json'), JSON.stringify({
  filesScanned: stats.filesScanned,
  filesChanged: stats.filesChanged,
  joins: stats.joins,
  perVerb: stats.perVerb,
  errors: stats.errors,
}, null, 2), 'utf-8')

console.log(`\nDry run: ${DRY_RUN}`)
