import { useState, useRef, useEffect } from 'react'
import { speak, SHOW_AUDIO } from '../utils/speak'

const posLabels = {
  noun: "сущ.",
  verb: "гл.",
  adj: "прил.",
  adv: "нареч.",
  num: "числ.",
  phrase: "фраза",
}

function WordTooltip({ text, translation, dict, transcription, pos, onAdd, isSaved }) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  function handleAdd() {
    onAdd({ text, translation: dict || translation, transcription, pos })
  }

  return (
    <span className="no-word-wrapper" ref={tooltipRef}>
      <span className="no-word" onClick={() => setIsOpen(!isOpen)}>
        {text}
      </span>

      {isOpen && (
        <span className="tooltip">
          <span className="tooltip-top">
            <span className="tooltip-word">{text}</span>
            {SHOW_AUDIO && (
              <button
                className="tooltip-speak"
                onClick={(e) => { e.stopPropagation(); speak(text) }}
                title="Произнести"
                aria-label="Произнести"
              >
                🔊
              </button>
            )}
            {pos && <span className="tooltip-pos">{posLabels[pos]}</span>}
          </span>
          <span className="tooltip-transcription">[{transcription}]</span>
          <span className="tooltip-translation">{translation}</span>
          {dict && dict !== translation && (
            <span className="tooltip-dict">{dict}</span>
          )}
          {isSaved ? (
            <span className="tooltip-saved">В словаре</span>
          ) : (
            <button className="tooltip-btn" onClick={handleAdd}>
              + В словарь
            </button>
          )}
        </span>
      )}
    </span>
  )
}

export default WordTooltip
