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

      <section className="home-method">
        <div className="home-method-inner">
          <div className="sec-head">
            <div className="sec-num">¶ метод</div>
            <div>
              <h2 className="sec-title">Как работает <em>гибрид</em>.</h2>
              <p className="sec-sub">Три простых шага. Никакой грамматики и карточек — только чтение и контекст.</p>
            </div>
          </div>

          <div className="method-steps">
            <div className="method-step">
              <div className="method-step-ill">
                <svg viewBox="0 0 160 120">
                  <rect x="20" y="20" width="120" height="80" rx="6" fill="#fff8e8" stroke="#2a2418" strokeWidth="2"/>
                  <line x1="30" y1="36" x2="120" y2="36" stroke="#2a2418" strokeWidth="1.5"/>
                  <line x1="30" y1="48" x2="100" y2="48" stroke="#5a4f3a" strokeWidth="1"/>
                  <rect x="55" y="58" width="26" height="10" rx="2" fill="#e0a84a" stroke="#2a2418" strokeWidth="1"/>
                  <line x1="30" y1="74" x2="120" y2="74" stroke="#5a4f3a" strokeWidth="1"/>
                  <line x1="30" y1="86" x2="80" y2="86" stroke="#5a4f3a" strokeWidth="1"/>
                </svg>
              </div>
              <div className="method-step-num">1</div>
              <h3>Выбираешь тему и уровень</h3>
              <p>8 категорий — от <em>fastlege</em> до <em>Oljefondet</em>, три уровня CEFR. Темы, которых нет в стандартных курсах норвежского.</p>
            </div>

            <div className="method-step">
              <div className="method-step-ill">
                <svg viewBox="0 0 160 120">
                  <circle cx="80" cy="60" r="36" fill="#a8c4d8" stroke="#2a2418" strokeWidth="2"/>
                  <text x="80" y="68" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="600" fill="#1f4d8f" fontSize="20">fastlege</text>
                  <path d="M50 100 L50 80 L40 80" stroke="#2a2418" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M50 80 L60 70" stroke="#2a2418" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <text x="120" y="40" fontFamily="Caveat, cursive" fontSize="22" fill="#c5462e">врач!</text>
                </svg>
              </div>
              <div className="method-step-num">2</div>
              <h3>Тапаешь — видишь перевод</h3>
              <p>Норвежская лексика подсвечена прямо в русском тексте. Тап на слово — перевод, транскрипция, кнопка «в словарь». Запоминаешь в контексте, без отдельных карточек.</p>
            </div>

            <div className="method-step">
              <div className="method-step-ill">
                <svg viewBox="0 0 160 120">
                  <path d="M30 90 L30 50 L60 30 L90 50 L120 30 L130 50 L130 90 Z" fill="#5a8a5a" stroke="#2a2418" strokeWidth="2"/>
                  <polyline points="40,75 60,55 80,65 100,40 120,55" fill="none" stroke="#fff8e8" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="40" cy="75" r="3" fill="#fff8e8"/>
                  <circle cx="60" cy="55" r="3" fill="#fff8e8"/>
                  <circle cx="80" cy="65" r="3" fill="#fff8e8"/>
                  <circle cx="100" cy="40" r="3" fill="#e0a84a"/>
                  <circle cx="120" cy="55" r="3" fill="#fff8e8"/>
                </svg>
              </div>
              <div className="method-step-num">3</div>
              <h3>Двигаешь ползунок норвежского</h3>
              <p>От 0% до 100%. Сначала видишь самые частые норвежские слова, потом всё более редкие. Справа — «обзор» с ключевыми терминами и сюжетом.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
