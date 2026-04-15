import { useState } from 'react'
import { Link } from 'react-router-dom'
import texts from '../data/texts'
import { topics, levels, lengths } from '../data/topics'
import useProgress from '../hooks/useProgress'

const topicKeys = Object.keys(topics)
const lengthKeys = Object.keys(lengths)

function Texts() {
  const [step, setStep] = useState(1)
  const [activeTopic, setActiveTopic] = useState(null)
  const [activeLevel, setActiveLevel] = useState(null)
  const [activeLength, setActiveLength] = useState(null)
  const { isRead, readIds } = useProgress()

  function selectTopic(key) {
    setActiveTopic(key)
    setActiveLevel(null)
    setActiveLength(null)
    setStep(2)
  }

  function selectLevel(level) {
    setActiveLevel(level)
    setActiveLength(null)
    setStep(3)
  }

  function selectLength(length) {
    setActiveLength(length)
    setStep(4)
  }

  function goToStep(n) {
    if (n <= 1) { setActiveTopic(null); setActiveLevel(null); setActiveLength(null) }
    if (n <= 2) { setActiveLevel(null); setActiveLength(null) }
    if (n <= 3) { setActiveLength(null) }
    setStep(n)
  }

  // Тексты по выбранной теме
  const textsForTopic = activeTopic ? texts.filter((t) => t.topic === activeTopic) : []

  // Доступные уровни для этой темы
  const availableLevels = [...new Set(textsForTopic.map((t) => t.level))]
    .sort((a, b) => levels.indexOf(a) - levels.indexOf(b))

  // Тексты по теме + уровню
  const textsForLevel = activeLevel
    ? textsForTopic.filter((t) => t.level === activeLevel)
    : textsForTopic

  // Доступные длины для темы + уровня
  const availableLengths = [...new Set(textsForLevel.map((t) => t.length))]
    .sort((a, b) => lengthKeys.indexOf(a) - lengthKeys.indexOf(b))

  // Финальный список текстов
  const filteredTexts = activeLength
    ? textsForLevel.filter((t) => t.length === activeLength)
    : textsForLevel

  return (
    <div>
      <h1>Тексты <span className="read-counter">{readIds.length} из {texts.length} прочитано</span></h1>

      {/* Хлебные крошки */}
      {step > 1 && (
        <div className="breadcrumbs">
          <button className="breadcrumb" onClick={() => goToStep(1)}>Все темы</button>
          {activeTopic && (
            <>
              <span className="breadcrumb-sep">/</span>
              <button className={`breadcrumb ${step === 2 ? 'breadcrumb-current' : ''}`} onClick={() => goToStep(2)}>{topics[activeTopic]}</button>
            </>
          )}
          {activeLevel && (
            <>
              <span className="breadcrumb-sep">/</span>
              <button className={`breadcrumb ${step === 3 ? 'breadcrumb-current' : ''}`} onClick={() => goToStep(3)}>{activeLevel}</button>
            </>
          )}
          {activeLength && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb breadcrumb-current">{lengths[activeLength]}</span>
            </>
          )}
        </div>
      )}

      {/* Шаг 1: Выбор темы */}
      {step === 1 && (
        <div className="step-grid">
          {topicKeys.map((key) => {
            const count = texts.filter((t) => t.topic === key).length
            const readCount = texts.filter((t) => t.topic === key && isRead(t.id)).length
            return (
              <button key={key} className="step-card" onClick={() => selectTopic(key)}>
                <span className="step-card-title">{topics[key]}</span>
                <span className="step-card-info">{count} текстов{readCount > 0 && ` · ${readCount} прочитано`}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Шаг 2: Выбор уровня */}
      {step === 2 && (
        <div className="step-grid">
          {availableLevels.map((level) => {
            const count = textsForTopic.filter((t) => t.level === level).length
            return (
              <button key={level} className="step-card" onClick={() => selectLevel(level)}>
                <span className="step-card-title">{level}</span>
                <span className="step-card-info">{count} текстов</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Шаг 3: Выбор длины */}
      {step === 3 && (
        <div className="step-grid">
          {availableLengths.map((key) => {
            const count = textsForLevel.filter((t) => t.length === key).length
            return (
              <button key={key} className="step-card" onClick={() => selectLength(key)}>
                <span className="step-card-title">{lengths[key]}</span>
                <span className="step-card-info">{count} текстов</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Шаг 4: Список текстов */}
      {step === 4 && (
        <div className="texts-list">
          {filteredTexts.length === 0 ? (
            <p className="texts-empty">Нет текстов</p>
          ) : (
            filteredTexts.map((text) => (
              <Link to={`/texts/${text.id}`} key={text.id} className={`text-card ${isRead(text.id) ? 'text-card-read' : ''}`}>
                <div className="text-card-header">
                  <span className="text-level">{text.level}</span>
                  <span className="text-length">{lengths[text.length]}</span>
                  {isRead(text.id) && <span className="text-read-badge">Прочитано</span>}
                </div>
                <h2 className="text-title">{text.title}</h2>
                <p className="text-description">{text.description}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Texts
