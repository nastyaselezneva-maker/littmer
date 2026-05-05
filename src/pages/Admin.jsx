import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import catalog from '../data/catalog'
import { categories, getTopicLabel } from '../data/topics'
import { supabase } from '../lib/supabase'

const levels = ['A2', 'B1', 'B2']

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1
    return acc
  }, {})
}

// Карта id текста → метаданные (для отображения названий)
const catalogById = Object.fromEntries(catalog.map((t) => [t.id, t]))

function Admin() {
  const [deepStats, setDeepStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [globalStats, setGlobalStats] = useState(null)
  const [popularTexts, setPopularTexts] = useState([])
  const [topWords, setTopWords] = useState([])
  const [signupsPerDay, setSignupsPerDay] = useState([])
  const [globalLoading, setGlobalLoading] = useState(true)

  // Загружаем глобальную статистику из Supabase при монтировании
  useEffect(() => {
    let cancelled = false
    async function load() {
      const [statsRes, popRes, wordsRes, signupsRes] = await Promise.all([
        supabase.rpc('get_global_stats'),
        supabase.rpc('get_popular_texts', { lim: 20 }),
        supabase.rpc('get_top_words', { lim: 30 }),
        supabase.rpc('get_signups_per_day'),
      ])
      if (cancelled) return
      if (!statsRes.error && statsRes.data) setGlobalStats(statsRes.data[0])
      if (!popRes.error) setPopularTexts(popRes.data || [])
      if (!wordsRes.error) setTopWords(wordsRes.data || [])
      if (!signupsRes.error) setSignupsPerDay(signupsRes.data || [])
      setGlobalLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // === Базовые метрики (мгновенно из каталога) ===
  const total = catalog.length
  const byLevel = countBy(catalog, 'level')
  const byCategory = countBy(catalog, 'category')
  const byLength = countBy(catalog, 'length')
  const byTopic = countBy(catalog, 'topic')

  // Пустые подтемы
  const emptyTopics = []
  for (const [catKey, cat] of Object.entries(categories)) {
    for (const [topicKey, topic] of Object.entries(cat.topics)) {
      if (!byTopic[topicKey]) {
        emptyTopics.push({ category: cat.label, topic: topic.label })
      }
    }
  }

  // Категория x Уровень
  const matrix = {}
  for (const text of catalog) {
    const k = text.category
    if (!matrix[k]) matrix[k] = { A2: 0, B1: 0, B2: 0 }
    matrix[k][text.level]++
  }

  // === Глубокая статистика (по запросу: загружает все JSON) ===
  async function calcDeep() {
    setLoading(true)
    setProgress(0)
    const stats = {
      perLevel: { A2: { texts: 0, segments: 0, noWords: 0, ruWords: 0, idioms: 0 }, B1: { texts: 0, segments: 0, noWords: 0, ruWords: 0, idioms: 0 }, B2: { texts: 0, segments: 0, noWords: 0, ruWords: 0, idioms: 0 } },
      idiomFreq: {},
      perText: [],
    }

    for (let i = 0; i < catalog.length; i++) {
      const meta = catalog[i]
      try {
        const res = await fetch(`/content/${meta.id}.json`)
        if (!res.ok) continue
        const data = await res.json()
        const segs = data.segments || []
        const lvl = stats.perLevel[meta.level]
        lvl.texts++
        lvl.segments += segs.length

        let noWords = 0
        let ruWords = 0
        let idioms = 0
        for (const s of segs) {
          if (s.type === 'no') {
            const wc = (s.text || '').trim().split(/\s+/).length
            noWords += wc
            if (s.pos === 'phrase') {
              idioms++
              const key = s.text.trim()
              stats.idiomFreq[key] = (stats.idiomFreq[key] || 0) + 1
            }
          } else if (s.type === 'ru') {
            ruWords += (s.text || '').trim().split(/\s+/).filter(Boolean).length
          }
        }
        lvl.noWords += noWords
        lvl.ruWords += ruWords
        lvl.idioms += idioms

        stats.perText.push({
          id: meta.id,
          title: meta.title,
          level: meta.level,
          segments: segs.length,
          noWords,
          ruWords,
          density: noWords + ruWords > 0 ? Math.round((noWords / (noWords + ruWords)) * 100) : 0,
          idioms,
        })
      } catch (e) {
        // skip
      }
      setProgress(Math.round(((i + 1) / catalog.length) * 100))
    }

    setDeepStats(stats)
    setLoading(false)
  }

  return (
    <div className="admin">
      <h1>Админская панель</h1>
      <p className="admin-subtitle">Контент и активность пользователей</p>

      <section className="admin-section">
        <h2>Глобальная статистика</h2>
        {globalLoading && <p>Загружаю данные…</p>}
        {!globalLoading && globalStats && (
          <>
            <div className="admin-grid">
              <div className="admin-card">
                <span className="admin-card-num">{globalStats.total_users}</span>
                <span className="admin-card-label">пользователей</span>
              </div>
              <div className="admin-card">
                <span className="admin-card-num">{globalStats.total_words}</span>
                <span className="admin-card-label">слов в словарях</span>
              </div>
              <div className="admin-card">
                <span className="admin-card-num">{globalStats.total_reads}</span>
                <span className="admin-card-label">прочтений текстов</span>
              </div>
            </div>

            {signupsPerDay.length > 0 && (
              <>
                <h3>Регистрации (последние 30 дней)</h3>
                <div className="admin-bars">
                  {signupsPerDay.map((d) => {
                    const max = Math.max(...signupsPerDay.map((s) => s.signups), 1)
                    const height = (d.signups / max) * 100
                    return (
                      <div key={d.day} className="admin-bar" title={`${d.day}: ${d.signups}`}>
                        <div className="admin-bar-fill" style={{ height: `${height}%` }} />
                        <span className="admin-bar-num">{d.signups}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {popularTexts.length > 0 && (
              <>
                <h3>Самые читаемые тексты</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Текст</th>
                      <th>Уровень</th>
                      <th>Прочтений</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularTexts.map((t) => {
                      const meta = catalogById[t.text_id]
                      return (
                        <tr key={t.text_id}>
                          <td>
                            {meta ? (
                              <Link to={`/texts/${t.text_id}`}>{meta.title}</Link>
                            ) : (
                              <span>{t.text_id}</span>
                            )}
                          </td>
                          <td>
                            {meta && <span data-level={meta.level} className="admin-level-pill">{meta.level}</span>}
                          </td>
                          <td><strong>{t.reads}</strong></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </>
            )}

            {topWords.length > 0 && (
              <>
                <h3>Самые популярные слова в словарях</h3>
                <ol className="admin-idiom-list">
                  {topWords.map((w) => (
                    <li key={w.word}>
                      <span className="admin-idiom-text">{w.word}</span>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{w.translation}</span>
                      <span className="admin-idiom-count">×{w.saves}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </>
        )}
        {!globalLoading && !globalStats && (
          <p style={{ color: 'var(--text-light)' }}>
            Не удалось загрузить — возможно, SQL-функции ещё не созданы в Supabase.
          </p>
        )}
      </section>

      <section className="admin-section">
        <h2>Контент: всего текстов — {total}</h2>
      </section>

      <section className="admin-section">
        <h2>По уровню</h2>
        <div className="admin-grid">
          {levels.map((lvl) => (
            <div key={lvl} className="admin-card">
              <span className="admin-card-num">{byLevel[lvl] || 0}</span>
              <span className="admin-card-label" data-level={lvl}>{lvl}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>По длине</h2>
        <div className="admin-grid">
          {['short', 'medium', 'long'].map((len) => (
            <div key={len} className="admin-card">
              <span className="admin-card-num">{byLength[len] || 0}</span>
              <span className="admin-card-label">{len}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Категории × уровни</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Категория</th>
              <th>A2</th>
              <th>B1</th>
              <th>B2</th>
              <th>Всего</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categories).map(([key, cat]) => {
              const m = matrix[key] || { A2: 0, B1: 0, B2: 0 }
              const sum = m.A2 + m.B1 + m.B2
              return (
                <tr key={key}>
                  <td>{cat.label}</td>
                  <td>{m.A2}</td>
                  <td>{m.B1}</td>
                  <td>{m.B2}</td>
                  <td><strong>{sum}</strong></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {emptyTopics.length > 0 && (
        <section className="admin-section">
          <h2>Пустые подтемы ({emptyTopics.length})</h2>
          <ul className="admin-empty-list">
            {emptyTopics.map((t, i) => (
              <li key={i}>
                <span className="admin-empty-cat">{t.category}</span> → {t.topic}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="admin-section">
        <h2>Глубокая статистика</h2>
        {!deepStats && !loading && (
          <button className="admin-btn" onClick={calcDeep}>
            Рассчитать плотность и идиомы
          </button>
        )}
        {loading && (
          <p>Загружаю тексты… {progress}%</p>
        )}
        {deepStats && (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Уровень</th>
                  <th>Текстов</th>
                  <th>Сегм./текст</th>
                  <th>NO слов</th>
                  <th>Плотность NO</th>
                  <th>Идиом всего</th>
                  <th>Идиом/текст</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((lvl) => {
                  const s = deepStats.perLevel[lvl]
                  const total = s.noWords + s.ruWords
                  const density = total > 0 ? Math.round((s.noWords / total) * 100) : 0
                  return (
                    <tr key={lvl}>
                      <td><span data-level={lvl} className="admin-level-pill">{lvl}</span></td>
                      <td>{s.texts}</td>
                      <td>{s.texts > 0 ? Math.round(s.segments / s.texts) : 0}</td>
                      <td>{s.noWords}</td>
                      <td>{density}%</td>
                      <td>{s.idioms}</td>
                      <td>{s.texts > 0 ? (s.idioms / s.texts).toFixed(1) : 0}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <h3>Топ-20 идиом</h3>
            <ol className="admin-idiom-list">
              {Object.entries(deepStats.idiomFreq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 20)
                .map(([text, count]) => (
                  <li key={text}>
                    <span className="admin-idiom-text">{text}</span>
                    <span className="admin-idiom-count">×{count}</span>
                  </li>
                ))}
            </ol>

            <h3>Тексты с минимумом идиом для своего уровня</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Уровень</th>
                  <th>Идиом</th>
                  <th>Плотность</th>
                </tr>
              </thead>
              <tbody>
                {deepStats.perText
                  .filter((t) => (t.level === 'B1' && t.idioms < 2) || (t.level === 'B2' && t.idioms < 4))
                  .sort((a, b) => a.idioms - b.idioms)
                  .slice(0, 30)
                  .map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td><span data-level={t.level} className="admin-level-pill">{t.level}</span></td>
                      <td>{t.idioms}</td>
                      <td>{t.density}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </section>
    </div>
  )
}

export default Admin
