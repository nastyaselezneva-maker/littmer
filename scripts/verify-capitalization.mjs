// Проверяет, что после точек/!/? новое предложение начинается с заглавной буквы.
// Проверяет и русский (склейка text полей), и норвежский (no fields + no.text) виды.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(process.cwd())
const CONTENT_DIR = path.join(ROOT, 'public', 'content')

function buildFullRu(segments) {
  let s = ''
  for (const seg of segments) {
    if (seg.type === 'ru') s += seg.text || ''
    else if (seg.type === 'no') s += seg.translation || ''
  }
  return s
}

function buildFullNo(segments) {
  let s = ''
  for (const seg of segments) {
    if (seg.type === 'ru') s += seg.no || ''
    else if (seg.type === 'no') s += seg.text || ''
  }
  return s
}

// Проверяет, что после точки/!/? + пробела(ов) идёт заглавная буква.
// Игнорирует случаи: числа (1. mai, 5.), сокращения (f.eks., и т.д.), кавычки и скобки.
function findViolations(text, lang) {
  const violations = []
  // Регэксп: завершающий знак, потом whitespace, потом первая буква
  const re = /([.!?…])(\s+)([^\s])/g
  let m
  while ((m = re.exec(text)) !== null) {
    const punctIdx = m.index
    const nextChar = m[3]
    const before = text.slice(Math.max(0, punctIdx - 10), punctIdx)
    const after = text.slice(punctIdx + m[0].length - 1, Math.min(text.length, punctIdx + m[0].length + 30))

    // Игнорируем если после точки идёт цифра или знак препинания
    if (/[0-9.,;:'"«»()\-—]/.test(nextChar)) continue
    // Игнорируем если перед точкой цифра (1. mai, 5.)
    if (/[0-9]/.test(text[punctIdx - 1])) continue
    // Игнорируем сокращения (короткое слово до точки)
    const wordBefore = (before.match(/\S+$/) || [''])[0]
    if (wordBefore.length <= 2 && /^[a-zæøåа-яё]+\.$/i.test(wordBefore + '.')) continue
    if (/^(f\.eks|т\.е|т\.п|т\.д|др|и т|p\.s|nr)$/i.test(wordBefore)) continue

    // Проверяем, что nextChar — буква
    if (!/[a-zæøåа-яё]/i.test(nextChar)) continue

    // Если первая буква НЕ в верхнем регистре — нарушение
    if (nextChar !== nextChar.toUpperCase() || nextChar === nextChar.toLowerCase()) {
      // Проверка: nextChar строчная (lowercase)
      if (nextChar.toLowerCase() === nextChar && nextChar.toUpperCase() !== nextChar) {
        violations.push({
          lang,
          context: text.slice(Math.max(0, punctIdx - 30), Math.min(text.length, punctIdx + 50)),
          position: punctIdx,
          firstLetter: nextChar,
        })
      }
    }
  }
  return violations
}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json')).sort()
const report = { filesChecked: 0, totalViolations: 0, byFile: [] }

for (const file of files) {
  const fp = path.join(CONTENT_DIR, file)
  let raw
  try {
    raw = JSON.parse(fs.readFileSync(fp, 'utf-8'))
  } catch (e) {
    console.error(`Cannot parse ${file}: ${e.message}`)
    continue
  }
  if (!Array.isArray(raw.segments)) continue
  report.filesChecked++

  const ru = buildFullRu(raw.segments)
  const no = buildFullNo(raw.segments)
  const violations = [...findViolations(ru, 'ru'), ...findViolations(no, 'no')]

  if (violations.length > 0) {
    report.totalViolations += violations.length
    report.byFile.push({ file, violations })
  }
}

console.log('=== CAPITALIZATION CHECK ===')
console.log(`Files checked: ${report.filesChecked}`)
console.log(`Total violations: ${report.totalViolations}`)
console.log(`Files with violations: ${report.byFile.length}`)
console.log()
for (const f of report.byFile.slice(0, 50)) {
  console.log(`\n${f.file} (${f.violations.length}):`)
  for (const v of f.violations.slice(0, 5)) {
    console.log(`  [${v.lang}] ...${v.context.replace(/\n/g, ' ')}...`)
  }
  if (f.violations.length > 5) console.log(`  ... and ${f.violations.length - 5} more`)
}

fs.writeFileSync(path.join(ROOT, 'scripts', '_capitalization_report.json'), JSON.stringify(report, null, 2))
console.log('\nWrote scripts/_capitalization_report.json')
