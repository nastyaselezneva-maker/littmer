import { useState } from 'react'
import { Link } from 'react-router-dom'
import texts from '../data/texts'
import { topics, levels, lengths } from '../data/topics'

const topicKeys = Object.keys(topics)
const lengthKeys = Object.keys(lengths)

function Texts() {
  const [activeLevel, setActiveLevel] = useState(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [activeLength, setActiveLength] = useState(null)

  const filteredTexts = texts.filter((text) => {
    if (activeLevel && text.level !== activeLevel) return false
    if (activeTopic && text.topic !== activeTopic) return false
    if (activeLength && text.length !== activeLength) return false
    return true
  })

  return (
    <div>
      <h1>Тексты</h1>

      <div className="filters">
        <div className="filter-group">
          <span className="filter-label">Уровень</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeLevel === null ? 'active' : ''}`}
              onClick={() => setActiveLevel(null)}
            >
              Все
            </button>
            {levels.map((level) => (
              <button
                key={level}
                className={`filter-btn ${activeLevel === level ? 'active' : ''}`}
                onClick={() => setActiveLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Тема</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeTopic === null ? 'active' : ''}`}
              onClick={() => setActiveTopic(null)}
            >
              Все
            </button>
            {topicKeys.map((key) => (
              <button
                key={key}
                className={`filter-btn ${activeTopic === key ? 'active' : ''}`}
                onClick={() => setActiveTopic(key)}
              >
                {topics[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Длина</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeLength === null ? 'active' : ''}`}
              onClick={() => setActiveLength(null)}
            >
              Все
            </button>
            {lengthKeys.map((key) => (
              <button
                key={key}
                className={`filter-btn ${activeLength === key ? 'active' : ''}`}
                onClick={() => setActiveLength(key)}
              >
                {lengths[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="texts-list">
        {filteredTexts.length === 0 ? (
          <p className="texts-empty">Нет текстов с такой комбинацией фильтров</p>
        ) : (
          filteredTexts.map((text) => (
            <Link to={`/texts/${text.id}`} key={text.id} className="text-card">
              <div className="text-card-header">
                <span className="text-level">{text.level}</span>
                <span className="text-topic">{topics[text.topic]}</span>
                <span className="text-length">{lengths[text.length]}</span>
              </div>
              <h2 className="text-title">{text.title}</h2>
              <p className="text-description">{text.description}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default Texts
