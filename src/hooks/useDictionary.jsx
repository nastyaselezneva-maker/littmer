import { createContext, useContext, useState, useEffect } from 'react'
import useAuth from './useAuth'
import { supabase } from '../lib/supabase'

const GUEST_KEY = 'norsk-dictionary:guest'

const DictionaryContext = createContext(null)

export function DictionaryProvider({ children }) {
  const { userId } = useAuth()
  const [words, setWords] = useState([])

  // Загружаем словарь при смене пользователя
  useEffect(() => {
    if (userId) {
      // Облако
      let cancelled = false
      supabase
        .from('dictionary')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .then(async ({ data, error }) => {
          if (cancelled) return
          if (error) {
            console.error('Failed to load dictionary:', error)
            setWords([])
            return
          }
          const cloudWords = (data || []).map((d) => ({
            text: d.text,
            translation: d.translation,
            transcription: d.transcription || '',
            pos: d.pos || '',
            dict: d.dict || '',
          }))

          // Миграция гостевого словаря, если облако пустое
          if (cloudWords.length === 0) {
            const localGuest = localStorage.getItem(GUEST_KEY)
            if (localGuest) {
              try {
                const localWords = JSON.parse(localGuest)
                if (Array.isArray(localWords) && localWords.length > 0) {
                  const rows = localWords.map((w) => ({
                    user_id: userId,
                    text: w.text,
                    translation: w.translation || '',
                    transcription: w.transcription || '',
                    pos: w.pos || '',
                    dict: w.dict || '',
                  }))
                  await supabase.from('dictionary').insert(rows)
                  if (!cancelled) setWords(localWords)
                  return
                }
              } catch (e) {
                console.warn('Migration failed', e)
              }
            }
          }

          setWords(cloudWords)
        })
      return () => { cancelled = true }
    } else {
      // Гость — localStorage
      const saved = localStorage.getItem(GUEST_KEY)
      setWords(saved ? JSON.parse(saved) : [])
    }
  }, [userId])

  // В режиме гостя сохраняем в localStorage
  useEffect(() => {
    if (!userId) {
      localStorage.setItem(GUEST_KEY, JSON.stringify(words))
    }
  }, [words, userId])

  async function addWord(word) {
    if (words.some((w) => w.text === word.text)) return false
    setWords([...words, word])
    if (userId) {
      const { error } = await supabase.from('dictionary').insert({
        user_id: userId,
        text: word.text,
        translation: word.translation || '',
        transcription: word.transcription || '',
        pos: word.pos || '',
        dict: word.dict || '',
      })
      if (error) console.error('Failed to add word:', error)
    }
    return true
  }

  async function removeWord(text) {
    setWords(words.filter((w) => w.text !== text))
    if (userId) {
      const { error } = await supabase.from('dictionary')
        .delete()
        .eq('user_id', userId)
        .eq('text', text)
      if (error) console.error('Failed to remove word:', error)
    }
  }

  async function clearAll() {
    setWords([])
    if (userId) {
      const { error } = await supabase.from('dictionary').delete().eq('user_id', userId)
      if (error) console.error('Failed to clear dictionary:', error)
    }
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
