/**
 * Озвучивает норвежский текст через браузерный SpeechSynthesis API.
 * Работает без интернета и без API-ключей.
 */

// Временно скрыто — качество браузерной озвучки пока неудовлетворительное.
// Включить обратно, когда будет готова качественная озвучка (например, через внешний TTS API).
export const SHOW_AUDIO = false

const VOICE_STORAGE_KEY = 'norsk-voice'

let cachedVoice = null

function isHighQuality(voice) {
  return /natural|premium|neural|enhanced|online/i.test(voice.name)
}

export function getNorwegianVoices() {
  if (!('speechSynthesis' in window)) return []
  const voices = window.speechSynthesis.getVoices()
  const norwegian = voices.filter(
    (v) => v.lang.startsWith('nb') || v.lang.startsWith('no')
  )
  // Сначала качественные (Natural/Premium/Neural), потом по алфавиту
  return norwegian.sort((a, b) => {
    const aHQ = isHighQuality(a)
    const bHQ = isHighQuality(b)
    if (aHQ !== bHQ) return aHQ ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export function getSelectedVoiceName() {
  return localStorage.getItem(VOICE_STORAGE_KEY) || ''
}

export function setSelectedVoice(voiceName) {
  if (voiceName) {
    localStorage.setItem(VOICE_STORAGE_KEY, voiceName)
  } else {
    localStorage.removeItem(VOICE_STORAGE_KEY)
  }
  cachedVoice = null
}

function findNorwegianVoice() {
  if (cachedVoice) return cachedVoice

  const voices = window.speechSynthesis.getVoices()
  const selectedName = getSelectedVoiceName()

  if (selectedName) {
    const match = voices.find((v) => v.name === selectedName)
    if (match) {
      cachedVoice = match
      return match
    }
  }

  const norwegian = voices.filter(
    (v) => v.lang.startsWith('nb') || v.lang.startsWith('no')
  )

  // Предпочитаем качественные голоса, потом nb-NO, потом любой
  cachedVoice =
    norwegian.find(isHighQuality) ||
    norwegian.find((v) => v.lang === 'nb-NO') ||
    norwegian.find((v) => v.lang === 'no-NO') ||
    norwegian[0] ||
    null

  return cachedVoice
}

export function speak(text, onEnd) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis не поддерживается в этом браузере')
    return false
  }

  // Отменяем предыдущую озвучку, если была
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = findNorwegianVoice()

  if (voice) {
    utterance.voice = voice
  }
  utterance.lang = 'nb-NO'
  utterance.rate = 0.9 // чуть медленнее обычного для учебных целей

  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }

  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking() {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
}

// Инициализация: подгружаем голоса заранее (в некоторых браузерах это асинхронно)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = null
    findNorwegianVoice()
  })
}
