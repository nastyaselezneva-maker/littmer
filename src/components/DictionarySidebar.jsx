import { Link } from 'react-router-dom'
import useDictionary from '../hooks/useDictionary'
import { speak, SHOW_AUDIO } from '../utils/speak'

function DictionarySidebar({ isOpen, onClose }) {
  const { words, removeWord } = useDictionary()

  if (words.length === 0 || !isOpen) return null

  return (
    <aside className="dict-sidebar">
      <div className="dict-sidebar-header">
        <h3>Словарь</h3>
        <span className="dict-sidebar-count">{words.length}</span>
        <button
          className="dict-sidebar-close"
          onClick={onClose}
          title="Закрыть словарь"
        >
          ×
        </button>
      </div>
      <div className="dict-sidebar-list">
        {words.map((word) => (
          <div key={word.text} className="dict-sidebar-item">
            <div className="dict-sidebar-text">
              <span className="dict-sidebar-no">{word.text}</span>
              <span className="dict-sidebar-translation">{word.translation}</span>
            </div>
            {SHOW_AUDIO && (
              <button
                className="dict-sidebar-speak"
                onClick={() => speak(word.text)}
                title="Произнести"
              >
                🔊
              </button>
            )}
            <button
              className="dict-sidebar-remove"
              onClick={() => removeWord(word.text)}
              title="Удалить"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <Link to="/dictionary?mode=cards" className="dict-sidebar-study">
        Учить
      </Link>
    </aside>
  )
}

export default DictionarySidebar
