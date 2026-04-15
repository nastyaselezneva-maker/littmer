import { useState, useEffect } from 'react'

const STORAGE_KEY = 'norsk-progress'

function loadProgress() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : []
}

function saveProgress(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export default function useProgress() {
  const [readIds, setReadIds] = useState(loadProgress)

  useEffect(() => {
    saveProgress(readIds)
  }, [readIds])

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
