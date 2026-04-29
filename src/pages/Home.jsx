import { Link } from 'react-router-dom'
import catalog from '../data/catalog'
import { categories, iconPath } from '../data/topics'
import { plural, texts as textsForms } from '../utils/plural'

const categoryKeys = Object.keys(categories)

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>LittMer</h1>
        <p className="home-subtitle">
          Учи норвежский через чтение гибридных текстов на русском и норвежском —
          знакомые сюжеты помогают запоминать новую лексику в естественном контексте, без зубрёжки.
          Статьи полезны не только для изучения языка, но и для знакомства со страной:
          как устроены медицина, банки, бюрократия, природа и культура Норвегии.
          Многие темы отсутствуют в популярных образовательных источниках и на курсах норвежского языка.
        </p>
      </div>

      <div className="step-grid">
        {categoryKeys.map((key) => {
          const count = catalog.filter((t) => t.category === key).length
          const hasTexts = count > 0
          return (
            <Link
              to={hasTexts ? `/texts?category=${key}` : "/texts"}
              key={key}
              className={`step-card ${!hasTexts ? 'step-card-empty' : ''}`}
            >
              <img src={iconPath(key)} alt="" className="step-card-icon" />
              <span className="step-card-title">
                {categories[key].label}
                <span className="step-card-subtitle">{categories[key].labelNo}</span>
              </span>
              <span className="step-card-info">
                {hasTexts ? `${count} ${plural(count, textsForms)}` : 'Скоро'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
