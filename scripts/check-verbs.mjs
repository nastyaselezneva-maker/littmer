// Norwegian verb form checker for all content files
// Checks for: wrong conjugation forms, modal+conjugated, infinitive used as finite, etc.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const contentDir = path.resolve(root, 'public', 'content')

// ──────────────────────────────────────────────────────────────────────────────
// KNOWN IRREGULAR VERBS: { infinitive: { presens, preterit, perfektPartisipp } }
// ──────────────────────────────────────────────────────────────────────────────
const IRREG = {
  være:    { presens: ['er'],               preterit: ['var'],             perf: ['vært'] },
  ha:      { presens: ['har'],              preterit: ['hadde'],           perf: ['hatt'] },
  gjøre:   { presens: ['gjør'],             preterit: ['gjorde'],          perf: ['gjort'] },
  si:      { presens: ['sier'],             preterit: ['sa'],              perf: ['sagt'] },
  se:      { presens: ['ser'],              preterit: ['så'],              perf: ['sett'] },
  ta:      { presens: ['tar'],              preterit: ['tok'],             perf: ['tatt'] },
  få:      { presens: ['får'],              preterit: ['fikk'],            perf: ['fått'] },
  gi:      { presens: ['gir'],              preterit: ['ga', 'gav'],       perf: ['gitt'] },
  gå:      { presens: ['går'],              preterit: ['gikk'],            perf: ['gått'] },
  bli:     { presens: ['blir'],             preterit: ['ble', 'ble'],      perf: ['blitt'] },
  komme:   { presens: ['kommer'],           preterit: ['kom'],             perf: ['kommet'] },
  stå:     { presens: ['står'],             preterit: ['sto', 'stod'],     perf: ['stått'] },
  ligge:   { presens: ['ligger'],           preterit: ['lå'],              perf: ['ligget'] },
  sitte:   { presens: ['sitter'],           preterit: ['satt'],            perf: ['sittet'] },
  vite:    { presens: ['vet'],              preterit: ['visste'],          perf: ['visst'] },
  kunne:   { presens: ['kan'],              preterit: ['kunne'],           perf: ['kunnet'] },
  skulle:  { presens: ['skal'],             preterit: ['skulle'],          perf: ['skullet'] },
  ville:   { presens: ['vil'],              preterit: ['ville'],           perf: ['villet'] },
  måtte:   { presens: ['må'],               preterit: ['måtte'],           perf: ['måttet'] },
  burde:   { presens: ['bør'],              preterit: ['burde'],           perf: ['burdet'] },
  finne:   { presens: ['finner'],           preterit: ['fant'],            perf: ['funnet'] },
  spørre:  { presens: ['spør'],             preterit: ['spurte'],          perf: ['spurt'] },
  velge:   { presens: ['velger'],           preterit: ['valgte'],          perf: ['valgt'] },
  selge:   { presens: ['selger'],           preterit: ['solgte'],          perf: ['solgt'] },
  drikke:  { presens: ['drikker'],          preterit: ['drakk'],           perf: ['drukket'] },
  skrive:  { presens: ['skriver'],          preterit: ['skrev'],           perf: ['skrevet'] },
  forstå:  { presens: ['forstår'],          preterit: ['forstod', 'forsto'], perf: ['forstått'] },
  hjelpe:  { presens: ['hjelper'],          preterit: ['hjalp'],           perf: ['hjulpet'] },
  legge:   { presens: ['legger'],           preterit: ['la'],              perf: ['lagt'] },
  sette:   { presens: ['setter'],           preterit: ['satte'],           perf: ['satt'] },
  skje:    { presens: ['skjer'],            preterit: ['skjedde'],         perf: ['skjedd'] },
  treffe:  { presens: ['treffer'],          preterit: ['traff'],           perf: ['truffet'] },
  drive:   { presens: ['driver'],           preterit: ['drev', 'dreiv'],   perf: ['drevet'] },
  fly:     { presens: ['flyr'],             preterit: ['fløy'],            perf: ['fløyet'] },
  dra:     { presens: ['drar'],             preterit: ['dro', 'drog'],     perf: ['dratt'] },
  bære:    { presens: ['bærer'],            preterit: ['bar'],             perf: ['båret'] },
  bryte:   { presens: ['bryter'],           preterit: ['brøt'],            perf: ['brutt'] },
  falle:   { presens: ['faller'],           preterit: ['falt'],            perf: ['falt'] },
  slå:     { presens: ['slår'],             preterit: ['slo'],             perf: ['slått'] },
  gyte:    { presens: ['gyter'],            preterit: ['gytte'],           perf: ['gytt'] },
  be:      { presens: ['ber'],              preterit: ['ba', 'bad'],       perf: ['bedt', 'bedt'] },
  dø:      { presens: ['dør'],              preterit: ['døde'],            perf: ['dødd'] },
  tro:     { presens: ['tror'],             preterit: ['trodde'],          perf: ['trodd'] },
  bo:      { presens: ['bor'],              preterit: ['bodde'],           perf: ['bodd'] },
  le:      { presens: ['ler'],              preterit: ['lo'],              perf: ['ledd'] },
  leve:    { presens: ['lever'],            preterit: ['levde'],           perf: ['levd'] },
  gripe:   { presens: ['griper'],           preterit: ['grep'],            perf: ['grepet'] },
  bite:    { presens: ['biter'],            preterit: ['bet'],             perf: ['bitt'] },
  skyte:   { presens: ['skyter'],           preterit: ['skjøt'],           perf: ['skutt'] },
  ta:      { presens: ['tar'],              preterit: ['tok'],             perf: ['tatt'] },
  fortelle: { presens: ['forteller'],       preterit: ['fortalte'],        perf: ['fortalt'] },
  tilby:   { presens: ['tilbyr'],           preterit: ['tilbød'],          perf: ['tilbudt'] },
  sende:   { presens: ['sender'],           preterit: ['sendte'],          perf: ['sendt'] },
  kjenne:  { presens: ['kjenner'],          preterit: ['kjente'],          perf: ['kjent'] },
  prøve:   { presens: ['prøver'],           preterit: ['prøvde'],          perf: ['prøvd'] },
}

// Build reverse maps: conjugated_form → { inf, tense }
const PRESENS_TO_INF = {}  // e.g. "er" → "være"
const PRETERIT_TO_INF = {} // e.g. "var" → "være"
const PERF_TO_INF = {}     // e.g. "vært" → "være"

for (const [inf, forms] of Object.entries(IRREG)) {
  for (const f of forms.presens)  { if (f) PRESENS_TO_INF[f]  = inf }
  for (const f of forms.preterit) { if (f) PRETERIT_TO_INF[f] = inf }
  for (const f of forms.perf)     { if (f) PERF_TO_INF[f]     = inf }
}

// Modal verbs (presens forms that take infinitive after them)
const MODALS = new Set(['kan','skal','vil','må','bør','tør','orker','klarer','greier'])
// Auxiliary that takes perfektpartisipp
const AUX_PERF = new Set(['har','hadde'])
// Auxiliary "å" — takes infinitive
const AUX_AA = 'å'

// ──────────────────────────────────────────────────────────────────────────────
// Detect a regular Norwegian finite presens: verb-stem + er/r
// Returns the verb if it looks like a present-tense form of a regular verb
// ──────────────────────────────────────────────────────────────────────────────
function looksLikeRegularPresens(word) {
  // ends in -er (most regular verbs) or just -r (some short verbs)
  return /^[a-zæøå]{2,}er$/i.test(word) || /^[a-zæøå]{3,}r$/i.test(word)
}

// Detect an infinitive: ends in -e, or is a known short irregular inf
const SHORT_INF = new Set(['gå','se','ta','få','ha','bli','gi','slå','be','dø','bo','tro','si','le','dra','fly','snø','ses','fås','tas'])
function looksLikeInfinitive(word) {
  if (SHORT_INF.has(word.toLowerCase())) return true
  return /^[a-zæøå]{2,}e$/i.test(word)
}

// ──────────────────────────────────────────────────────────────────────────────
// Errors we detect
// ──────────────────────────────────────────────────────────────────────────────
const errors = []

// ──────────────────────────────────────────────────────────────────────────────
// Check a single Norwegian sentence (sequence of tokens)
// ──────────────────────────────────────────────────────────────────────────────
function checkSentence(tokens, fileId, segmentInfo) {
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i].toLowerCase()
    const tokRaw = tokens[i]

    // ── Pattern 1: Modal + conjugated verb (modal + presens form)
    if (MODALS.has(tok) && i + 1 < tokens.length) {
      const next = tokens[i + 1].toLowerCase()
      // After modal, expect infinitive — flag if presens-looking (e.g. "snakker")
      if (looksLikeRegularPresens(next) && !MODALS.has(next)) {
        errors.push({
          type: 'modal+presens',
          file: fileId,
          context: tokens.slice(Math.max(0, i-2), i+4).join(' '),
          problem: `«${tokRaw} ${tokens[i+1]}» — after modal «${tokRaw}» expect infinitive, got presens-form «${tokens[i+1]}»`,
          segment: segmentInfo,
        })
      }
      // Flag if "skal/kan/vil/etc. er/var/tok" (modal + irregular finite)
      if (PRESENS_TO_INF[next] && next !== 'er' /* er can be adj predicate */ && !['er'].includes(next)) {
        // only if it's clearly a verb form, not "kan er" (edge case)
        errors.push({
          type: 'modal+finite_irreg',
          file: fileId,
          context: tokens.slice(Math.max(0, i-2), i+4).join(' '),
          problem: `«${tokRaw} ${tokens[i+1]}» — modal followed by irregular finite form «${tokens[i+1]}» (inf: ${PRESENS_TO_INF[next]})`,
          segment: segmentInfo,
        })
      }
    }

    // ── Pattern 2: har/hadde + non-perfektpartisipp (e.g. "har snakker" or "har snakke")
    if (AUX_PERF.has(tok) && i + 1 < tokens.length) {
      const next = tokens[i + 1].toLowerCase()
      // If next is presens-form (ends in -er), probably wrong: "har snakker"
      if (looksLikeRegularPresens(next) && !PERF_TO_INF[next] && !PRESENS_TO_INF[next]) {
        // Could be "har penger" (noun), so be conservative — only flag if it's a known-verb presens
        // We can't reliably detect this without a full lexicon; skip for now
      }
      // If next is infinitive (ends in -e but NOT -et/-t), might be wrong: "har snakke"
      if (looksLikeInfinitive(next) && !PERF_TO_INF[next]) {
        // "har å gjøre" is a set phrase — skip
        if (next !== 'å') {
          errors.push({
            type: 'har+infinitive',
            file: fileId,
            context: tokens.slice(Math.max(0, i-2), i+4).join(' '),
            problem: `«${tokRaw} ${tokens[i+1]}» — «${tokRaw}» followed by infinitive «${tokens[i+1]}» instead of perfektpartisipp`,
            segment: segmentInfo,
          })
        }
      }
    }

    // ── Pattern 3: "å" + conjugated form (å snakker instead of å snakke)
    if (tok === 'å' && i + 1 < tokens.length) {
      const next = tokens[i + 1].toLowerCase()
      if (looksLikeRegularPresens(next)) {
        errors.push({
          type: 'å+presens',
          file: fileId,
          context: tokens.slice(Math.max(0, i-2), i+4).join(' '),
          problem: `«å ${tokens[i+1]}» — after «å» expect infinitive, got presens-form «${tokens[i+1]}»`,
          segment: segmentInfo,
        })
      }
      // å + known irregular presens
      if (PRESENS_TO_INF[next]) {
        errors.push({
          type: 'å+finite_irreg',
          file: fileId,
          context: tokens.slice(Math.max(0, i-2), i+4).join(' '),
          problem: `«å ${tokens[i+1]}» — after «å» expect infinitive, got finite form «${tokens[i+1]}» (inf: ${PRESENS_TO_INF[next]})`,
          segment: segmentInfo,
        })
      }
    }

    // ── Pattern 4: known wrong preterit forms — check specific common mistakes
    // "tok" is preterit of "ta", check it's not used where presens expected
    // This requires syntactic context we can't reliably get from tokens alone
    // Focus on clear morphological errors

    // ── Pattern 5: "er blitt" vs "har blitt" — both OK in Norwegian
    // ── Pattern 6: perfektpartisipp used as presens without aux
    // e.g. bare "snakket" as a main verb in presens context
    // Too hard to detect without syntax tree — skip

    // ── Pattern 7: Check for common typos in irregular verbs
    const knownWrong = {
      'snakkat': 'snakket',   // wrong participle
      'snakket': null,         // correct
      'kommet': null,          // correct
      'kommt': 'kommet',       // typo
      'blitt': null,           // correct
      'gåt': 'gått',
      'sett': null,
      'tatt': null,
      'fått': null,
      'gitt': null,
      'sagt': null,
      'gjort': null,
      'vært': null,
      'hatt': null,
      'kunnet': null,
      'skullet': null,
      'villet': null,
      'måttet': null,
      'funnet': null,
      'forstått': null,
      'drukket': null,
      'drakket': 'drakk',      // preterit used as participle
      'gikket': 'gått',        // wrong participle of gå
    }
    if (knownWrong[tok] !== undefined && knownWrong[tok] !== null) {
      errors.push({
        type: 'wrong_form',
        file: fileId,
        context: tokens.slice(Math.max(0, i-2), i+4).join(' '),
        problem: `«${tokRaw}» → should be «${knownWrong[tok]}»`,
        segment: segmentInfo,
      })
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Extract full Norwegian text from a file's segments
// ──────────────────────────────────────────────────────────────────────────────
function extractNorwegianText(segments) {
  // Returns array of { text, segIndex, segType }
  const parts = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (seg.type === 'ru' && seg.no) {
      parts.push({ text: seg.no, segIndex: i, segType: 'ru.no' })
    } else if (seg.type === 'no' && seg.text) {
      parts.push({ text: seg.text, segIndex: i, segType: 'no.text' })
    }
  }
  return parts
}

// Tokenize Norwegian text
function tokenize(text) {
  return text
    .replace(/[.,!?;:«»"()\[\]]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0)
}

// ──────────────────────────────────────────────────────────────────────────────
// Process one file
// ──────────────────────────────────────────────────────────────────────────────
function processFile(filePath) {
  const fileId = path.basename(filePath, '.json')
  let json
  try {
    json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (e) {
    errors.push({ type: 'parse_error', file: fileId, problem: e.message, segment: null })
    return
  }
  if (!Array.isArray(json.segments)) return

  // Build full sentence from all Norwegian parts concatenated
  const parts = extractNorwegianText(json.segments)
  const fullText = parts.map(p => p.text).join(' ')
  const tokens = tokenize(fullText)

  checkSentence(tokens, fileId, 'full_text')
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────
const files = fs.readdirSync(contentDir)
  .filter(f => f.endsWith('.json'))
  .map(f => path.join(contentDir, f))

console.log(`Scanning ${files.length} files...`)
for (const f of files) processFile(f)

console.log(`\nFound ${errors.length} potential issues.\n`)

// Group by type
const byType = {}
for (const e of errors) {
  if (!byType[e.type]) byType[e.type] = []
  byType[e.type].push(e)
}

for (const [type, list] of Object.entries(byType)) {
  console.log(`\n═══ ${type.toUpperCase()} (${list.length}) ═══`)
  for (const e of list) {
    console.log(`  [${e.file}] ${e.problem}`)
    console.log(`    context: "${e.context}"`)
  }
}

// Save report
const reportPath = path.resolve(__dirname, '_verb_check_report.json')
fs.writeFileSync(reportPath, JSON.stringify(errors, null, 2), 'utf-8')
console.log(`\nReport saved to: ${reportPath}`)
