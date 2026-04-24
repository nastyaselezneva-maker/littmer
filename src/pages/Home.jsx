import { Link } from 'react-router-dom'
import texts from '../data/texts'
import { categories, iconPath } from '../data/topics'

const categoryKeys = Object.keys(categories)

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>NorskApp</h1>
        <p className="home-subtitle">
          Учи норвежский через чтение. Тексты на русском языке с норвежскими словами —
          нажимай на слова, чтобы увидеть перевод и сохранить в личный словарь.
        </p>
      </div>

      <div className="step-grid">
        {categoryKeys.map((key) => {
          const count = texts.filter((t) => t.category === key).length
          const hasTexts = count > 0
          return (
            <Link
              to={hasTexts ? `/texts?category=${key}` : "/texts"}
              key={key}
              className={`step-card ${!hasTexts ? 'step-card-empty' : ''}`}
            >
              <img src={iconPath(key)} alt="" className="step-card-icon" />
              <span className="step-card-title">{categories[key].label}</span>
              <span className="step-card-info">
                {hasTexts ? `${count} текстов` : 'Скоро'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
