import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  infinitive: "инфинитив",
  present: "настоящее",
  preterite: "прошедшее",
  perfect: "перфект",
  imperative: "повел.",
  sg_indef: "ед.ч. неопр.",
  sg_def: "ед.ч. опр.",
  pl_indef: "мн.ч. неопр.",
  pl_def: "мн.ч. опр.",
  indef_m_f: "неопр. м/ж",
  indef_n: "неопр. ср.",
  indef_pl: "неопр. мн.",
  definite: "определ.",
  comparative: "сравн.",
  superlative: "превосх.",
  positive: "положит.",
}

const formOrder = {
  verb: ["infinitive", "present", "preterite", "perfect", "imperative"],
  noun: ["sg_indef", "sg_def", "pl_indef", "pl_def"],
  adj: ["indef_m_f", "indef_n", "indef_pl", "definite", "comparative", "superlative"],
  adv: ["positive", "comparative", "superlative"],
}

const VIEWPORT_MARGIN = 8
const TOOLTIP_GAP = 10

function computePosition(anchorRect, tooltipEl) {
  if (!anchorRect || !tooltipEl) return null
  const tw = tooltipEl.offsetWidth
  const th = tooltipEl.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Centered above by default
  let left = anchorRect.left + anchorRect.width / 2 - tw / 2
  let top = anchorRect.top - th - TOOLTIP_GAP
  let placement = 'top'

  // If not enough room above — place below
  if (top < VIEWPORT_MARGIN) {
    top = anchorRect.bottom + TOOLTIP_GAP
    placement = 'bottom'
  }
  // Clamp horizontally
  if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN
  if (left + tw > vw - VIEWPORT_MARGIN) left = vw - VIEWPORT_MARGIN - tw

  // Arrow X relative to tooltip (pointing to anchor center)
  const anchorCenter = anchorRect.left + anchorRect.width / 2
  const arrowX = Math.max(12, Math.min(tw - 12, anchorCenter - left))

  return { top, left, placement, arrowX }
}

function WordTooltip({ text, translation, dict, transcription, pos, form, forms, onAdd, isSaved }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pos2, setPos2] = useState(null)
  const wordRef = useRef(null)
  const tooltipRef = useRef(null)

  const updatePosition = useCallback(() => {
    if (!wordRef.current || !tooltipRef.current) return
    const rect = wordRef.current.getBoundingClientRect()
    setPos2(computePosition(rect, tooltipRef.current))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    // Compute on next frame so tooltip has dimensions
    requestAnimationFrame(updatePosition)
    function handleClickOutside(e) {
      if (tooltipRef.current && tooltipRef.current.contains(e.target)) return
      if (wordRef.current && wordRef.current.contains(e.target)) return
      setIsOpen(false)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, updatePosition])

  function handleAdd() {
    onAdd({ text, translation: dict || translation, transcription, pos })
  }

  const tooltipStyle = pos2
    ? { top: `${pos2.top}px`, left: `${pos2.left}px`, '--arrow-x': `${pos2.arrowX}px` }
    : { visibility: 'hidden' }

  return (
    <>
      <span
        ref={wordRef}
        className="no-word"
        onClick={() => setIsOpen((v) => !v)}
      >
        {text}
      </span>

      {isOpen && createPortal(
        <span
          ref={tooltipRef}
          className={`tooltip ${pos2 ? `tooltip-${pos2.placement}` : ''}`}
          style={tooltipStyle}
        >
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
          <button
            className="tooltip-close"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть"
          >
            ×
          </button>
        </span>,
        document.body
      )}
    </>
  )
}

export default WordTooltip
