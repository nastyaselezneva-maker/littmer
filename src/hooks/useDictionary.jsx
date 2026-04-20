import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'norsk-dictionary'

function loadWords() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

function saveWords(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
}

const DictionaryContext = createContext(null)

export function DictionaryProvider({ children }) {
  const [words, setWords] = useState(loadWords)

  useEffect(() => {
    saveWords(words)
  }, [words])

  function addWord(word) {
    if (words.some((w) => w.text === word.text)) return false
    setWords([...words, word])
    return true
  }

  function removeWord(text) {
    setWords(words.filter((w) => w.text !== text))
  }

  function clearAll() {
    setWords([])
  }

  function hasWord(text) {
    return words.some((w) => w.text === text)
  }

  const value = { words, addWord, removeWord, clearAll, hasWord }

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  )
}

export default function useDictionary() {
  return useContext(DictionaryContext)
}
