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

const formLabels = {
  // verb
  infinitive: "инфинитив",
  present: "настоящее",
  preterite: "прошедшее",
  perfect: "перфект",
  imperative: "повел.",
  // noun
  sg_indef: "ед.ч. неопр.",
  sg_def: "ед.ч. опр.",
  pl_indef: "мн.ч. неопр.",
  pl_def: "мн.ч. опр.",
  // adj
  indef_m_f: "неопр. м/ж",
  indef_n: "неопр. ср.",
  indef_pl: "неопр. мн.",
  definite: "определ.",
  comparative: "сравн.",
  superlative: "превосх.",
  // adv степени
  positive: "положит.",
}

const formOrder = {
  verb: ["infinitive", "present", "preterite", "perfect", "imperative"],
  noun: ["sg_indef", "sg_def", "pl_indef", "pl_def"],
  adj: ["indef_m_f", "indef_n", "indef_pl", "definite", "comparative", "superlative"],
  adv: ["positive", "comparative", "superlative"],
}

function WordTooltip({ text, translation, dict, transcription, pos, form, forms, onAdd, isSaved }) {
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
            {form && formLabels[form] && (
              <span className="tooltip-form">· {formLabels[form]}</span>
            )}
          </span>
          <span className="tooltip-translation">{translation}</span>
          {dict && dict !== translation && (
            <span className="tooltip-dict">{dict}</span>
          )}
          {forms && formOrder[pos] && (
            <span className="tooltip-paradigm">
              {formOrder[pos]
                .filter((k) => forms[k])
                .map((k) => (
                  <span key={k} className={`tooltip-paradigm-row ${k === form ? 'tooltip-paradigm-current' : ''}`}>
                    <span className="tooltip-paradigm-label">{formLabels[k]}</span>
                    <span className="tooltip-paradigm-value">{forms[k]}</span>
                  </span>
                ))}
            </span>
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
