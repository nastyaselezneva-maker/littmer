import { createContext, useContext, useState, useEffect } from 'react'
import useAuth from './useAuth'

function storageKey(username) {
  return `norsk-dictionary:${username || 'guest'}`
}

function loadWords(username) {
  const saved = localStorage.getItem(storageKey(username))
  return saved ? JSON.parse(saved) : []
}

function saveWords(username, words) {
  localStorage.setItem(storageKey(username), JSON.stringify(words))
}

const DictionaryContext = createContext(null)

export function DictionaryProvider({ children }) {
  const { currentUser } = useAuth()
  const [words, setWords] = useState(() => loadWords(currentUser))

  // При смене пользователя перезагружаем словарь
  useEffect(() => {
    setWords(loadWords(currentUser))
  }, [currentUser])

  // При изменении сохраняем в localStorage
  useEffect(() => {
    saveWords(currentUser, words)
  }, [words, currentUser])

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
