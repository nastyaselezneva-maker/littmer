import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useDictionary from '../hooks/useDictionary'
import useSrs from '../hooks/useSrs'
import { speak, SHOW_AUDIO } from '../utils/speak'
import { plural, words as wordsForms } from '../utils/plural'

function Dictionary() {
  const { words, removeWord, clearAll } = useDictionary()
  const { recordReview, orderQueue, stats } = useSrs()
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'cards' ? 'cards' : 'list'
  const [mode, setMode] = useState(initialMode)
  const [search, setSearch] = useState('')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  function handleClearClick() {
    if (confirmClear) {
      clearAll()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  const query = search.toLowerCase().trim()
  const filteredWords = query
    ? words.filter((w) =>
        w.text.toLowerCase().includes(query) ||
        w.translation.toLowerCase().includes(query)
      )
    : words

  // SRS-очередь: просроченные → новые → будущие
  const queue = useMemo(() => orderQueue(words), [words, orderQueue])
  const safeIndex = queue.length > 0 ? cardIndex % queue.length : 0
  const currentEntry = queue[safeIndex]
  const currentWord = currentEntry?.word

  function nextCard() {
    setFlipped(false)
    setCardIndex((i) => (i + 1) % queue.length)
  }

  function handleReview(quality) {
    if (!currentWord) return
    recordReview(currentWord.text, quality)
    nextCard()
  }

  return (
    <div>
      <div className="dictionary-header">
        <h1>Мой словарь</h1>
        {words.length > 0 && (
          <div className="dictionary-modes">
            <button
              className={`mode-btn ${mode === 'list' ? 'active' : ''}`}
              onClick={() => setMode('list')}
            >
              Список
            </button>
            <button
              className={`mode-btn ${mode === 'cards' ? 'active' : ''}`}
              onClick={() => setMode('cards')}
            >
              Учить
            </button>
          </div>
        )}
      </div>

      {words.length === 0 ? (
        <p className="dictionary-empty">
          {mode === 'cards'
            ? 'Словарь пуст — учить пока нечего. Открой любой текст и нажми на норвежское слово, чтобы добавить его в словарь.'
            : 'Словарь пуст. Открой любой текст и нажми на норвежское слово, чтобы добавить его сюда.'}
        </p>
      ) : mode === 'list' ? (
        <>
          <div className="dictionary-toolbar">
            <input
              type="text"
              className="dictionary-search"
              placeholder="Поиск по словарю..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="dictionary-count">
              {query ? `${filteredWords.length} из ${words.length}` : `${words.length} ${plural(words.length, wordsForms)}`}
            </span>
            <button
              className={`dictionary-clear ${confirmClear ? 'dictionary-clear-confirm' : ''}`}
              onClick={handleClearClick}
            >
              {confirmClear ? 'Точно?' : 'Очистить словарь'}
            </button>
          </div>
          <div className="dictionary-list">
            {filteredWords.map((word) => (
              <div key={word.text} className="dictionary-card">
                {SHOW_AUDIO && (
                  <button
                    className="dictionary-speak"
                    onClick={() => speak(word.text)}
                    title="Произнести"
                  >
                    🔊
                  </button>
                )}
                <div className="dictionary-word">
                  <span className="dictionary-no">{word.text}</span>
                  <span className="dictionary-transcription">[{word.transcription}]</span>
                </div>
                <div className="dictionary-translation">{word.translation}</div>
                <button
                  className="dictionary-remove"
                  onClick={() => removeWord(word.text)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flashcard-area">
          <div className="srs-stats">
            <span className="srs-stat srs-stat-due"><b>{stats.due}</b> к повторению</span>
            <span className="srs-stat srs-stat-learning"><b>{stats.learning}</b> в процессе</span>
            <span className="srs-stat srs-stat-learned"><b>{stats.learned}</b> выучено</span>
          </div>

          <div
            className={`flashcard ${flipped ? 'flashcard-flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-front">
              {SHOW_AUDIO && (
                <button
                  className="flashcard-speak"
                  onClick={(e) => { e.stopPropagation(); speak(currentWord.text) }}
                  title="Произнести"
                >
                  🔊
                </button>
              )}
              <span className="flashcard-word">{currentWord.text}</span>
              <span className="flashcard-hint">Нажми, чтобы увидеть перевод</span>
            </div>
            <div className="flashcard-back">
              {SHOW_AUDIO && (
                <button
                  className="flashcard-speak"
                  onClick={(e) => { e.stopPropagation(); speak(currentWord.text) }}
                  title="Произнести"
                >
                  🔊
                </button>
              )}
              <span className="flashcard-word">{currentWord.text}</span>
              <span className="flashcard-transcription">[{currentWord.transcription}]</span>
              <span className="flashcard-translation">{currentWord.translation}</span>
            </div>
          </div>

          <div className="flashcard-controls">
            {flipped ? (
              <>
                <button className="flashcard-btn flashcard-btn-again" onClick={() => handleReview(0)}>
                  Снова
                </button>
                <button className="flashcard-btn flashcard-btn-good" onClick={() => handleReview(1)}>
                  Помню
                </button>
                <button className="flashcard-btn flashcard-btn-easy" onClick={() => handleReview(2)}>
                  Легко
                </button>
              </>
            ) : (
              <button className="flashcard-btn flashcard-btn-show" onClick={() => setFlipped(true)}>
                Показать ответ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dictionary
