// Verification pass: check phrase tagging across all content files.
// Outputs:
//  - Missing phrases: phrase in PHRASES.json appears in full Norwegian string but is not a single phrase segment
//  - Extra phrase segments: phrase-tagged segments whose text is NOT in PHRASES.json (potential errors)
//  - Suspicious long phrase segments: >4 words

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const CONTENT_DIR = path.join(ROOT, 'public', 'content');
const PHRASES_FILE = path.join(ROOT, 'scripts', 'PHRASES.json');

const phrasesData = JSON.parse(fs.readFileSync(PHRASES_FILE, 'utf-8'));
const ALL_PHRASES = [
  ...phrasesData.discourse_markers,
  ...phrasesData.verb_preposition,
];
// sort longest first to avoid partial matches
ALL_PHRASES.sort((a, b) => b.length - a.length);

function buildFullNo(segments) {
  // Build full Norwegian sentence from ru.no + no.text
  let s = '';
  for (const seg of segments) {
    if (seg.type === 'ru') s += seg.no || '';
    else if (seg.type === 'no') s += seg.text || '';
  }
  return s;
}

function getPhraseSegments(segments) {
  return segments
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.type === 'no' && s.pos === 'phrase');
}

// Word boundary check (norwegian-aware: letters incl å,ø,æ)
const NORW_LETTERS = "a-zA-ZæøåÆØÅ";
function findAllOccurrences(haystack, needle) {
  const results = [];
  const re = new RegExp(`(?<![${NORW_LETTERS}])${escapeRegex(needle)}(?![${NORW_LETTERS}])`, 'gi');
  let m;
  while ((m = re.exec(haystack)) !== null) {
    results.push({ index: m.index, match: m[0] });
  }
  return results;
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json')).sort();

const report = {
  filesChecked: 0,
  missingPhrases: [], // { file, phrase, fullNo }
  extraPhraseSegments: [], // { file, segText, translation }
  longPhraseSegments: [], // { file, segText, wordCount }
};

for (const file of files) {
  const fp = path.join(CONTENT_DIR, file);
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch (e) {
    console.error(`Cannot parse ${file}: ${e.message}`);
    continue;
  }
  if (!Array.isArray(raw.segments)) continue;
  report.filesChecked++;

  const fullNo = buildFullNo(raw.segments);
  const phraseSegs = getPhraseSegments(raw.segments);
  const phraseSegTexts = phraseSegs.map(({ s }) => (s.text || '').trim().toLowerCase());

  // 1. Missing phrases — но избегаем ложных совпадений:
  //    "i tillegg" внутри "i tillegg til" не считается отдельным вхождением.
  //    Маркируем позиции, занятые: (а) уже помеченными phrase сегментами,
  //    (б) более длинными каноническими фразами, чьи вхождения мы уже учли.
  const consumed = new Uint8Array(fullNo.length);
  // (а) Помеченные phrase сегменты
  for (const { s } of phraseSegs) {
    const ph = (s.text || '').trim();
    if (!ph) continue;
    const occ = findAllOccurrences(fullNo, ph);
    for (const o of occ) {
      for (let i = o.index; i < o.index + o.match.length; i++) consumed[i] = 1;
    }
  }
  // ALL_PHRASES уже отсортированы по убыванию длины (longest first)
  for (const ph of ALL_PHRASES) {
    const occ = findAllOccurrences(fullNo, ph);
    if (occ.length === 0) continue;
    // Реальные вхождения — не пересекающиеся с уже занятыми позициями
    const realOcc = occ.filter((o) => {
      for (let i = o.index; i < o.index + o.match.length; i++) {
        if (consumed[i]) return false;
      }
      return true;
    });
    const tagged = phraseSegTexts.filter((t) => t === ph.toLowerCase()).length;
    if (realOcc.length > 0 && tagged < realOcc.length) {
      report.missingPhrases.push({
        file,
        phrase: ph,
        occurrences: realOcc.length,
        tagged,
      });
    }
    // Помечаем реальные вхождения как занятые, чтобы более короткие
    // канонические фразы не флажились внутри них
    for (const o of realOcc) {
      for (let i = o.index; i < o.index + o.match.length; i++) consumed[i] = 1;
    }
  }

  // 2. Extra phrase segments (not in PHRASES.json)
  const phrasesLowerSet = new Set(ALL_PHRASES.map((p) => p.toLowerCase()));
  for (const { s, i } of phraseSegs) {
    const t = (s.text || '').trim().toLowerCase();
    if (!phrasesLowerSet.has(t)) {
      report.extraPhraseSegments.push({
        file,
        segIndex: i,
        text: s.text,
        translation: s.translation,
        transcription: s.transcription,
      });
    }
    // 3. Long phrase
    const wc = (s.text || '').trim().split(/\s+/).length;
    if (wc > 4) {
      report.longPhraseSegments.push({
        file,
        segIndex: i,
        text: s.text,
        translation: s.translation,
        wordCount: wc,
        inPhrasesJson: phrasesLowerSet.has(t),
      });
    }
  }
}

// Print report
console.log('=== VERIFY PHRASES REPORT ===');
console.log(`Files checked: ${report.filesChecked}`);
console.log(`\n--- Missing phrases (in text but not tagged): ${report.missingPhrases.length} ---`);
for (const m of report.missingPhrases) {
  console.log(`  ${m.file}: "${m.phrase}" occurs ${m.occurrences}x, tagged ${m.tagged}x`);
}
console.log(`\n--- Extra phrase segments (not in PHRASES.json): ${report.extraPhraseSegments.length} ---`);
const grouped = new Map();
for (const e of report.extraPhraseSegments) {
  const k = e.text;
  if (!grouped.has(k)) grouped.set(k, []);
  grouped.get(k).push(e);
}
const sortedGroups = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [text, occs] of sortedGroups) {
  console.log(`  "${text}" (${occs[0].translation}) — ${occs.length}x in: ${occs.slice(0, 3).map((o) => o.file).join(', ')}${occs.length > 3 ? ', ...' : ''}`);
}
console.log(`\n--- Long phrase segments (>4 words): ${report.longPhraseSegments.length} ---`);
for (const l of report.longPhraseSegments) {
  console.log(`  ${l.file}[${l.segIndex}]: "${l.text}" (${l.wordCount} words) inPHRASES=${l.inPhrasesJson}`);
}

// Write JSON report for further automated processing
fs.writeFileSync(path.join(ROOT, 'scripts', '_phrase_verify_report.json'), JSON.stringify(report, null, 2));
console.log('\nWrote scripts/_phrase_verify_report.json');
