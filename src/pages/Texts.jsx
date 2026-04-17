import { useState } from 'react'
import { Link } from 'react-router-dom'
import texts from '../data/texts'
import { categories, levels, lengths, getTopicLabel } from '../data/topics'
import useProgress from '../hooks/useProgress'

const categoryKeys = Object.keys(categories)
const lengthKeys = Object.keys(lengths)

function Texts() {
  const [step, setStep] = useState(1)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [activeLevel, setActiveLevel] = useState(null)
  const [activeLength, setActiveLength] = useState(null)
  const { isRead, readIds } = useProgress()

  function selectCategory(key) {
    setActiveCategory(key)
    setActiveTopic(null)
    setActiveLevel(null)
    setActiveLength(null)
    setStep(2)
  }

  function selectTopic(key) {
    setActiveTopic(key)
    setActiveLevel(null)
    setActiveLength(null)
    setStep(3)
  }

  function selectLevel(level) {
    setActiveLevel(level)
    setActiveLength(null)
    setStep(4)
  }

  function selectLength(length) {
    setActiveLength(length)
    setStep(5)
  }

  function goToStep(n) {
    if (n <= 1) { setActiveCategory(null); setActiveTopic(null); setActiveLevel(null); setActiveLength(null) }
    if (n <= 2) { setActiveTopic(null); setActiveLevel(null); setActiveLength(null) }
    if (n <= 3) { setActiveLevel(null); setActiveLength(null) }
    if (n <= 4) { setActiveLength(null) }
    setStep(n)
  }

  // Фильтрация по шагам
  const textsForCategory = activeCategory
    ? texts.filter((t) => t.category === activeCategory)
    : []

  const textsForTopic = activeTopic
    ? textsForCategory.filter((t) => t.topic === activeTopic)
    : textsForCategory

  const availableTopics = activeCategory
    ? Object.keys(categories[activeCategory].topics)
        .filter((key) => textsForCategory.some((t) => t.topic === key))
    : []

  const availableLevels = [...new Set(textsForTopic.map((t) => t.level))]
    .sort((a, b) => levels.indexOf(a) - levels.indexOf(b))

  const textsForLevel = activeLevel
    ? textsForTopic.filter((t) => t.level === activeLevel)
    : textsForTopic

  const availableLengths = [...new Set(textsForLevel.map((t) => t.length))]
    .sort((a, b) => lengthKeys.indexOf(a) - lengthKeys.indexOf(b))

  const filteredTexts = activeLength
    ? textsForLevel.filter((t) => t.length === activeLength)
    : textsForLevel

  return (
    <div>
      <h1>Тексты <span className="read-counter">{readIds.length} из {texts.length} прочитано</span></h1>

      {/* Хлебные крошки */}
      {step > 1 && (
        <div className="breadcrumbs">
          <button className="breadcrumb" onClick={() => goToStep(1)}>Все категории</button>
          {activeCategory && (
            <>
              <span className="breadcrumb-sep">/</span>
              <button className={`breadcrumb ${step === 2 ? 'breadcrumb-current' : ''}`} onClick={() => goToStep(2)}>
                {categories[activeCategory].label}
              </button>
            </>
          )}
          {activeTopic && (
            <>
              <span className="breadcrumb-sep">/</span>
              <button className={`breadcrumb ${step === 3 ? 'breadcrumb-current' : ''}`} onClick={() => goToStep(3)}>
                {getTopicLabel(activeTopic)}
              </button>
            </>
          )}
          {activeLevel && (
            <>
              <span className="breadcrumb-sep">/</span>
              <button className={`breadcrumb ${step === 4 ? 'breadcrumb-current' : ''}`} onClick={() => goToStep(4)}>
                {activeLevel}
              </button>
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

      {/* Шаг 1: Выбор категории */}
      {step === 1 && (
        <div className="step-grid">
          {categoryKeys.map((key) => {
            const count = texts.filter((t) => t.category === key).length
            const readCount = texts.filter((t) => t.category === key && isRead(t.id)).length
            const hasTexts = count > 0
            return (
              <button
                key={key}
                className={`step-card ${!hasTexts ? 'step-card-empty' : ''}`}
                onClick={() => hasTexts && selectCategory(key)}
              >
                <span className="step-card-title">{categories[key].label}</span>
                <span className="step-card-info">
                  {hasTexts
                    ? `${count} текстов${readCount > 0 ? ` · ${readCount} прочитано` : ''}`
                    : 'Скоро'
                  }
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Шаг 2: Выбор подтемы */}
      {step === 2 && (
        <div className="step-grid">
          {availableTopics.map((key) => {
            const count = textsForCategory.filter((t) => t.topic === key).length
            return (
              <button key={key} className="step-card" onClick={() => selectTopic(key)}>
                <span className="step-card-title">{getTopicLabel(key)}</span>
                <span className="step-card-info">{count} текстов</span>
              </button>
            )
          })}
          {/* Подтемы без текстов — показываем как "Скоро" */}
          {activeCategory && Object.keys(categories[activeCategory].topics)
            .filter((key) => !availableTopics.includes(key))
            .map((key) => (
              <button key={key} className="step-card step-card-empty">
                <span className="step-card-title">{categories[activeCategory].topics[key]}</span>
                <span className="step-card-info">Скоро</span>
              </button>
            ))
          }
        </div>
      )}

      {/* Шаг 3: Выбор уровня */}
      {step === 3 && (
        <div className="step-grid">
          {availableLevels.map((level) => {
            const count = textsForTopic.filter((t) => t.level === level).length
            return (
              <button key={level} className="step-card" data-level={level} onClick={() => selectLevel(level)}>
                <span className="step-card-title">{level}</span>
                <span className="step-card-info">{count} текстов</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Шаг 4: Выбор длины */}
      {step === 4 && (
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

      {/* Шаг 5: Список текстов */}
      {step === 5 && (
        <div className="texts-list">
          {filteredTexts.length === 0 ? (
            <p className="texts-empty">Нет текстов</p>
          ) : (
            filteredTexts.map((text) => (
              <Link to={`/texts/${text.id}`} key={text.id} className={`text-card ${isRead(text.id) ? 'text-card-read' : ''}`}>
                <div className="text-card-header">
                  <span className="text-level" data-level={text.level}>{text.level}</span>
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
