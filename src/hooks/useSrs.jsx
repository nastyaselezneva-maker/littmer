import { useState, useCallback, useMemo } from 'react'

const SRS_KEY = 'norsk-srs:v1'
const DAY_MS = 86400000

function loadSrs() {
  try {
    const raw = localStorage.getItem(SRS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveSrs(state) {
  try {
    localStorage.setItem(SRS_KEY, JSON.stringify(state))
  } catch {}
}

const DEFAULT = { ease: 2.5, interval: 0, due: 0, reps: 0, lastReviewed: 0 }

export default function useSrs() {
  const [srs, setSrs] = useState(loadSrs)

  const getSrs = useCallback((text) => srs[text] || DEFAULT, [srs])

  const recordReview = useCallback((text, quality) => {
    // quality: 0=again, 1=good, 2=easy
    const s = srs[text] || DEFAULT
    let { ease, interval, reps } = s
    if (quality === 0) {
      interval = 1
      ease = Math.max(1.3, ease - 0.2)
      reps = 0
    } else if (quality === 1) {
      reps += 1
      if (reps === 1) interval = 1
      else if (reps === 2) interval = 3
      else interval = Math.round(interval * ease)
    } else if (quality === 2) {
      reps += 1
      ease = Math.min(3.0, ease + 0.15)
      if (reps === 1) interval = 3
      else if (reps === 2) interval = 7
      else interval = Math.round(interval * ease * 1.3)
    }
    const now = Date.now()
    const due = now + interval * DAY_MS
    const newState = { ease, interval, due, reps, lastReviewed: now }
    const next = { ...srs, [text]: newState }
    setSrs(next)
    saveSrs(next)
  }, [srs])

  // Возвращает массив слов, отсортированных по приоритету:
  // 1. Просроченные (due ≤ now) — сначала те, что давно ждут
  // 2. Новые (reps == 0)
  // 3. Будущие — в порядке due
  const orderQueue = useCallback((words) => {
    const now = Date.now()
    const enriched = words.map((w) => {
      const s = srs[w.text] || DEFAULT
      const isNew = s.reps === 0 && s.lastReviewed === 0
      const isDue = !isNew && s.due <= now
      return { word: w, srs: s, isNew, isDue }
    })
    enriched.sort((a, b) => {
      // Просроченные карточки идут первыми (давно ждут)
      if (a.isDue && !b.isDue) return -1
      if (!a.isDue && b.isDue) return 1
      if (a.isDue && b.isDue) return a.srs.due - b.srs.due
      // Новые после просроченных
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      // Остальные — по due ascending
      return a.srs.due - b.srs.due
    })
    return enriched
  }, [srs])

  const stats = useMemo(() => {
    const now = Date.now()
    let learning = 0, due = 0, learned = 0
    for (const text in srs) {
      const s = srs[text]
      if (s.reps === 0) continue
      if (s.due <= now) due += 1
      else if (s.interval >= 21) learned += 1
      else learning += 1
    }
    return { learning, due, learned }
  }, [srs])

  return { getSrs, recordReview, orderQueue, stats }
}
