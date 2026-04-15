import { useState, useEffect } from 'react'

const STORAGE_KEY = 'norsk-dictionary'

function loadWords() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

function saveWords(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
}

export default function useDictionary() {
  const [words, setWords] = useState(loadWords)

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    saveWords(words)
  }, [words])

  function addWord(word) {
    // Не добавляем дубликаты
    if (words.some((w) => w.text === word.text)) return false
    setWords([...words, word])
    return true
  }

  function removeWord(text) {
    setWords(words.filter((w) => w.text !== text))
  }

  function hasWord(text) {
    return words.some((w) => w.text === text)
  }

  return { words, addWord, removeWord, hasWord }
}
