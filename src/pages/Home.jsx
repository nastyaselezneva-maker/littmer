import { Link } from 'react-router-dom'
import texts from '../data/texts'
import { categories } from '../data/topics'

const categoryKeys = Object.keys(categories)

function Home() {
  const textCount = texts.length

  return (
    <div className="home">
      <div className="home-hero">
        <h1>NorskApp</h1>
        <p className="home-subtitle">
          Учи норвежский через чтение. Тексты на русском языке с норвежскими словами —
          нажимай на слова, чтобы увидеть перевод и сохранить в личный словарь.
        </p>
        <Link to="/texts" className="home-btn">Начать читать</Link>
      </div>

      <div className="home-stats">
        <div className="home-stat">
          <span className="home-stat-number">{textCount}</span>
          <span className="home-stat-label">текстов</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-number">{categoryKeys.length}</span>
          <span className="home-stat-label">категорий</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-number">3</span>
          <span className="home-stat-label">уровня</span>
        </div>
      </div>

      <h2>Категории</h2>
      <div className="home-topics">
        {categoryKeys.map((key) => {
          const count = texts.filter((t) => t.category === key).length
          return (
            <Link to="/texts" key={key} className="home-topic-card">
              <span className="home-topic-title">{categories[key].label}</span>
              {count > 0 && <span className="home-topic-count">{count} текстов</span>}
              {count === 0 && <span className="home-topic-count">Скоро</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
