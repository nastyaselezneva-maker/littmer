import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import catalog from '../data/catalog'
import { getTopicLabel } from '../data/topics'
import WordTooltip from '../components/WordTooltip'
import DictionarySidebar from '../components/DictionarySidebar'
import useDictionary from '../hooks/useDictionary'
import useProgress from '../hooks/useProgress'
import { speak, stopSpeaking, getNorwegianVoices, getSelectedVoiceName, setSelectedVoice, SHOW_AUDIO } from '../utils/speak'

function Reader() {
  const { id } = useParams()
  const [text, setText] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addWord, hasWord, words } = useDictionary()
  const hasWords = words.length > 0
  const { markAsRead, isRead } = useProgress()
  const textIsRead = text ? isRead(id) : false
  const savedPercent = localStorage.getItem('norsk-percent')
  const [noPercent, setNoPercent] = useState(savedPercent ? Number(savedPercent) : 50)
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
    localStorage.setItem('norsk-percent', value)
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

  // Считаем сколько норвежских слов показывать
  // 0% = все на русском, 90% = все норвежские слова, 100% = весь текст на норвежском
  const noSegments = text.segments.filter((s) => s.type === "no")
  const noCount = noSegments.length
  const allWordsVisible = noPercent >= 90
  const showCount = allWordsVisible ? noCount : Math.round(noCount * noPercent / 90)

  // Равномерно распределяем норвежские слова по тексту
  const visibleSet = new Set()
  if (showCount > 0 && showCount < noCount) {
    const step = noCount / showCount
    for (let i = 0; i < showCount; i++) {
      visibleSet.add(Math.floor(i * step))
    }
  }

  let noIndex = 0

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
          {noPercent > 0 && noPercent < 90 && `${showCount} из ${noCount} слов`}
          {noPercent >= 90 && noPercent < 100 && `Все ${noCount} слов`}
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
          // Русский сегмент
          if (segment.type !== "no") {
            // При 100% показываем норвежский вариант фразы
            if (noPercent === 100 && segment.no) {
              return <span key={index} className="ru-as-no">{segment.no}</span>
            }
            return <span key={index}>{segment.text}</span>
          }

          // Норвежский сегмент
          const currentNoIndex = noIndex
          noIndex++

          // Определяем: показать как норвежское или как русский перевод
          const showAsNorwegian = showCount >= noCount || visibleSet.has(currentNoIndex)

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
