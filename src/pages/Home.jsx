import { Link } from 'react-router-dom'
import catalog from '../data/catalog'
import { categories } from '../data/topics'
import { plural, texts as textsForms } from '../utils/plural'
import CategoryIcon from '../components/CategoryIcon'

const categoryKeys = Object.keys(categories)

// Карта ключ категории → токен пастельного цвета
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

const LEVEL_ORDER = ['A2', 'B1', 'B2']

function levelsForCategory(key) {
  const set = new Set(catalog.filter((t) => t.category === key).map((t) => t.level))
  return LEVEL_ORDER.filter((l) => set.has(l))
}

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-brand">Litt<em>Mer</em></h1>
        <p className="home-subtitle">
          Учи норвежский через чтение гибридных текстов на русском и норвежском —
          знакомые сюжеты помогают запоминать новую лексику в естественном контексте, без зубрёжки.
          Статьи полезны не только для изучения языка, но и для знакомства со страной:
          как устроены медицина, банки, бюрократия, природа и культура Норвегии.
          Многие темы отсутствуют в популярных образовательных источниках и на курсах норвежского языка.
        </p>
      </div>

      <div className="cat-grid">
        {categoryKeys.map((key, idx) => {
          const count = catalog.filter((t) => t.category === key).length
          const hasTexts = count > 0
          const lvls = levelsForCategory(key)
          return (
            <Link
              to={hasTexts ? `/texts?category=${key}` : "/texts"}
              key={key}
              className={`cat-card ${!hasTexts ? 'cat-card-empty' : ''}`}
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
                  <span>{hasTexts ? 'текстов в теме' : 'Скоро'}</span>
                  {hasTexts && <b>{count}</b>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
