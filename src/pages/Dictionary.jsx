import { useState } from 'react'
import useDictionary from '../hooks/useDictionary'

function Dictionary() {
  const { words, removeWord, clearAll } = useDictionary()
  const [mode, setMode] = useState('list') // 'list' или 'cards'
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

  function nextCard() {
    setFlipped(false)
    setCardIndex((i) => (i + 1) % words.length)
  }

  function prevCard() {
    setFlipped(false)
    setCardIndex((i) => (i - 1 + words.length) % words.length)
  }

  function shuffleCards() {
    setFlipped(false)
    setCardIndex(Math.floor(Math.random() * words.length))
  }

  // Если текущий индекс стал невалидным (удалили слово)
  const safeIndex = words.length > 0 ? cardIndex % words.length : 0
  const currentWord = words[safeIndex]

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
              Карточки
            </button>
          </div>
        )}
      </div>

      {words.length === 0 ? (
        <p className="dictionary-empty">
          Словарь пуст. Открой любой текст и нажми на норвежское слово, чтобы добавить его сюда.
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
              {query ? `${filteredWords.length} из ${words.length}` : `${words.length} слов`}
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
          <p className="flashcard-counter">{safeIndex + 1} из {words.length}</p>

          <div
            className={`flashcard ${flipped ? 'flashcard-flipped' : ''}`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="flashcard-front">
              <span className="flashcard-word">{currentWord.text}</span>
              <span className="flashcard-hint">Нажми, чтобы увидеть перевод</span>
            </div>
            <div className="flashcard-back">
              <span className="flashcard-word">{currentWord.text}</span>
              <span className="flashcard-transcription">[{currentWord.transcription}]</span>
              <span className="flashcard-translation">{currentWord.translation}</span>
            </div>
          </div>

          <div className="flashcard-controls">
            <button className="flashcard-btn" onClick={prevCard}>Назад</button>
            <button className="flashcard-btn" onClick={shuffleCards}>Случайное</button>
            <button className="flashcard-btn flashcard-btn-next" onClick={nextCard}>Далее</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dictionary
