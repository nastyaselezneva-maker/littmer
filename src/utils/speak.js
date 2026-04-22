/**
 * Озвучивает норвежский текст через браузерный SpeechSynthesis API.
 * Работает без интернета и без API-ключей.
 */

// Кэш голосов — загружаются асинхронно в некоторых браузерах
let cachedVoice = null

function findNorwegianVoice() {
  if (cachedVoice) return cachedVoice

  const voices = window.speechSynthesis.getVoices()

  // Предпочитаем норвежский букмол, потом любой норвежский
  cachedVoice =
    voices.find((v) => v.lang === 'nb-NO') ||
    voices.find((v) => v.lang === 'no-NO') ||
    voices.find((v) => v.lang.startsWith('nb')) ||
    voices.find((v) => v.lang.startsWith('no')) ||
    null

  return cachedVoice
}

export function speak(text) {
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

  window.speechSynthesis.speak(utterance)
  return true
}

// Инициализация: подгружаем голоса заранее (в некоторых браузерах это асинхронно)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null // сбрасываем кэш, чтобы перечитать
    findNorwegianVoice()
  }
}
