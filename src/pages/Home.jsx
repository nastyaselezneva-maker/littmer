import { Link } from 'react-router-dom'
import texts from '../data/texts'
import { topics } from '../data/topics'

function Home() {
  const topicKeys = Object.keys(topics)
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
          <span className="home-stat-number">{topicKeys.length}</span>
          <span className="home-stat-label">темы</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-number">3</span>
          <span className="home-stat-label">уровня</span>
        </div>
      </div>

      <h2>Темы</h2>
      <div className="home-topics">
        {topicKeys.map((key) => (
          <Link to="/texts" key={key} className="home-topic-card">
            {topics[key]}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
