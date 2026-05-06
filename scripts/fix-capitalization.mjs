// Авто-фикс капитализации первой буквы предложения после ./!/?/…
// Обрабатывает и русский, и норвежский раздельно.

import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'public', 'content')
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json')).sort()

let totalFixedRu = 0
let totalFixedNo = 0
let filesChanged = 0

const SENTENCE_END = /[.!?…]/
const LETTER = /[a-zæøåäöéè а-яёА-ЯЁ]/i

function isLowercaseLetter(c) {
  if (!c || !/[a-zæøåäöéèа-яё]/i.test(c)) return false
  return c.toLowerCase() === c && c.toUpperCase() !== c
}

function getFirstLetterIdx(s) {
  // returns index of first non-whitespace char, -1 if none
  for (let i = 0; i < s.length; i++) {
    if (!/\s/.test(s[i])) return i
  }
  return -1
}

function getLastNonSpace(s) {
  for (let i = s.length - 1; i >= 0; i--) {
    if (!/\s/.test(s[i])) return s[i]
  }
  return ''
}

// Игнорируем сокращения и числа, чтобы не «капить» после "1. " или "f.eks."
function shouldTriggerCap(textBeforePunct) {
  const wordBefore = (textBeforePunct.match(/\S+$/) || [''])[0]
  // Цифра перед точкой (1., 2., 5.) — не конец предложения
  if (/^\d+\.?$/.test(wordBefore)) return false
  // Сокращения: f.eks., т.д., т.е., т.п., п.с., и т.
  if (/^(f\.eks|t\.d|т\.е|т\.д|т\.п|p\.s|nr|и т)$/i.test(wordBefore.replace(/\.$/, ''))) return false
  return true
}

for (const file of files) {
  const fp = path.join(CONTENT_DIR, file)
  const data = JSON.parse(fs.readFileSync(fp, 'utf-8'))
  if (!Array.isArray(data.segments)) continue
  let changed = false

  // Track running text accumulators for RU and NO so we can check sentence boundaries
  let ruAccum = ''
  let noAccum = ''

  for (const seg of data.segments) {
    let ruField, noField, ruKey, noKey
    if (seg.type === 'ru') {
      ruField = seg.text || ''; noField = seg.no || ''
      ruKey = 'text'; noKey = 'no'
    } else if (seg.type === 'no') {
      ruField = seg.translation || ''; noField = seg.text || ''
      ruKey = 'translation'; noKey = 'text'
    } else continue

    // --- RU check ---
    if (ruField.length > 0) {
      const idx = getFirstLetterIdx(ruField)
      if (idx >= 0) {
        // Что было в RU аккумуляторе перед добавлением этого сегмента?
        const prevEnd = ruAccum.replace(/\s+$/, '')
        const lastChar = prevEnd.slice(-1)
        if (SENTENCE_END.test(lastChar) && shouldTriggerCap(prevEnd.slice(0, -1))) {
          const firstChar = ruField[idx]
          if (isLowercaseLetter(firstChar)) {
            const newText = ruField.slice(0, idx) + firstChar.toUpperCase() + ruField.slice(idx + 1)
            seg[ruKey] = newText
            ruField = newText
            totalFixedRu++
            changed = true
          }
        }
      }
    }

    // --- NO check ---
    if (noField.length > 0) {
      const idx = getFirstLetterIdx(noField)
      if (idx >= 0) {
        const prevEnd = noAccum.replace(/\s+$/, '')
        const lastChar = prevEnd.slice(-1)
        if (SENTENCE_END.test(lastChar) && shouldTriggerCap(prevEnd.slice(0, -1))) {
          const firstChar = noField[idx]
          if (isLowercaseLetter(firstChar)) {
            const newText = noField.slice(0, idx) + firstChar.toUpperCase() + noField.slice(idx + 1)
            seg[noKey] = newText
            noField = newText
            totalFixedNo++
            changed = true
          }
        }
      }
    }

    ruAccum += ruField
    noAccum += noField
  }

  if (changed) {
    fs.writeFileSync(fp, JSON.stringify(data))
    filesChanged++
  }
}

console.log(`Fixed: RU ${totalFixedRu}, NO ${totalFixedNo} (${filesChanged} files changed)`)
