import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import texts from '../data/texts'
import { getTopicLabel } from '../data/topics'
import WordTooltip from '../components/WordTooltip'
import useDictionary from '../hooks/useDictionary'
import useProgress from '../hooks/useProgress'

function Reader() {
  const { id } = useParams()
  const text = texts.find((t) => t.id === id)
  const { addWord, hasWord } = useDictionary()
  const { markAsRead, isRead } = useProgress()
  const textIsRead = text ? isRead(id) : false
  const savedPercent = localStorage.getItem('norsk-percent')
  const [noPercent, setNoPercent] = useState(savedPercent ? Number(savedPercent) : 50)

  function handlePercentChange(value) {
    setNoPercent(value)
    localStorage.setItem('norsk-percent', value)
  }

  if (!text) {
    return (
      <div>
        <h1>Текст не найден</h1>
        <Link to="/texts">Вернуться к списку</Link>
      </div>
    )
  }

  // Считаем сколько норвежских слов показывать
  const noSegments = text.segments.filter((s) => s.type === "no")
  const noCount = noSegments.length
  const showCount = Math.round(noCount * noPercent / 100)

  // Определяем какие именно слова показывать как норвежские
  let noIndex = 0

  return (
    <div>
      <Link to="/texts" className="back-link">Назад к текстам</Link>

      <div className="reader-header">
        <span className="text-level" data-level={text.level}>{text.level}</span>
        <span className="text-topic">{getTopicLabel(text.topic)}</span>
      </div>

      <h1>{text.title}</h1>

      <div className="reader-controls">
        <label className="control-label">
          Норвежский: <strong>{noPercent}%</strong>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={noPercent}
          onChange={(e) => handlePercentChange(Number(e.target.value))}
          className="percent-slider"
        />
        <span className="control-hint">
          {noPercent === 0 && "Полностью русский"}
          {noPercent > 0 && noPercent < 100 && `${showCount} из ${noCount} слов`}
          {noPercent === 100 && "Полностью норвежский"}
        </span>
      </div>

      <div className="reader-text">
        {text.segments.map((segment, index) => {
          // Русский сегмент
          if (segment.type !== "no") {
            // При 100% показываем норвежский вариант фразы
            if (noPercent === 100 && segment.no) {
              return <span key={index} className="ru-as-no">{segment.no}</span>
            }
            return <span key={index}>{segment.text}</span>
          }

          // Норвежский сегмент
          const currentNoIndex = noIndex
          noIndex++

          // Если слово за пределами лимита — показываем русский перевод
          if (currentNoIndex >= showCount) {
            return <span key={index}>{segment.translation}</span>
          }

          return (
            <WordTooltip
              key={index}
              number={currentNoIndex + 1}
              text={segment.text}
              translation={segment.translation}
              dict={segment.dict}
              transcription={segment.transcription}
              pos={segment.pos}
              onAdd={addWord}
              isSaved={hasWord(segment.text)}
            />
          )
        })}
      </div>

      <div className="reader-footer">
        {textIsRead ? (
          <span className="read-done">Прочитано</span>
        ) : (
          <button className="read-btn" onClick={() => markAsRead(id)}>
            Отметить как прочитанное
          </button>
        )}
      </div>
    </div>
  )
}

export default Reader
