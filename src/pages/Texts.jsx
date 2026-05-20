import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import catalog from '../data/catalog'
import { categories, levels, lengths, levelDescriptions, getTopicLabel, getTopicLabelNo, iconPath } from '../data/topics'
import CategoryIcon from '../components/CategoryIcon'
import { plural, texts as textsForms } from '../utils/plural'
import useProgress from '../hooks/useProgress'

const categoryKeys = Object.keys(categories)

const CAT_COLOR = {
  economy: 'var(--cat-economy)',
  society: 'var(--cat-society)',
  science: 'var(--cat-science)',
  work: 'var(--cat-work)',
  education: 'var(--cat-edu)',
  culture: 'var(--cat-culture)',
  health: 'var(--cat-health)',
  driving: 'var(--cat-driving)',
}

const LEVEL_ORDER_HOME = ['A2', 'B1', 'B2']

function levelsForCategoryTexts(key) {
  const set = new Set(catalog.filter((t) => t.category === key).map((t) => t.level))
  return LEVEL_ORDER_HOME.filter((l) => set.has(l))
}

function Texts() {
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')
  const initialCategory = urlCategory && categories[urlCategory] ? urlCategory : null

  const [step, setStep] = useState(initialCategory ? 2 : 1)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeTopic, setActiveTopic] = useState(null)
  const [activeLevel, setActiveLevel] = useState(null)
  const { isRead, readIds } = useProgress()

  function selectCategory(key) {
    setActiveCategory(key)
    setActiveTopic(null)
    setActiveLevel(null)
    setStep(2)
  }

  function selectTopic(key) {
    setActiveTopic(key)
    setActiveLevel(null)
    setStep(3)
  }

  function selectLevel(level) {
    setActiveLevel(level)
    setStep(4)
  }

  function goToStep(n) {
    if (n <= 1) { setActiveCategory(null); setActiveTopic(null); setActiveLevel(null) }
    if (n <= 2) { setActiveTopic(null); setActiveLevel(null) }
    if (n <= 3) { setActiveLevel(null) }
    setStep(n)
  }

  // Фильтрация по шагам
  const textsForCategory = activeCategory
    ? catalog.filter((t) => t.category === activeCategory)
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

  const filteredTexts = activeLevel
    ? textsForTopic.filter((t) => t.level === activeLevel)
    : textsForTopic

  return (
    <div>
      <h1>Тексты <span className="read-counter">{readIds.length} из {catalog.length} прочитано</span></h1>

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
              <span className="breadcrumb breadcrumb-current">{activeLevel}</span>
            </>
          )}
        </div>
      )}

      {/* Шаг 1: Выбор категории */}
      {step === 1 && (
        <div className="cat-grid">
          {categoryKeys.map((key, idx) => {
            const count = catalog.filter((t) => t.category === key).length
            const readCount = catalog.filter((t) => t.category === key && isRead(t.id)).length
            const hasTexts = count > 0
            const lvls = levelsForCategoryTexts(key)
            return (
              <button
                key={key}
                className={`cat-card ${!hasTexts ? 'cat-card-empty' : ''}`}
                onClick={() => hasTexts && selectCategory(key)}
              >
                <div className="cat-pic" style={{ background: CAT_COLOR[key] }}>
                  <span className="cat-corner">№ {String(idx + 1).padStart(2, '0')}</span>
                  {lvls.length > 0 && (
                    <span className="cat-lvls">
                      {lvls.map((l) => <i key={l}>{l}</i>)}
                    </span>
                  )}
                  <CategoryIcon category={key} className="cat-pic-svg" />
                </div>
                <div className="cat-meta">
                  <h3 className="cat-ru">{categories[key].label}</h3>
                  <span className="cat-no">{categories[key].labelNo}</span>
                  <div className="cat-row">
                    <span>
                      {hasTexts
                        ? (readCount > 0 ? `${readCount} из ${count} прочитано` : 'текстов в теме')
                        : 'Скоро'}
                    </span>
                    {hasTexts && <b>{count}</b>}
                  </div>
                </div>
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
              <button key={key} className="step-card step-card-text" onClick={() => selectTopic(key)}>
                <span className="step-card-title">
                  {getTopicLabel(key)}
                  <span className="step-card-subtitle">{getTopicLabelNo(key)}</span>
                </span>
                <span className="step-card-info">{count} {plural(count, textsForms)}</span>
                <span className="step-card-btn">Открыть →</span>
              </button>
            )
          })}
          {activeCategory && Object.keys(categories[activeCategory].topics)
            .filter((key) => !availableTopics.includes(key))
            .map((key) => (
              <button key={key} className="step-card step-card-text step-card-empty">
                <span className="step-card-title">
                  {categories[activeCategory].topics[key].label}
                  <span className="step-card-subtitle">{categories[activeCategory].topics[key].labelNo}</span>
                </span>
                <span className="step-card-info">Скоро</span>
                <span className="step-card-btn">Открыть →</span>
              </button>
            ))
          }
        </div>
      )}

      {/* Шаг 3: Выбор уровня */}
      {step === 3 && (
        <div className="level-list">
          {availableLevels.map((level) => {
            const count = textsForTopic.filter((t) => t.level === level).length
            return (
              <button key={level} className="level-btn" data-level={level} onClick={() => selectLevel(level)}>
                <span className="level-btn-label">{level}</span>
                <span className="level-btn-info">{count} {plural(count, textsForms)}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Шаг 4: Описание уровня + список текстов */}
      {step === 4 && activeLevel && levelDescriptions[activeLevel] && (
        <div className="level-info" data-level={activeLevel}>
          <div className="level-info-header">
            <span className="text-level" data-level={activeLevel}>{activeLevel}</span>
            <span className="level-info-title">{levelDescriptions[activeLevel].title}</span>
          </div>
          <p className="level-info-summary">{levelDescriptions[activeLevel].summary}</p>
          <ul className="level-info-features">
            {levelDescriptions[activeLevel].features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {step === 4 && (
        <div className="texts-list">
          {filteredTexts.length === 0 ? (
            <p className="texts-empty">Нет текстов</p>
          ) : (
            filteredTexts.map((text) => (
              <Link to={`/texts/${text.id}`} key={text.id} className={`text-card ${isRead(text.id) ? 'text-card-read' : ''}`}>
                <div className="text-card-header">
                  <span className="text-level" data-level={text.level}>{text.level}</span>
                  {text.length && <span className="text-length">{lengths[text.length]}</span>}
                  {isRead(text.id) && <span className="text-read-badge">Прочитано</span>}
                </div>
                <h2 className="text-title">{text.title}</h2>
                {text.titleNo && <p className="text-title-no">{text.titleNo}</p>}
                <p className="text-description">{text.description}</p>
                <span className="text-card-btn">Читать →</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Texts
