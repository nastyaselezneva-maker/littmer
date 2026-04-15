import { useState, useRef, useEffect } from 'react'

function WordTooltip({ number, text, translation, transcription, onAdd, isSaved }) {
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
    onAdd({ text, translation, transcription })
  }

  return (
    <span className="no-word-wrapper" ref={tooltipRef}>
      <span className="no-word" onClick={() => setIsOpen(!isOpen)}>
        <span className="no-word-number">{number}</span>{text}
      </span>

      {isOpen && (
        <span className="tooltip">
          <span className="tooltip-word">{text}</span>
          <span className="tooltip-transcription">[{transcription}]</span>
          <span className="tooltip-translation">{translation}</span>
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
