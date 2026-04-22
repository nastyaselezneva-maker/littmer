import { useState, useEffect } from 'react'
import useAuth from './useAuth'

function storageKey(username) {
  return `norsk-progress:${username || 'guest'}`
}

function loadProgress(username) {
  const saved = localStorage.getItem(storageKey(username))
  return saved ? JSON.parse(saved) : []
}

function saveProgress(username, ids) {
  localStorage.setItem(storageKey(username), JSON.stringify(ids))
}

export default function useProgress() {
  const { currentUser } = useAuth()
  const [readIds, setReadIds] = useState(() => loadProgress(currentUser))

  useEffect(() => {
    setReadIds(loadProgress(currentUser))
  }, [currentUser])

  useEffect(() => {
    saveProgress(currentUser, readIds)
  }, [readIds, currentUser])

  function markAsRead(id) {
    if (!readIds.includes(id)) {
      setReadIds([...readIds, id])
    }
  }

  function unmarkAsRead(id) {
    setReadIds(readIds.filter((r) => r !== id))
  }

  function isRead(id) {
    return readIds.includes(id)
  }

  return { readIds, markAsRead, unmarkAsRead, isRead }
}
