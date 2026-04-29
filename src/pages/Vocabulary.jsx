import { useState, useEffect, useMemo, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/topics'
import useDictionary from '../hooks/useDictionary'

const PAGE_SIZE = 100
const LEVELS = ['A2', 'B1', 'B2']

const POS_LABELS = {
  noun: 'Существительное',
  verb: 'Глагол',
  adj: 'Прилагательное',
  adv: 'Наречие',
  num: 'Числительное',
  pronoun: 'Местоимение',
  prep: 'Предлог',
  conj: 'Союз',
  interj: 'Междометие',
  phrase: 'Устойчивое выражение',
}

// Простая эвристика «когнат» — слова, которые узнаются русскоговорящему.
// Латинские буквы есть только норвежские, но многие интернационализмы созвучны.
const COGNATE_HINTS = [
  'bank', 'metro', 'doktor', 'profess', 'student', 'universit', 'apotek',
  'film', 'musikk', 'sport', 'parti', 'demokrat', 'politi', 'kafe',
  'restaurant', 'hotel', 'turist', 'idé', 'system', 'kultur', 'natur',
  'foto', 'tekst', 'metode', 'teori', 'praksis', 'energi', 'kalori',
  'rapport', 'argument', 'analyse', 'situasjon', 'oppera', 'klima',
  'kafe', 'pasient', 'helse', 'medisin', 'kirurg', 'terapi', 'pasient',
  'pizza', 'kaffe', 'okean', 'kontakt', 'ekspert', 'student',
]

function isCognate(word) {
  const w = word.toLowerCase()
  return COGNATE_HINTS.some((c) => w.includes(c))
}

// Эвристика — определение формы существительного по окончанию
function getNounForm(word) {
  const w = word.toLowerCase().replace(/[^a-zæøåäö]/gi, '')
  if (!w || w.length < 2) return ''
  if (w.endsWith('ene')) return 'flertall · bestemt'
  if (w.endsWith('er')) return 'flertall · ubestemt'
  if (w.endsWith('en') || w.endsWith('et')) return 'entall · bestemt'
  if (w.endsWith('a') && w.length > 3) return 'entall · bestemt'
  return 'entall · ubestemt'
}

// Известные неправильные глаголы
const VERB_IRREGULARS = {
  'er': 'presens', 'var': 'preteritum', 'vært': 'perfektum',
  'har': 'presens', 'hadde': 'preteritum', 'hatt': 'perfektum',
  'kommer': 'presens', 'kom': 'preteritum', 'kommet': 'perfektum',
  'går': 'presens', 'gikk': 'preteritum', 'gått': 'perfektum',
  'gjør': 'presens', 'gjorde': 'preteritum', 'gjort': 'perfektum',
  'blir': 'presens', 'ble': 'preteritum', 'blitt': 'perfektum',
  'får': 'presens', 'fikk': 'preteritum', 'fått': 'perfektum',
  'sier': 'presens', 'sa': 'preteritum', 'sagt': 'perfektum',
  'tar': 'presens', 'tok': 'preteritum', 'tatt': 'perfektum',
  'ser': 'presens', 'så': 'preteritum', 'sett': 'perfektum',
  'gir': 'presens', 'ga': 'preteritum', 'gitt': 'perfektum',
  'kan': 'presens', 'kunne': 'preteritum', 'kunnet': 'perfektum',
  'må': 'presens', 'måtte': 'preteritum', 'måttet': 'perfektum',
  'skal': 'presens', 'skulle': 'preteritum', 'skullet': 'perfektum',
  'vil': 'presens', 'ville': 'preteritum',
  'bør': 'presens', 'burde': 'preteritum',
  'spør': 'presens', 'spurte': 'preteritum', 'spurt': 'perfektum',
  'finner': 'presens', 'fant': 'preteritum', 'funnet': 'perfektum',
  'gjelder': 'presens', 'gjaldt': 'preteritum', 'gjeldt': 'perfektum',
  'velger': 'presens', 'valgte': 'preteritum', 'valgt': 'perfektum',
}

function getVerbForm(word) {
  const w = word.toLowerCase().replace(/[^a-zæøåäö]/gi, '')
  if (!w) return ''
  if (VERB_IRREGULARS[w]) return VERB_IRREGULARS[w]
  if (w.endsWith('dde') || w.endsWith('tte')) return 'preteritum'
  if (w.endsWith('de') || w.endsWith('te')) return 'preteritum'
  if (w.endsWith('et')) return 'preteritum/perfektum'
  if (w.endsWith('er')) return 'presens'
  if (w.endsWith('e')) return 'infinitiv'
  if (w.endsWith('t') || w.endsWith('dd')) return 'perfektum'
  if (w.endsWith('r')) return 'presens'
  return ''
}

function getForm(word, pos) {
  if (pos === 'noun') return getNounForm(word)
  if (pos === 'verb') return getVerbForm(word)
  return ''
}

function Vocabulary() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [posFilter, setPosFilter] = useState('all')
  const [sort, setSort] = useState('count')
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [expanded, setExpanded] = useState(null)
  const [savedOnly, setSavedOnly] = useState(false)
  const [cognatesOnly, setCognatesOnly] = useState(false)
  const { hasWord, words: savedWords } = useDictionary()

  useEffect(() => {
    setLoading(true)
    fetch('/vocabulary.json')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Множество сохранённых слов (по всем формам)
  const savedSet = useMemo(() => {
    const s = new Set()
    for (const w of savedWords) {
      s.add(w.text.toLowerCase())
    }
    return s
  }, [savedWords])

  function isSaved(word) {
    if (savedSet.has(word.word.toLowerCase())) return true
    return word.forms.some((f) => savedSet.has(f.toLowerCase()))
  }

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    return data.words.filter((w) => {
      if (savedOnly && !isSaved(w)) return false
      if (cognatesOnly && !isCognate(w.word)) return false
      if (levelFilter !== 'all' && w.levels[levelFilter] === 0) return false
      if (catFilter !== 'all' && !w.categories[catFilter]) return false
      if (posFilter !== 'all' && w.pos !== posFilter) return false
      if (q) {
        if (
          !w.word.toLowerCase().includes(q) &&
          !w.translation.toLowerCase().includes(q) &&
          !w.forms.some((f) => f.toLowerCase().includes(q))
        ) return false
      }
      return true
    })
  }, [data, search, levelFilter, catFilter, posFilter, savedOnly, cognatesOnly, savedSet])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'count') arr.sort((a, b) => b.count - a.count)
    else if (sort === 'rare') arr.sort((a, b) => a.count - b.count)
    else if (sort === 'alpha') arr.sort((a, b) => a.word.localeCompare(b.word))
    return arr
  }, [filtered, sort])

  // Покрытие словаря пользователя
  const savedCount = useMemo(() => {
    if (!data) return 0
    return data.words.filter(isSaved).length
  }, [data, savedSet])

  if (loading) {
    return <div className="vocab-loading">Загружаю словарь…</div>
  }
  if (!data) {
    return <div className="vocab-loading">Не удалось загрузить словарь</div>
  }

  const visible = sorted.slice(0, pageSize)
  const coveragePercent = data.totalUnique > 0 ? Math.round((savedCount / data.totalUnique) * 100) : 0

  return (
    <div className="vocab">
      <h1>Лексика</h1>
      <p className="vocab-subtitle">
        Все норвежские слова, которые встречаются в текстах LittMer.
        Изучай частотные, ищи примеры, отслеживай покрытие.
      </p>

      <div className="vocab-stats">
        <div className="vocab-stat">
          <span className="vocab-stat-num">{data.totalUnique}</span>
          <span className="vocab-stat-label">уникальных слов</span>
        </div>
        <div className="vocab-stat">
          <span className="vocab-stat-num">{data.totalOccurrences}</span>
          <span className="vocab-stat-label">всего вхождений</span>
        </div>
        <div className="vocab-stat">
          <span className="vocab-stat-num">{data.totalTexts}</span>
          <span className="vocab-stat-label">текстов</span>
        </div>
        <div className="vocab-stat">
          <span className="vocab-stat-num">{savedCount} <small>/ {data.totalUnique}</small></span>
          <span className="vocab-stat-label">в твоём словаре · {coveragePercent}%</span>
          <div className="vocab-coverage">
            <div className="vocab-coverage-bar" style={{ width: `${coveragePercent}%` }} />
          </div>
        </div>
      </div>

      <div className="vocab-filters">
        <input
          className="vocab-search"
          type="text"
          placeholder="Поиск по норвежскому или русскому..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPageSize(PAGE_SIZE) }}
        />
        <select className="vocab-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="all">Все уровни</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="vocab-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">Все категории</option>
          {Object.entries(categories).map(([k, c]) => (
            <option key={k} value={k}>{c.label}</option>
          ))}
        </select>
        <select className="vocab-select" value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
          <option value="all">Все части речи</option>
          {Object.entries(POS_LABELS).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
        <select className="vocab-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="count">Самые частые</option>
          <option value="rare">Самые редкие</option>
          <option value="alpha">По алфавиту</option>
        </select>
        <label className="vocab-checkbox">
          <input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
          Только в моём словаре
        </label>
        <label className="vocab-checkbox">
          <input type="checkbox" checked={cognatesOnly} onChange={(e) => setCognatesOnly(e.target.checked)} />
          Только когнаты
        </label>
      </div>

      <p className="vocab-count">
        Найдено: <strong>{sorted.length}</strong> {sorted.length !== data.totalUnique && `из ${data.totalUnique}`}
      </p>

      <table className="vocab-table">
        <thead>
          <tr>
            <th>Слово</th>
            <th>Перевод</th>
            {posFilter === 'all' && <th>Часть речи</th>}
            <th>Форма</th>
            <th>Раз</th>
            <th>Уровни</th>
            <th>Текстов</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((w) => {
            const saved = isSaved(w)
            const isOpen = expanded === w.word
            return (
              <Fragment key={w.word}>
                <tr className={saved ? 'vocab-row-saved' : ''}>
                  <td>
                    <span className="vocab-word">{w.word}</span>
                    {isCognate(w.word) && <span className="vocab-cognate" title="Похоже на русский">≈</span>}
                  </td>
                  <td className="vocab-translation">{w.translation}</td>
                  {posFilter === 'all' && <td className="vocab-pos">{POS_LABELS[w.pos] || ''}</td>}
                  <td className="vocab-form">{getForm(w.word, w.pos)}</td>
                  <td className="vocab-count-cell">{w.count}</td>
                  <td>
                    {LEVELS.map((l) => (
                      w.levels[l] > 0 && (
                        <span key={l} className="vocab-level-pill" data-level={l}>{l}</span>
                      )
                    ))}
                  </td>
                  <td>
                    <button
                      className="vocab-texts-btn"
                      onClick={() => setExpanded(isOpen ? null : w.word)}
                    >
                      {w.texts.length} {isOpen ? '▼' : '▸'}
                    </button>
                  </td>
                  <td>
                    {saved && <span className="vocab-saved-mark" title="В твоём словаре">✓</span>}
                  </td>
                </tr>
                {isOpen && (
                  <tr className="vocab-row-expanded">
                    <td colSpan={posFilter === 'all' ? 8 : 7}>
                      <div className="vocab-expanded">
                        <div className="vocab-forms">
                          <strong>Формы в текстах:</strong>{' '}
                          {w.forms.map((f) => <code key={f}>{f}</code>)}
                        </div>
                        <div className="vocab-text-list">
                          <strong>Встречается в:</strong>
                          <ul>
                            {w.texts.map((t) => (
                              <li key={t.id}>
                                <Link to={`/texts/${t.id}`}>
                                  <span className="vocab-level-pill" data-level={t.level}>{t.level}</span>
                                  {t.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      {pageSize < sorted.length && (
        <button className="vocab-more-btn" onClick={() => setPageSize(pageSize + PAGE_SIZE)}>
          Показать ещё {Math.min(PAGE_SIZE, sorted.length - pageSize)} слов
        </button>
      )}
    </div>
  )
}

export default Vocabulary
