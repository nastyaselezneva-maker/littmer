import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import catalog from '../data/catalog'
import { getTopicLabel } from '../data/topics'
import WordTooltip from '../components/WordTooltip'
import DictionarySidebar from '../components/DictionarySidebar'
import useDictionary from '../hooks/useDictionary'
import useProgress from '../hooks/useProgress'
import { speak, stopSpeaking, getNorwegianVoices, getSelectedVoiceName, setSelectedVoice, SHOW_AUDIO } from '../utils/speak'

// Хэшируем id текста, чтобы получить детерминированное зерно
function hashId(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return h
}

// Mulberry32 — простой PRNG, возвращает функцию rand()
function makeRand(seed) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6D2B79F5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Возвращает массив индексов [0..n-1], перемешанный детерминированно
function seededShuffle(n, seed) {
  const arr = Array.from({ length: n }, (_, i) => i)
  const rand = makeRand(seed)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Разбиваем строку на токены (норвежские слова) + разделители (пунктуация, пробелы),
// возвращаем массив React-элементов: WordTooltip для слов с найденным переводом,
// иначе обычный span.
function tokenizeWithTooltips(text, lookup, addWord, hasWord) {
  if (!text) return null
  const parts = []
  const wordRegex = /[a-zæøåäöA-ZÆØÅÄÖ]+(?:-[a-zæøåäöA-ZÆØÅÄÖ]+)*/g
  let lastIndex = 0
  let match
  let k = 0
  while ((match = wordRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'sep', text: text.slice(lastIndex, match.index), k: k++ })
    }
    parts.push({ type: 'word', text: match[0], k: k++ })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'sep', text: text.slice(lastIndex), k: k++ })
  }

  return parts.map((p) => {
    if (p.type === 'sep') return <span key={p.k}>{p.text}</span>
    const entry = lookup[p.text.toLowerCase()]
    if (!entry) return <span key={p.k}>{p.text}</span>
    return (
      <WordTooltip
        key={p.k}
        text={p.text}
        translation={entry.tr}
        dict={entry.dict}
        transcription={entry.ts}
        pos={entry.pos}
        onAdd={addWord}
        isSaved={hasWord(p.text)}
      />
    )
  })
}

// Кеш lookup.json — грузим один раз
let lookupCache = null
let lookupPromise = null
function loadLookup() {
  if (lookupCache) return Promise.resolve(lookupCache)
  if (lookupPromise) return lookupPromise
  lookupPromise = fetch('/lookup.json')
    .then((r) => (r.ok ? r.json() : {}))
    .then((d) => { lookupCache = d; return d })
    .catch(() => ({}))
  return lookupPromise
}

function Reader() {
  const { id } = useParams()
  const [text, setText] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lookup, setLookup] = useState(lookupCache || {})
  const { addWord, hasWord, words } = useDictionary()
  const hasWords = words.length > 0
  const { markAsRead, isRead } = useProgress()
  const textIsRead = text ? isRead(id) : false
  const [noPercent, setNoPercent] = useState(50)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const sidebarVisible = hasWords && sidebarOpen
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState(getNorwegianVoices())
  const [selectedVoice, setSelectedVoiceState] = useState(getSelectedVoiceName())

  // Смещаем весь сайт влево, когда словарь открыт
  useEffect(() => {
    if (sidebarVisible) {
      document.body.classList.add('has-sidebar')
    } else {
      document.body.classList.remove('has-sidebar')
    }
    return () => document.body.classList.remove('has-sidebar')
  }, [sidebarVisible])

  // Загружаем текст по id
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setText(null)
    fetch(`/content/${id}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) {
          setText(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  // Останавливаем озвучку при уходе со страницы
  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  // Подгружаем словарь подсказок (lookup.json) для тултипов в связках
  useEffect(() => {
    loadLookup().then(setLookup)
  }, [])

  // Голоса в некоторых браузерах загружаются асинхронно
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    function loadVoices() {
      setVoices(getNorwegianVoices())
    }
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  function handleVoiceChange(name) {
    setSelectedVoiceState(name)
    setSelectedVoice(name)
  }

  // Стабильный случайный порядок ВСЕХ сегментов — двигая ползунок выше,
  // мы только добавляем сегменты в норвежский режим, не меняем уже видимые.
  const shuffleOrder = useMemo(() => {
    if (!text) return []
    return seededShuffle(text.segments.length, hashId(text.id))
  }, [text])

  // Подсчитываем количество слов в норвежском варианте каждого сегмента.
  const segmentNoWords = useMemo(() => {
    if (!text) return []
    return text.segments.map((seg) => {
      const noText = seg.type === 'no' ? (seg.text || '') : (seg.no || '')
      return noText.trim().split(/\s+/).filter(Boolean).length
    })
  }, [text])

  // Собираем полный норвежский текст из сегментов
  function getFullNorwegianText() {
    if (!text) return ''
    return text.segments
      .map((s) => (s.type === 'no' ? s.text : s.no || ''))
      .join('')
  }

  function handleSpeakText() {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
    } else {
      const fullText = getFullNorwegianText()
      speak(fullText, () => setIsSpeaking(false))
      setIsSpeaking(true)
    }
  }

  function handlePercentChange(value) {
    setNoPercent(value)
  }

  if (loading) {
    return (
      <div className="reader-loading">
        <p>Загружаю текст…</p>
      </div>
    )
  }

  if (!text) {
    return (
      <div>
        <h1>Текст не найден</h1>
        <Link to="/texts">Вернуться к списку</Link>
      </div>
    )
  }

  // Ищем соседние тексты в той же подтеме
  const textsInTopic = catalog.filter((t) => t.topic === text.topic)
  const currentIdx = textsInTopic.findIndex((t) => t.id === id)
  const prevText = currentIdx > 0 ? textsInTopic[currentIdx - 1] : null
  const nextText = currentIdx >= 0 && currentIdx < textsInTopic.length - 1
    ? textsInTopic[currentIdx + 1]
    : null

  // Линейная шкала по всем словам текста.
  // 0% — всё на русском, 100% — весь текст по-норвежски.
  // X% — примерно X% от всех норвежских слов уже показано.
  const totalNoWords = segmentNoWords.reduce((a, b) => a + b, 0)
  const targetNoWords = Math.round((totalNoWords * noPercent) / 100)

  // Идём по перемешанному порядку, накапливая слова, пока не достигнем цели.
  const visibleSet = new Set()
  let accumulated = 0
  for (const idx of shuffleOrder) {
    if (accumulated >= targetNoWords) break
    visibleSet.add(idx)
    accumulated += segmentNoWords[idx]
  }
  const visibleNoWords = accumulated

  return (
    <div className={`reader-layout ${sidebarVisible ? 'reader-layout-with-sidebar' : ''}`}>
      <div className="reader-main">
      <Link to="/texts" className="back-link">Назад к текстам</Link>

      <div className="reader-header">
        <span className="text-level" data-level={text.level}>{text.level}</span>
        <span className="text-topic">{getTopicLabel(text.topic)}</span>
      </div>

      <h1>{text.title}</h1>
      {text.titleNo && <p className="reader-title-no">{text.titleNo}</p>}

      <div className="reader-controls">
        <label className="control-label">
          Норвежский: <strong>{noPercent}%</strong>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={noPercent}
          onChange={(e) => handlePercentChange(Number(e.target.value))}
          className="percent-slider"
        />
        <span className="control-hint">
          {noPercent === 0 && "Полностью русский"}
          {noPercent > 0 && noPercent < 100 && `${visibleNoWords} из ${totalNoWords} слов`}
          {noPercent === 100 && "Полностью норвежский"}
        </span>
        {SHOW_AUDIO && (
          <>
            <button
              className={`speak-text-btn ${isSpeaking ? 'speak-text-btn-active' : ''}`}
              onClick={handleSpeakText}
              title={isSpeaking ? 'Остановить озвучку' : 'Озвучить весь текст'}
            >
              {isSpeaking ? '⏹ Стоп' : '🔊 Озвучить весь текст'}
            </button>
            {voices.length > 1 && (
              <select
                className="voice-select"
                value={selectedVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                title="Голос озвучки"
              >
                <option value="">Авто</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>

      <div className="reader-text">
        {text.segments.map((segment, index) => {
          const showAsNorwegian = visibleSet.has(index)

          // Русский сегмент
          if (segment.type !== "no") {
            if (showAsNorwegian && segment.no) {
              // Токенизируем — слова со словарной записью получают тултип, остальные — текстом
              return (
                <span key={index} className="ru-as-no">
                  {tokenizeWithTooltips(segment.no, lookup, addWord, hasWord)}
                </span>
              )
            }
            return <span key={index}>{segment.text}</span>
          }

          // Норвежский сегмент
          if (!showAsNorwegian) {
            return <span key={index}>{segment.translation}</span>
          }

          return (
            <WordTooltip
              key={index}
              text={segment.text}
              translation={segment.translation}
              dict={segment.dict}
              transcription={segment.transcription}
              pos={segment.pos}
              onAdd={addWord}
              isSaved={hasWord(segment.text)}
            />
          )
        })}
      </div>

      <div className="reader-footer">
        {prevText ? (
          <Link to={`/texts/${prevText.id}`} className="prev-btn">
            ← Назад: {prevText.title}
          </Link>
        ) : <span />}

        {textIsRead ? (
          <span className="read-done">Прочитано</span>
        ) : (
          <button className="read-btn" onClick={() => markAsRead(id)}>
            Отметить как прочитанное
          </button>
        )}

        {nextText ? (
          <Link to={`/texts/${nextText.id}`} className="next-btn">
            Дальше: {nextText.title} →
          </Link>
        ) : <span />}
      </div>
      </div>
      <DictionarySidebar isOpen={sidebarVisible} onClose={() => setSidebarOpen(false)} />
      {hasWords && !sidebarOpen && (
        <button
          className="dict-open-btn"
          onClick={() => setSidebarOpen(true)}
          title="Открыть словарь"
        >
          📖 {words.length}
        </button>
      )}
    </div>
  )
}

export default Reader
