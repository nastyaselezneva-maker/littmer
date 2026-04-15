import useDictionary from '../hooks/useDictionary'

function Dictionary() {
  const { words, removeWord } = useDictionary()

  return (
    <div>
      <h1>Мой словарь</h1>

      {words.length === 0 ? (
        <p className="dictionary-empty">
          Словарь пуст. Открой любой текст и нажми на норвежское слово, чтобы добавить его сюда.
        </p>
      ) : (
        <>
          <p className="dictionary-count">Слов: {words.length}</p>
          <div className="dictionary-list">
            {words.map((word) => (
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
      )}
    </div>
  )
}

export default Dictionary
